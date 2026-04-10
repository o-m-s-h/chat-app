import "./register.css";
import { useNavigate } from "react-router-dom";

function RegisterUI({
  username,
  email,
  password,
  setUsername,
  setEmail,
  setPassword,
  handleRegister
}) {
  const navigate = useNavigate();

  return (
    <div className="register-wrapper">
      <div className="glass-card">
        <h1>Register</h1>

        {/* USERNAME */}
        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* EMAIL */}
        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button onClick={handleRegister} className="btn">
          Register
        </button>

        <div className="register-link">
          <p>
            Already have an account?{" "}
            <span onClick={() => navigate("/")}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterUI;