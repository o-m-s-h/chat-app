const { io } = require("socket.io-client");

const socket = io("http://localhost:5000", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWMzNDVhZWYzNTc0MDVhNzgzN2ZiMzQiLCJpYXQiOjE3NzQ0MDUwNjQsImV4cCI6MTc3NTAwOTg2NH0.xUCAfPMJ1r15KDeD2pXk5dEjY3qc4rejY1qGp7A6bpI"
  }
});

socket.on("connect", () => {
  console.log("✅ User1 Connected:", socket.id);

  // Send message after 2 sec
  setTimeout(() => {
    socket.emit("send_message", {
      receiverId: "69c34613f357405a7837fb38",
      content: "Hello from User1 🚀"
    });
  }, 2000);
});

socket.on("receive_message", (msg) => {
  console.log("📩 User1 received:", msg);
});

socket.on("message_seen", (data) => {
  console.log("👁 Seen update:", data);
});