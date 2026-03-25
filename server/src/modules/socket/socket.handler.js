const jwt = require("jsonwebtoken");
const events = require("./events");
const { createMessage } = require("../message/message.service");

// userId -> [socketIds]
const onlineUsers = new Map();

const handleSocket = (io) => {
  io.on(events.CONNECTION, (socket) => {
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

      // 🔥 Store user sockets
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, []);
      }

      onlineUsers.get(userId).push(socket.id);

      console.log(`✅ User ${userId} is online`);
      console.log("📡 Current sockets:", onlineUsers.get(userId));

      // Emit online only first time
      if (onlineUsers.get(userId).length === 1) {
        socket.broadcast.emit(events.USER_ONLINE, { userId });
      }

      // ==============================
      // 🔥 MESSAGE HANDLING (CORE)
      // ==============================
      socket.on(events.SEND_MESSAGE, async ({ receiverId, content }) => {
        try {
          console.log(`📩 Message from ${userId} → ${receiverId}`);

          // 1. Save message
          const message = await createMessage({
            sender: userId,
            receiver: receiverId,
            content
          });

          // 2. Check if receiver is online
          const receiverSockets = onlineUsers.get(receiverId);

          if (receiverSockets && receiverSockets.length > 0) {
            // 3. Send to all receiver sockets
            receiverSockets.forEach((socketId) => {
              io.to(socketId).emit(events.RECEIVE_MESSAGE, message);
            });

            // 4. Update status
            message.status = "delivered";
            await message.save();
          }

          // 5. Send back to sender
          socket.emit(events.RECEIVE_MESSAGE, message);

        } catch (err) {
          console.log("❌ Message error:", err.message);
        }
      });

      // ==============================
      // 🔌 DISCONNECT
      // ==============================
      socket.on(events.DISCONNECT, () => {
        console.log(`❌ User ${userId} disconnected`);

        const sockets = onlineUsers.get(userId) || [];

        const updatedSockets = sockets.filter(id => id !== socket.id);

        if (updatedSockets.length === 0) {
          onlineUsers.delete(userId);

          socket.broadcast.emit(events.USER_OFFLINE, { userId });
        } else {
          onlineUsers.set(userId, updatedSockets);
        }
      });

    } catch (err) {
      console.log("❌ Invalid token");
      socket.disconnect();
    }
  });
};

const getOnlineUsers = () => onlineUsers;

module.exports = { handleSocket, getOnlineUsers };