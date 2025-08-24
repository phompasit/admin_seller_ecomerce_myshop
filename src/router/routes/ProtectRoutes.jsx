import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVerifyUser, verifyToken } from "../../hooks/reducer/auth_reducer";
import { Navigate } from "react-router-dom";
const ProtectRoute = ({ route, children }) => {
  const dispatch = useDispatch();
  const { token, exp } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(getVerifyUser());
  }, [dispatch]);
  const { sellerInfo_data } = useSelector((state) => state.auth);


  useEffect(() => {
    const checkAuth = async () => {
      await dispatch(verifyToken());

    };
    checkAuth();
  }, [dispatch]);

  // ถ้ายังไม่ได้ login
  if (!token) {
    return <Navigate to="/register" replace />;
  }
  // ถ้า role ไม่ตรง route
  if (exp?.role !== route?.role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ ตรวจเฉพาะ seller และเฉพาะ path ที่ต้องการ
  const isSeller = exp?.role === "sellers";
  const pathNeedsVerification = route?.path?.startsWith("/seller");

  if (isSeller && pathNeedsVerification) {
    if (!sellerInfo_data || sellerInfo_data.verificationStatus !== "access") {
      return (
        <div style={{ color: "red", padding: "2rem", textAlign: "center" }}>
          Please complete all verification in seller settings to unlock this
          page.
        </div>
      );
      // หรือ: return <Navigate to="/seller/verify-first" replace />;
    }
  }

  return <Suspense fallback={<div>Loading page...</div>}>{children}</Suspense>;
};

export default ProtectRoute;
