import { useState, useRef } from "react";
import "./chat.css";
import chatIcon from "../assets/chat.png";
import onlineIcon from "../assets/online.png";

function ChatUI({
  users,
  selectedChat,
  messages,
  input,
  setInput,
  sendMessage,
  startChat,
  onlineUsers,
  userId,
  username,
  logout,
  email,
  setEmail,
  addUser
}) {
  const [search, setSearch] = useState("");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(300);

  const isResizing = useRef(false);

  const filteredUsers = users
  .filter((u) =>
    showOnlineOnly ? onlineUsers.includes(u._id) : true
  )
  .filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  // 🔥 RESIZE HANDLER
  const startX = useRef(0);
const startWidth = useRef(250);

const handleMouseDown = (e) => {
  isResizing.current = true;
  startX.current = e.clientX;
  startWidth.current = sidebarWidth;
};

const handleMouseMove = (e) => {
  if (!isResizing.current) return;

  const dx = e.clientX - startX.current;
  setSidebarWidth(startWidth.current + dx);
};

  const handleMouseUp = () => {
    isResizing.current = false;
  };

  return (
    <div
      className="chat-container"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >

      {/* ICON BAR */}
      <div className="icon-bar">
        <div
          className={!showOnlineOnly ? "icon active" : "icon"}
          onClick={() => setShowOnlineOnly(false)}
        >
          <img src={chatIcon} alt="chat" className="icon-img" />
        </div>

        <div
          className={showOnlineOnly ? "icon active" : "icon"}
          onClick={() => setShowOnlineOnly(true)}
        >
          <img src={onlineIcon} alt="chat" className="online-img" />
        </div>
      </div>

      {/* USERS SIDEBAR */}
      <div
        className="sidebar"
        style={{ width: sidebarWidth }}
      >
        <h3>{showOnlineOnly ? "Online Users" : "Users"}</h3>

        {/* 🔥 ADD USER */}
        <div className="add-user-box">
          <input
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={addUser}>Add</button>
        </div>

        {/* 🔍 SEARCH */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search or start new chat"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredUsers.map((u) => {
          const isOnline = onlineUsers.includes(u._id);

          return (
            <div
              key={u._id}
              className="user"
              onClick={() => startChat(u)}
            >
              {u.username}
              <span>{isOnline ? "🟢" : "⚫"}</span>
            </div>
          );
        })}
      </div>

      {/* 🔥 RESIZER */}
      <div className="resizer" onMouseDown={handleMouseDown}></div>

      {/* CHAT AREA */}
      <div className="chat-area">

        <div className="chat-header">
          <div>
            {selectedChat
              ? selectedChat.participants
                  .filter((p) => p._id !== userId)
                  .map((p) => (
                    <div key={p._id}>
                      {p.username}
                      <small>
                        {onlineUsers.includes(p._id)
                          ? " Online"
                          : " Offline"}
                      </small>
                    </div>
                  ))
              : "Select Chat"}
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span>{username}</span>
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="messages">
          {messages.map((msg, i) => {
            const isMine =
              (msg.senderId || msg.sender) === userId;

            return (
              <div
                key={i}
                className={`message ${isMine ? "sent" : "received"}`}
              >
                {msg.content}
              </div>
            );
          })}
        </div>

        {/* INPUT */}
        {selectedChat && (
          <div className="input-box">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatUI;