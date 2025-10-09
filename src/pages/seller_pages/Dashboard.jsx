import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Select,
  VStack,
  HStack,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Icon,
  Flex,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Skeleton,
  useBreakpointValue,
  SimpleGrid,
  Tooltip as ChakraTooltip,
} from "@chakra-ui/react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
} from "recharts";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  DollarSign,
  RotateCcw,
  Star,
  Package,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Award,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { dashbord_seller } from "../../hooks/reducer/finance_reducer/finance";

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const radius = useBreakpointValue({ base: 60, md: 80 });
  // Responsive values
  const containerMaxW = useBreakpointValue({ base: "full", xl: "8xl" });
  const bg = useColorModeValue("green.50", "green.900");
  const gridColumns = useBreakpointValue({
    base: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
  });
  const chartHeight = useBreakpointValue({
    base: "250px",
    md: "300px",
    lg: "350px",
  });
  const fontSize = useBreakpointValue({ base: "sm", md: "md" });

  // Color mode values
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const dispatch = useDispatch();
  const { dashbord_data, loading } = useSelector((state) => state.finance);
  // Time range configuration
  const timeRangeConfig = {
    today: { label: "ມື້ນີ້", period: "today" },
    "7d": { label: "7 ວັນລ່າສຸດ", period: "7d" },
    "30d": { label: "30 ວັນລ່າສຸດ", period: "30d" },
    month: { label: "ເດືອນນີ້", period: "month" },
    year: { label: "ປີນີ້", period: "year" },
  };

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null);
      setIsRefreshing(true);
      await dispatch(dashbord_seller({ period: timeRange }));
    } catch (err) {
      setError("ບໍ່ສາມາດໂຫລດຂໍ້ມູນໄດ້. ກະລຸນາລອງໃໝ່.");
      console.error("Dashboard fetch error:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch, timeRange]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Process sales trends data for charts
  const chartData = useMemo(() => {
    if (!dashbord_data?.salesTrends) return [];

    return dashbord_data.salesTrends.map((item) => ({
      date: new Date(item.date).toLocaleDateString("lo-LA", {
        month: "short",
        day: "numeric",
      }),
      sales: item.totalRevenue || 0,
      orders: item.totalOrders || 0,
      avgOrder: item.averageOrderValue || 0,
    }));
  }, [dashbord_data?.salesTrends]);

  // Process category data for pie chart
  const categoryData = useMemo(() => {
    if (!dashbord_data?.categoryPerformance) return [];

    const colors = [
      "#0084FF",
      "#00D4FF",
      "#5E72E4",
      "#11CDEF",
      "#2DCE89",
      "#FDB462",
      "#B3DE69",
    ];
    const total = dashbord_data.categoryPerformance.reduce(
      (sum, item) => sum + item.totalRevenue,
      0
    );

    return dashbord_data.categoryPerformance.slice(0, 7).map((item, index) => ({
      name: item.name,
      value: item.totalRevenue,
      percentage:
        total > 0 ? ((item.totalRevenue / total) * 100).toFixed(1) : 0,
      color: colors[index % colors.length],
      productCount: item.productCount,
    }));
  }, [dashbord_data?.categoryPerformance]);

  // Calculate KPI data
  const kpiData = useMemo(() => {
    if (!dashbord_data) return {};

    return {
      totalSales: dashbord_data.totalSales || 0,
      totalOrders: dashbord_data.totalOrders || 0,
      totalProfit: dashbord_data.totalProfit || 0,
      averageOrderValue: dashbord_data.averageOrderValue || 0,
      topProduct: dashbord_data.topProduct,
      lowStockCount: dashbord_data.lowStockProducts || 0,
      totalProducts: dashbord_data.totalProducts || 0,
    };
  }, [dashbord_data]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("lo-LA").format(amount || 0);
  };

  // Get status color for orders
  const getStatusColor = (status) => {
    const statusMap = {
      completed: "green",
      pending_payout: "blue",
      withdrawn: "purple",
      pending: "orange",
      cancelled: "red",
      default: "gray",
    };
    return statusMap[status] || statusMap.default;
  };

  // Get status label in Lao
  const getStatusLabel = (status) => {
    const statusLabels = {
      completed: "ສຳເລັດແລ້ວ",
      pending_payout: "ລໍຖ້າຈ່າຍເງິນ",
      withdrawn: "ຖອນແລ້ວ",
      pending: "ລໍຖ້າ",
      cancelled: "ຍົກເລີກ",
    };
    return statusLabels[status] || status;
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <VStack spacing={6} align="stretch">
      <Skeleton height="60px" />
      <SimpleGrid columns={gridColumns} spacing={4}>
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} height="120px" />
          ))}
      </SimpleGrid>
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
        <Skeleton height="350px" />
        <Skeleton height="350px" />
      </Grid>
    </VStack>
  );

  if (loading && !dashbord_data) {
    return (
      <Box bg={bgColor} minH="100vh" py={8}>
        <Container maxW={containerMaxW}>
          <LoadingSkeleton />
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" py={{ base: 4, md: 8 }}>
      <Container maxW={containerMaxW} px={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          {/* Header */}
          <Flex
            direction={{ base: "column", sm: "row" }}
            align={{ base: "stretch", sm: "center" }}
            justify="space-between"
            gap={4}
          >
            <Heading
              size={{ base: "lg", md: "xl" }}
              color={textColor}
              fontFamily="Noto Sans Lao, serif"
            >
              📊 ແຜງຄວບຄຸມຜູ້ຂາຍ
            </Heading>

            <HStack spacing={2}>
              <ChakraTooltip label="ຣີເຟຣດຂໍ້ມູນ">
                <Icon
                  as={RefreshCw}
                  cursor="pointer"
                  onClick={fetchDashboardData}
                  color={textColor}
                  _hover={{
                    transform: "rotate(180deg)",
                    transition: "transform 0.3s",
                  }}
                  className={isRefreshing ? "animate-spin" : ""}
                />
              </ChakraTooltip>

              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                width={{ base: "full", sm: "200px" }}
                bg={cardBg}
                borderColor={borderColor}
                size={{ base: "sm", md: "md" }}
              >
                {Object.entries(timeRangeConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </Select>
            </HStack>
          </Flex>

          {/* Error Alert */}
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <AlertTitle fontSize={fontSize}>ຂໍ້ຜິດພາດ!</AlertTitle>
              <AlertDescription fontSize={fontSize}>{error}</AlertDescription>
            </Alert>
          )}

          {/* KPI Cards */}
          <SimpleGrid columns={gridColumns} spacing={{ base: 3, md: 4 }}>
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody p={{ base: 4, md: 6 }}>
                <Stat>
                  <Flex align="center">
                    <Box p={2} bg="blue.500" borderRadius="lg" mr={3}>
                      <Icon
                        as={DollarSign}
                        color="white"
                        boxSize={{ base: 4, md: 5 }}
                      />
                    </Box>
                    <Box flex="1">
                      <StatLabel
                        fontSize={{ base: "xs", md: "sm" }}
                        fontFamily="Noto Sans Lao, serif"
                      >
                        ຍອດຂາຍລວມ
                      </StatLabel>
                      <StatNumber fontSize={{ base: "md", md: "lg" }}>
                        {formatCurrency(kpiData.totalSales)} LAK
                      </StatNumber>
                      <StatHelpText mb={0} fontSize={{ base: "xs", md: "sm" }}>
                        {/* <StatArrow type="increase" /> */}
                      
                      </StatHelpText>
                    </Box>
                  </Flex>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody p={{ base: 4, md: 6 }}>
                <Stat>
                  <Flex align="center">
                    <Box p={2} bg="green.500" borderRadius="lg" mr={3}>
                      <Icon
                        as={ShoppingCart}
                        color="white"
                        boxSize={{ base: 4, md: 5 }}
                      />
                    </Box>
                    <Box flex="1">
                      <StatLabel
                        fontSize={{ base: "xs", md: "sm" }}
                        fontFamily="Noto Sans Lao, serif"
                      >
                        ຈຳນວນຄຳສັ່ງຊື້
                      </StatLabel>
                      <StatNumber fontSize={{ base: "md", md: "lg" }}>
                        {formatCurrency(kpiData.totalOrders)}
                      </StatNumber>
                      <StatHelpText mb={0} fontSize={{ base: "xs", md: "sm" }}>
                        {/* <StatArrow type="increase" /> */}
                      
                      </StatHelpText>
                    </Box>
                  </Flex>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody p={{ base: 4, md: 6 }}>
                <Stat>
                  <Flex align="center">
                    <Box p={2} bg="teal.500" borderRadius="lg" mr={3}>
                      <Icon
                        as={TrendingUp}
                        color="white"
                        boxSize={{ base: 4, md: 5 }}
                      />
                    </Box>
                    <Box flex="1">
                      <StatLabel
                        fontSize={{ base: "xs", md: "sm" }}
                        fontFamily="Noto Sans Lao, serif"
                      >
                        ຍອດລາຍຮັບສຸດທິ
                      </StatLabel>
                      <StatNumber fontSize={{ base: "md", md: "lg" }}>
                        {formatCurrency(kpiData.totalProfit)} LAK
                      </StatNumber>
                      <StatHelpText mb={0} fontSize={{ base: "xs", md: "sm" }}>
                        {/* <StatArrow type="increase" /> */}
                       
                      </StatHelpText>
                    </Box>
                  </Flex>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody p={{ base: 4, md: 6 }}>
                <Stat>
                  <Flex align="center">
                    <Box p={2} bg="purple.500" borderRadius="lg" mr={3}>
                      <Icon
                        as={Award}
                        color="white"
                        boxSize={{ base: 4, md: 5 }}
                      />
                    </Box>
                    <Box flex="1">
                      <StatLabel
                        fontSize={{ base: "xs", md: "sm" }}
                        fontFamily="Noto Sans Lao, serif"
                      >
                        ມູນຄ່າສະເລ່ຍຕໍ່ອໍເດີ
                      </StatLabel>
                      <StatNumber fontSize={{ base: "md", md: "lg" }}>
                        {formatCurrency(kpiData.averageOrderValue)} LAK
                      </StatNumber>
                      <StatHelpText mb={0} fontSize={{ base: "xs", md: "sm" }}>
                        {/* <StatArrow type="increase" /> */}
                       
                      </StatHelpText>
                    </Box>
                  </Flex>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Top Product Card */}
          {kpiData.topProduct && (
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardBody p={{ base: 4, md: 6 }}>
                <Flex align="center">
                  <Box p={2} bg="yellow.500" borderRadius="lg" mr={3}>
                    <Icon
                      as={Star}
                      color="white"
                      boxSize={{ base: 4, md: 5 }}
                    />
                  </Box>
                  <Box flex="1">
                    <Text
                      fontSize={{ base: "sm", md: "md" }}
                      fontFamily="Noto Sans Lao, serif"
                      color="gray.600"
                    >
                      ສິນຄ້າຂາຍດີທີ່ສຸດ
                    </Text>
                    <Text
                      fontSize={{ base: "md", md: "lg" }}
                      fontWeight="bold"
                      noOfLines={2}
                    >
                      {kpiData.topProduct.name}
                    </Text>
                    <HStack mt={2}>
                      <Badge
                        colorScheme="green"
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        ຂາຍໄດ້ {formatCurrency(kpiData.topProduct.sold_count)}{" "}
                        ຊິ້ນ
                      </Badge>
                      <Badge
                        colorScheme="blue"
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        {formatCurrency(kpiData.topProduct.price)} LAK
                      </Badge>
                    </HStack>
                  </Box>
                </Flex>
              </CardBody>
            </Card>
          )}

          {/* Charts Section */}
          <Grid
            templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
            gap={{ base: 4, md: 6 }}
          >
            {/* Sales Trend Chart */}
            <GridItem>
              <Card bg={cardBg} shadow="lg" borderRadius="xl">
                <CardHeader pb={2}>
                  <Heading
                    size={{ base: "sm", md: "md" }}
                    color={textColor}
                    fontFamily="Noto Sans Lao, serif"
                  >
                    📈 ແນວໂນ້ມຍອດຂາຍ
                  </Heading>
                </CardHeader>
                <CardBody pt={0}>
                  <Box h={chartHeight}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={borderColor}
                        />
                        <XAxis
                          dataKey="date"
                          fontSize={12}
                          stroke={textColor}
                        />
                        <YAxis
                          fontSize={12}
                          stroke={textColor}
                          tickFormatter={(value) =>
                            `${(value / 1000).toFixed(0)}K`
                          }
                        />
                        <Tooltip
                          formatter={(value, name) => [
                            `${formatCurrency(value)} LAK`,
                            name === "sales" ? "ຍອດຂາຍ" : "ຄຳສັ່ງຊື້",
                          ]}
                          labelStyle={{ color: textColor }}
                          contentStyle={{
                            backgroundColor: cardBg,
                            border: `1px solid ${borderColor}`,
                            borderRadius: "8px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="sales"
                          stroke="#0084FF"
                          fill="#0084FF"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </CardBody>
              </Card>
            </GridItem>

            {/* Category Distribution */}
            <GridItem>
              <Card bg={cardBg} shadow="lg" borderRadius="xl">
                <CardHeader pb={2}>
                  <Heading
                    size={{ base: "sm", md: "md" }}
                    color={textColor}
                    fontFamily="Noto Sans Lao, serif"
                  >
                    🏷️ ໝວດໝູ່ສິນຄ້າ
                  </Heading>
                </CardHeader>
                <CardBody pt={0}>
                  <Box h={chartHeight}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={radius}
                          dataKey="value"
                          label={({ name, percentage }) =>
                            `${name} ${percentage}%`
                          }
                          labelLine={false}
                        >
                          {categoryData?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [
                            `${formatCurrency(value)} LAK`,
                            "ຍອດຂາຍ",
                          ]}
                          contentStyle={{
                            backgroundColor: cardBg,
                            border: `1px solid ${borderColor}`,
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          {/* Orders Trend Chart */}
          <Card bg={cardBg} shadow="lg" borderRadius="xl">
            <CardHeader pb={2}>
              <Heading
                size={{ base: "sm", md: "md" }}
                color={textColor}
                fontFamily="Noto Sans Lao, serif"
              >
                📦 ແນວໂນ້ມຄຳສັ່ງຊື້ & ມູນຄ່າສະເລ່ຍ
              </Heading>
            </CardHeader>
            <CardBody pt={0}>
              <Box h={chartHeight}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
                    <XAxis dataKey="date" fontSize={12} stroke={textColor} />
                    <YAxis fontSize={12} stroke={textColor} />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "avgOrder"
                          ? `${formatCurrency(value)} LAK`
                          : value.toString(),
                        name === "orders" ? "ຄຳສັ່ງຊື້" : "ມູນຄ່າສະເລ່ຍ",
                      ]}
                      contentStyle={{
                        backgroundColor: cardBg,
                        border: `1px solid ${borderColor}`,
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="orders"
                      fill="#00D4FF"
                      name="ຄຳສັ່ງຊື້"
                      radius={[2, 2, 0, 0]}
                    />
                    <Bar
                      dataKey="avgOrder"
                      fill="#5E72E4"
                      name="ມູນຄ່າສະເລ່ຍ"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>

          {/* Tables Section */}
          <Grid
            templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
            gap={{ base: 4, md: 6 }}
          >
            {/* Recent Orders */}
            <GridItem>
              <Card bg={cardBg} shadow="lg" borderRadius="xl">
                <CardHeader pb={2}>
                  <Heading
                    fontFamily="Noto Sans Lao, serif"
                    size={{ base: "sm", md: "md" }}
                    color={textColor}
                  >
                    🛍️ ຄຳສັ່ງຊື້ລ່າສຸດ
                  </Heading>
                </CardHeader>
                <CardBody pt={0}>
                  <TableContainer>
                    <Table size={{ base: "sm", md: "md" }} variant="simple">
                      <Thead>
                        <Tr>
                          <Th
                            fontFamily="Noto Sans Lao, serif"
                            fontSize={{ base: "xs", md: "sm" }}
                            borderColor={borderColor}
                          >
                            ລະຫັດອໍເດີ້
                          </Th>
                          <Th
                            fontFamily="Noto Sans Lao, serif"
                            fontSize={{ base: "xs", md: "sm" }}
                            borderColor={borderColor}
                          >
                            ຍອດລວມ
                          </Th>
                          <Th
                            fontFamily="Noto Sans Lao, serif"
                            fontSize={{ base: "xs", md: "sm" }}
                            borderColor={borderColor}
                          >
                            ສະຖານະ
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {dashbord_data?.latestOrders?.map((order) => (
                          <Tr key={order._id}>
                            <Td
                              fontWeight="bold"
                              fontSize={{ base: "xs", md: "sm" }}
                              borderColor={borderColor}
                            >
                              #{order?.orderId}
                            </Td>
                            <Td
                              color="green.500"
                              fontWeight="bold"
                              fontSize={{ base: "xs", md: "sm" }}
                              borderColor={borderColor}
                            >
                              {formatCurrency(order?.total)} LAK
                            </Td>
                            <Td borderColor={borderColor}>
                              <Badge
                                colorScheme={getStatusColor(order.status)}
                                fontSize={{ base: "2xs", md: "xs" }}
                              >
                                {getStatusLabel(order?.status)}
                              </Badge>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CardBody>
              </Card>
            </GridItem>

            {/* Top Products */}
            <GridItem>
              <Card bg={cardBg} shadow="lg" borderRadius="xl">
                <CardHeader pb={2}>
                  <Heading
                    fontFamily="Noto Sans Lao, serif"
                    size={{ base: "sm", md: "md" }}
                    color={textColor}
                  >
                    🏆 ສິນຄ້າຂາຍດີທີ່ສຸດ TOP 5
                  </Heading>
                </CardHeader>
                <CardBody pt={0}>
                  <TableContainer>
                    <Table size={{ base: "sm", md: "md" }} variant="simple">
                      <Thead>
                        <Tr>
                          <Th
                            fontFamily="Noto Sans Lao, serif"
                            fontSize={{ base: "xs", md: "sm" }}
                            borderColor={borderColor}
                          >
                            ສິນຄ້າ
                          </Th>
                          <Th
                            fontFamily="Noto Sans Lao, serif"
                            fontSize={{ base: "xs", md: "sm" }}
                            isNumeric
                            borderColor={borderColor}
                          >
                            ຈຳນວນຂາຍ
                          </Th>
                          <Th
                            fontFamily="Noto Sans Lao, serif"
                            fontSize={{ base: "xs", md: "sm" }}
                            isNumeric
                            borderColor={borderColor}
                          >
                            ລາຄາ
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {dashbord_data?.topFiveProducts?.map(
                          (product, index) => (
                            <Tr key={index}>
                              <Td
                                fontWeight="medium"
                                fontSize={{ base: "xs", md: "sm" }}
                                borderColor={borderColor}
                                maxW={{ base: "120px", md: "200px" }}
                              >
                                <Text noOfLines={2}>{product?.name}</Text>
                              </Td>
                              <Td
                                isNumeric
                                fontSize={{ base: "xs", md: "sm" }}
                                borderColor={borderColor}
                              >
                                {formatCurrency(product?.sold_count)}
                              </Td>
                              <Td
                                isNumeric
                                color="green.500"
                                fontWeight="bold"
                                fontSize={{ base: "xs", md: "sm" }}
                                borderColor={borderColor}
                              >
                                {formatCurrency(product?.price)} LAK
                              </Td>
                            </Tr>
                          )
                        )}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          {/* Stock Alert */}
          {kpiData.lowStockCount > 0 && (
            <Alert
              status="warning"
              borderRadius="xl"
              bg="orange.50"
              borderLeft="4px solid"
              borderColor="orange.500"
              _dark={{
                bg: "orange.900",
                borderColor: "orange.400",
              }}
            >
              <AlertIcon as={AlertTriangle} color="orange.500" />
              <Box flex="1">
                <AlertTitle
                  fontSize={{ base: "sm", md: "md" }}
                  fontFamily="Noto Sans Lao, serif"
                >
                  ⚠️ ແຈ້ງເຕືອນສະຕັອກສິນຄ້າ
                </AlertTitle>
                <AlertDescription fontSize={{ base: "xs", md: "sm" }}>
                  ມີສິນຄ້າ {kpiData.lowStockCount} ລາຍການທີ່ກຳລັງຈະໝົດສະຕັອກ
                </AlertDescription>
              </Box>
            </Alert>
          )}

          {/* Summary Stats */}
          <Card bg={cardBg} shadow="lg" borderRadius="xl">
            <CardHeader>
              <Heading
                size={{ base: "sm", md: "md" }}
                color={textColor}
                fontFamily="Noto Sans Lao, serif"
              >
                📊 ສະຫຼຸບພາບລວມ
              </Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid
                columns={{ base: 2, md: 4 }}
                spacing={{ base: 4, md: 6 }}
              >
                <VStack spacing={2} align="center">
                  <Icon
                    as={Package}
                    color="blue.500"
                    boxSize={{ base: 6, md: 8 }}
                  />
                  <Text
                    fontSize={{ base: "lg", md: "2xl" }}
                    fontWeight="bold"
                    color={textColor}
                  >
                    {formatCurrency(kpiData.totalProducts)}
                  </Text>
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    color="gray.500"
                    textAlign="center"
                    fontFamily="Noto Sans Lao, serif"
                  >
                    ສິນຄ້າທັງໝົດ
                  </Text>
                </VStack>

                <VStack spacing={2} align="center">
                  <Icon
                    as={AlertTriangle}
                    color="orange.500"
                    boxSize={{ base: 6, md: 8 }}
                  />
                  <Text
                    fontSize={{ base: "lg", md: "2xl" }}
                    fontWeight="bold"
                    color={textColor}
                  >
                    {kpiData.lowStockCount}
                  </Text>
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    color="gray.500"
                    textAlign="center"
                    fontFamily="Noto Sans Lao, serif"
                  >
                    ສະຕັອກຕ່ຳ
                  </Text>
                </VStack>

                <VStack spacing={2} align="center">
                  <Icon
                    as={TrendingUp}
                    color="green.500"
                    boxSize={{ base: 6, md: 8 }}
                  />
                  <Text
                    fontSize={{ base: "lg", md: "2xl" }}
                    fontWeight="bold"
                    color={textColor}
                  >
                    {categoryData?.length || 0}
                  </Text>
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    color="gray.500"
                    textAlign="center"
                    fontFamily="Noto Sans Lao, serif"
                  >
                    ປະເພດສິນຄ້າ
                  </Text>
                </VStack>

                <VStack spacing={2} align="center">
                  <Icon
                    as={Calendar}
                    color="purple.500"
                    boxSize={{ base: 6, md: 8 }}
                  />
                  <Text
                    fontSize={{ base: "lg", md: "2xl" }}
                    fontWeight="bold"
                    color={textColor}
                  >
                    {timeRangeConfig[timeRange]?.label}
                  </Text>
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    color="gray.500"
                    textAlign="center"
                    fontFamily="Noto Sans Lao, serif"
                  >
                    ໄລຍະເວລາ
                  </Text>
                </VStack>
              </SimpleGrid>

              {/* Performance Indicators */}
              {/* <Box mt={6}>
                <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" mb={4} fontFamily="Noto Sans Lao, serif">
                  ຕົວຊີ້ວັດປະສິດທິພາບ
                </Text>
                
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Flex justify="space-between" mb={1}>
                      <Text fontSize={{ base: "xs", md: "sm" }} fontFamily="Noto Sans Lao, serif">
                        ອັດຕາການປ່ຽນແປງຍອດຂາຍ
                      </Text>
                      <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="green.500">
                        +12.5%
                      </Text>
                    </Flex>
                    <Progress value={12.5} colorScheme="green" size="sm" borderRadius="full" />
                  </Box>

                  <Box>
                    <Flex justify="space-between" mb={1}>
                      <Text fontSize={{ base: "xs", md: "sm" }} fontFamily="Noto Sans Lao, serif">
                        ອັດຕາການເພີ່ມຂຶ້ນຂອງຄຳສັ່ງຊື້
                      </Text>
                      <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="blue.500">
                        +8.2%
                      </Text>
                    </Flex>
                    <Progress value={8.2} colorScheme="blue" size="sm" borderRadius="full" />
                  </Box>

                  <Box>
                    <Flex justify="space-between" mb={1}>
                      <Text fontSize={{ base: "xs", md: "sm" }} fontFamily="Noto Sans Lao, serif">
                        ອັດຕາກຳໄລ
                      </Text>
                      <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="purple.500">
                        +9.7%
                      </Text>
                    </Flex>
                    <Progress value={9.7} colorScheme="purple" size="sm" borderRadius="full" />
                  </Box>
                </VStack>
              </Box> */}
            </CardBody>
          </Card>

          {/* Category Performance Details */}
          {categoryData?.length > 0 && (
            <Card bg={cardBg} shadow="lg" borderRadius="xl">
              <CardHeader>
                <Heading
                  size={{ base: "sm", md: "md" }}
                  color={textColor}
                  fontFamily="Noto Sans Lao, serif"
                >
                  📈 ປະສິດທິພາບຕາມປະເພດສິນຄ້າ
                </Heading>
              </CardHeader>
              <CardBody>
                <TableContainer>
                  <Table size={{ base: "sm", md: "md" }} variant="simple">
                    <Thead>
                      <Tr>
                        <Th
                          fontFamily="Noto Sans Lao, serif"
                          fontSize={{ base: "xs", md: "sm" }}
                          borderColor={borderColor}
                        >
                          ປະເພດ
                        </Th>
                        <Th
                          fontFamily="Noto Sans Lao, serif"
                          fontSize={{ base: "xs", md: "sm" }}
                          isNumeric
                          borderColor={borderColor}
                        >
                          ຈຳນວນສິນຄ້າ
                        </Th>
                        <Th
                          fontFamily="Noto Sans Lao, serif"
                          fontSize={{ base: "xs", md: "sm" }}
                          isNumeric
                          borderColor={borderColor}
                        >
                          ຍອດຂາຍ
                        </Th>
                        <Th
                          fontFamily="Noto Sans Lao, serif"
                          fontSize={{ base: "xs", md: "sm" }}
                          isNumeric
                          borderColor={borderColor}
                        >
                          ສ່ວນແບ່ງ
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {categoryData.map((category, index) => (
                        <Tr key={index}>
                          <Td
                            borderColor={borderColor}
                            fontSize={{ base: "xs", md: "sm" }}
                          >
                            <HStack>
                              <Box
                                w={3}
                                h={3}
                                borderRadius="full"
                                bg={category.color}
                              />
                              <Text fontWeight="medium">{category.name}</Text>
                            </HStack>
                          </Td>
                          <Td
                            isNumeric
                            borderColor={borderColor}
                            fontSize={{ base: "xs", md: "sm" }}
                          >
                            {category.productCount}
                          </Td>
                          <Td
                            isNumeric
                            borderColor={borderColor}
                            fontSize={{ base: "xs", md: "sm" }}
                            fontWeight="bold"
                            color="green.500"
                          >
                            {formatCurrency(category.value)} LAK
                          </Td>
                          <Td
                            isNumeric
                            borderColor={borderColor}
                            fontSize={{ base: "xs", md: "sm" }}
                          >
                            <Badge colorScheme="blue" variant="subtle">
                              {category.percentage}%
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>
          )}

          {/* Quick Actions */}
          <Card bg={cardBg} shadow="lg" borderRadius="xl">
            <CardHeader>
              <Heading
                size={{ base: "sm", md: "md" }}
                color={textColor}
                fontFamily="Noto Sans Lao, serif"
              >
                ⚡ ການດຳເນີນການດ່ວນ
              </Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                <VStack
                  p={4}
                  borderRadius="lg"
                  bg={bg}
                  cursor="pointer"
                  _hover={{
                    transform: "translateY(-2px)",
                    transition: "all 0.2s",
                  }}
                  spacing={2}
                >
                  <Icon as={Package} color="blue.500" boxSize={6} />
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    textAlign="center"
                    fontWeight="medium"
                    fontFamily="Noto Sans Lao, serif"
                  >
                    ເພີ່ມສິນຄ້າໃໝ່
                  </Text>
                </VStack>

                <VStack
                  p={4}
                  borderRadius="lg"
                  bg={bg}
                  cursor="pointer"
                  _hover={{
                    transform: "translateY(-2px)",
                    transition: "all 0.2s",
                  }}
                  spacing={2}
                >
                  <Icon as={TrendingUp} color="green.500" boxSize={6} />
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    textAlign="center"
                    fontWeight="medium"
                    fontFamily="Noto Sans Lao, serif"
                  >
                    ວິເຄາະຍອດຂາຍ
                  </Text>
                </VStack>

                <VStack
                  p={4}
                  borderRadius="lg"
                  bg={bg}
                  cursor="pointer"
                  _hover={{
                    transform: "translateY(-2px)",
                    transition: "all 0.2s",
                  }}
                  spacing={2}
                >
                  <Icon as={Users} color="purple.500" boxSize={6} />
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    textAlign="center"
                    fontWeight="medium"
                    fontFamily="Noto Sans Lao, serif"
                  >
                    ຈັດການລູກຄ້າ
                  </Text>
                </VStack>

                <VStack
                  p={4}
                  borderRadius="lg"
                  bg={bg}
                  cursor="pointer"
                  _hover={{
                    transform: "translateY(-2px)",
                    transition: "all 0.2s",
                  }}
                  spacing={2}
                >
                  <Icon as={AlertTriangle} color="orange.500" boxSize={6} />
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    textAlign="center"
                    fontWeight="medium"
                    fontFamily="Noto Sans Lao, serif"
                  >
                    ແຈ້ງເຕືອນສະຕັອກ
                  </Text>
                </VStack>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Footer Info */}
          <Box textAlign="center" py={4}>
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color="gray.500"
              fontFamily="Noto Sans Lao, serif"
            >
              ອັບເດດລ່າສຸດ: {new Date().toLocaleString("lo-LA")}
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Dashboard;
