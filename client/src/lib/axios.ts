import axios from "axios";

export const api = axios.create({
  baseURL: "https://rstore-mern.onrender.com",
  withCredentials: true,
});
