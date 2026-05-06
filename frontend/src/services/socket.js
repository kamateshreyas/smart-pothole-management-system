import { io } from "socket.io-client";
import { API_URL } from "./api.js";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_URL.replace("/api", "");

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"]
});
