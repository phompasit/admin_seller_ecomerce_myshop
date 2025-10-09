import React, { useEffect } from "react";
import { useToast } from "@chakra-ui/react"; // ถ้าใช้ Chakra UI
import socket from "../seller_pages/socket"; // socket.io-client ที่เชื่อมต่อไว้แล้ว
import { useDispatch, useSelector } from "react-redux";
import { get_user } from "../../hooks/reducer/auth_reducer";

const VerifyNotification = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo._id; // ID ของผู้ใช้งาน (ควรได้จาก auth/token)
  useEffect(() => {
    // 1. ลงทะเบียน socket ฝั่ง client ด้วย userId
    dispatch(get_user());
    socket.emit("access_verify_seller_notification", userId);

    // 2. รับ event ที่ส่งจาก backend
    socket.on("verify_result", (data) => {
      toast({
        title: "📣 ແຈ້ງເຕືອນຢືນຢັນຕົວຕົນ",
        description: data.message,
        status:
          data.status === "access"
            ? "success"
            : data.status === "rejected"
            ? "error"
            : "info",
        duration: 5000,
        isClosable: true,
      });
    });

    // 3. cleanup เมื่อ component ถูก unmount
    return () => {
      socket.off("verify_result");
    };
  }, [toast, dispatch, userId]);

  return null; // เป็น component ลอย ๆ ไม่ต้องแสดงอะไร
};

export default VerifyNotification;
