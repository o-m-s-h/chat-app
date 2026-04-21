import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (token) => {
  if (!socket) {
    socket = io(process.env.REACT_APP_SOCKET_URL, {
      auth: { token },
      autoConnect: true
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    // 👇 Handle forced logout from server
    socket.on("force_logout", ({ message }) => {
      console.warn("Force logout:", message);

      socket.disconnect();

      // Clear local auth state
      localStorage.removeItem("token");

      // Redirect to login
      alert(message);
      window.location.href = "/login";
    });
  }

  return socket;
};

export const getSocket = () => socket;