const { Server } = require("socket.io");
const { handleSocket } = require("../modules/socket/socket.handler");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
      "http://localhost:3000",
      "https://omkar-chat-app.vercel.app"
    ], // later restrict in production
      methods: ["GET", "POST"],
      credentials : true
    },
  });

  // Delegate all logic to handler (clean architecture)
  handleSocket(io);
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initSocket, getIO };