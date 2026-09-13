import "./register.css";
import { useNavigate } from "react-router-dom";
import UIIcon from "../components/UIIcon";

function RegisterUI({ username, email, password, setUsername, setEmail, setPassword, handleRegister }) {
  const navigate = useNavigate();
  return (
    <main className="auth-page">
      <div className="auth-brand"><span className="brand-mark"><UIIcon /></span>afterhours<span style={{ color: "var(--cyan)" }}>.</span></div>
      <section className="auth-card" aria-labelledby="register-title">
        <p className="auth-eyebrow">A place for your people</p>
        <h1 id="register-title">Great chats start here.</h1>
        <p className="auth-description">Create your account. Make yourself at home.</p>
        <label htmlFor="register-name">Username</label>
        <div className="auth-field"><input id="register-name" type="text" placeholder="What should we call you?" value={username} onChange={(e) => setUsername(e.target.value)} /></div>
        <label htmlFor="register-email">Email address</label>
        <div className="auth-field"><input id="register-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <label htmlFor="register-password">Password</label>
        <div className="auth-field"><input id="register-password" type="password" placeholder="Choose a password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <button onClick={handleRegister} className="auth-submit">Create account <UIIcon name="arrow" /></button>
        <p className="auth-switch">Already have an account? <button className="auth-link" onClick={() => navigate("/")}>Sign in</button></p>
      </section>
      <p className="auth-footer">Less noise. More conversation.</p>
    </main>
  );
}
export default RegisterUI;
