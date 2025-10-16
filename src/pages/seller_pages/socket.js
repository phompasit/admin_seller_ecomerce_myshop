import { io } from "socket.io-client";

const socket = io("https://pontoeshop.shop", {
  withCredentials: true,
});

export default socket;