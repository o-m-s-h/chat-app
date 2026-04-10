import { useEffect, useState } from "react";
import API from "../services/api";
import { connectSocket } from "../socket/socket";
import "../App.css";
import ChatUI from "./ChatUI";

function Chat() {
  const [socket, setSocket] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [email, setEmail] = useState("");

  // ✅ USERS STATE
  const [users, setUsers] = useState([]);

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  // 🔹 Fetch users
  const fetchUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data);
  };
  // new 
    const addUser = async () => {
    try {
      const res = await API.post("/users/add", { email });

      alert("User added");

      setUsers((prev) => [...prev, res.data.user]);

      setEmail("");
    } catch (err) {
      alert(err.response?.data?.error || "Error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔥 connect socket
  useEffect(() => {
    const token = localStorage.getItem("token");
    const s = connectSocket(token);
    setSocket(s);
  }, []);

  // 🔥 ONLINE / OFFLINE LISTENERS
  useEffect(() => {
    if (!socket) return;

    socket.on("online_users", (users) => {
    setOnlineUsers(users);
    });

    socket.on("user_online", ({ userId }) => {
      console.log("🟢 Online:", userId);
      setOnlineUsers((prev) => {
        if (prev.includes(userId)) return prev;
        return [...prev, userId];
      });
    });

    socket.on("user_offline", ({ userId }) => {
      console.log("⚫ Offline:", userId);
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      socket.off("online_users");
      socket.off("user_online");
      socket.off("user_offline");
    };
  }, [socket]);

  // 🔹 Fetch chats
  const fetchChats = async () => {
    const res = await API.get("/chat");
    setChats(res.data);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // 🔹 Fetch messages
  const fetchMessages = async (chatId) => {
    const res = await API.get(`/chat/${chatId}/messages`);
    setMessages(res.data);
  };

  // 🔥 START CHAT
  const startChat = async (user) => {
    let chat = chats.find((c) =>
      c.participants.some((p) => p._id === user._id)
    );

    if (!chat) {
      socket.emit("send_message", {
        receiverId: user._id,
        content: "👋 Hi",
      });

      setTimeout(fetchChats, 500);
    } else {
      setSelectedChat(chat);
      fetchMessages(chat._id);
    }
  };

  // 🔥 Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (msg) => {
      const normalizedMsg = {
        ...msg,
        senderId: msg.sender || msg.senderId,
      };

      if (msg.chat === selectedChat?._id) {
        setMessages((prev) => [...prev, normalizedMsg]);
      }
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, [socket, selectedChat]);

  // 🔥 SEND MESSAGE
  const sendMessage = () => {
    if (!input || !selectedChat || !socket) return;

    const receiverId = selectedChat.participants.find(
      (p) => p._id !== userId
    )?._id;

    if (!receiverId) return;

    socket.emit("send_message", {
      receiverId,
      content: input,
      chatId: selectedChat._id,
    });

    setInput("");
  };

  // 🔥 logout
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

   return (
    <ChatUI
      users={users}
      chats={chats}
      selectedChat={selectedChat}
      setSelectedChat={setSelectedChat}
      messages={messages}
      input={input}
      setInput={setInput}
      sendMessage={sendMessage}
      startChat={startChat}
      fetchMessages={fetchMessages}
      onlineUsers={onlineUsers}
      userId={userId}
      username={username}
      logout={logout}
      email={email}
      setEmail={setEmail}
      addUser={addUser}
    />
  );
}

export default Chat;