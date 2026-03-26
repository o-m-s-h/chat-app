import { useState } from "react";
import API from "../services/api";
import { connectSocket } from "../socket/socket";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await API.post("/auth/login", {
      email,
      password
    });

    const token = res.data.token;

    localStorage.setItem("token", token);

    connectSocket(token);

    alert("Login successful");
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;