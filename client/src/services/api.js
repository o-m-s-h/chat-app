import axios from "axios";

const API = axios.create({
  baseURL: "process.env.REACT_APP_API_URL"
});

// 🔥 attach token automatically
API.interceptors.request.use((req) => {
  const token = sessionStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;