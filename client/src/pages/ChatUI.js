import { useState, useRef } from "react";
import "./chat.css";
import UIIcon from "../components/UIIcon";


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
    <div className="chat-container" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <nav className="icon-bar" aria-label="Chat filters">
        <div className="brand-mark" title="Afterhours"><UIIcon /></div>
        <div className="rail-links">
          <button className={!showOnlineOnly ? "icon active" : "icon"} onClick={() => setShowOnlineOnly(false)} aria-label="All conversations" aria-pressed={!showOnlineOnly} title="All conversations"><UIIcon /></button>
          <button className={showOnlineOnly ? "icon active" : "icon"} onClick={() => setShowOnlineOnly(true)} aria-label="Online users" aria-pressed={showOnlineOnly} title="Online users"><UIIcon name="users" /></button>
        </div>
        <div className="rail-avatar" title={username}>{username?.charAt(0).toUpperCase()}</div>
      </nav>

      <aside className="sidebar" style={{ width: sidebarWidth }}>
        <div className="sidebar-brand">afterhours<span>.</span></div>
        <div className="sidebar-heading"><h1>{showOnlineOnly ? "Online users" : "Messages"}</h1><span className="count-badge">{filteredUsers.length}</span></div>
        <p className="sidebar-subtitle">Your people, one conversation away.</p>
        <div className="search-box">
          <UIIcon name="search" />
          <input type="text" aria-label="Search conversations" placeholder="Search people" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="add-user-section">
          <label htmlFor="add-email">Start a connection</label>
          <div className="add-user-box">
            <input id="add-email" placeholder="Enter their email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button onClick={addUser}>Add</button>
          </div>
        </div>
        <div className="list-label">{showOnlineOnly ? "AVAILABLE NOW" : "YOUR CONVERSATIONS"}</div>
        <div className="user-list">
          {filteredUsers.map((u) => {
            const isOnline = onlineUsers.includes(u._id);
            return (
              <button key={u._id} className={`user ${selectedChat?.participants.some((p) => p._id === u._id && p._id !== userId) ? "selected" : ""}`} onClick={() => startChat(u)}>
                <span className="user-avatar">{u.username.charAt(0).toUpperCase()}<span className={`status-dot ${isOnline ? "online" : ""}`} /></span>
                <span className="user-details"><span className="user-name">{u.username}</span><span className="user-status">{isOnline ? "Online now" : "Offline"}</span></span>
                <span className="user-arrow" aria-hidden="true">›</span>
              </button>
            );
          })}
          {filteredUsers.length === 0 && <div className="list-empty"><UIIcon name="users" /><p>{search ? "No people found" : showOnlineOnly ? "It's quiet right now" : "Your people go here"}</p><span>{search ? "Try another name." : showOnlineOnly ? "Check all conversations to find someone." : "Add someone by email to get started."}</span></div>}
        </div>
        <div className="sidebar-footer"><span className="footer-dot" />A little closer, wherever you are.</div>
      </aside>

      <div className="resizer" onMouseDown={handleMouseDown} title="Drag to resize sidebar" />

      <main className="chat-area">
        <header className="chat-header">
          <div className="conversation-title">
            {selectedChat ? selectedChat.participants.filter((p) => p._id !== userId).map((p) => (
              <div className="chat-person" key={p._id}>
                <span className="user-avatar">{p.username.charAt(0).toUpperCase()}</span>
                <div><div className="header-name">{p.username}</div><small><span className={`status-dot ${onlineUsers.includes(p._id) ? "online" : ""}`} />{onlineUsers.includes(p._id) ? "Online" : "Offline"}</small></div>
              </div>
            )) : <div><div className="header-name">Your conversation space</div><small>Make time for a good chat.</small></div>}
          </div>
          <div className="account-actions"><span className="account-name">{username}</span><button className="logout-btn" onClick={logout}><UIIcon name="logout" /><span>Log out</span></button></div>
        </header>

        <div className="messages">
          {!selectedChat && messages.length === 0 && <div className="chat-empty">
            <div className="empty-orbit"><span className="empty-chat-icon"><UIIcon /></span><span className="orbit-dot" /></div>
            <p className="empty-eyebrow">STAY IN THE LOOP</p>
            <h2>A good conversation<br />starts with hello<span>.</span></h2>
            <p>Choose someone from your conversations,<br className="desktop-break" /> or add a friend by email to get started.</p>
            <div className="empty-note"><UIIcon name="users" />Your people. Your space.</div>
          </div>}
          {selectedChat && messages.length === 0 && <div className="chat-empty"><span className="empty-chat-icon"><UIIcon /></span><h2>Say hello<span>.</span></h2><p>This conversation is ready for its first message.</p></div>}
          {messages.map((msg, i) => {
            const isMine = (msg.senderId || msg.sender) === userId;
            return <div key={i} className={`message ${isMine ? "sent" : "received"}`}>{msg.content}</div>;
          })}
        </div>

        {selectedChat && <div className="composer">
          <div className="input-box">
            <input aria-label="Message" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Write a message..." />
            <button onClick={sendMessage}>Send <UIIcon name="send" /></button>
          </div>
        </div>}
      </main>
    </div>
  );
}
export default ChatUI;
