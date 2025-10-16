import { useEffect, useState, useRef, useCallback } from "react";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken } from "../../hooks/reducer/auth_reducer";
const useSocket = (userId) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(verifyToken());
  }, [dispatch]);
  useEffect(() => {
    if (!token) return; // ถ้าไม่มี token ไม่สร้าง socket

    if (!userId) {
      // ถ้าไม่มี userId ให้ disconnect socket ที่มีอยู่
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // ป้องกันการสร้าง socket ซ้ำ
    if (!socketRef.current) {
      socketRef.current = io("https://pontoeshop.shop", {
        withCredentials: true,
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        maxReconnectionAttempts: 5,
        timeout: 20000,
        transports: ["websocket", "polling"], // เพิ่มเพื่อความเสถียร
      });
    }

    const socket = socketRef.current;

    const handleConnect = () => {
      setIsConnected(true);
      // ใช้ event ที่มีใน server จริง
    };

    const handleDisconnect = (reason) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    };

    const handleReconnect = () => {
      console.log("🔄 Socket reconnected");
      setIsConnected(true);
    };

    const handleConnectError = (err) => {
      console.error("❌ Socket connection error:", err);
      setIsConnected(false);
    };

    // Register event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("reconnect", handleReconnect);
    socket.on("connect_error", handleConnectError);

    // ถ้า socket เชื่อมต่ออยู่แล้ว ให้ register user
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      if (socketRef.current) {
        // ลบ listeners ก่อน disconnect
        socketRef.current.off("connect", handleConnect);
        socketRef.current.off("disconnect", handleDisconnect);
        socketRef.current.off("reconnect", handleReconnect);
        socketRef.current.off("connect_error", handleConnectError);

        // Disconnect และ cleanup
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
    };
  }, [userId, token]);

  // Helper function เพื่อ emit events อย่างปลอดภัย
  const emit = useCallback((event, data, callback) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(event, data, callback);
    } else {
      console.warn("⚠️ Socket not connected, cannot emit:", event);
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    emit, // เพิ่มฟังก์ชัน emit ที่ปลอดภัย
  };
};

export default useSocket;
