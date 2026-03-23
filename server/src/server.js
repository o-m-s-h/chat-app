require("dotenv").config();
const http = require("http");
const app = require("./app");
const { initSocket } = require("./config/socket");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect Database FIRST
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});