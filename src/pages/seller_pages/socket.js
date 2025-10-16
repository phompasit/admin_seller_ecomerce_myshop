import { io } from "socket.io-client";

const socket = io("http://167.86.78.170", {
  withCredentials: true,
});

export default socket;