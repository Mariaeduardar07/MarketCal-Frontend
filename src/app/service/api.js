// /services/api.js
import axios from "axios";

// Prefer an env var so the API can be pointed to a backend server.
// In development set NEXT_PUBLIC_API_URL, e.g. http://localhost:3333
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333",
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
