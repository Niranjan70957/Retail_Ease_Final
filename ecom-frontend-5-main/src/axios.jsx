import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8081/api",
});
delete API.defaults.headers.common["Authorization"];
export default API;
