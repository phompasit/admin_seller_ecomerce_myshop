import React, { Suspense, useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVerifyUser, verifyToken } from "../../hooks/reducer/auth_reducer";
import { Navigate, useLocation } from "react-router-dom";
import BlockActiveSeller from "../../pages/auth/BlockActiveSeller";

// Loading component
const LoadingFallback = ({ message = "Loading page..." }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      flexDirection: "column",
      gap: "1rem",
    }}
  >
    <div
      style={{
        width: "40px",
        height: "40px",
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #3498db",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
    <div style={{ color: "#666", fontSize: "14px" }}>{message}</div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Verification message component
const VerificationMessage = ({ message }) => (
  <div
    style={{
      color: "#ea580c",
      padding: "2rem",
      textAlign: "center",
      backgroundColor: "#fff7ed",
      border: "1px solid #fed7aa",
      borderRadius: "8px",
      margin: "2rem auto",
      maxWidth: "500px",
    }}
  >
    <div style={{ fontSize: "48px", marginBottom: "1rem" }}>⚠️</div>
    <p style={{ fontSize: "16px", margin: 0 }}>{message}</p>
  </div>
);

const ProtectRoute = ({ route, children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { token, exp, sellerInfo_data } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  // ตรวจสอบ permissions แบบ memoized
  const permissions = useMemo(() => {
    const isSeller = exp?.role === "sellers";
    const pathNeedsVerification =
      route?.path?.startsWith("/seller") ||
      location.pathname.startsWith("/seller");

    return {
      hasToken: !!token,
      hasCorrectRole: exp?.role === route?.role,
      isSeller,
      active: exp?.active === true,
      pathNeedsVerification,
      isVerified: sellerInfo_data?.verificationStatus === "access",
    };
  }, [
    token,
    exp?.role,
    route?.role,
    route?.path,
    location.pathname,
    sellerInfo_data?.verificationStatus,
    exp?.active,
  ]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);

  
        await dispatch(verifyToken());

        // ถ้าเป็น seller และต้องการ verification ก็เรียก getVerifyUser
        if (permissions.isSeller && permissions.pathNeedsVerification) {
          await dispatch(getVerifyUser());
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [dispatch, permissions.isSeller, permissions.pathNeedsVerification]); // dependency เฉพาะ dispatch เท่านั้น

  // แสดง loading ระหว่างเช็ค auth
  if (isLoading) {
    return <LoadingFallback message="Verifying authentication..." />;
  }

  // ถ้าไม่มี token
  if (!permissions.hasToken) {
    return <Navigate to="/register" replace state={{ from: location }} />;
  }

  // ถ้า role ไม่ตรง
  if (!permissions.hasCorrectRole) {
    return <Navigate to="/login" replace />;
  }
  if (permissions.active) {
    return <BlockActiveSeller />;
  }
  // ถ้าเป็น seller และต้องการ verification แต่ยังไม่ verified
  if (
    permissions.isSeller &&
    permissions.pathNeedsVerification &&
    !permissions.isVerified
  ) {
    return (
      <VerificationMessage message="Please complete all verification steps in seller settings to access this page." />
    );
  }

  // ผ่านการตรวจสอบทั้งหมดแล้ว
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
};

export default ProtectRoute;
