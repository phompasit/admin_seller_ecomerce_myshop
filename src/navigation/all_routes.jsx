///ໜ້າ ລີ້ງຄິກ
import { LayoutDashboard } from "lucide-react";
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
    icon: LayoutDashboard,
    label: "ໜ້າຫຼັກ",
    role: "admin",
    path: "/admin/dashbord_admin",
  },
  {
    icon: FiHome,
    label: "ໜ້າຫຼັກ",
    isActive: true,
    role: "sellers",
    path: "/sellers/dashboard",
  },
  {
    icon: FiPackage,
    label: "ສິນຄ້າ",
    role: "sellers",
    path: "/sellers/products",
  },
  {
    icon: FiPackage,
    label: "ໝວດໝູ່ສິນຄ້າ",
    role: "admin",
    path: "/admin/add_category",
  },
  {
    icon: FiPackage,
    label: "ຄູ່ປ່ອງສ່ວນຫລຸດ",
    role: "admin",
    path: "/admin/add_coupon",
  },
  {
    icon: FiPackage,
    label: "ຈັດການຜູ້ຂາຍ",
    role: "admin",
    path: "/admin/seller_management",
  },
  {
    icon: FiPackage,
    label: "ຈັດການສິນຄ້າ",
    role: "admin",
    path: "/admin/products_management",
  },
  ///OrderManagementDashboard
  {
    icon: FiPackage,
    label: "ຈັດການອໍເດີ້",
    role: "admin",
    path: "/admin/order_management",
  },
  {
    icon: FiShoppingCart,
    label: "ຄຳສັ່ງຊື້ສິນຄ້າ",
    path: "/sellers/orders",
    role: "sellers",
    // badge: 5,
  },
  {
    icon: FiMessageCircle,
    label: "ຕິດຕໍ່ລູກຄ້າ",
    path: "/sellers/chat",
    role: "sellers",
    badge: 0,
  },

  {
    icon: FiDollarSign,
    label: "ການເງິນ",
    role: "sellers",
    path: "/sellers/finance",
  },

  {
    icon: FiDollarSign,
    label: "ການເງິນ",
    role: "admin",
    path: "/admin/finance",
  },
  {
    icon: FiSettings,
    label: "ຕັ້ງຄ່າ",
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
