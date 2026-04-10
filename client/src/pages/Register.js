import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import RegisterUI from "./RegisterUI";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", {
        username,
        email,
        password
      });

      alert("Registered successfully");

      navigate("/"); // go to login
    } catch (err) {
      alert(err.response?.data?.error || "Error");
    }
  };

 return (
  <RegisterUI
    username={username}
    email={email}
    password={password}
    setUsername={setUsername}
    setEmail={setEmail}
    setPassword={setPassword}
    handleRegister={handleRegister}
  />
);
}

export default Register;