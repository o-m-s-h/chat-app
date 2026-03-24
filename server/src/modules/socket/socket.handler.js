const jwt = require("jsonwebtoken");
const events = require("./events");

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

      // 🔥 Add socket to user's list
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, []);
      }

      onlineUsers.get(userId).push(socket.id);

      console.log(`✅ User ${userId} is online`);
      console.log("📡 Current sockets:", onlineUsers.get(userId));

      // Broadcast ONLY when user comes online first time
      if (onlineUsers.get(userId).length === 1) {
        socket.broadcast.emit(events.USER_ONLINE, { userId });
      }

      // Handle disconnect
      socket.on(events.DISCONNECT, () => {
        console.log(`❌ User ${userId} disconnected`);

        const sockets = onlineUsers.get(userId) || [];

        const updatedSockets = sockets.filter(id => id !== socket.id);

        if (updatedSockets.length === 0) {
          onlineUsers.delete(userId);

          // 🔥 Broadcast offline only when last socket closes
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