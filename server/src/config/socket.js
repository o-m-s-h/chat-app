const { Server } = require("socket.io");
const { handleSocket } = require("../modules/socket/socket.handler");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // later restrict in production
      methods: ["GET", "POST"]
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