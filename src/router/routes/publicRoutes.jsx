import React from "react";
import LoginPage from "../../pages/auth/LoginPage";
const RegisterPage = React.lazy(() => import("../../pages/auth/RegisterPage"));
const publicRoutes = [
  {
    path: "/register",
    element: <RegisterPage/>
  },
    {
    path: "/login",
    element: <LoginPage/>
  },
]
export default publicRoutes;
