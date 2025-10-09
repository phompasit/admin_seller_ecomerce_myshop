import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Box,
  Grid,
  Card,
  CardBody,
  CardHeader,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Select,
  Input,
  HStack,
  VStack,
  Text,
  Heading,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Spacer,
  useColorModeValue,
  Container,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import {
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  Bell,
  Filter,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
  UserPlus,
  UserX,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { report_admin } from "../../hooks/reducer/admin_reducer/provider_reducer";

// ================== COMPONENTS ==================

// StatCard Component - Memoized for performance
const StatCard = React.memo(({ title, value, change, icon, color }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Format change value
  const formatChange = (changeValue) => {
    if (changeValue === undefined || changeValue === null) return null;
    const rounded = Math.round(changeValue * 10) / 10; // ปัดเศษ 1 ตำแหน่ง
    return rounded;
  };

  const formattedChange = formatChange(change);

  return (
    <Card
      bg={cardBg}
      shadow="sm"
      borderWidth="1px"
      borderColor={borderColor}
      _hover={{ shadow: "md", transform: "translateY(-2px)" }}
      transition="all 0.2s"
    >
      <CardBody>
        <Flex>
          <Box>
            <Stat>
              <StatLabel color="gray.600" fontSize="sm">
                {title}
              </StatLabel>
              <StatNumber fontSize="2xl" fontWeight="bold" color={color}>
                {value}
              </StatNumber>
              {formattedChange !== null && (
                <StatHelpText>
                  <StatArrow
                    type={formattedChange >= 0 ? "increase" : "decrease"}
                  />
                  {Math.abs(formattedChange)}% ຈາກເດືອນກ່ອນ
                </StatHelpText>
              )}
            </Stat>
          </Box>
          <Spacer />
          <Box p={3} bg={`${color}.50`} borderRadius="lg">
            <Icon as={icon} w={6} h={6} color={`${color}.500`} />
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
});

StatCard.displayName = "StatCard";

// Loading Skeleton Component
const DashboardSkeleton = () => (
  <VStack spacing={6} align="stretch">
    <Grid
      templateColumns={{
        base: "1fr",
        md: "repeat(2, 1fr)",
        lg: "repeat(5, 1fr)",
      }}
      gap={4}
    >
      {[...Array(10)].map((_, i) => (
        <Card key={i}>
          <CardBody>
            <Skeleton height="100px" />
          </CardBody>
        </Card>
      ))}
    </Grid>
  </VStack>
);

// ================== UTILITY FUNCTIONS ==================

// const getStatusColor = (status) => {
//   const statusMap = {
//     completed: "green",
//     processing: "blue",
//     shipped: "purple",
//     pending: "orange",
//     cancelled: "red",
//   };
//   return statusMap[status?.toLowerCase()] || "gray";
// };

const getPaymentBadge = (status) => {
  const statusConfig = {
    pending: { color: "orange", label: "ລໍຖ້າຊຳລະເງິນ" },
    completed: { color: "green", label: "ຊຳລະເງິນແລ້ວ" },
    refunded: { color: "red", label: "ຄືນເງິນແລ້ວ" },
    processing: { color: "blue", label: "ກຳລັງກວດສອບ" },
  };
  const config = statusConfig[status] || statusConfig.pending;
  return <Badge colorScheme={config.color}>{config.label}</Badge>;
};

const getStatusBadge = (status) => {
  const statusConfig = {
    pending: { color: "orange", label: "ລໍຖ້າດຳເນີນການ", icon: Clock },
    Processing: { color: "blue", label: "ກຳລັງຈັດກຽມ", icon: Package },
    Shipped: { color: "purple", label: "ກຳລັງຈັດສົ່ງ", icon: Truck },
    Delivered: { color: "green", label: "ຈັດສົ່ງແລ້ວ", icon: CheckCircle },
    Cancelled: { color: "red", label: "ຍົກເລີກຄຳສັ່ງຊື້", icon: XCircle },
  };
  const config = statusConfig[status] || statusConfig.pending;
  const IconComponent = config.icon;

  return (
    <Badge
      colorScheme={config.color}
      display="flex"
      alignItems="center"
      gap={1}
    >
      <IconComponent size={12} />
      {config.label}
    </Badge>
  );
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("la-LA", {
    style: "currency",
    currency: "LAK",
  }).format(value || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return dateString.replace("T", " ").split(".")[0];
};

// ================== MAIN COMPONENT ==================

const DashboardAdmin = () => {
  // ===== State Management =====
  const [dateFilter, setDateFilter] = useState("7days");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // ===== Redux =====
  const dispatch = useDispatch();
  const { report_admin_data } = useSelector((state) => state.provider_reducer);

  // ===== Theme =====
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // ===== Fetch Data =====
  const fetchReportData = useCallback(() => {
    setIsLoading(true);
    const params = {};

    if (startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
    } else if (dateFilter && dateFilter !== "all") {
      params.dateFilter = dateFilter;
    }

    // ✅ ส่ง params โดยตรง (ไม่ต้องห่อด้วย object)
    dispatch(report_admin(params)).finally(() => setIsLoading(false));
  }, [dispatch, dateFilter, startDate, endDate]);

  // Initial load
  useEffect(() => {
    fetchReportData();
  }, []);

  // Handle filter apply
  const handleApplyFilter = useCallback(() => {
    fetchReportData();
  }, [fetchReportData]);

  // ===== Memoized Data Processing =====

  // Category Revenue
  const categoryRevenue = useMemo(() => {
    if (!report_admin_data?.revenueByCategory) return [];

    const colors = [
      "#0084FF",
      "#00D4FF",
      "#5E72E4",
      "#11CDEF",
      "#2DCE89",
      "#FDB462",
      "#B3DE69",
    ];

    return report_admin_data.revenueByCategory.map((item, index) => ({
      name: item.categoryName,
      value: item.totalRevenue,
      color: colors[index % colors.length],
      totalQuantity: item.totalQuantity,
    }));
  }, [report_admin_data?.revenueByCategory]);

  // Top Products
  const topProducts = useMemo(() => {
    if (!report_admin_data?.products?.topSellingProducts) return [];

    return report_admin_data.products.topSellingProducts.map((product) => ({
      name: product.name,
      value: product.sold_count,
      category: product.categoryId?.name || "Unknown",
    }));
  }, [report_admin_data?.products?.topSellingProducts]);

  // Daily Sales Data (from backend)
  const dailySalesData = useMemo(() => {
    if (!report_admin_data?.dailySalesData) return [];

    return report_admin_data.dailySalesData.map((day) => ({
      name: new Date(day.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      sales: day.totalSales,
      orders: day.totalOrders,
    }));
  }, [report_admin_data?.dailySalesData]);

  // Recent Orders
  const recentOrders = useMemo(() => {
    return report_admin_data?.orders?.latestOrder || [];
  }, [report_admin_data?.orders?.latestOrder]);

  // Low Stock Products
  const lowStockProducts = useMemo(() => {
    return report_admin_data?.products?.lowStockProducts || 0;
  }, [report_admin_data?.products?.lowStockProducts]);

  // Sales Overview
  const salesOverview = useMemo(() => {
    return report_admin_data?.salesOverview || {};
  }, [report_admin_data?.salesOverview]);

  // Changes (percentage from last month)
  const changes = useMemo(() => {
    return (
      report_admin_data?.changes || {
        orders: {},
        users: {},
        sellers: {},
        products: {},
        shipping: {},
      }
    );
  }, [report_admin_data?.changes]);
  // ===== Render Loading State =====
  if (isLoading && !report_admin_data) {
    return (
      <Container maxW="full" bg={bgColor} minH="100vh" p={6}>
        <DashboardSkeleton />
      </Container>
    );
  }

  // ===== Main Render =====
  return (
    <Container maxW="full" bg={bgColor} minH="100vh" p={6}>
      <VStack spacing={6} align="stretch">
        {/* ===== HEADER ===== */}
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
          <Box>
            <Heading
              fontFamily={"Noto Sans Lao, serif"}
              size="lg"
              color="gray.800"
            >
              Admin Dashboard
            </Heading>
            <Text color="gray.600" fontSize="sm">
              Welcome back! Here's what's happening with your store today.
            </Text>
          </Box>

          <HStack spacing={3} align="center" flexWrap="wrap">
            <Select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setStartDate("");
                setEndDate("");
              }}
              size="sm"
              bg={cardBg}
              borderRadius="md"
              fontSize="sm"
              fontWeight="medium"
              w="150px"
            >
              <option value="today">ວັນນີ້</option>
              <option value="3days">3 ວັນທີ່ແລ້ວ</option>
              <option value="7days">7 ວັນທີ່ແລ້ວ</option>
              <option value="1month">1 ເດືອນທີ່ແລ້ວ</option>
              <option value="1year">1 ປີທີ່ແລ້ວ</option>
              <option value="all">ທັງໝົດ</option>
            </Select>

            <Input
              type="date"
              size="sm"
              bg={cardBg}
              borderRadius="md"
              fontSize="sm"
              w="150px"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
            />

            <Input
              type="date"
              size="sm"
              bg={cardBg}
              borderRadius="md"
              fontSize="sm"
              w="150px"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
            />

            <Button
              leftIcon={<Filter size={16} />}
              colorScheme="blue"
              size="sm"
              borderRadius="md"
              fontWeight="medium"
              onClick={handleApplyFilter}
              isLoading={isLoading}
            >
              ກັ່ນຕອງ
            </Button>
          </HStack>
        </Flex>

        {/* ===== LOW STOCK ALERT ===== */}
        {lowStockProducts > 0 && (
          <Alert
            status="warning"
            borderRadius="lg"
            bg="orange.50"
            borderColor="orange.200"
          >
            <AlertIcon />
            <Box flex="1">
              <AlertTitle fontSize="sm">ແຈ້ງເຕືອນສິນຄ້າໃກ້ໝົດ!</AlertTitle>
              <AlertDescription fontSize="sm">
                ມີສິນຄ້າ {lowStockProducts} ລາຍການທີ່ໃກ້ໝົດສະຕ໋ອກ
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {/* ===== SALES OVERVIEW CARDS ===== */}
        {salesOverview && Object.keys(salesOverview).length > 0 && (
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={4}
          >
            <StatCard
              title="ລາຍຮັບລວມ"
              value={formatCurrency(salesOverview.totalRevenue)}
              icon={DollarSign}
              color="green"
            />
            <StatCard
              title="ລາຍຮັບລວມຫຼັງຍົກເລີກອໍເດີ້"
              value={formatCurrency(salesOverview.total_lastNet)}
              icon={DollarSign}
              color="green"
            />
            <StatCard
              title="ຄຳສັ່ງຊື້ທັງໝົດ"
              value={salesOverview.totalOrders?.toLocaleString()}
              icon={ShoppingCart}
              color="blue"
            />
            <StatCard
              title="ມູນຄ່າສະເລ່ຍຕໍ່ຄຳສັ່ງ"
              value={formatCurrency(salesOverview.averageOrderValue)}
              icon={TrendingUp}
              color="purple"
            />
            <StatCard
              title="ອັດຕາສຳເລັດ"
              value={`${salesOverview.completionRate?.toFixed(1)}%`}
              icon={CheckCircle}
              color="teal"
            />
          </Grid>
        )}

        {/* ===== SUMMARY CARDS ===== */}
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(5, 1fr)",
          }}
          gap={4}
        >
          {/* Orders */}
          <StatCard
            title="ຍອດລວມຄຳສັ່ງຊື້"
            value={report_admin_data?.orders?.totalOrders || 0}
            change={changes.orders?.totalOrders}
            icon={ShoppingCart}
            color="blue"
          />
          <StatCard
            title="ຊຳລະເງິນສຳເລັດ"
            value={report_admin_data?.orders?.completedOrders || 0}
            change={changes.orders?.completedOrders}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="ລໍຖ້າຊຳລະເງິນ"
            value={report_admin_data?.orders?.pendingOrders || 0}
            change={changes.orders?.pendingOrders}
            icon={Clock}
            color="orange"
          />
          <StatCard
            title="ຖືກຍົກເລີກ"
            value={report_admin_data?.orders?.expiredOrders || 0}
            change={changes.orders?.expiredOrders}
            icon={XCircle}
            color="red"
          />
          <StatCard
            title="ລາຍຮັບລະບົບເບື້ອງຕົ້ນ"
            value={formatCurrency(report_admin_data?.orders?.fee_system_total)}
            change={changes.orders?.totalSales}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="ລາຍຮັບລະບົບສຸດທິ"
            value={formatCurrency(
              report_admin_data?.orders?.fee_system_total_lastNet
            )}
            change={0}
            icon={DollarSign}
            color="green"
          />

          {/* Users */}
          <StatCard
            title="ຜູ້ຊື້ທັງໝົດ"
            value={report_admin_data?.users?.totalUsersBuyer || 0}
            change={changes.users?.totalUsersBuyer}
            icon={Users}
            color="purple"
          />
          <StatCard
            title="ຜູ້ຂາຍທັງໝົດ"
            value={report_admin_data?.users?.totalUsersSeller || 0}
            change={changes.users?.totalUsersSeller}
            icon={Users}
            color="purple"
          />
          <StatCard
            title="ຜູ້ຊື້ໃໝ່ເດືອນນີ້"
            value={report_admin_data?.users?.newClientThisMonth || 0}
            change={changes.users?.totalUsersBuyer}
            icon={UserPlus}
            color="blue"
          />
          <StatCard
            title="ຜູ້ຂາຍໃໝ່ເດືອນນີ້"
            value={report_admin_data?.users?.newSellersThisMonth || 0}
            change={changes.users?.totalUsersSeller}
            icon={UserPlus}
            color="blue"
          />
          <StatCard
            title="ຖືກປິດກັ້ນ"
            value={report_admin_data?.users?.inactiveUsers || 0}
            change={changes.users?.inactiveUsers}
            icon={UserX}
            color="red"
          />

          {/* Products */}
          <StatCard
            title="ສິນຄ້າທັງໝົດ"
            value={report_admin_data?.products?.totalProducts || 0}
            change={changes.products?.totalProducts}
            icon={Package}
            color="teal"
          />
          <StatCard
            title="ສິນຄ້າໃກ້ໝົດ"
            value={report_admin_data?.products?.lowStockProducts || 0}
            icon={AlertCircle}
            color="red"
          />

          {/* Sellers */}
          <StatCard
            title="ຜ່ານການຢືນຢັນ (verify)"
            value={report_admin_data?.sellers?.activeSellers || 0}
            change={changes.sellers?.activeSellers}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="ລໍຖ້າຢືນຢັນ  (verify)"
            value={report_admin_data?.sellers?.pendingSellers || 0}
            change={changes.sellers?.pendingSellers}
            icon={Clock}
            color="orange"
          />
          <StatCard
            title="ຖືກປະຕິເສດ (verify)"
            value={report_admin_data?.sellers?.rejectedSellers || 0}
            change={changes.sellers?.rejectedSellers}
            icon={XCircle}
            color="red"
          />

          {/* Shipping */}
          <StatCard
            title="ກຳລັງຈັດສົ່ງ (shipping)"
            value={report_admin_data?.shipping?.shippingOrders || 0}
            change={changes.shipping?.shippingOrders}
            icon={Truck}
            color="blue"
          />
          <StatCard
            title="ລໍຖ້າຈັດສົ່ງ  (shipping)"
            value={report_admin_data?.shipping?.pendingShipping || 0}
            change={changes.shipping?.pendingShipping}
            icon={Clock}
            color="orange"
          />
          <StatCard
            title="ຈັດສົ່ງສຳເລັດ  (shipping)"
            value={report_admin_data?.shipping?.deliveredOrders || 0}
            change={changes.shipping?.deliveredOrders}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="ຖືກຍົກເລີກ (ຄຳສັ່ງຊື້ຈາກຜູ້ຂາຍ)"
            value={report_admin_data?.shipping?.returnedOrders || 0}
            change={changes.shipping?.returnedOrders}
            icon={RotateCcw}
            color="red"
          />
        </Grid>
      </VStack>
      {/* ===== CHARTS SECTION ===== */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
        {/* Sales Chart */}
        <Card
          bg={cardBg}
          shadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <CardHeader>
            <Heading fontFamily={"Noto Sans Lao, serif"} size="md">
              ພາບລວມຍອດຂາຍ
            </Heading>
            <Text fontSize="sm" color="gray.600">
              ແນວໂນ້ມຍອດຂາຍ ແລະ ຄຳສັ່ງຊື້ຕາມວັນ
            </Text>
          </CardHeader>
          <CardBody>
            <Box h="300px">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailySalesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3182CE" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#3182CE"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#718096" fontSize={12} />
                  <YAxis stroke="#718096" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#3182CE"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>

        {/* Category Revenue */}
        <Card
          bg={cardBg}
          shadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <CardHeader>
            <Heading fontFamily={"Noto Sans Lao, serif"} size="md">
              ລາຍຮັບຕາມປະເພດ
            </Heading>
            <Text fontSize="sm" color="gray.600">
              ການແຈກຢາຍຍອດຂາຍ
            </Text>
          </CardHeader>
          <CardBody>
            <Box h="250px">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryRevenue}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                    label={(entry) => entry.name}
                  >
                    {categoryRevenue.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            <VStack spacing={2} mt={4}>
              {categoryRevenue.map((item, index) => (
                <HStack key={index} justify="space-between" w="full">
                  <HStack>
                    <Box w={3} h={3} borderRadius="full" bg={item.color} />
                    <Text fontSize="sm">{item.name}</Text>
                  </HStack>
                  <Text fontSize="sm" fontWeight="medium">
                    {formatCurrency(item.value)}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </Grid>

      {/* ===== TOP PRODUCTS CHART ===== */}
      <Card bg={cardBg} shadow="sm" borderWidth="1px" borderColor={borderColor}>
        <CardHeader>
          <Heading fontFamily="Noto Sans Lao, serif" size="md">
            ສິນຄ້າຂາຍດີ 5 ອັນດັບ
          </Heading>
          <Text fontSize="sm" color="gray.600">
            ສິນຄ້າທີ່ມີຍອດຂາຍດີທີ່ສຸດໃນເດືອນນີ້
          </Text>
        </CardHeader>
        <CardBody>
          <Box h="300px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topProducts}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  stroke="#718096"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#718096" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="value" fill="#3182CE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardBody>
      </Card>
      <VStack>
        {/* ===== RECENT ORDERS & NOTIFICATIONS ===== */}
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
          {/* Recent Orders */}
          <Card
            bg={cardBg}
            shadow="sm"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <CardHeader>
              <Box>
                <Heading fontFamily="Noto Sans Lao, serif" size="md">
                  ປະຫວັດຄຳສັ່ງຊື້ລ່າສຸດ
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  10 ລາຍການຫຼ້າສຸດ
                </Text>
              </Box>
            </CardHeader>
            <CardBody>
              <Box overflowX="auto">
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th fontFamily="Noto Sans Lao, serif" fontSize="xs">
                        ລະຫັດ
                      </Th>
                      <Th fontFamily="Noto Sans Lao, serif" fontSize="xs">
                        ລູກຄ້າ
                      </Th>
                      <Th fontFamily="Noto Sans Lao, serif" fontSize="xs">
                        ສະຖານະ
                      </Th>
                      <Th fontFamily="Noto Sans Lao, serif" fontSize="xs">
                        ຍອດລວມ
                      </Th>
                      <Th fontFamily="Noto Sans Lao, serif" fontSize="xs">
                        ການຊຳລະ
                      </Th>
                      <Th fontFamily="Noto Sans Lao, serif" fontSize="xs">
                        ວັນທີ
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {recentOrders.map((order) => (
                      <Tr key={order._id} _hover={{ bg: "gray.50" }}>
                        <Td fontWeight="medium" fontSize="sm">
                          #{order?.orderId}
                        </Td>
                        <Td fontSize="sm">{order?.user_id?.username}</Td>
                        <Td>{getStatusBadge(order?.shipping_status)}</Td>
                        <Td fontSize="sm" fontWeight="medium">
                          {formatCurrency(order?.total)}
                        </Td>
                        <Td>{getPaymentBadge(order?.status)}</Td>
                        <Td fontSize="sm" color="gray.600">
                          {formatDate(order?.createdAt)}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </CardBody>
          </Card>

          {/* Notifications */}
          <VStack spacing={4}>
            <Card
              bg={cardBg}
              shadow="sm"
              borderWidth="1px"
              borderColor={borderColor}
              w="full"
            >
              <CardHeader>
                <HStack>
                  <Icon as={Bell} color="blue.500" />
                  <Heading fontFamily={"Noto Sans Lao, serif"} size="md">
                    ແຈ້ງເຕືອນລະບົບ
                  </Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack spacing={3} align="stretch">
                  {report_admin_data?.notifications?.abnormalOrders > 0 && (
                    <Alert status="error" size="sm" borderRadius="md">
                      <AlertIcon boxSize="4" />
                      <Box fontSize="sm">
                        <AlertTitle fontSize="sm">ຄຳສັ່ງຜິດປົກກະຕິ</AlertTitle>
                        <AlertDescription fontSize="xs">
                          {report_admin_data?.notifications?.abnormalOrders}{" "}
                          ຄຳສັ່ງຊື້
                        </AlertDescription>
                      </Box>
                    </Alert>
                  )}

                  {report_admin_data?.notifications?.sellerVerificationPending >
                    0 && (
                    <Alert status="warning" size="sm" borderRadius="md">
                      <AlertIcon boxSize="4" />
                      <Box fontSize="sm">
                        <AlertTitle fontSize="sm">
                          ລໍຖ້າອະນຸມັດຜູ້ຂາຍ
                        </AlertTitle>
                        <AlertDescription fontSize="xs">
                          {
                            report_admin_data?.notifications
                              ?.sellerVerificationPending
                          }{" "}
                          ລາຍການ
                        </AlertDescription>
                      </Box>
                    </Alert>
                  )}

                  {report_admin_data?.notifications?.lowStockAlerts > 0 && (
                    <Alert status="info" size="sm" borderRadius="md">
                      <AlertIcon boxSize="4" />
                      <Box fontSize="sm">
                        <AlertTitle fontSize="sm">ສິນຄ້າໃກ້ໝົດ</AlertTitle>
                        <AlertDescription fontSize="xs">
                          {report_admin_data?.notifications?.lowStockAlerts}{" "}
                          ລາຍການ
                        </AlertDescription>
                      </Box>
                    </Alert>
                  )}

                  {!report_admin_data?.notifications?.abnormalOrders &&
                    !report_admin_data?.notifications
                      ?.sellerVerificationPending &&
                    !report_admin_data?.notifications?.lowStockAlerts && (
                      <Text
                        fontSize="sm"
                        color="gray.500"
                        textAlign="center"
                        py={4}
                      >
                        ບໍ່ມີການແຈ້ງເຕືອນໃໝ່
                      </Text>
                    )}
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Grid>
      </VStack>
    </Container>
  );
};

export default DashboardAdmin;
