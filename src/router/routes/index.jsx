// routes/getRoutes.js หรือที่คุณเก็บไฟล์นี้
import React, { Suspense } from "react";
import { privateRoutes } from "./privateRoutes";
import ProtectRoutes from "./ProtectRoutes";
import MainLayout from "../../layouts/MainLayout";
import AuthProvider from "../../utils/AuthProvider"; // ✅ import มา
// routes/getRoutes.js
export const getRoutes = () => {
  const protectedRoutes = privateRoutes.map((route) => ({
    ...route,
    element: <ProtectRoutes route={route}>{route.element}</ProtectRoutes>,
  }));

  return {
    path: "/",
    element: (
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    ),
    children: protectedRoutes,
  };
};







// export const getRoutes = () => {
//  const protectedRoutes = privateRoutes.map((route) => ({
//   ...route,
//   element: (
//     <ProtectRoutes role={route.role}>
//       {route.element}
//     </ProtectRoutes>
//   ),
//   children: route.children?.map((child) => ({
//     ...child,
//     element: (
//       <ProtectRoutes role={child.role}>
//         {child.element}
//       </ProtectRoutes>
//     ),
//   })),
// }));

//   return {
//     path: "/",
//     element: (
//       <AuthProvider>
//         <MainLayout />
//       </AuthProvider>
//     ),
//     children: protectedRoutes,
//   };
// };
