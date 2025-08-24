///ໜ້າ ລີ້ງຄິກ
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiMessageCircle,
  FiUsers,
  FiDollarSign,
  FiSettings,
} from "react-icons/fi";
export const all_routes = [
  {
    icon: FiHome,
    label: "Dashboard",
    isActive: true,
    role: "sellers",
    path: "/sellers/dashboard",
  },
  {
    icon: FiPackage,
    label: "Products",
    role: "sellers",
    path: "/sellers/products",
  },
  {
    icon: FiPackage,
    label: "categories",
    role: "admin",
    path: "/admin/add_category",
  },
  {
    icon: FiPackage,
    label: "Add Coupon",
    role: "admin",
    path: "/admin/add_coupon",
  },
  {
    icon: FiPackage,
    label: "seller_management",
    role: "admin",
    path: "/admin/seller_management",
  },
  {
    icon: FiPackage,
    label: "products_management",
    role: "admin",
    path: "/admin/products_management",
  },
  ///OrderManagementDashboard
  {
    icon: FiPackage,
    label: "order_management",
    role: "admin",
    path: "/admin/order_management",
  },
  {
    icon: FiShoppingCart,
    label: "Orders",
    path: "/sellers/orders",
    role: "sellers",
    badge: 5,
  },
  {
    icon: FiMessageCircle,
    label: "Chat",
    path: "/chat",
    role: "sellers",
    badge: 3,
  },
  {
    icon: FiUsers,
    label: "Customers",
    role: "sellers",
    path: "/customers",
  },
  {
    icon: FiDollarSign,
    label: "Finance",
    role: "sellers",
    path: "/sellers/finance",
  },
  {
    icon: FiSettings,
    label: "Settings",
    role: "sellers",
    path: "/setting",
  },
   {
    icon: FiSettings,
    label: "FlshSale",
    role: "admin",
    path: "/admin/flash_sale",
  },
];
