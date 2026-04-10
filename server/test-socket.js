// const { io } = require("socket.io-client");

// // 🔥 paste your JWT token here
// const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWMyOTMyNTI5NDk3MGE1NzJlYmVmYzciLCJpYXQiOjE3NzQzNTk3NjUsImV4cCI6MTc3NDk2NDU2NX0.5b8oiNJEHYTS4l3zT8Kj8kMbYW6-9yqbkF-qOb56-FY";

// const socket = io("http://localhost:5000", {
//   auth: {
//     token: TOKEN
//   }
// });

// // Connected
// socket.on("connect", () => {
//   console.log("✅ Connected:", socket.id);

//   // 🔥 Send message after connect
//   setTimeout(() => {
//     socket.emit("send_message", {
//       receiverId: "PASTE_OTHER_USER_ID",
//       content: "Hello from Omkar 🚀"
//     });
//   }, 2000);
// });

// socket.on("receive_message", (msg) => {
//   console.log("📩 New Message:", msg);
// });

// // // Online event
// socket.on("user_online", (data) => {
//   console.log("🟢 User Online:", data);
// });

// // // Offline event
// socket.on("user_offline", (data) => {
//   console.log("🔴 User Offline:", data);
// });

// // // Error handling
// socket.on("connect_error", (err) => {
//   console.log("❌ Connection Error:", err.message);
// });

const { io } = require("socket.io-client");

// 🔥 paste your JWT token here
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWMyOTMyNTI5NDk3MGE1NzJlYmVmYzciLCJpYXQiOjE3NzQzNTk3NjUsImV4cCI6MTc3NDk2NDU2NX0.5b8oiNJEHYTS4l3zT8Kj8kMbYW6-9yqbkF-qOb56-FY";

// 🔥 replace with actual receiver userId
const RECEIVER_ID = "69c34613f357405a7837fb38";

const socket = io("http://localhost:5000", {
  auth: {
    token: TOKEN
  }
});

// ==============================
// ✅ CONNECTED
// ==============================
socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);

  // ✍️ Simulate typing
  socket.emit("typing", {
    receiverId: RECEIVER_ID
  });

  // Stop typing after 3 sec
  setTimeout(() => {
    socket.emit("stop_typing", {
      receiverId: RECEIVER_ID
    });
  }, 3000);

  // 📩 Send message after typing
  setTimeout(() => {
    socket.emit("send_message", {
      receiverId: RECEIVER_ID,
      content: "Hello from Omkar 🚀"
    });
  }, 4000);
});

// ==============================
// 📩 RECEIVE MESSAGE
// ==============================
socket.on("receive_message", (msg) => {
  console.log("📩 New Message:", msg);

  // 👁 Mark as seen immediately (optional)
  socket.emit("message_seen", {
    messageId: msg._id
  });
});

// ==============================
// ✍️ TYPING EVENTS
// ==============================
socket.on("typing", (data) => {
  console.log("✍️ User typing:", data.userId);
});

socket.on("stop_typing", (data) => {
  console.log("✋ User stopped typing:", data.userId);
});

// ==============================
// 🟢 USER ONLINE
// ==============================
socket.on("user_online", (data) => {
  console.log("🟢 User Online:", data);
});

// ==============================
// 🔴 USER OFFLINE
// ==============================
socket.on("user_offline", (data) => {
  console.log("🔴 User Offline:", data);
});

// ==============================
// ❌ ERROR HANDLING
// ==============================
socket.on("connect_error", (err) => {
  console.log("❌ Connection Error:", err.message);
});