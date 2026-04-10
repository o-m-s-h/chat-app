import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import LoginUI from "./LoginUI";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      const { token, user } = res.data;

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userId", user._id);

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("username", user.username);

      navigate("/chat");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <LoginUI
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      handleLogin={handleLogin}
    />
  );
}

export default Login;