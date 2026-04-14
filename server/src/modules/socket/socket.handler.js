const jwt = require("jsonwebtoken");
const events = require("./events");
const { createMessage } = require("../message/message.service");
const Message = require("../message/message.model");
const {
  addUserSocket,
  removeUserSocket,
  getUserSockets,
  getOnlineUserIds,
} = require("../presence/presence.service");
const { socketRateLimiter } = require("../../middleware/rateLimiter.middleware");
const redis = require("../../config/redis");

const handleSocket = (io) => {
  io.on(events.CONNECTION, async (socket) => {
    console.log("⚡ Socket connected:", socket.id);

    const token = socket.handshake.auth?.token;

    if (!token) {
      console.log("❌ No token, disconnecting...");
      socket.disconnect();
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      // 🔥 Add socket to Redis presence
      await addUserSocket(userId, socket.id);

      console.log(`✅ User ${userId} is online`);

      // 🔥 Send all online users to this client
      const onlineUserIds = await getOnlineUserIds();
      socket.emit("online_users", onlineUserIds);

      // Emit online only on first socket
      const userSockets = await getUserSockets(userId);
      if (userSockets.length === 1) {
        socket.broadcast.emit(events.USER_ONLINE, { userId });
      }

      // ==============================
      // 📩 SEND MESSAGE
      // ==============================
      socket.on(events.SEND_MESSAGE, async ({ receiverId, content }) => {
        try {
          // 🛡️ Rate limit: 30 messages per 60 seconds
          const allowed = await socketRateLimiter(redis, userId, "send_message", 30, 60);
          if (!allowed) {
            socket.emit("error", { message: "Slow down! You are sending messages too fast." });
            return;
          }

          console.log(`📩 Message from ${userId} → ${receiverId}`);

          const message = await createMessage({
            sender: userId,
            receiver: receiverId,
            content,
          });

          const receiverSockets = await getUserSockets(receiverId);

          if (receiverSockets.length > 0) {
            receiverSockets.forEach((socketId) => {
              io.to(socketId).emit(events.RECEIVE_MESSAGE, message);
            });

            message.status = "delivered";
            await message.save();
          }

          socket.emit(events.RECEIVE_MESSAGE, message);

        } catch (err) {
          console.log("❌ Message error:", err.message);
        }
      });

      // ==============================
      // ✍️ TYPING START
      // ==============================
      socket.on(events.TYPING, async ({ receiverId }) => {
        // 🛡️ Rate limit: 20 typing events per 10 seconds
        const allowed = await socketRateLimiter(redis, userId, "typing", 20, 10);
        if (!allowed) return; // silently drop, no need to notify user

        const receiverSockets = await getUserSockets(receiverId);
        receiverSockets.forEach((socketId) => {
          io.to(socketId).emit(events.TYPING, { userId });
        });
      });

      // ==============================
      // ✍️ TYPING STOP
      // ==============================
      socket.on(events.STOP_TYPING, async ({ receiverId }) => {
        const receiverSockets = await getUserSockets(receiverId);
        receiverSockets.forEach((socketId) => {
          io.to(socketId).emit(events.STOP_TYPING, { userId });
        });
      });

      // ==============================
      // 👁 MESSAGE SEEN
      // ==============================
      socket.on(events.MESSAGE_SEEN, async ({ messageId }) => {
        try {
          const message = await Message.findById(messageId);

          if (!message) return;
          if (message.receiver.toString() !== userId) return;

          message.status = "seen";
          await message.save();

          const senderSockets = await getUserSockets(message.sender.toString());
          senderSockets.forEach((socketId) => {
            io.to(socketId).emit(events.MESSAGE_SEEN, {
              messageId,
              status: "seen",
            });
          });

        } catch (err) {
          console.log("❌ Seen error:", err.message);
        }
      });

      // ==============================
      // 🔌 DISCONNECT
      // ==============================
      socket.on(events.DISCONNECT, async () => {
        console.log(`❌ User ${userId} disconnected`);

        const isFullyOffline = await removeUserSocket(userId, socket.id);

        if (isFullyOffline) {
          socket.broadcast.emit(events.USER_OFFLINE, { userId });
        }
      });

    } catch (err) {
      console.log("❌ Invalid token");
      socket.disconnect();
    }
  });
};

module.exports = { handleSocket };