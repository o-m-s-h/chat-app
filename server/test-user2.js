const { io } = require("socket.io-client");

const socket = io("http://localhost:5000", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWMzNDYxM2YzNTc0MDVhNzgzN2ZiMzgiLCJpYXQiOjE3NzQ0MDUxNTcsImV4cCI6MTc3NTAwOTk1N30.hdWRok8FuONC3c4FENFEwiXp-vQOh3LESdqzM9whw1s"
  }
});

socket.on("connect", () => {
  console.log("✅ User2 Connected:", socket.id);
});

// 📩 Receive message
socket.on("receive_message", (msg) => {
  console.log("📩 User2 received:", msg);

  // 👁 Mark as seen after 2 sec
  setTimeout(() => {
    socket.emit("message_seen", {
      messageId: msg._id
    });
  }, 2000);
});