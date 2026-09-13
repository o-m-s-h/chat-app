import "./login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import UIIcon from "../components/UIIcon";

function LoginUI({ email, password, setEmail, setPassword, handleLogin }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <main className="auth-page">
      <div className="auth-brand"><span className="brand-mark"><UIIcon /></span>afterhours<span style={{ color: "var(--cyan)" }}>.</span></div>
      <section className="auth-card" aria-labelledby="login-title">
        <p className="auth-eyebrow">Good to see you again</p>
        <h1 id="login-title">Pick up the conversation.</h1>
        <p className="auth-description">Sign in and get back to your people.</p>
        <label htmlFor="login-email">Email address</label>
        <div className="auth-field"><input id="login-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <label htmlFor="login-password">Password</label>
        <div className="auth-field">
          <input id="login-password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="button" className="password-toggle" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button>
        </div>
        <button onClick={handleLogin} className="auth-submit">Sign in <UIIcon name="arrow" /></button>
        <p className="auth-switch">New around here? <button className="auth-link" onClick={() => navigate("/register")}>Create an account</button></p>
      </section>
      <p className="auth-footer">Less noise. More conversation.</p>
    </main>
  );
}
export default LoginUI;
