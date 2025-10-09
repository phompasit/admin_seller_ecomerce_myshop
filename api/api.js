import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_FRONTEND_URL,
});

export default api;
