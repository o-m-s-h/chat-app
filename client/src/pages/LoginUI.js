import "./login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LoginUI({ email, password, setEmail, setPassword, handleLogin }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-wrapper">
      <div className="glass-card">
        <h1>Login</h1>

        {/* EMAIL */}
        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <i className="bx bxs-user"></i>
        </div>

        {/* PASSWORD */}
        <div className="input-box">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <i
            className={`bx ${showPassword ? "bxs-eye-slash" : "bxs-eye"}`}
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer" }}
          ></i>
        </div>

        <button onClick={handleLogin} className="btn">
          Login
        </button>

        <div className="register-link">
          <p>
            Don’t have an account?{" "}
            <span onClick={() => navigate("/register")}>
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginUI;