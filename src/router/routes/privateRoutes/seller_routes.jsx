import { lazy } from "react";
import SellerSettings from "../../../pages/seller_pages/SellerSettings";
import ProductManagement from "../../../pages/seller_pages/ProductManagement";
import FinanceSellerPage from "../../../pages/seller_pages/FinanceSellerPage";
import SellerOrderManagement from "../../../pages/seller_pages/SellerOrderManagement";
import ChatCustomer from "../../../pages/seller_pages/ChatCustomer";

const Dashboard = lazy(() => import("../../../pages/seller_pages/Dashboard"));

export const seller_routes = [
  {
    path: "/sellers/dashboard",
    element: <Dashboard />,
    role: "sellers",
  },
  {
    path: "/setting",
    element: <SellerSettings />,
    role: "sellers",
  },
  {
    path: "/sellers/products",
    element: <ProductManagement />,
    role: "sellers",
  },
  {
    path: "/sellers/finance",
    element: <FinanceSellerPage />,
    role: "sellers",
  },
    {
    path: "/sellers/orders",
    element: <SellerOrderManagement />,
    role: "sellers",
  },
   {
    path: "/sellers/chat",
    element: <ChatCustomer />,
    role: "sellers",
  },
];
