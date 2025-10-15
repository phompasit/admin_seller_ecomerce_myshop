import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Card,
  CardHeader,
  CardBody,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Textarea,
  FormControl,
  FormLabel,
  Switch,
  Avatar,
  Divider,
  useToast,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Wrap,
  WrapItem,
  RadioGroup,
  Radio,
  Stack,
  Link,
} from "@chakra-ui/react";
import {
  Filter,
  Eye,
  Edit,
  Download,
  Bell,
  AlertTriangle,
  User,
  Store,
  CreditCard,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  MapPin,
  DollarSign,
  TrendingUp,
  RefreshCw,
  MoreVertical,
  Copy,
  MessageSquare,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { get_order_for } from "../../hooks/reducer/admin_reducer/provider_reducer";
import { update_status_shipping } from "../../hooks/reducer/sellers_reducer/provider_sellers";
const OrderManagementDashboard = () => {
  const toast = useToast();
  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose,
  } = useDisclosure();
  const {
    isOpen: isFilterOpen,
    onOpen: onFilterOpen,
    onClose: onFilterClose,
  } = useDisclosure();
  const {
    isOpen: isNoteOpen,
    onOpen: onNoteOpen,
    onClose: onNoteClose,
  } = useDisclosure();
  const { get_order_admin } = useSelector((state) => state.provider_reducer);
  // Sample data
  const [orders, setOrders] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(get_order_for());
  }, [dispatch]);
  useEffect(() => {
    setOrders(get_order_admin);
  }, [get_order_admin]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // table or card
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    dateFrom: "",
    dateTo: "",
    store: "",
    paymentStatus: "",
  });
  const savedViews = [
    { name: "ລໍຖ້າດຳເນີນການ", filters: { status: "pending" } },
    {
      name: "ມີບັນຫາ",
      filters: { flags: ["customer_complaint", "high_value"] },
    },
  ];

  // Filter logic
  // Helper ตัดเวลาออก เหลือแค่ yyyy-MM-dd
  const formatDateOnly = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().split("T")[0]; // "2025-09-26"
  };

  // Filter logic
  const filteredOrders = orders?.filter((order) => {
    const searchTerm = filters?.search?.toLowerCase() || "";

    // ✅ Search
    const matchSearch =
      !searchTerm ||
      order?._id?.toLowerCase().includes(searchTerm) ||
      order?.orderId?.toString()?.toLowerCase().includes(searchTerm) ||
      order?.user_id?.username?.toLowerCase().includes(searchTerm) ||
      order?.shippingAddress?.name?.toLowerCase().includes(searchTerm) ||
      order?.shippingAddress?.phone?.toLowerCase().includes(searchTerm);

    // ✅ Shipping status
    const matchStatus =
      !filters?.status ||
      order?.shipping_status?.toLowerCase() === filters?.status?.toLowerCase();

    // ✅ Payment status
    const matchPayment =
      !filters?.paymentStatus ||
      order?.status?.toLowerCase() === filters?.paymentStatus?.toLowerCase();

    // ✅ Date range (เทียบแค่ yyyy-MM-dd)
    const createdAt = formatDateOnly(order?.createdAt);
    const fromDate = filters?.dateFrom || null;
    const toDate = filters?.dateTo || null;

    const matchDate =
      (!fromDate || createdAt >= fromDate) && (!toDate || createdAt <= toDate);

    // ✅ Amount range
    const total = Number(order?.total_summary || 0);
    const minAmount = filters?.minAmount ? Number(filters.minAmount) : null;
    const maxAmount = filters?.maxAmount ? Number(filters.maxAmount) : null;

    const matchAmount =
      (!minAmount || total >= minAmount) && (!maxAmount || total <= maxAmount);

    return (
      matchSearch && matchStatus && matchPayment && matchDate && matchAmount
    );
  });

  // Status colors and l  abels
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "orange", label: "ລໍຖ້າດຳເນີນການ", icon: Clock },
      Processing: { color: "blue", label: "ກຳລັງຈັດກຽມ", icon: Package },
      Shipped: { color: "purple", label: "ກຳລັງຈັດສົ່ງ", icon: Truck },
      Delivered: { color: "green", label: "ຈັດສົ່ງແລ້ວ", icon: CheckCircle },
      Cancelled: { color: "red", label: "ຍົກເລີກຄຳສັ່ງຊື້", icon: XCircle },
    };

    // Normalize status to match config keys
    const normalizedStatus =
      status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase();

    const config = statusConfig[normalizedStatus] || statusConfig[status];
    const IconComponent = config?.icon;

    if (!IconComponent) return null;

    return (
      <Badge
        colorScheme={config?.color}
        display="flex"
        alignItems="center"
        gap={1}
      >
        <IconComponent size={12} />
        {config?.label}
      </Badge>
    );
  };
  const getPaymentBadge = (status) => {
    const statusConfig = {
      pending: { color: "orange", label: "ລໍຖ້າຊຳລະເງິນ" },
      completed: { color: "green", label: "ຊຳລະເງິນແລ້ວ" },
      refunded: { color: "red", label: "ຄືນເງິນແລ້ວ" },
      processing: { color: "blue", label: "ກຳລັງກວດສອບ" },
    };

    const config = statusConfig[status];
    return <Badge colorScheme={config?.color}>{config?.label}</Badge>;
  };

  const getFlagBadge = (flag) => {
    const flagConfig = {
      high_value: { color: "purple", label: "ຍອດສູງ", icon: TrendingUp },
      customer_complaint: {
        color: "red",
        label: "ຮ້ອງຮຽນ",
        icon: AlertTriangle,
      },
      duplicate_ip: { color: "yellow", label: "IP ຊໍ້າ", icon: Copy },
    };

    const config = flagConfig[flag];
    if (!config) return null;

    const IconComponent = config?.icon;
    return (
      <Badge
        colorScheme={config?.color}
        size="sm"
        display="flex"
        alignItems="center"
        gap={1}
      >
        <IconComponent size={10} />
        {config?.label}
      </Badge>
    );
  };

  const updateOrderStatus = (orderId, newStatus, note) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              timeline: order?.deliverySteps?.map((step) => {
                if (
                  (newStatus === "Processing" &&
                    step.status === "Processing") ||
                  (newStatus === "Shipped" &&
                    (step.status === "Processing" ||
                      step.status === "Shipped")) ||
                  (newStatus === "Delivered" && step.status !== "Cancelled")
                ) {
                  return {
                    ...step,
                    completed: true,
                    date: new Date().toISOString(),
                  };
                }
                return step;
              }),
            }
          : order
      )
    );
    dispatch(
      update_status_shipping({
        id: orderId,
        shipping_status: newStatus,
        step: newStatus,
        note: note,
      })
    ).then(() => dispatch(get_order_for()));
    toast({
      title: "ອັບເດດສຳເລັດ",
      description: `ປ່ຽນສະຖານະຄຳສັ່ງຊື້ ${orderId} ເປັນ ${newStatus}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const exportOrders = (format) => {
    // Simulate export
    toast({
      title: "กำลังส่งออกข้อมูล",
      description: `ส่งออกข้อมูลเป็น ${format.toUpperCase()} สำเร็จ`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const addNote = (orderId, noteText) => {
    if (!noteText.trim()) return;

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              notes: [
                ...order.notes,
                {
                  id: Date.now(),
                  text: noteText,
                  author: "Admin",
                  date: new Date().toISOString(),
                },
              ],
            }
          : order
      )
    );

    toast({
      title: "เพิ่มหมายเหตุสำเร็จ",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // Statistics
  const stats = useMemo(() => {
    const total = orders?.length;
    const pending = orders?.filter((o) => o.shipping_status === "pending")
      ?.length;
    const shipped = orders?.filter((o) => o.shipping_status === "Shipped")
      ?.length;
    const delivered = orders?.filter((o) => o.shipping_status === "Delivered")
      ?.length;
    const cancelled = orders?.filter((o) => o.shipping_status === "Cancelled")
      ?.length;
    const totalRevenue = orders
      ?.filter((o) => o.shipping_status !== "Cancelled")
      .reduce((sum, o) => sum + o.total, 0);

    return {
      total,
      pending,
      shipped,
      delivered,
      cancelled,
      totalRevenue,
      cancelRate: total > 0 ? ((cancelled / total) * 100).toFixed(1) : 0,
    };
  }, [orders]);
  const OrderCard = ({ order }) => (
    <Card>
      <CardHeader pb={2}>
        <Flex justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold" fontSize="lg">
              {order?.get_order_adminid}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {new Date(order?.createdAt).toLocaleDateString("th-TH")}
            </Text>
          </VStack>
          <VStack align="end" spacing={1}>
            {order.status}
            <Text fontWeight="bold" color="green.500">
              LAK {order?.total?.toLocaleString()}
            </Text>
          </VStack>
        </Flex>
      </CardHeader>
      <CardBody pt={0}>
        <VStack align="start" spacing={2}>
          <HStack>
            <User size={14} />
            <Text fontSize="sm">{order?.user_id?.username}</Text>
          </HStack>
          <HStack>
            <Store size={14} />
            <Text fontSize="sm">{order?.sellers[0].store_name}</Text>
          </HStack>
          <HStack>
            <CreditCard size={14} />
            {getPaymentBadge(order?.status)}
          </HStack>
          {order?.flags?.length > 0 && (
            <Wrap>
              {order?.flags?.map((flag) => (
                <WrapItem key={flag}>{getFlagBadge(flag)}</WrapItem>
              ))}
            </Wrap>
          )}
          <HStack mt={2} spacing={2}>
            <Button
              size="sm"
              leftIcon={<Eye size={14} />}
              onClick={() => {
                setSelectedOrder(order);
                onDetailOpen();
              }}
            >
              ເບີງລາຍລະອຽດ
            </Button>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<MoreVertical size={14} />}
                size="sm"
                variant="ghost"
              />
              <MenuList>
                <MenuItem
                  onClick={() =>
                    updateOrderStatus(
                      order?._id,
                      "Processing",
                      "ກຳລັງກຽມສິນຄ້າແລະແພ໋ກສຶນຄ້າ"
                    )
                  }
                >
                  ປ່ຽນເປັນ "ກຳລັງກຽມ"
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    updateOrderStatus(
                      order?._id,
                      "Shipped",
                      "ສິນຄ້າອອກຈາກສາງກຳລັງຈັດສົ່ງໃຫ່ຜູ້ບໍລິການຂົນສົ່ງ"
                    )
                  }
                >
                  ປ່ຽນເປັນ "ກຳລັງຈັດສົ່ງ"
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    updateOrderStatus(
                      order?._id,
                      "Delivered",
                      "ສິນຄ້າໄດ້ຮັບການຈັດສົ່ງສຳເລັດໃຫ້ກັບຜູ້ບໍລິການຂົນສົ່ງ"
                    )
                  }
                >
                  ປ່ຽນເປັນ "ຈັດສົ່ງແລ້ວ"
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    updateOrderStatus(
                      order?._id,
                      "Cancelled",
                      "ຄຳສັ່ງຊື້ຂອງທ່ານຖືກຍົກເລີກ ກຳລັງດຳເນີນການຄືນເງິນພາຍໃນ 1-3ຊົ່ວໂມງ"
                    )
                  }
                  color="red.500"
                >
                  ຍົກເລີກຄຳສັ່ງຊື້
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );

  const TimelineStep = ({ step, isLast }) => {
    const stepLabels = {
      order_placed: "ຄຳສັ່ງຊື້ຈາກຜູ້ຊື້",
      Processing: "ກຳລັງກຽມສິນຄ້າແລະແພ໋ກສຶນຄ້າ",
      Shipped: "ສິນຄ້າອອກຈາກສາງກຳລັງຈັດສົ່ງໃຫ່ຜູ້ບໍລິການຂົນສົ່ງ",
      Delivered: "ສິນຄ້າໄດ້ຮັບການຈັດສົ່ງສຳເລັດໃຫ້ກັບຜູ້ບໍລິການຂົນສົ່ງ",
      Cancelled: "ຍົກເລີກ",
    };

    return (
      <HStack spacing={4} align="start">
        <VStack spacing={0}>
          <Box
            w={8}
            h={8}
            borderRadius="full"
            bg={step.step ? "green.500" : "gray.300"}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {step.step ? (
              <CheckCircle size={16} color="white" />
            ) : (
              <Clock size={16} color="gray.600" />
            )}
          </Box>
          {!isLast && (
            <Box w={0.5} h={8} bg={step.step ? "green.500" : "gray.300"} />
          )}
        </VStack>
        <VStack align="start" spacing={1} flex={1}>
          <Text fontWeight={step ? "bold" : "normal"}>
            {stepLabels[step.step]}
          </Text>
          {step.timestamp && (
            <Text fontSize="sm" color="gray.600">
              {new Date(step.timestamp).toLocaleString("th-TH")}
            </Text>
          )}
        </VStack>
      </HStack>
    );
  };
  function getStatusPayment(status) {
    switch (status) {
      case "pending_payment":
        return <Badge colorScheme="yellow">ລໍຖ້າຊຳລະ</Badge>;

      case "PAYMENT_COMPLETED":
        return <Badge colorScheme="green">ຊຳລະແລ້ວ</Badge>;

      case "expired":
        return <Badge colorScheme="red">ຊຳລະບໍ່ສຳເລັດ</Badge>;

      case "Cancelled":
        return <Badge colorScheme="gray">ຍົກເລີກ</Badge>;

      default:
        return <Badge colorScheme="purple">ບໍ່ຮູ້ສະຖານະ</Badge>;
    }
  }
  return (
    <Box p={6} maxW="100vw" bg="gray.50" minH="100vh">
      {/* Header */}
      <VStack align="start" spacing={6} mb={6}>
        <HStack justify="space-between" w="full">
          <VStack align="start" spacing={2}>
            <Text fontSize="3xl" fontWeight="bold">
              ຈັດການຄຳສັ່ງຊື້
            </Text>
            <Text color="gray.600">ລະບົບຈັດການຄຳສັ່ງຊື້ Marketplace</Text>
          </VStack>
          <HStack spacing={2}>
            <Button leftIcon={<Bell size={16} />} variant="ghost">
              ແຈ້ງເຕືອນ (0)
            </Button>
            <Menu>
              <MenuButton as={Button} rightIcon={<Download size={16} />}>
                ສົ່ງອອກຂໍ້ມູນ
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => exportOrders("excel")}>
                  Excel (.xlsx)
                </MenuItem>
                <MenuItem onClick={() => exportOrders("csv")}>
                  CSV (.csv)
                </MenuItem>
                <MenuItem onClick={() => exportOrders("pdf")}>
                  PDF (.pdf)
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </HStack>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 2, md: 4, lg: 7 }} spacing={4} w="full">
          <Stat>
            <StatLabel>ຄ່າສັ່ງຊື້ທັງໝົດ</StatLabel>
            <StatNumber>{stats.total}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>ລໍຖ້າດຳເນີນການ</StatLabel>
            <StatNumber color="orange.500">{stats.pending}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>ກຳລັງຈັດສົ່ງ</StatLabel>
            <StatNumber color="purple.500">{stats.shipped}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>ຈັດສົ່ງແລ້ວ</StatLabel>
            <StatNumber color="green.500">{stats.delivered}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>ຍົກເລີກ</StatLabel>
            <StatNumber color="red.500">{stats.cancelled}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>ຍອດຂາຍລວມ</StatLabel>
            <StatNumber color="green.600">
              LAK {stats.totalRevenue?.toLocaleString()}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel>ອັດຕາການຍົກເລີກ</StatLabel>
            <StatNumber color={stats.cancelRate > 10 ? "red.500" : "green.500"}>
              {stats.cancelRate}%
            </StatNumber>
          </Stat>
        </SimpleGrid>
      </VStack>

      {/* Filters and Search */}
      <Card mb={6}>
        <CardBody>
          <VStack spacing={4}>
            <HStack w="full" spacing={4}>
              <Box flex={1}>
                <Input
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      search: e.target.value,
                    }))
                  }
                  placeholder="Search..."
                />
              </Box>
              <Select
                placeholder="ສະຖານະຄຳສັ່ງຊື້"
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                w="200px"
              >
                <option value="pending">ລໍຖ້າດຳເນີນການ</option>
                <option value="Processing">ກຳລັງຈັດກຽມ</option>
                <option value="Shipped">ກຳລັງຈັດສົ່ງ</option>
                <option value="Delivered">ຈັດສົ່ງແລ້ວ</option>
                <option value="Cancelled">ຍົກເລີກ </option>
              </Select>
              <Select
                placeholder="ສະຖານະການຊຳລະເງີນ"
                value={filters.paymentStatus}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    paymentStatus: e.target.value,
                  }))
                }
                w="200px"
              >
                <option value="pending">ລໍຖ້າຊຳລະເງິນ</option>
                <option value="completed">ຊຳລະເງິນແລ້ວ</option>
                <option value="processing">ກຳລັງກວດສອບ</option>
                <option value="refunded">ຄືນເງິນແລ້ວ</option>
              </Select>
              <Button leftIcon={<Filter size={16} />} onClick={onFilterOpen}>
                ຕົວກຣອງເພີ່ມເຕີ່ມ
              </Button>
            </HStack>

            <HStack justify="space-between" w="full">
              <HStack>
                <Text fontSize="sm" color="gray.600">
                  ມຸມມອງທີ່ບັນທຶກໄວ້:
                </Text>
                {savedViews.map((view) => (
                  <Button
                    key={view.name}
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, ...view.filters }))
                    }
                  >
                    {view.name}
                  </Button>
                ))}
              </HStack>
              <HStack>
                <Text fontSize="sm" color="gray.600">
                  ສະແດງຜົນ:
                </Text>
                <RadioGroup value={viewMode} onChange={setViewMode}>
                  <Stack direction="row">
                    <Radio value="table">ແບບຕາລາງ</Radio>
                    <Radio value="card">ແບບກາດ</Radio>
                  </Stack>
                </RadioGroup>
              </HStack>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Order List */}
      <Card>
        <CardHeader>
          <HStack justify="space-between">
            <Text fontSize="xl" fontWeight="bold">
              ລາຍການຄຳສັ່ງຊື້ ({orders?.length})
            </Text>
            <Button
              leftIcon={<RefreshCw size={16} />}
              size="sm"
              variant="ghost"
            >
              ລີເຟຣສ
            </Button>
          </HStack>
        </CardHeader>
        <CardBody>
          {viewMode === "table" ? (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th fontFamily={"Noto Sans Lao, serif"}>ລະຫັດຄຳສັ່ງຊື້</Th>
                    <Th fontFamily={"Noto Sans Lao, serif"}>ລູກຄ້າ</Th>
                    <Th fontFamily={"Noto Sans Lao, serif"}>ຮ້ານຄ້າ</Th>
                    <Th fontFamily={"Noto Sans Lao, serif"}>ຍອດລວມ</Th>
                    <Th fontFamily={"Noto Sans Lao, serif"}>ສະຖານະ</Th>
                    <Th fontFamily={"Noto Sans Lao, serif"}>ສະຖານະຂົນສົ່ງ</Th>
                    <Th fontFamily={"Noto Sans Lao, serif"}>ວັນທີ່ສັ່ງຊື້</Th>
                    <Th fontFamily={"Noto Sans Lao, serif"}>ແຈ້ງເຕືອນ</Th>
                    <Th fontFamily={"Noto Sans Lao, serif"}>ຈັດການ</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredOrders?.map((order) => (
                    <Tr key={order._id}>
                      <Td fontWeight="bold">#{order?.orderId}</Td>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text>{order?.user_id?.username || "no"}</Text>
                          <Text fontSize="sm" color="gray.600">
                            {order?.user_id?.phone || "no"}
                          </Text>
                        </VStack>
                      </Td>
                      <Td>{order?.sellers[0].store_name}</Td>
                      <Td fontWeight="bold" color="green.600">
                        <VStack align="start" spacing={1}>
                          <Text> LAK {order?.total?.toLocaleString()}</Text>
                          <Text fontSize="sm" color="gray.600">
                            LAK {order?.fee_system.toLocaleString() || "no"}
                          </Text>
                        </VStack>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text> {getPaymentBadge(order?.status)}</Text>
                          <Text fontSize="sm" color="gray.600">
                            ຊຳລະດ້ວຍ {order?.paymentMethod}
                          </Text>
                        </VStack>
                      </Td>
                      <Td>{getStatusBadge(order?.shipping_status)}</Td>
                      <Td>
                        {new Date(order?.createdAt)?.toLocaleDateString(
                          "th-TH"
                        )}
                      </Td>
                      <Td>
                        {order?.flags?.length > 0 && (
                          <HStack>
                            {order?.flags?.map((flag) => getFlagBadge(flag))}
                          </HStack>
                        )}
                      </Td>
                      <Td>
                        <HStack spacing={1}>
                          <IconButton
                            icon={<Eye size={14} />}
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedOrder(order);
                              onDetailOpen();
                            }}
                          />
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<MoreVertical size={14} />}
                              size="sm"
                              variant="ghost"
                            />
                            <MenuList>
                              <MenuItem
                                onClick={() =>
                                  updateOrderStatus(
                                    order._id,
                                    "Processing",
                                    "ກຳລັງກຽມສິນຄ້າແລະແພ໋ກສຶນຄ້າ"
                                  )
                                }
                              >
                                ປ່ຽນເປັນ "ກຳລັງກຽມ"
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  updateOrderStatus(
                                    order._id,
                                    "Shipped",
                                    "ສິນຄ້າອອກຈາກສາງກຳລັງຈັດສົ່ງໃຫ່ຜູ້ບໍລິການຂົນສົ່ງ"
                                  )
                                }
                              >
                                ປ່ຽນເປັນ "ກຳລັງຈັດສົ່ງ"
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  updateOrderStatus(
                                    order._id,
                                    "Delivered",
                                    " ສິນຄ້າໄດ້ຮັບການຈັດສົ່ງສຳເລັດໃຫ້ກັບຜູ້ບໍລິການຂົນສົ່ງ"
                                  )
                                }
                              >
                                ປ່ຽນເປັນ "ຈັດສົ່ງແລ້ວ"
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  updateOrderStatus(
                                    order._id,
                                    "Cancelled",
                                    "ຄຳສັ່ງຊື້ຂອງທ່ານຖືກຍົກເລີກ ກຳລັງດຳເນີນການຄືນເງິນພາຍໃນ 1-3ຊົ່ວໂມງ"
                                  )
                                }
                                color="red.500"
                              >
                                ຍົກເລີກຄຳສັ່ງຊື້
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {filteredOrders?.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </SimpleGrid>
          )}

          {filteredOrders?.length === 0 && (
            <Box textAlign="center" py={10}>
              <Text color="gray.500">ບໍ່ພົບຄຳສັ່ງຊື້ທີ່ຄົ້ນຫາ</Text>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* Order Detail Modal */}
      <Modal isOpen={isDetailOpen} onClose={onDetailClose} size="6xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>
            <VStack justify="space-between" w="full" pr={8}>
              <VStack align="start" spacing={1}>
                <Text>ລາຍລະອຽດຄຳສັ່ງຊື້ {selectedOrder?.id}</Text>
                <HStack>
                  {selectedOrder && selectedOrder.status}
                  {selectedOrder &&
                    getPaymentBadge(selectedOrder.paymentStatus)}
                </HStack>
              </VStack>
              <HStack>
                <Menu>
                  <MenuButton
                    as={Button}
                    size="sm"
                    leftIcon={<Edit size={14} />}
                  >
                    ປ່ຽນສະຖານະ
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        updateOrderStatus(selectedOrder._id, "processing");
                        onDetailClose();
                      }}
                    >
                      ປ່ຽນເປັນ ກຳລັງຈັດກຽມ
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        updateOrderStatus(selectedOrder._id, "shipped");
                        onDetailClose();
                      }}
                    >
                      ປ່ຽນເປັນ ກຳລັງຈັດສົ່ງ
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        updateOrderStatus(selectedOrder._id, "delivered");
                        onDetailClose();
                      }}
                    >
                      ປ່ຽນເປັນ ຈັດສົ່ງແລ້ວ
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        updateOrderStatus(selectedOrder._id, "cancelled");
                        onDetailClose();
                      }}
                      color="red.500"
                    >
                      ຍົກເລີກຄຳສັ່ງຊື້
                    </MenuItem>
                  </MenuList>
                </Menu>
                <Button
                  size="sm"
                  leftIcon={<MessageSquare size={14} />}
                  onClick={onNoteOpen}
                >
                  ເພີ່ມໝາຍເຫດ
                </Button>
              </HStack>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedOrder && (
              <Tabs>
                <TabList>
                  <Tab>ຂໍ້ມູນທົ່ວໄປ</Tab>
                  <Tab>ລາຍການສິນຄ້າ</Tab>
                  <Tab>ທາມລາຍ</Tab>
                  <Tab>ໝາຍເຫດ ({selectedOrder?.notes?.length || 0})</Tab>
                  <Tab>ການຄືນເງິນ</Tab>
                  <Tab>ເອກະສານ</Tab>
                </TabList>

                <TabPanels>
                  {/* General Info Tab */}
                  <TabPanel>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      {/* Customer Info */}
                      <Card>
                        <CardHeader>
                          <Text fontSize="lg" fontWeight="bold">
                            ຂໍ້ມູນລູກຄ້າ
                          </Text>
                        </CardHeader>
                        <CardBody>
                          <VStack align="start" spacing={3}>
                            <HStack>
                              <Avatar
                                size="sm"
                                name={selectedOrder?.user_id?.username}
                              />
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="bold">
                                  {selectedOrder?.user_id?.username}
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                  {selectedOrder?.user_id?.email}
                                </Text>
                              </VStack>
                            </HStack>
                            <HStack>
                              <Phone size={16} />
                              <Text>{selectedOrder?.user_id?.phone}</Text>
                            </HStack>
                          </VStack>
                        </CardBody>
                      </Card>

                      {/* Store Info */}
                      <Card>
                        <CardHeader>
                          <Text fontSize="lg" fontWeight="bold">
                            ຂໍ້ມູນຮ້ານຄ້າ
                          </Text>
                        </CardHeader>
                        <CardBody>
                          <VStack align="start" spacing={3}>
                            <HStack>
                              <Store size={16} />
                              <Text fontWeight="bold">
                                {selectedOrder?.sellers[0]?.store_name}
                              </Text>
                            </HStack>
                            <Text fontSize="sm" color="gray.600">
                              ລະຫັດຮ້ານ: {selectedOrder?.sellers[0]?.store_code}
                            </Text>
                          </VStack>
                        </CardBody>
                      </Card>

                      {/* Shipping Address */}
                      <Card>
                        <CardHeader>
                          <Text fontSize="lg" fontWeight="bold">
                            ທີ່ຢູ່ຈັດສົ່ງ
                          </Text>
                        </CardHeader>
                        <CardBody>
                          <VStack align="start" spacing={2}>
                            <Box
                              border="1px"
                              borderColor="gray.200"
                              rounded="2xl"
                              p={4}
                              bg="white"
                              shadow="md"
                              _hover={{
                                shadow: "lg",
                                transform: "translateY(-2px)",
                                transition: "0.2s",
                              }}
                            >
                              <HStack align="start" spacing={3}>
                                <Box
                                  p={2}
                                  rounded="full"
                                  bg="blue.50"
                                  color="blue.600"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <MapPin size={18} />
                                </Box>

                                <VStack align="start" spacing={1} w="full">
                                  <HStack spacing={2}>
                                    <Text fontWeight="bold" fontSize="md">
                                      {selectedOrder?.shippingAddress?.name}
                                    </Text>
                                    <Badge colorScheme="blue" fontSize="xs">
                                      {selectedOrder?.shippingAddress?.phone}
                                    </Badge>
                                  </HStack>

                                  <Divider />

                                  <Text fontSize="sm" color="gray.700">
                                    {selectedOrder?.shippingAddress?.village},{" "}
                                    {selectedOrder?.shippingAddress?.district},{" "}
                                    {selectedOrder?.shippingAddress?.province}
                                  </Text>

                                  <HStack spacing={2} pt={1}>
                                    <Badge colorScheme="green" variant="subtle">
                                      {
                                        selectedOrder?.shippingAddress
                                          ?.transportCompany
                                      }
                                    </Badge>
                                    <Text fontSize="sm" color="gray.600">
                                      {selectedOrder?.shippingAddress?.branch}
                                    </Text>
                                  </HStack>
                                </VStack>
                              </HStack>
                            </Box>
                          </VStack>
                        </CardBody>
                      </Card>

                      {/* Order Summary */}
                      <Card>
                        <CardHeader>
                          <Text fontSize="lg" fontWeight="bold">
                            ສະຫຼຸບຄຳສັ່ງຊື້
                          </Text>
                        </CardHeader>

                        <CardBody>
                          <VStack align="start" spacing={3} w="full">
                            {/* วันที่สั่งซื้อ */}
                            <HStack justify="space-between" w="full">
                              <Text>ວັນທີ່ສັ່ງຊື້:</Text>
                              <Text>
                                {new Date(
                                  selectedOrder?.createdAt
                                ).toLocaleString("th-TH")}
                              </Text>
                            </HStack>

                            {/* ยอดรวม */}
                            <HStack justify="space-between" w="full">
                              <Text>ຍອດລວມ:</Text>
                              <Text
                                fontWeight="bold"
                                color="green.600"
                                fontSize="lg"
                              >
                                LAK {selectedOrder?.total?.toLocaleString()}
                              </Text>
                            </HStack>

                            {/* จำนวนรายการ */}
                            <HStack justify="space-between" w="full">
                              <Text>ຈຳນວນລາຍການ:</Text>
                              <Text>{selectedOrder?.items?.length} ລາຍການ</Text>
                            </HStack>

                            {/* Status */}
                            <HStack justify="space-between" w="full">
                              <Text>ສະຖານະ:</Text>
                              <Text color="blue.600" fontWeight="semibold">
                                {getStatusPayment(selectedOrder?.status)}
                              </Text>
                            </HStack>

                            {/* Transaction Id */}
                            <HStack justify="space-between" w="full">
                              <Text>Transaction ID:</Text>
                              <Text>{selectedOrder?.transactionId}</Text>
                            </HStack>

                            {/* Payment Method */}
                            <HStack justify="space-between" w="full">
                              <Text>ວິທີຊຳລະ:</Text>
                              <Text>{selectedOrder?.paymentMethod}</Text>
                            </HStack>

                            {/* Payment Time */}
                            <HStack justify="space-between" w="full">
                              <Text>ເວລາຊຳລະ:</Text>
                              <Text>
                                {selectedOrder?.payment_time &&
                                  new Date(
                                    selectedOrder?.payment_time
                                  ).toLocaleString("th-TH")}
                              </Text>
                            </HStack>

                            {/* Reference No */}
                            <HStack justify="space-between" w="full">
                              <Text>Reference No:</Text>
                              <Text>
                                {selectedOrder?.exReferenceNo ||
                                  selectedOrder?.refNo}
                              </Text>
                            </HStack>

                            {/* Source Name */}
                            <HStack justify="space-between" w="full">
                              <Text>ຊື່ຜູ້ໂອນ:</Text>
                              <Text>{selectedOrder?.sourceName}</Text>
                            </HStack>

                            {/* Source Account */}
                            <HStack justify="space-between" w="full">
                              <Text>ບັນຊີຜູ້ໂອນ:</Text>
                              <Text>{selectedOrder?.sourceAccount}</Text>
                            </HStack>

                            {/* Flags */}
                            {selectedOrder?.flags?.length > 0 && (
                              <Box w="full">
                                <Text mb={2}>ແຈ້ງເຕືອນ:</Text>
                                <Wrap>
                                  {selectedOrder?.flags?.map((flag) => (
                                    <WrapItem key={flag}>
                                      {getFlagBadge(flag)}
                                    </WrapItem>
                                  ))}
                                </Wrap>
                              </Box>
                            )}
                          </VStack>
                        </CardBody>
                      </Card>
                    </SimpleGrid>
                  </TabPanel>

                  {/* Items Tab */}
                  <TabPanel>
                    <Card>
                      <CardHeader>
                        <Text fontSize="lg" fontWeight="bold">
                          ລາຍການສິນຄ້າ
                        </Text>
                      </CardHeader>
                      <CardBody>
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th fontFamily={"Noto Sans Lao, serif"}>
                                ລະຫັດສິນຄ້າ
                              </Th>
                              <Th fontFamily={"Noto Sans Lao, serif"}>
                                ສິນຄ້າ
                              </Th>
                              <Th fontFamily={"Noto Sans Lao, serif"}>ຈຳນວນ</Th>
                              <Th fontFamily={"Noto Sans Lao, serif"}>
                                ລາຄາຕໍ່ໜ່ວຍ
                              </Th>
                              <Th fontFamily={"Noto Sans Lao, serif"}>
                                ລາຄາລວມ
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {selectedOrder?.items?.map((item, index) => (
                              <Tr key={index}>
                                <Td>#{item?.productId.orderId}</Td>
                                <Td>{item?.productId.name}</Td>
                                <Td>{item?.quantity}</Td>
                                <Td>LAK {item?.price?.toLocaleString()}</Td>
                                <Td fontWeight="bold">
                                  LAK
                                  {(
                                    item?.price * item?.quantity
                                  ).toLocaleString()}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                        <Divider my={4} />
                        <HStack
                          bg="white"
                          rounded="2xl"
                          shadow="md"
                          p={5}
                          border="1px"
                          borderColor="gray.200"
                          maxW="md"
                          mx="auto"
                          justify="space-between"
                        >
                          {/* หัวข้ออยู่บนสุด */}
                          <Text fontSize="xl" fontWeight="bold" mb={4}>
                            ສະຫຼຸບຍອດຊຳລະ
                          </Text>

                          {/* เนื้อหา */}
                          <VStack spacing={2} align="stretch">
                            <HStack justify="space-between">
                              <Text color="gray.600">ລາຄາສິນຄ້າລວມ</Text>
                              <Text fontWeight="medium">
                                LAK {selectedOrder.subtotal.toLocaleString()}
                              </Text>
                            </HStack>

                            <HStack justify="space-between">
                              <Text color="gray.600">ສ່ວນຫຼຸດ</Text>
                              <Text fontWeight="medium" color="red.500">
                                - LAK {selectedOrder.discount.toLocaleString()}
                              </Text>
                            </HStack>

                            <HStack justify="space-between">
                              <Text color="gray.600">ຄ່າຂົນສົ່ງ</Text>
                              <Text fontWeight="medium">
                                LAK{" "}
                                {selectedOrder.shippingCost.toLocaleString()}
                              </Text>
                            </HStack>

                            <HStack justify="space-between">
                              <Text color="gray.600">ຄ່າທຳນຽມລະບົບ</Text>
                              <Text fontWeight="medium">
                                LAK {selectedOrder.fee_system.toLocaleString()}
                              </Text>
                            </HStack>

                            <Divider />

                            <HStack justify="space-between">
                              <Text fontWeight="semibold">ຍອດລວມຫຼັງຫັກ</Text>
                              <Text fontWeight="semibold">
                                LAK{" "}
                                {selectedOrder.total_summary.toLocaleString()}
                              </Text>
                            </HStack>

                            <HStack justify="space-between" pt={2}>
                              <Text fontSize="lg" fontWeight="bold">
                                ຍອດທັງໝົດ:
                              </Text>
                              <Text
                                fontSize="lg"
                                fontWeight="bold"
                                color="green.600"
                              >
                                LAK {selectedOrder.total.toLocaleString()}
                              </Text>
                            </HStack>
                          </VStack>
                        </HStack>
                      </CardBody>
                    </Card>
                  </TabPanel>

                  {/* Timeline Tab */}
                  <TabPanel>
                    <Card>
                      <CardHeader>
                        <Text fontSize="lg" fontWeight="bold">
                          ທາມລາຍຄຳສັ່ງຊື້
                        </Text>
                      </CardHeader>
                      <CardBody>
                        <VStack align="start" spacing={4} w="full">
                          {selectedOrder?.deliverySteps?.map((step, index) => (
                            <TimelineStep
                              key={index}
                              step={step}
                              isLast={
                                index ===
                                selectedOrder?.deliverySteps?.length - 1
                              }
                            />
                          ))}
                        </VStack>
                      </CardBody>
                    </Card>
                  </TabPanel>

                  {/* Notes Tab */}
                  <TabPanel>
                    <VStack spacing={4} align="start" w="full">
                      {selectedOrder?.notes &&
                      selectedOrder?.notes?.length > 0 ? (
                        selectedOrder?.notes?.map((note) => (
                          <Card key={note.id} w="full">
                            <CardBody>
                              <VStack align="start" spacing={2}>
                                <HStack justify="space-between" w="full">
                                  <Text fontWeight="bold">{note.author}</Text>
                                  <Text fontSize="sm" color="gray.600">
                                    {new Date(note?.date).toLocaleString(
                                      "th-TH"
                                    )}
                                  </Text>
                                </HStack>
                                <Text>{note?.text}</Text>
                              </VStack>
                            </CardBody>
                          </Card>
                        ))
                      ) : (
                        <Alert status="info">
                          <AlertIcon />
                          <AlertTitle>ບໍ່ມີໝາຍເຫດ</AlertTitle>
                          <AlertDescription>
                            ຍັງບໍ່ມີໝາຍເຫດສຳຫລັບຄຳສັ່ງຊື້ນີ້
                          </AlertDescription>
                        </Alert>
                      )}
                    </VStack>
                  </TabPanel>

                  {/* Refund Tab */}
                  <TabPanel>
                    <Card>
                      <CardHeader>
                        <Text fontSize="lg" fontWeight="bold">
                          ການຄືນເງິນ
                        </Text>
                      </CardHeader>
                      <CardBody>
                        {selectedOrder.refund ? (
                          <VStack align="start" spacing={4}>
                            <HStack justify="space-between" w="full">
                              <Text>ຈຳນວນເງິນທີ່ຄືນ:</Text>
                              <Text fontWeight="bold" color="red.500">
                                LAK{" "}
                                {selectedOrder?.refund?.amount?.toLocaleString()}
                              </Text>
                            </HStack>
                            <HStack justify="space-between" w="full">
                              <Text>ສະຖານະ:</Text>
                              <Badge
                                colorScheme={
                                  selectedOrder?.refund?.status === "completed"
                                    ? "green"
                                    : "orange"
                                }
                              >
                                {selectedOrder?.refund?.status === "completed"
                                  ? "ຄືນເງິນແລ້ວ"
                                  : "ກຳລັງດຳເນີນການ"}
                              </Badge>
                            </HStack>
                            <HStack justify="space-between" w="full">
                              <Text>ວັນທີ່ຄືນເງິນ:</Text>
                              <Text>
                                {new Date(
                                  selectedOrder?.refund?.date
                                )?.toLocaleString("th-TH")}
                              </Text>
                            </HStack>
                          </VStack>
                        ) : (
                          <VStack spacing={4}>
                            <Alert status="info">
                              <AlertIcon />
                              <AlertTitle>ບໍ່ມີການຄືນເງິນ</AlertTitle>
                              <AlertDescription>
                                ຄຳສັ່ງຊື້ນີ້ຍັງບໍ່ມີການຮ້ອງຂໍຄືນເງິນ
                              </AlertDescription>
                            </Alert>
                            <Button
                              colorScheme="red"
                              size="sm"
                              leftIcon={<DollarSign size={14} />}
                            >
                              ສ້າງຄຳຂໍຄືນເງິນ
                            </Button>
                          </VStack>
                        )}
                      </CardBody>
                    </Card>
                  </TabPanel>

                  {/* Documents Tab */}
                  <TabPanel>
                    <Card>
                      {/* <CardHeader>
                        <HStack justify="space-between">
                          <Text fontSize="lg" fontWeight="bold">
                            ເອກະສານແນບ
                          </Text>
                          <Button size="sm" leftIcon={<Upload size={14} />}>
                            ອັບໂຫລດເອກະສານ
                          </Button>
                        </HStack>
                      </CardHeader> */}
                      <CardBody>
                        <VStack spacing={4} align="start">
                          {/* <Alert status="info">
                            <AlertIcon />
                            <AlertTitle>ບໍ່ມີເອກະສານ</AlertTitle>
                            <AlertDescription>
                              ຍັງບໍ່ມີເອກະສານທີ່ແນບກັບຄຳສັ່ງຊື້ນີ້
                            </AlertDescription>
                          </Alert> */}
                          <SimpleGrid
                            columns={{ base: 1, md: 3 }}
                            spacing={4}
                            w="full"
                          >
                            {/* <Button
                              leftIcon={<FileText size={16} />}
                              variant="outline"
                            >
                              ໃບກຳກັບພາສີ
                            </Button>
                            <Button
                              leftIcon={<Camera size={16} />}
                              variant="outline"
                            >
                              ຮູບສິນຄ້າກ່ອນຈັດສົ່ງ
                            </Button> */}
                            <Link
                              href={selectedOrder?.imagesShipping}
                              target="_blank"
                              rel="noopener noreferrer"
                              _hover={{ textDecoration: "none" }}
                            >
                              <Button
                                leftIcon={<Package size={16} />}
                                variant="outline"
                                w="full"
                                isDisabled={!selectedOrder?.imagesShipping}
                              >
                                ໃບປະໜ້າກ່ອງພັດສະດຸ{" "}
                                {selectedOrder?.trackingNumber || ""}
                              </Button>
                            </Link>
                          </SimpleGrid>
                        </VStack>
                      </CardBody>
                    </Card>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onDetailClose}>ปิด</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Note Modal */}
      <Modal isOpen={isNoteOpen} onClose={onNoteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ເພີ່ມໝາຍເຫດ</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>ໝາຍເຫດ</FormLabel>
              <Textarea
                placeholder="ໃສ່ໝາຍເຫດທີ່ນີ້..."
                rows={4}
                id="note-textarea"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onNoteClose}>
              ຍົກເລີກ
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                const textarea = document.getElementById("note-textarea");
                if (textarea && selectedOrder) {
                  addNote(selectedOrder.id, textarea.value);
                  textarea.value = "";
                  onNoteClose();
                }
              }}
            >
              ບັນທຶກ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Advanced Filter Modal */}
      <Modal isOpen={isFilterOpen} onClose={onFilterClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ຕົວກຣອງຂັ້ນສູງ</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="start">
              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl>
                  <FormLabel>ວັນທີ່ເລີ່ມຕົ້ນ</FormLabel>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateFrom: e.target.value,
                      }))
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>ວັນທີ່ສິ້ນສຸດ</FormLabel>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateTo: e.target.value,
                      }))
                    }
                  />
                </FormControl>
              </SimpleGrid>
              <FormControl>
                <FormLabel>ຮ້ານຄ້າ</FormLabel>
                <Input
                  placeholder="ຊື່ຮ້ານຄ້າ"
                  value={filters.store}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, store: e.target.value }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>ຍອດຂາຍຂັ້ນຕໍ່າ (LAK)</FormLabel>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minAmount || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minAmount: e.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>ຍອດຂາຍສູງສຸດ (LAK)</FormLabel>
                <Input
                  type="number"
                  placeholder="ບໍ່ຈຳກັດ"
                  value={filters.maxAmount || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxAmount: e.target.value,
                    }))
                  }
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() => {
                setFilters({
                  search: "",
                  status: "",
                  dateFrom: "",
                  dateTo: "",
                  store: "",
                  paymentStatus: "",
                  minAmount: "",
                  maxAmount: "",
                });
              }}
            >
              ລ້າງທັງໝົດ
            </Button>
            <Button colorScheme="blue" onClick={onFilterClose}>
              ໃຊ້ຕົວກຣອງ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default OrderManagementDashboard;
