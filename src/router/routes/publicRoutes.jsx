import React from "react";
import LoginPage from "../../pages/auth/LoginPage";
import Phonereset from "../../components/Phonereset";
import OTPVerification from "../../components/OTPVerification";
import ResetPassword from "../../components/ResetPassword";
const RegisterPage = React.lazy(() => import("../../pages/auth/RegisterPage"));
const publicRoutes = [
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <Phonereset />,
  },
  {
    path: "/otp-verification/:phone/:uuid",
    element: <OTPVerification />,
  },
  {
    path: "/reset-password/:phone/:otp/:uuid",
    element: <ResetPassword />,
  },
];
export default publicRoutes;
