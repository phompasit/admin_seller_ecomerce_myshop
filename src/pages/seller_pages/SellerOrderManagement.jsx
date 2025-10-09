import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Grid,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  Select,
  Text,
  Badge,
  IconButton,
  Checkbox,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  HStack,
  Divider,
  Progress,
  useToast,
  Spinner,
  Container,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Image,
  useBreakpointValue,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  InputLeftElement,
  InputGroup,
} from "@chakra-ui/react";
import {
  FiEye,
  FiEdit,
  FiPrinter,
  FiSearch,
  FiTruck,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiHash,
} from "react-icons/fi";
import {
  get_order,
  update_status_shipping,
  update_tracking,
} from "../../hooks/reducer/sellers_reducer/provider_sellers";
import { useDispatch, useSelector } from "react-redux";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
// Mock data
const OrderManagement = () => {
  const [orders, setOrders] = useState();
  const [filteredOrders, setFilteredOrders] = useState();
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingImage, setShippingImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [note, setNote] = useState();
  const [step, setStep] = useState();
  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose,
  } = useDisclosure();
  const {
    isOpen: isPrintModalOpen,
    onOpen: onPrintModalOpen,
    onClose: onPrintModalClose,
  } = useDisclosure();
  const {
    isOpen: isStatusModalOpen,
    onOpen: onStatusModalOpen,
    onClose: onStatusModalClose,
  } = useDisclosure();
  const {
    isOpen: isShippingModalOpen,
    onOpen: onShippingModalOpen,
    onClose: onShippingModalClose,
  } = useDisclosure();
  const dispatch = useDispatch();
  const toast = useToast();
  const { get_orders, seller_data_orders } = useSelector(
    (state) => state.provider_sellers
  );
  const columns = useBreakpointValue({ base: 2, md: 3, lg: 4 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        await dispatch(get_order());
      } catch (error) {
        toast({
          title: "ເກີດຂໍ້ຜິດພາດ",
          description: error.message || "ກະລຸນາ ລອງໃໝ່ພາຍຫລັງ ",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [dispatch]);
  useEffect(() => {
    setOrders(get_orders);
    setFilteredOrders(get_orders);
  }, [get_orders]);
  // Calculate summary stats ProductSkeleton
  const ProductSkeleton = () => (
    <VStack spacing={4} align="center">
      {/* ไอคอนการ์ตูนกำลังโหลด */}

      {/* Skeleton สำหรับเนื้อหา */}
      <Skeleton height="20px" width="200px" />
      <SkeletonText mt="2" noOfLines={2} spacing="3" width="250px" />
      <Skeleton height="20px" width="100px" />
      <Skeleton height="20px" width="150px" />
    </VStack>
  );
  const today = new Date().toISOString().split("T")[0];
  const summary = {
    today: orders
      ?.filter((order) => {
        // กัน null/undefined
        if (!order?.createdAt) return false;
        return order.createdAt.split("T")[0] === today;
      })
      // เรียงจากวันที่ล่าสุด
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).length,
    pending: orders?.filter((order) => order.shipping_status === "pending")
      .length,
    shipped: orders?.filter((order) => order.shipping_status === "Shipped")
      .length,
    completed: orders?.filter((order) => order.shipping_status === "Delivered")
      .length,
    cancelled: orders?.filter((order) => order.shipping_status === "Cancelled")
      .length,
  };

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered?.filter((order) =>
        String(order?.orderId || "")
          .toLowerCase()
          .includes(search)
      );
    }
    // Date filter
    if (dateFilter !== "all") {
      const today = new Date();
      const filterDate = new Date(today);
      if (dateFilter === "today") {
        filtered = filtered
          .filter(
            (order) =>
              new Date(order.createdAt).toISOString().split("T")[0] ===
              new Date().toISOString().split("T")[0]
          )
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (dateFilter === "7days") {
        filterDate.setDate(today.getDate() - 7);
        filtered = filtered
          .filter((order) => new Date(order.createdAt) >= filterDate)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (dateFilter === "30days") {
        filterDate.setDate(today.getDate() - 30);
        filtered = filtered
          .filter((order) => new Date(order.createdAt) >= filterDate)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered
        .filter((order) => order.shipping_status === statusFilter)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Payment filter
    if (paymentFilter !== "all") {
      if (paymentFilter === "PAYMENT_COMPLETED") {
        filtered = filtered
          .filter((order) => order.status === "PAYMENT_COMPLETED")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (paymentFilter === "pending_payment") {
        filtered = filtered
          .filter((order) => order.status === "pending_payment")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, dateFilter, statusFilter, paymentFilter]);

  const getStatusColor = (status) => {
    const colors = {
      Processing: "orange",
      Shipped: "blue",
      Delivered: "green",
      Cancelled: "red",
      Paid: "green",
      pending: "yellow",
      Failed: "red",
    };
    return colors[status] || "gray";
  };
  const getStatusText = (status) => {
    const texts = {
      Processing: "ກຳລັງດຳເນີນການ",
      Shipped: "ຈັດສົ່ງແລ້ວ",
      Delivered: "ຈັດສົ່ງສຳເລັດ",
      Cancelled: "ຍົກເລີກ",
      Paid: "ຊຳລະເງິນແລ້ວ",
      pending: "ລໍຖ້າດຳເນີນການ",
      Failed: "ລົ້ມເລວ",
    };
    return texts[status] || "ไม่ทราบสถานะ";
  };
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "COD":
        return "💰";
      case "Transfer":
        return "🏦";
      case "Card":
        return "💳";
      case "Wallet":
        return "📱";
      default:
        return "💰";
    }
  };
  // mapping สถานะ → step + note
  const statusMap = {
    Processing: {
      step: "Processing",
      note: "ກຳລັງກຽມສິນຄ້າແລະແພ໋ກສຶນຄ້າ",
    },
    Shipped: {
      step: "Shipped",
      note: "ສິນຄ້າອອກຈາກສາງກຳລັງຈັດສົ່ງໃຫ່ຜູ້ບໍລິການຂົນສົ່ງ",
    },
    Delivered: {
      step: "Delivered",
      note: " ສິນຄ້າໄດ້ຮັບການຈັດສົ່ງສຳເລັດໃຫ້ກັບຜູ້ບໍລິການຂົນສົ່ງ",
    },
    Cancelled: {
      step: "Cancelled",
      note: "ຄຳສັ່ງຊື້ຂອງທ່ານຖືກຍົກເລີກ ກຳລັງດຳເນີນການຄືນເງິນພາຍໃນ 1-3ຊົ່ວໂມງ",
    },
  };
  const handleSelectOrder = (orderId, checked) => {
    if (checked) {
      setSelectedOrders((prev) => [...prev, orderId]);
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map((order) => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handlePrintSelected = (selectedOrders) => {
    if (selectedOrders.length === 0) {
      toast({
        title: "ກະລຸນາເລືອກຄຳສັ່ງຊື້",
        description: "ກະລຸນາເລືອກຄຳສັ່ງຊື້ທີ່ຕ້ອງການພິມ",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setSelectedOrders(selectedOrders);
    onPrintModalOpen();
  };
  const printRef = useRef(null);

  // ✅ ใช้ useReactToPrint
  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) {
      toast({
        title: "ເກິດຂໍ້ຜິດພາດ",
        description: "ບໍ່ສາມາດເຂົ້າເຖິງເນື້ອຫານການພິມໄດ້",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const selectedOrdersData = selectedOrders
      .map((orderId) => orders.find((o) => o._id === orderId))
      .filter(Boolean);
    const printWindow = window.open("", "_blank");
    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order Receipt</title>
          <meta charset="utf-8">
          <style>
      
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Lao:wght@400;500;600&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: "Noto Sans Lao", serif;
    }

    body {
      font-family: "Noto Sans Lao", serif;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
      padding: 15mm;
      color: #1f2937;
      font-size: 10px;
      line-height: 1.4;
    }

    .print-container {
      display: flex;
      flex-direction: column;
      gap: 20mm;
    }

    .order-receipt {
      width: 8cm;
      max-width: 8cm;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      padding: 0;
      margin: 0 auto;
      overflow: hidden;
      page-break-inside: avoid;
      position: relative;
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .receipt-header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      padding: 20px 16px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .receipt-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }

    .receipt-header::after {
      content: '';
      position: absolute;
      bottom: -12px;
      left: 50%;
      transform: translateX(-50%);
      width: 24px;
      height: 24px;
      background: #ffffff;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .store-logo {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin: 0 auto 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.3);
      font-weight: 700;
      font-size: 18px;
      overflow: hidden;
      position: relative;
      z-index: 2;
    }

    .store-logo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }

    .store-name {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 4px;
      letter-spacing: -0.3px;
      position: relative;
      z-index: 2;
    }

    .store-subtitle {
      font-size: 10px;
      opacity: 0.9;
      margin-bottom: 8px;
      font-weight: 400;
      position: relative;
      z-index: 2;
    }

    .store-code {
      font-size: 8px;
      font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
      background: rgba(255, 255, 255, 0.2);
      padding: 4px 8px;
      border-radius: 6px;
      display: inline-block;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      z-index: 2;
    }

    .order-info {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      font-size: 10px;
      position: relative;
      z-index: 2;
    }

    .order-id {
      font-weight: 700;
      font-size: 12px;
    }

    .order-date {
      opacity: 0.9;
      font-weight: 400;
    }

    .receipt-body {
      padding: 20px 16px;
    }

    .section {
      margin-bottom: 20px;
    }

    .section-title {
      font-size: 11px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
      text-transform: none;
      letter-spacing: -0.2px;
    }

    .section-title::before {
      content: '';
      width: 3px;
      height: 14px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 2px;
      flex-shrink: 0;
    }

    .customer-info {
      background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
      padding: 14px;
      border-radius: 12px;
      font-size: 9px;
      border: 1px solid #d1fae5;
      position: relative;
    }

    .customer-info::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 12px 0 0 12px;
    }

    .info-row {
      display: flex;
      margin-bottom: 6px;
      align-items: flex-start;
    }

    .info-row:last-child {
      margin-bottom: 0;
    }

    .info-label {
      font-weight: 600;
      min-width: 48px;
      color: #374151;
      flex-shrink: 0;
    }

    .info-value {
      flex: 1;
      color: #1f2937;
      margin-left: 8px;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9px;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .items-table th {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      padding: 8px 6px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 2px solid #e2e8f0;
      font-size: 8px;
      letter-spacing: -0.1px;
    }

    .items-table td {
      padding: 10px 6px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: top;
    }

    .items-table tr:hover {
      background: #fafbfc;
    }

    .item-name {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
      font-size: 9px;
      line-height: 1.3;
    }

    .item-details {
      color: #6b7280;
      font-size: 8px;
      line-height: 1.3;
      background: #f8fafc;
      padding: 2px 6px;
      border-radius: 4px;
      display: inline-block;
    }

    .quantity {
      text-align: center;
      font-weight: 600;
      background: #eff6ff;
      border-radius: 6px;
      padding: 2px 0;
      color: #1d4ed8;
    }

    .price {
      text-align: right;
      font-weight: 600;
      color: #059669;
      font-size: 9px;
    }

    .totals-section {
      background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
      padding: 14px;
      border-radius: 12px;
      margin-top: 12px;
      border: 1px solid #d1fae5;
      position: relative;
    }

    .totals-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 12px 0 0 12px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 10px;
      align-items: center;
    }

    .total-row:last-child {
      margin-bottom: 0;
    }

    .total-row.final {
      font-size: 13px;
      font-weight: 700;
      color: #059669;
      border-top: 2px solid #10b981;
      padding-top: 8px;
      margin-top: 8px;
      background: rgba(16, 185, 129, 0.1);
      margin-left: -14px;
      margin-right: -14px;
      padding-left: 14px;
      padding-right: 14px;
      border-radius: 0 0 8px 8px;
    }

    .payment-section {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      padding: 14px;
      border-radius: 12px;
      border: 1px solid #bfdbfe;
      position: relative;
    }

    .payment-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border-radius: 12px 0 0 12px;
    }

    .payment-method {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(59, 130, 246, 0.1);
      padding: 4px 8px;
      border-radius: 6px;
      font-weight: 500;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 8px;
      font-weight: 600;
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      color: #065f46;
      border: 1px solid #10b981;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .receipt-footer {
      text-align: center;
      margin-top: 16px;
      padding: 16px;
      border-top: 2px dashed #e5e7eb;
      font-size: 8px;
      color: #6b7280;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      margin-left: -16px;
      margin-right: -16px;
      margin-bottom: -20px;
    }

    .receipt-footer p {
      margin-bottom: 4px;
    }

    .footer-thanks {
      font-weight: 700;
      color: #374151;
      font-size: 10px;
      margin-bottom: 6px;
    }

    @media print {
      body { 
        background: white !important;
        margin: 0;
        padding: 3mm;
      }
      
      .order-receipt { 
        box-shadow: none !important;
        border: 1px solid #e5e7eb;
        border-radius: 0;
        margin: 0;
        break-inside: avoid;
      }
      
      .no-print { 
        display: none !important; 
      }

      .receipt-header {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }

    @page {
      size: 8cm auto;
      margin: 3mm;
    }

    @media (max-width: 480px) {
      .order-receipt {
        width: 100%;
        max-width: 100%;
        margin: 0;
        border-radius: 0;
      }
    }
        </style>
        </head>
        <body>
         <div class="print-container">
          ${selectedOrdersData
            .map(
              (order) => `
           <div class="order-receipt">
                    <div class="receipt-header">
                      <div class="store-logo">
                        ${
                          seller_data_orders?.store_images
                            ? `<img src="${seller_data_orders.store_images}" alt="Store Logo" />`
                            : `<span>${
                                seller_data_orders?.store_name?.charAt(0) || "S"
                              }</span>`
                        }
                      </div>
                      <div class="store-name">${
                        seller_data_orders?.store_name || "Store Name"
                      }</div>
                      <div class="store-subtitle">ໃບບິນ / Receipt</div>
                      ${
                        seller_data_orders?.store_code
                          ? `<div class="store-code">CODE: ${seller_data_orders.store_code}</div>`
                          : ""
                      }
                      <div class="order-info">
                        <div class="order-id">#${order.orderId}</div>
                        <div class="order-date">${
                          order.createdAt.split("T")[0]
                        }</div>
                      </div>
                    </div>

                    <div class="receipt-body">
                      <!-- Customer Information -->
                      <div class="section">
                        <div class="section-title">ຂໍ້ມູນລູກຄ້າ</div>
                        <div class="customer-info">
                          <div class="info-row">
                            <div class="info-label">ຊື່ແລະນາມສະກຸນ:</div>
                            <div class="info-value">${
                              order.shippingAddress?.name || "N/A"
                            }</div>
                          </div>
                          <div class="info-row">
                            <div class="info-label">ເບີໂທລະສັບ:</div>
                            <div class="info-value">${
                              order.shippingAddress?.phone || "N/A"
                            }</div>
                          </div>
                          <div class="info-row">
                            <div class="info-label">ແຂວງ:</div>
                            <div class="info-value">${
                              order.shippingAddress?.province || "N/A"
                            }</div>
                          </div>
                          <div class="info-row">
                            <div class="info-label">ເມືອງ:</div>
                            <div class="info-value">${
                              order.shippingAddress?.district || "N/A"
                            }</div>
                          </div>
                          <div class="info-row">
                            <div class="info-label">ບ້ານ:</div>
                            <div class="info-value">${
                              order.shippingAddress?.village || "N/A"
                            }</div>
                          </div>
                          <div class="info-row">
                            <div class="info-label">ບໍລິສັດຂົນສົ່ງ:</div>
                            <div class="info-value">${
                              order.shippingAddress?.transportCompany || "N/A"
                            }</div>
                          </div>
                          <div class="info-row">
                            <div class="info-label">ສາຂາ:</div>
                            <div class="info-value">${
                              order.shippingAddress?.branch || "N/A"
                            }</div>
                          </div>
                        </div>
                      </div>

                      <!-- Items -->
                      <div class="section">
                        <div class="section-title">ລາຍການສິນຄ້າ</div>
                        <table class="items-table">
                          <thead>
                            <tr>
                              <th>ລະຫັດສິນຄ້າ</th>
                              <th>ສິນຄ້າ</th>
                              <th>ຈຳນວນ</th>
                              <th>ລາຄາ</th>
                              <th>ລວມ</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${
                              order.items
                                ?.map(
                                  (item) => `
                              <tr>
                                <td>${item.productId?.sku || "N/A"}</td>
                                <td>
                                  <div class="item-name">${
                                    item.productId?.name || "Unknown Product"
                                  }</div>
                                  <div class="item-details">
                                  ສີ: ${
                                    item.color ||
                                    item.productId?.colors?.[0] ||
                                    "N/A"
                                  }<br/>
                                    ຂະໜາດໄຊ້: ${
                                      item.size ||
                                      item.productId?.size?.[0] ||
                                      "N/A"
                                    }
                                  </div>
                                </td>
                                <td class="quantity">${item.quantity || 0}</td>
                                <td class="price">LAK ${(
                                  item.price || 0
                                ).toLocaleString()}</td>
                                <td class="price">LAK ${(
                                  (item.price || 0) * (item.quantity || 0)
                                ).toLocaleString()}</td>
                              </tr>
                            `
                                )
                                .join("") ||
                              '<tr><td colspan="5" style="text-align: center;">ไม่มีรายการสินค้า</td></tr>'
                            }
                          </tbody>
                        </table>
                      </div>

                      <!-- Totals -->
                      <div class="totals-section">
                        <div class="total-row">
                          <span>ລາຄາລວມ:</span>
                          <span>LAK ${(
                            order.subtotal || 0
                          ).toLocaleString()}</span>
                        </div>
                        <div class="total-row">
                          <span>ສ່ວນຫຼຸດ:</span>
                          <span style="color: #dc2626">
                            ${
                              order.discount
                                ? order.discount.toLocaleString()
                                : "0"
                            }
                          </span>
                        </div>
                        <div class="total-row final">
                          <span>ຍອດລວມສຸດທິ:</span>
                          <span>LAK ${(
                            order.total || 0
                          ).toLocaleString()}</span>
                        </div>
                      </div>

                      <!-- Payment -->
                      <div class="section">
                        <div class="section-title">ການຊຳລະເງິນ</div>
                        <div class="payment-section">
                          <div class="info-row">
                            <div class="info-label">ວິທີການຊຳລະເງິນ:</div>
                            <div class="info-value payment-method">
                              <span>${getPaymentMethodIcon(
                                order.paymentMethod
                              )}</span>
                              <span>${order.paymentMethod || "N/A"}</span>
                            </div>
                          </div>
                          <div class="info-row">
                            <div class="info-label">ສະຖານະການຊຳລະເງິນ:</div>
                            <div class="info-value">
                              <span class="status-badge">${
                                order.status === "PAYMENT_COMPLETED"
                                  ? "ຊຳລະເງິນສຳເລັດ"
                                  : "ບໍ່ສຳເລັດ"
                              }</span>
                            </div>
                          </div>
                          ${
                            order.trackingNumber
                              ? `<div class="info-row">
                                <div class="info-label">ເລກໝາຍພັດສະດຸ:</div>
                                <div class="info-value">${order.trackingNumber}</div>
                               </div>`
                              : ""
                          }
                        </div>
                      </div>
                    </div>

                    <div class="receipt-footer">
                      <p class="footer-thanks">ຂອບໃຈທີ່ໃຊ້ບໍລິການ</p>
                      <p>Thank you for your order</p>
                      <p style="font-family: 'Noto Sans Lao', serif">
                        ຕິດຕໍ່: ${
                          seller_data_orders?.user_id?.phone ||
                          seller_data_orders?.user_id?.email ||
                          ""
                        }
                      </p>
                    </div>
                  </div>
            `
            )
            .join("")}
        </div>

          <script>
            // Helper function to format date
            function formatDate(dateString) {
              if (!dateString) return 'N/A';
              const date = new Date(dateString);
              return date.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              });
            }

            // Helper function to get payment method icon
            function getPaymentMethodIcon(method) {
              if (!method) return '💰';
              switch(method.toLowerCase()) {
                case 'credit card':
                case 'card':
                  return '💳';
                case 'cash':
                  return '💵';
                case 'bank transfer':
                  return '🏦';
                case 'digital wallet':
                  return '📱';
                default:
                  return '💰';
              }
            }

            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printHTML);
    printWindow.document.close();
  };

  // ✅ รวมการทำงานทั้งหมด
  const confirmPrint = async () => {
    setIsLoading(true);
    if (!printRef.current) {
      toast({
        title: "ເກິດຂໍ້ຜິດພາດ",
        description: "ບໍ່ສາມາດເຂົ້າເຖິງເນື້ອຫາການພິມໄດ້",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      // 1️⃣ อัพเดทสถานะก่อน
      setOrders((prev) =>
        prev.map((order) =>
          selectedOrders.includes(order.id)
            ? { ...order, isPrinted: true }
            : order
        )
      );

      // 2️⃣ สั่งพิมพ์
      await handlePrint();

      // 3️⃣ ปิด Modal + Reset state
      setSelectedOrders([]);
      onPrintModalClose();

      // 4️⃣ Toast แจ้งผล
      toast({
        title: "ພິມສຳເລັດ",
        description: `ພິມໃບສັ່ງຊື້ ${selectedOrders.length} ລາຍການສຳເລັດ`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: error.message || "ບໍ່ສາມາດພິມໄດ້ ກະລຸນາລອງໃໝ່",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintSingle = (orderId) => {
    setSelectedOrders([orderId]);
    onPrintModalOpen();
  };

  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    onStatusModalOpen();
  };

  const handleOpenShippingModal = (order) => {
    setSelectedOrder(order);
    setTrackingNumber(order.trackingNumber || "");
    setShippingImage("");
    setImagePreview(order.imagesShipping || "");
    onShippingModalOpen();
  };

  const handleStatusUpdate = () => {
    try {
      setIsLoading(true);

      setTimeout(() => {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === selectedOrder._id
              ? { ...order, orderStatus: newStatus }
              : order
          )
        );

        setIsLoading(false);
        onStatusModalClose();
        dispatch(
          update_status_shipping({
            id: selectedOrder._id,
            shipping_status: newStatus,
            step: step,
            note: note,
          })
        ).then(() => dispatch(get_order()));
        toast({
          title: "ອັບເດດສະຖານະສຳເລັດ",
          description: `ປ່ຽນສະຖານະເປັນ ${newStatus}ແລ້ວ`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }, 1000);
    } catch (error) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: error.message || "ກະລຸນາ ລອງໃໝ່ພາຍຫລັງ ",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleShippingUpdate = () => {
    try {
      if (!trackingNumber.trim()) {
        toast({
          title: "ກະລຸນາກຣອກເລກໝາຍພັດສະດຸ",
          description: "ກະລຸນາກຣອກເລກໝາຍພັດສະດຸແລະຮູບພາບ",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setIsLoading(true);

      setTimeout(() => {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === selectedOrder._id
              ? {
                  ...order,
                  trackingNumber: trackingNumber,
                  shippingImage: shippingImage || order.shippingImage,
                  orderStatus: "Shipped",
                }
              : order
          )
        );

        setIsLoading(false);
        onShippingModalClose();
        setTrackingNumber("");
        setShippingImage("");
        setImagePreview("");
        const data_tracking = {
          orderId: selectedOrder._id,
          trackingNumber: trackingNumber,
          imagesShipping: shippingImage,
        };
        dispatch(update_tracking(data_tracking)).then(
          async () => await dispatch(get_order())
        );
        toast({
          title: "ບັນທຶກຂໍ້ມູນສຳເລັດ",
          description: "ອັບເດດເລກພັດສະດຸແລະຮູບພາບສຳເລັດ",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }, 1500);
    } catch (error) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: error.message || "ກະລຸນາ ລອງໃໝ່ພາຍຫລັງ ",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "ໄຟລໃຫ່ຍເກີນໄປ",
          description: "ກະລຸນາເລືອກໄຟລທີ່ບໍ່ເກີນ  5 MB",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setShippingImage(file);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    onDetailOpen();
  };

  // 2. Fix the Data component to use the correct data structure
  const Data = React.forwardRef((props, ref) => {
    return (
      <div ref={ref} style={{ padding: "20px" }}>
        <VStack spacing={4} align="stretch">
          {selectedOrders?.map((orderId) => {
            const order = orders?.find((o) => o.id === orderId);
            if (!order) return null;

            return (
              <Card
                key={orderId}
                size="sm"
                mb={4}
                p={4}
                borderWidth={1}
                borderRadius="md"
              >
                <VStack spacing={4} align="stretch">
                  {/* Header */}
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold" fontSize="sm">
                        ລະຫັດອໍເດີ້: {order?.id}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        ວັນທີ່:{" "}
                        {order?.date ||
                          new Date(order?.createdAt).toLocaleDateString()}
                      </Text>
                    </VStack>
                    {order?.isPrinted && (
                      <Badge colorScheme="green" size="sm">
                        ພິມແລ້ວ
                      </Badge>
                    )}
                  </HStack>

                  {/* Shipping Address */}
                  <Box borderWidth={1} borderRadius="sm" p={3}>
                    <Text fontWeight="medium" fontSize="sm" mb={1}>
                      ຜູ້ຮັບສິນຄ້າ
                    </Text>
                    <Text fontSize="xs">{order?.shippingAddress?.name}</Text>
                    <Text fontSize="xs">{order?.shippingAddress?.phone}</Text>
                    <Text fontSize="xs">{order?.shippingAddress?.address}</Text>
                  </Box>

                  {/* Items List */}
                  <Box borderWidth={1} borderRadius="sm" p={3}>
                    <Text fontWeight="medium" fontSize="sm" mb={2}>
                      ລາຍການສິນຄ້າ
                    </Text>
                    <VStack spacing={2} align="stretch">
                      {order?.items?.map((item, idx) => (
                        <HStack
                          key={idx}
                          justify="space-between"
                          align="start"
                          fontSize="xs"
                        >
                          <VStack align="start" spacing={0} flex={3}>
                            <Text>
                              {item?.productId?.name || item?.name} x{" "}
                              {item?.quantity}
                            </Text>
                            <Text>
                              ສີ:{" "}
                              {item?.color ||
                                item?.productId?.colors?.[0] ||
                                "N/A"}
                            </Text>
                            <Text>
                              ຂະໜາດ:{" "}
                              {item?.size ||
                                item?.productId?.size?.[0] ||
                                "N/A"}
                            </Text>
                          </VStack>
                          <Text flex={1} textAlign="right">
                            {item?.price?.toLocaleString() || "0"} ກີບ
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>

                  {/* Totals */}
                  <Box borderWidth={1} borderRadius="sm" p={3}>
                    <VStack align="end" spacing={1}>
                      <Text fontSize="xs">
                        Subtotal: {order?.subtotal?.toLocaleString() || "0"} ກີບ
                      </Text>
                      <Text fontSize="xs">
                        Discount: {order?.discount?.toLocaleString() || "0"} ກີບ
                      </Text>
                      <Text fontWeight="bold" fontSize="sm" color="green.600">
                        Total: {order?.total?.toLocaleString() || "0"} ກີບ
                      </Text>
                    </VStack>
                  </Box>
                </VStack>
              </Card>
            );
          })}
        </VStack>
      </div>
    );
  });
  const covertDate = (date_data) => {
    const date = new Date(date_data);
    const formatted = date.toLocaleString("la-LA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return formatted;
  };
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredOrders?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <Container maxW="container.xl" py={6}>
      {/* Header */}
      <Box mb={6}>
        <Heading
          fontFamily={"Noto Sans Lao, serif"}
          size="lg"
          color="gray.700"
          mb={2}
        >
          📦 ຈັດການຄຳສັ່ງຊື້ສິນຄ້າ
        </Heading>
        <Text color="gray.600">ຈັດການຄຳສັ່ງຊື້</Text>
      </Box>

      {/* Summary Cards */}
      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(5, 1fr)" }}
        gap={4}
        mb={6}
      >
        <Card>
          <CardBody>
            <Stat>
              <StatLabel fontSize="sm" color="gray.600">
                📅 ມື້ນີ້
              </StatLabel>
              <StatNumber fontSize="2xl" color="blue.500">
                {summary.today}
              </StatNumber>
              <StatHelpText fontSize="xs">ຄຳສັ່ງຊື້</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel fontSize="sm" color="gray.600">
                🟡 ລໍຖ້າດຳເນີນການ
              </StatLabel>
              <StatNumber fontSize="2xl" color="orange.500">
                {summary.pending}
              </StatNumber>
              <StatHelpText fontSize="xs">ຄຳສັ່ງຊື້</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel fontSize="sm" color="gray.600">
                🚚 ກຳລັງຈັດສົ່ງ
              </StatLabel>
              <StatNumber fontSize="2xl" color="blue.500">
                {summary.shipped}
              </StatNumber>
              <StatHelpText fontSize="xs">ຄຳສັ່ງຊື້</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel fontSize="sm" color="gray.600">
                ✅ ສຳເລັດ
              </StatLabel>
              <StatNumber fontSize="2xl" color="green.500">
                {summary.completed}
              </StatNumber>
              <StatHelpText fontSize="xs">ຄຳສັ່ງຊື້</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel fontSize="sm" color="gray.600">
                ❌ ຍົກເລີກ
              </StatLabel>
              <StatNumber fontSize="2xl" color="red.500">
                {summary.cancelled}
              </StatNumber>
              <StatHelpText fontSize="xs">ຄຳສັ່ງຊື້</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      {/* Filters and Search */}
      <Card mb={6}>
        <CardBody>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(4, 1fr) auto" }}
            gap={4}
            alignItems="end"
          >
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                🔍 ຄົ້ນຫາ
              </Text>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FiSearch color="gray" />
                </InputLeftElement>
                <Input
                  placeholder="ຄົ້ນຫາ ອໍເດີ້ ໄອດີ"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                📅 ຊ່ວງເວລາ
              </Text>
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">ທັງໝົດ</option>
                <option value="today">ມື້ນີ້</option>
                <option value="7days">7 ວັນທີ່ຜ່ານມາ</option>
                <option value="30days">30 ວັນທີ່ຜ່ານມາ</option>
              </Select>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                📦 ສະຖານະຄຳສັ່ງຊື້
              </Text>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">ທັງໝົດ</option>
                <option value="pending">ລໍຖ້າດຳເນີນການ</option>
                <option value="Processing">ກຳລັງດຳເນີນການ</option>
                <option value="Shipped">ຈັດສົ່ງແລ້ວ</option>
                <option value="Delivered">ຈັດສົ່ງສຳເລັດ</option>
                <option value="Cancelled">ຍົກເລີກ</option>
              </Select>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                💳 ການຊຳລະເງິນ
              </Text>
              <Select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="all">ທັງໝົດ</option>
                <option value="PAYMENT_COMPLETED">ຊຳລະເງິນແລ້ວ</option>
                <option value="pending_payment">ຍັງບໍ່ຊຳລະເງິນ</option>
              </Select>
            </Box>
            <Button
              colorScheme="blue"
              leftIcon={<FiPrinter />}
              onClick={() => handlePrintSelected(selectedOrders)}
              isDisabled={selectedOrders.length === 0}
            >
              ພິມທີ່ເລືອກ ({selectedOrders.length})
            </Button>
          </Grid>
        </CardBody>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardBody p={0}>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>
                    <Checkbox
                      isChecked={
                        selectedOrders?.length === currentOrders?.length &&
                        currentOrders?.length > 0
                      }
                      isIndeterminate={
                        selectedOrders?.length > 0 &&
                        selectedOrders?.length < currentOrders?.length
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </Th>
                  <Th fontFamily={"Noto Sans Lao, serif"}>ໝາຍເລກອໍເດີ້</Th>
                  <Th fontFamily={"Noto Sans Lao, serif"}>ວັນທີ</Th>
                  <Th fontFamily={"Noto Sans Lao, serif"}>ຊື່ລູກຄ້າ</Th>
                  <Th fontFamily={"Noto Sans Lao, serif"}>ຈຳນວນລາຍການ</Th>
                  <Th fontFamily={"Noto Sans Lao, serif"}>ຍອດລວມ (ກີບ)</Th>
                  <Th fontFamily={"Noto Sans Lao, serif"}>ສະຖານະການຊຳລະເງິນ</Th>
                  <Th fontFamily={"Noto Sans Lao, serif"}>ສະຖານະຈັດສົ່ງ</Th>
                  <Th fontFamily={"Noto Sans Lao, serif"}>ສະຖານະການສົ່ງບິນ</Th>
                  <Th fontFamily={"Noto Sans Lao, serif"}>ຈັດການ</Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading ? (
                  <Tr>
                    <Td colSpan={10}>
                      <SimpleGrid columns={columns} spacing="6">
                        {Array.from({ length: 8 }, (_, i) => (
                          <ProductSkeleton key={i} />
                        ))}
                      </SimpleGrid>
                    </Td>
                  </Tr>
                ) : (
                  currentOrders?.map((order) => (
                    <Tr key={order._id} _hover={{ bg: "gray.50" }}>
                      <Td>
                        <Checkbox
                          isChecked={selectedOrders?.includes(order._id)}
                          onChange={(e) =>
                            handleSelectOrder(order?._id, e.target.checked)
                          }
                        />
                      </Td>
                      <Td>
                        <Text fontWeight="medium" color="blue.600">
                          #{order.orderId}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm">{covertDate(order.createdAt)}</Text>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium">{order.customerName}</Text>
                          <Text fontSize="xs" color="gray.500">
                            {order.shippingAddress.name}
                          </Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Text fontSize="sm">{order.items.length}</Text>
                      </Td>
                      <Td>
                        <Text fontWeight="bold" color="green.600">
                          {order?.total?.toLocaleString()}
                        </Text>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={
                            order.status === "PAYMENT_COMPLETED" ? "green" : "red"
                          }
                        >
                          {order.status === "PAYMENT_COMPLETED"
                            ? "ຊຳລະເງິນແລ້ວ"
                            : getStatusText(order.paymentStatus)}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={getStatusColor(order.shipping_status)}
                        >
                          {getStatusText(order.shipping_status)}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={order?.imagesShipping ? "green" : "red"}
                        >
                          {order?.imagesShipping
                            ? "ສົ່ງບິນແລ້ວ"
                            : "ຍັງບໍ່ສົ່ງບິນ"}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack spacing={1}>
                          <IconButton
                            size="sm"
                            icon={<FiEye />}
                            colorScheme="blue"
                            variant="ghost"
                            onClick={() => handleViewOrder(order)}
                            title="ເບີ່ງລາຍລະອຽດ"
                          />
                          <IconButton
                            size="sm"
                            icon={<FiPrinter />}
                            colorScheme="green"
                            variant="ghost"
                            onClick={() => handlePrintSingle(order._id)}
                            title="ພິມ"
                          />
                          <>
                            {order?.shipping_status !== "Cancelled" && (
                              <IconButton
                                size="sm"
                                icon={<FiEdit />}
                                colorScheme="orange"
                                variant="ghost"
                                onClick={() => handleOpenStatusModal(order)}
                                title="ປ່ຽນສະຖານະ"
                              />
                            )}
                            {order?.shipping_status !== "Cancelled" && (
                              <IconButton
                                size="sm"
                                icon={<FiTruck />}
                                colorScheme="blue"
                                variant="ghost"
                                onClick={() => handleOpenShippingModal(order)}
                                title="ຈັດການຈັດສົ່ງສິນຄ້າ"
                              />
                            )}
                          </>
                          {order.shipping_status === "Shipped" && (
                            <IconButton
                              size="sm"
                              icon={<FiEdit />}
                              colorScheme="orange"
                              variant="ghost"
                              onClick={() => handleOpenStatusModal(order)}
                              title="ປ່ຽນສະຖານະ"
                            />
                          )}
                        </HStack>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box
                bg="white"
                p={4}
                borderRadius="lg"
                shadow="sm"
                border="1px"
                borderColor="gray.200"
              >
                <HStack spacing={2} justify="space-between" align="center">
                  <Text fontSize="sm" color="gray.600">
                    ສະແດງ {startIndex + 1}-
                    {Math.min(startIndex + itemsPerPage, filteredOrders.length)}{" "}
                    ຈາກ {filteredOrders.length} ລາຍການ
                  </Text>

                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      isDisabled={currentPage === 1}
                      leftIcon={<ChevronLeftIcon />}
                      variant="outline"
                    >
                      ກ່ອນໜ້າ
                    </Button>

                    <HStack spacing={1}>
                      {/* First page */}
                      {currentPage > 3 && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => setCurrentPage(1)}
                            variant="outline"
                          >
                            1
                          </Button>
                          {currentPage > 4 && (
                            <Text fontSize="sm" color="gray.500" px={1}>
                              ...
                            </Text>
                          )}
                        </>
                      )}

                      {/* Pages around current */}
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNumber;
                          if (totalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (currentPage <= 3) {
                            pageNumber = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                          } else {
                            pageNumber = currentPage - 2 + i;
                          }

                          if (pageNumber < 1 || pageNumber > totalPages)
                            return null;

                          return (
                            <Button
                              key={pageNumber}
                              size="sm"
                              onClick={() => setCurrentPage(pageNumber)}
                              colorScheme={
                                currentPage === pageNumber ? "blue" : "gray"
                              }
                              variant={
                                currentPage === pageNumber ? "solid" : "outline"
                              }
                            >
                              {pageNumber}
                            </Button>
                          );
                        }
                      ).filter(Boolean)}

                      {/* Last page */}
                      {currentPage < totalPages - 2 && totalPages > 5 && (
                        <>
                          {currentPage < totalPages - 3 && (
                            <Text fontSize="sm" color="gray.500" px={1}>
                              ...
                            </Text>
                          )}
                          <Button
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                            variant="outline"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                    </HStack>

                    <Button
                      size="sm"
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      isDisabled={currentPage === totalPages}
                      rightIcon={<ChevronRightIcon />}
                      variant="outline"
                    >
                      ຖັດໄປ
                    </Button>
                  </HStack>

                  <Select
                    size="sm"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(parseInt(e.target.value));
                      setCurrentPage(1);
                    }}
                    w="auto"
                    minW="100px"
                  >
                    <option value={6}>6 / ໜ້າ</option>
                    <option value={12}>12 / ໜ້າ</option>
                    <option value={24}>24 / ໜ້າ</option>
                    <option value={50}>50 / ໜ້າ</option>
                  </Select>
                </HStack>
              </Box>
            )}
          </Box>

          {loading ? (
            <SimpleGrid columns={columns} spacing="6">
              {Array.from({ length: 8 }, (_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </SimpleGrid>
          ) : (
            filteredOrders?.length === 0 && (
              <Box textAlign="center" py={10}>
                <Text color="gray.500">
                  ບໍ່ພົບຄຳສັ່ງຊື້ທີ່ກົງກັບການຄົ້ນຫາ ກະລຸນາລອງໃໝ່
                </Text>
              </Box>
            )
          )}
        </CardBody>
      </Card>

      {/* Order Detail Drawer */}
      <Drawer
        isOpen={isDetailOpen}
        placement="right"
        onClose={onDetailClose}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <VStack align="start" spacing={2}>
              <Text fontSize="xl">ລາຍລະອຽດຄຳສັ່ງຊື້</Text>
              <Text fontSize="lg" color="blue.600" fontWeight="bold">
                {selectedOrder?.id}
              </Text>
            </VStack>
          </DrawerHeader>

          <DrawerBody>
            {selectedOrder && (
              <VStack spacing={6} align="stretch">
                {/* Customer Info */}
                <Box>
                  <Text fontWeight="bold" mb={3} color="gray.700">
                    👤 ຂໍ້ມູນລູກຄ້າ
                  </Text>
                  <Card>
                    <CardBody>
                      <VStack align="start" spacing={2}>
                        <HStack spacing={3}>
                          {/* Order ID */}
                          <Badge
                            colorScheme="blue"
                            px={3}
                            py={1}
                            borderRadius="md"
                            display="flex"
                            alignItems="center"
                            gap={1}
                          >
                            <FiHash />
                            <Text fontSize="sm" fontWeight="semibold">
                              ລະຫັດອໍເດີ້: {selectedOrder.orderId}
                            </Text>
                          </Badge>

                          {/* Order Date */}
                          <Badge
                            colorScheme="green"
                            px={3}
                            py={1}
                            borderRadius="md"
                            display="flex"
                            alignItems="center"
                            gap={1}
                          >
                            <FiCalendar />
                            <Text fontSize="sm" fontWeight="semibold">
                              ວັນທີສັ່ງຊື້:{" "}
                              {covertDate(selectedOrder.createdAt)}
                            </Text>
                          </Badge>
                        </HStack>

                        <Text>
                          <strong>ຊື່ ແລະ ນາມສະກຸນ:</strong>{" "}
                          {selectedOrder.shippingAddress.name}
                        </Text>
                        <Text>
                          <strong>ເບີໂທລະສັບ:</strong>{" "}
                          {selectedOrder.shippingAddress.phone}
                        </Text>
                        <Text>
                          <strong>ອິເມວ:</strong> {selectedOrder?.email || ""}
                        </Text>
                        <Text>
                          <strong>ແຂວງ:</strong>{" "}
                          {selectedOrder.shippingAddress.province}
                        </Text>
                        <Text>
                          <strong>ເມືອງ:</strong>{" "}
                          {selectedOrder.shippingAddress.district}
                        </Text>
                        <Text>
                          <strong>ບ້ານ:</strong>{" "}
                          {selectedOrder.shippingAddress.village}
                        </Text>
                        <Text>
                          <strong>ບໍລິສັດຂົນສົ່ງ:</strong>{" "}
                          {selectedOrder.shippingAddress.transportCompany}
                        </Text>
                        <Text>
                          <strong>ຝາກສາຂາ:</strong>{" "}
                          {selectedOrder.shippingAddress.branch}
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                </Box>

                {/* Shipping Image */}
                {selectedOrder.shippingImage && (
                  <Box>
                    <Text fontWeight="bold" mb={3} color="gray.700">
                      📦 ຮູບພາບໃບຂົນສົ່ງ
                    </Text>
                    <Card>
                      <CardBody>
                        <img
                          src={selectedOrder.shippingImage}
                          alt="ใบขนส่ง"
                          style={{
                            width: "100%",
                            maxWidth: "400px",
                            height: "auto",
                            borderRadius: "8px",
                          }}
                        />
                      </CardBody>
                    </Card>
                  </Box>
                )}

                {/* Order Items */}
                <Box>
                  <Text fontWeight="bold" mb={3} color="gray.700">
                    🛍️ ລາຍການສິນຄ້າ
                  </Text>
                  <Card>
                    <CardBody>
                      <VStack spacing={3}>
                        {selectedOrder.items.map((item, index) => (
                          <Flex
                            key={index}
                            justify="space-between"
                            w="100%"
                            p={3}
                            bg="gray.50"
                            rounded="md"
                            align="center"
                          >
                            {/* รูปสินค้า */}
                            <Image
                              src={item?.productId.images[0]} // ต้องมี item.image
                              alt={item.name}
                              boxSize="60px"
                              objectFit="cover"
                              rounded="md"
                              mr={4}
                            />

                            {/* ข้อมูลสินค้า */}
                            <VStack align="start" spacing={1} flex="1">
                              <Text fontWeight="medium">{item?.name}</Text>
                              <Text fontSize="sm" color="gray.600">
                                ຈຳນວນ: {item?.quantity}
                              </Text>
                              {item?.size ? (
                                <Text fontSize="sm" color="gray.600">
                                  ຂະໜາດ: {item?.size}
                                </Text>
                              ) : (
                                <Text fontSize="sm" color="gray.600">
                                  ຂະໜາດ: {item?.productId.size[0]}
                                </Text>
                              )}
                              {item?.color ? (
                                <Text fontSize="sm" color="gray.600">
                                  ສີ: {item?.color}
                                </Text>
                              ) : (
                                <Text fontSize="sm" color="gray.600">
                                  ຂະໜາດ: {item?.productId.colors[0]}
                                </Text>
                              )}
                              {item.discount && (
                                <Text fontSize="sm" color="gray.600">
                                  ສ່ວນຫຼຸດ: {item.discount.toLocaleString()} ກີບ
                                </Text>
                              )}
                            </VStack>

                            {/* ราคาสินค้า */}
                            <VStack align="end">
                              <Text fontWeight="bold" color="green.600">
                                {(item.price * item.quantity).toLocaleString()}{" "}
                                ກີບ
                              </Text>
                            </VStack>
                          </Flex>
                        ))}

                        <Divider />
                        <Flex
                          justify="space-between"
                          w="100%"
                          fontWeight="bold"
                          fontSize="s"
                        >
                          <Text>ສ່ວນຫຼຸດ:</Text>
                          <Text color="red.600">
                            {selectedOrder?.discount?.toLocaleString()} ກີບ
                          </Text>
                        </Flex>
                        <Flex
                          justify="space-between"
                          w="100%"
                          fontWeight="bold"
                          fontSize="s"
                        >
                          <Text>ຄ່າທຳນຽມລະບົບ:</Text>
                          <Text color="red.600">
                            {selectedOrder?.fee_system?.toLocaleString() ||
                              "ຟິຮຄ່າທຳນຽມ"}{" "}
                            ກີບ
                          </Text>
                        </Flex>
                        <Flex
                          justify="space-between"
                          w="100%"
                          fontWeight="bold"
                          fontSize="lg"
                        >
                          <Text>ຍອດລວມສຸດທິໄດ້ຮັບ:</Text>
                          <Text color="green.600">
                            {selectedOrder?.total_summary?.toLocaleString()} ກີບ
                          </Text>
                        </Flex>
                      </VStack>
                    </CardBody>
                  </Card>
                </Box>

                {/* Payment & Status */}
                <Box>
                  <Text fontWeight="bold" mb={3} color="gray.700">
                    💳 ການຊຳລະເງິນແລະສະຖານະການຈັດສົ່ງ
                  </Text>
                  <Card>
                    <CardBody>
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <VStack align="start">
                          <Text fontSize="sm" color="gray.600">
                            ວິທີການຊຳລະເງິນ
                          </Text>
                          <HStack>
                            <Text fontSize="lg">
                              {getPaymentMethodIcon(
                                selectedOrder.paymentMethod
                              )}
                            </Text>
                            <Text fontWeight="medium">
                              {selectedOrder.paymentMethod}
                            </Text>
                          </HStack>
                        </VStack>
                        <VStack align="start">
                          <Text fontSize="sm" color="gray.600">
                            ສະຖານະການຊຳລະເງິນ
                          </Text>
                          <Badge
                            colorScheme={
                              selectedOrder.status === "PAYMENT_COMPLETED"
                                ? "green"
                                : "red"
                            }
                          >
                            {selectedOrder.status === "PAYMENT_COMPLETED"
                              ? "ຊຳລະເງິນແລ້ວ"
                              : getStatusText(selectedOrder.paymentStatus)}
                          </Badge>
                        </VStack>
                        <VStack align="start">
                          <Text fontSize="sm" color="gray.600">
                            ສະຖານະຄຳສັ່ງຊື້
                          </Text>
                          <Badge
                            colorScheme={getStatusColor(
                              selectedOrder.shipping_status
                            )}
                          >
                            {getStatusText(selectedOrder.shipping_status)}
                          </Badge>
                        </VStack>
                        <VStack align="start">
                          <Text fontSize="sm" color="gray.600">
                            ເລກພັດສະດຸ
                          </Text>
                          <Text fontWeight="medium">
                            {selectedOrder.trackingNumber || "ຍັງບໍ່ມີ"}
                          </Text>
                        </VStack>
                        <VStack align="start">
                          <Text fontSize="sm" color="gray.600">
                            ສະຖານະການພິມ
                          </Text>
                          {selectedOrder.isPrinted ? (
                            <Badge colorScheme="green" variant="subtle">
                              ✅ ພິມແລ້ວ
                            </Badge>
                          ) : (
                            <Badge colorScheme="gray" variant="subtle">
                              ⏳ ຍັງບໍ່ພິມ
                            </Badge>
                          )}
                        </VStack>
                      </Grid>
                    </CardBody>
                  </Card>
                </Box>

                {/* Status Timeline */}
                <Box>
                  <Text fontWeight="bold" mb={3} color="gray.700">
                    📋 ສະຖານະການດຳເນີນການ
                  </Text>
                  <Card>
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <Flex align="center">
                          <Box
                            w={4}
                            h={4}
                            rounded="full"
                            bg="green.400"
                            mr={3}
                          />
                          <Text>ຮັບຄຳສັ່ງຊື້</Text>
                        </Flex>
                        <Progress
                          value={
                            selectedOrder?.shipping_status === "Processing"
                              ? 50
                              : 100
                          }
                          colorScheme="green"
                          size="sm"
                        />
                        <Flex align="center">
                          <Box
                            w={4}
                            h={4}
                            rounded="full"
                            bg={
                              ["Shipped", "Delivered"].includes(
                                selectedOrder.shipping_status
                              )
                                ? "green.400"
                                : "gray.300"
                            }
                            mr={3}
                          />
                          <Text>ຈັດສົ່ງສິນຄ້າ</Text>
                        </Flex>
                        <Progress
                          value={
                            selectedOrder.shipping_status === "Shipped"
                              ? 100
                              : 0
                          }
                          colorScheme="green"
                          size="sm"
                        />
                        <Flex align="center">
                          <Box
                            w={4}
                            h={4}
                            rounded="full"
                            bg={
                              selectedOrder.shipping_statuss === "Delivered"
                                ? "green.400"
                                : "gray.300"
                            }
                            mr={3}
                          />
                          <Text>ຈັດສົ່ງສຳເລັດ</Text>
                        </Flex>
                      </VStack>
                    </CardBody>
                  </Card>
                </Box>
              </VStack>
            )}
          </DrawerBody>

          <DrawerFooter>
            <HStack spacing={3}>
              <Button variant="outline" onClick={onDetailClose}>
                ປິດ
              </Button>
              {selectedOrder && selectedOrder.shipping_status === "Processing" && (
                <>
                  <Button
                    colorScheme="blue"
                    leftIcon={<FiTruck />}
                    onClick={() => {
                      handleOpenShippingModal(selectedOrder);
                      onDetailClose();
                    }}
                  >
                    ຈັດການຈັດສົ່ງ
                  </Button>
                  <Button
                    colorScheme="orange"
                    leftIcon={<FiEdit />}
                    onClick={() => {
                      handleOpenStatusModal(selectedOrder);
                      onDetailClose();
                    }}
                  >
                    ປ່ຽນສະຖານະຄຳສັ່ງຊື້
                  </Button>
                </>
              )}
              <Button
                colorScheme="green"
                leftIcon={<FiPrinter />}
                onClick={() => {
                  handlePrintSingle(selectedOrder._id);
                  onDetailClose();
                }}
              >
                ພິມໃບສັ່ງຊື້
              </Button>
            </HStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Print Confirmation Modal */}
      <Modal isOpen={isPrintModalOpen} onClose={onPrintModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <FiPrinter />
              <Text>ຢືນຢັນພິມ</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>ທ່ານຕ້ອງການພິມໃບສັ່ງຊື້ບໍ່?</Text>
            <Data ref={printRef} />
          </ModalBody>

          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={onPrintModalClose}
              isDisabled={isLoading}
            >
              ຍົກເລີກ
            </Button>
            <Button
              colorScheme="green"
              onClick={confirmPrint}
              isLoading={isLoading}
              loadingText="กำลังพิมพ์"
            >
              ຢືນຢັນພິມ
            </Button>
          </DrawerFooter>
        </ModalContent>
      </Modal>

      {/* Status Update Modal */}
      <Modal isOpen={isStatusModalOpen} onClose={onStatusModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <FiEdit />
              <Text>ປ່ຽນສະຖານະຄຳສັ່ງຊື້</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {selectedOrder && (
                <Card>
                  <CardBody>
                    <VStack align="start" spacing={2}>
                      <Text fontWeight="bold" color="blue.600">
                        {selectedOrder.id}
                      </Text>
                      <Text fontSize="sm">
                        ลูกค้า: {selectedOrder.shippingAddress.name}
                      </Text>
                      <Text fontSize="sm">
                        ສະຖານະປັດຈຸບັນ:
                        <Badge
                          ml={2}
                          colorScheme={getStatusColor(
                            selectedOrder.shipping_status
                          )}
                        >
                          {selectedOrder.shipping_status}
                        </Badge>
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              )}

              <Box>
                <Text fontWeight="medium" mb={2}>
                  ເລືອກສະຖານະໃໝ່:
                </Text>
                <Select
                  value={newStatus}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewStatus(value);

                    // ดึง note และ step อัตโนมัติ
                    if (statusMap[value]) {
                      setNote(statusMap[value].note);
                      setStep(statusMap[value].step);
                    }
                  }}
                  placeholder="ເລືອກສະຖານະ"
                >
                  <option value="Processing">
                    🔄 ກຳລັງດຳເນີນການ (Processing)
                  </option>
                  <option value="Shipped">🚚 ຈັດສົ່ງແລ້ວ (Shipped)</option>
                  <option value="Delivered">
                    ✅ ຈັດສົ່ງສຳເລັດ (Delivered)
                  </option>
                  <option value="Cancelled">❌ ຍົກເລີກ (Cancelled)</option>
                </Select>
              </Box>

              {/* Preview note */}
              {note && (
                <Box p={3} bg="gray.50" rounded="md">
                  <Text fontSize="sm" color="gray.600">
                    📝 Note: {note}-{step}
                  </Text>
                </Box>
              )}

              {isLoading && (
                <HStack justify="center" py={4}>
                  <Spinner size="sm" />
                  <Text>ກຳລັງອັບເດດສະຖານະ...</Text>
                </HStack>
              )}
            </VStack>
          </ModalBody>
          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={onStatusModalClose}
              isDisabled={isLoading}
            >
              ຍົກເລີກ
            </Button>
            <Button
              colorScheme="orange"
              onClick={handleStatusUpdate}
              isLoading={isLoading}
              loadingText="กำลังอัปเดต"
              isDisabled={
                !newStatus || newStatus === selectedOrder?.orderStatus
              }
            >
              ບັນທຶກ
            </Button>
          </DrawerFooter>
        </ModalContent>
      </Modal>

      {/* Shipping Management Modal */}
      <Modal
        isOpen={isShippingModalOpen}
        onClose={onShippingModalClose}
        isCentered
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <FiTruck />
              <Text>ຈັດການຈັດສົ່ງ</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="stretch">
              {selectedOrder && (
                <Card>
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      {/* Order ID */}
                      <Text fontWeight="bold" color="blue.600" fontSize="lg">
                        📦 ໝາຍເລກອໍເດີ #{selectedOrder.orderId}
                      </Text>

                      {/* Customer */}
                      <HStack spacing={2}>
                        <FiUser color="#3182ce" />
                        <Text fontSize="sm">
                          ລູກຄ້າ:{" "}
                          <Text as="span" fontWeight="semibold">
                            {selectedOrder.shippingAddress.name}
                          </Text>
                        </Text>
                      </HStack>

                      {/* Address */}
                      <HStack align="start" spacing={2}>
                        <FiMapPin color="#38A169" />
                        <VStack align="start" spacing={1} fontSize="sm">
                          <Text fontWeight="medium" color="gray.600">
                            ທີ່ຢູ່ຈັດສົ່ງ:
                          </Text>
                          <Text>
                            {selectedOrder.shippingAddress.province} •{" "}
                            {selectedOrder.shippingAddress.district} •{" "}
                            {selectedOrder.shippingAddress.village}
                          </Text>
                        </VStack>
                      </HStack>

                      {/* Transport */}
                      <HStack spacing={2}>
                        <FiTruck color="#D69E2E" />
                        <Text fontSize="sm">
                          ບໍລິສັດຂົນສົ່ງ:{" "}
                          <Badge
                            colorScheme="yellow"
                            variant="subtle"
                            px={2}
                            rounded="md"
                          >
                            {selectedOrder.shippingAddress.transportCompany}
                          </Badge>
                          {" - "}
                          ສາຂາ:{" "}
                          <Text as="span" fontWeight="medium">
                            {selectedOrder.shippingAddress.branch}
                          </Text>
                        </Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              )}

              <Box>
                <Text fontWeight="medium" mb={2} color="gray.700">
                  📝 ໝາຍເລກພັດສະດຸ *
                </Text>
                <Input
                  placeholder="ກຣອກໝາຍເລກພັດສະດຸຂົນສົ່ງ ເຊັ່ນ TH123456789"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  size="lg"
                />
              </Box>

              <Box>
                <Text fontWeight="medium" mb={3} color="gray.700">
                  📷 ອັບໂຫລດຮູບພາບການຂົນສົ່ງ
                </Text>
                <VStack spacing={4}>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    p={1}
                    border="2px dashed"
                    borderColor="gray.300"
                    _hover={{ borderColor: "blue.400" }}
                  />

                  <Text fontSize="sm" color="gray.500">
                    ຮອບຮັບໄຟລ: JPG, PNG, GIF (ຂະໜາດບໍ່ເກີນ 5MB)
                  </Text>

                  {imagePreview && (
                    <Box>
                      <Text fontWeight="medium" mb={2}>
                        ຕົວຢ່າງຮູບພາບ:
                      </Text>
                      <img
                        src={imagePreview}
                        alt="ตัวอย่างใบขนส่ง"
                        style={{
                          width: "100%",
                          maxWidth: "400px",
                          height: "auto",
                          borderRadius: "8px",
                          border: "2px solid #E2E8F0",
                        }}
                      />
                    </Box>
                  )}
                </VStack>
              </Box>

              <Box
                p={4}
                bg="blue.50"
                rounded="md"
                border="1px"
                borderColor="blue.200"
              >
                <HStack>
                  <Text fontSize="lg">ℹ️</Text>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" color="blue.800" fontWeight="medium">
                      ການບັນທຶກຂໍ້ມູນການຈັດສົ່ງ:
                    </Text>
                    <Text fontSize="sm" color="blue.700">
                      • ສະຖານະການຈັດສົ່ງຂອງລາຍການແມ່ນ "ໄດ້ຈັດສົ່ງ" (Shipped)
                      ອໍໂຕ້
                    </Text>
                    <Text fontSize="sm" color="blue.700">
                      • ລູກຄ້າຈະໄດ້ຮັບເລກລະຫັດພັດສະດຸ
                    </Text>
                  </VStack>
                </HStack>
              </Box>

              {isLoading && (
                <HStack justify="center" py={4}>
                  <Spinner size="sm" />
                  <Text>ກຳລັງບັນທຶກຂໍ້ມູນ...</Text>
                </HStack>
              )}
            </VStack>
          </ModalBody>

          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={onShippingModalClose}
              isDisabled={isLoading}
            >
              ຍົກເລີກ
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleShippingUpdate}
              isLoading={isLoading}
              loadingText="ກຳລັງບັນທຶກ...."
              leftIcon={<FiTruck />}
            >
              ບັນທຶກຂໍ້ມູນການຈັດສົ່ງ
            </Button>
          </DrawerFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default OrderManagement;
