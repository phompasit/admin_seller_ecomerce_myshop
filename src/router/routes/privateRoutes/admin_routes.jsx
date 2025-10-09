import { lazy } from "react";
import AddCouponForm from "../../../pages/admin_pages/AddCouponForm";
import SellerManagementDashboard from "../../../pages/admin_pages/SellerManagementDashboard";
import ProductManagement from "../../../pages/admin_pages/ProductManagement";
import OrderManagementDashboard from "../../../pages/admin_pages/OrderManagementDashboard";
import FlashSaleAdminDashboard from "../../../pages/admin_pages/FlashSaleAdminDashboard";
import Dashbord_admin from "../../../pages/admin_pages/Dashbord_admin";
import Finance_admin from "../../../pages/admin_pages/Finance_admin";
const Add_category = lazy(() =>
  import("../../../pages/admin_pages/AdminAddCategory")
);
export const admin_routes = [
  //admin/dashbord_admin
  {
    path: "/admin/dashbord_admin",
    element: <Dashbord_admin />,
    role: "admin",
  },
  {
    path: "/admin/add_category",
    element: <Add_category />,
    role: "admin",
  },
  {
    path: "/admin/add_coupon",
    element: <AddCouponForm />,
    role: "admin",
  },
  ////admin/seller_management
  {
    path: "/admin/seller_management",
    element: <SellerManagementDashboard />,
    role: "admin",
  },
  //products_management
  {
    path: "/admin/products_management",
    element: <ProductManagement />,
    role: "admin",
  },
  //rder_management
  {
    path: "/admin/order_management",
    element: <OrderManagementDashboard />,
    role: "admin",
  },
  ///flash_sale
  {
    path: "/admin/flash_sale",
    element: <FlashSaleAdminDashboard />,
    role: "admin",
  },
    {
    path: "/admin/finance",
    element: <Finance_admin />,
    role: "admin",
  },
];
