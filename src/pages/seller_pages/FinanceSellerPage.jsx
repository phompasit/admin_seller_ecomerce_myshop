import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Flex,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Button,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Input,
  Select,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  VStack,
  HStack,
  Container,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  useToast,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { Download, Search, Edit, Send } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAnalytics,
  getFinanceSummary,
  getTransactions,
  withdraw,
  withdraw_requests,
} from "../../hooks/reducer/finance_reducer/finance";
import SalesBarChart from "./SalesBarChart";
import { get_user } from "../../hooks/reducer/auth_reducer";
import { RepeatIcon } from "@chakra-ui/icons";
// Constants
const TIME_FILTER_OPTIONS = [
  { value: "today", label: "ມື້ນີ້" },
  { value: "7d", label: "7 ວັນທີ່ຜ່ານມາ" },
  { value: "30d", label: "30 ວັນທີ່ຜ່ານມາ" },
  { value: "month", label: "ເດືອນນີ້" },
  { value: "year", label: "ປີນີ້" },
];

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "ທຸກສະຖານະ" },
  { value: "success", label: "ຖອນສຳເລັດ" },
  { value: "pending", label: "ລໍຖ້າເນິນການ" },
  { value: "rejected", label: "ປະຕິເສດ ກະລຸນາຕິດຕໍ່ຝ່າຍສະໜັບສະໜູນ" },
];

const TRANSACTION_TYPES = {
  pending: "ລໍຖ້າດຳເນີນການ",
  success: "ຖອນສຳເລັດ",
  rejected: "ປະຕິເສດ ກະລຸນາຕິດຕໍ່ຝ່າຍສະໜັບສະໜູນ",
};

const STATUS_COLORS = {
  success: "green",
  pending: "orange",
  rejected: "red",
};

const FinanceSellerPage = () => {
  // State management
  const [timeFilter, setTimeFilter] = useState("30d");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawNote, setWithdrawNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hooks
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const dispatch = useDispatch();

  // Redux state
  const { financeSummary, analytics, isLoading: reduxLoading } = useSelector(
    (state) => state.finance
  );
  const { sellerInfo_data } = useSelector((state) => state.auth);
  const { get_withdraw_requests } = useSelector((state) => state.finance);
  // Theme colors
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Mock bank account data (should come from API/Redux in real app)
  const bankAccount = useMemo(
    () => ({
      bankName: sellerInfo_data?.bank_name,
      accountNumber: sellerInfo_data?.bank_account_number,
      accountName: sellerInfo_data?.bank_account_name,
    }),
    [sellerInfo_data]
  );
  // Fetch data with proper error handling
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        dispatch(getFinanceSummary()),
        dispatch(getTransactions()), ///statusFilter
        dispatch(getAnalytics(timeFilter)),
        dispatch(get_user()),
        dispatch(withdraw_requests()),
      ]);
    } catch (error) {
      console.error("Error fetching finance data:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, timeFilter, toast]);

  // Effect for initial data fetch and filter changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Utility functions
  const formatCurrency = useCallback((amount) => {
    if (typeof amount !== "number" || isNaN(amount)) return "฿0";

    return new Intl.NumberFormat("la-LA", {
      style: "currency",
      currency: "LAK",
      minimumFractionDigits: 0,
    }).format(amount);
  }, []);

  // const getStatusColor = useCallback((status) => {
  //   return STATUS_COLORS[status] || STATUS_COLORS.default;
  // }, []);

  const validateWithdrawAmount = useCallback(
    (amount) => {
      const numAmount = parseFloat(amount);
      if (!amount || numAmount <= 0) {
        return "ກະລຸນາລະບຸຈຳນວນເງິນທີ່ຕ້ອງການຖອນ";
      }
      if (numAmount > (financeSummary?.totalBalance.balance || 0)) {
        return "ຈຳນວນທີ່ຕ້ອງການຖອນເງິນເກີນຈຳນວນທີ່ມີຢູ່";
      }
      return null;
    },
    [financeSummary?.totalBalance?.balance]
  );

  // Event handlers
  const handleTimeFilterChange = useCallback((e) => {
    setTimeFilter(e.target.value);
  }, []);

  const handleStatusFilterChange = useCallback((e) => {
    setStatusFilter(e.target.value);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleWithdrawAmountChange = useCallback((e) => {
    setWithdrawAmount(e.target.value);
  }, []);

  const handleWithdrawNoteChange = useCallback((e) => {
    setWithdrawNote(e.target.value);
  }, []);

  const handleWithdraw = useCallback(async () => {
    const validationError = validateWithdrawAmount(withdrawAmount);
    if (validationError) {
      toast({
        title: "ເກີດຂໍ້ຜິພາດ",
        description: validationError,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      // In real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch(
        withdraw({
          amount: withdrawAmount,
          note: withdrawNote,
        })
      )
        .then((res) => {
          toast({
            title: "ສົ່ງຄຳຂໍຖອນສຳເລັດ",
            description: res.message || "ສົ່ງຄຳຂໍ້ສຳເລັດ",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          dispatch(withdraw_requests());
        })
        .catch((error) => {
          toast({
            title: "ເກີດຂໍ້ຜິດພາດ",
            description: error.message || "ບໍ່ສາມາດຖອນໄດ້ ກະລຸນາລອງໃໝ່",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });

      setWithdrawAmount("");
      setWithdrawNote("");
      onClose();

      // Refresh data after successful withdrawal request
      await fetchData();
    } catch (error) {
      toast({
        title: "ເກີດຂໍ້ຜິພາດ",
        description: error.message || "ບໍ່ສາມາດຖອນເງິນໄດ້ ກະລຸນາລອງໃໝ່",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    withdrawAmount,
    validateWithdrawAmount,
    toast,
    onClose,
    fetchData,
    dispatch,
    withdrawNote,
  ]);

  // Filtered transactions with memoization
  const filteredTransactions = useMemo(() => {
    if (!get_withdraw_requests?.data?.requests) return [];

    return get_withdraw_requests?.data?.requests.filter((transaction) => {
      const matchesSearch =
        transaction.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.status?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || transaction.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [get_withdraw_requests?.data?.requests, searchTerm, statusFilter]);

  // Chart data with fallback
  const chartData = analytics?.chartData || [];
  // Loading state
  if (isLoading || reduxLoading) {
    return (
      <Center h="200px">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return (
    <Box p={4} minH="100vh">
      <Container maxW="7xl">
        {/* Header */}
        <Flex
          justify="space-between"
          align="center"
          mb={6}
          flexWrap="wrap"
          gap={4}
        >
          <Heading
            fontFamily={"Noto Sans Lao, serif"}
            size="xl"
            color="blue.600"
          >
            ການເງິນຂອງທ່ານ
          </Heading>
        </Flex>

        {/* Alert */}
        {financeSummary?.totalBalance?.balance > 0 && (
          <Alert
            status="info"
            borderRadius="md"
            mb={6}
            bg="blue.50"
            borderColor="blue.200"
          >
            <AlertIcon color="blue.500" />
            <Box>
              <AlertTitle color="blue.800">
                ແຈ້ງເຕືອນ! ຫຼັງຈາກສົ່ງຄຳສັ່ງຖອນດຳເນີນການພາຍໃນ (1-2ວັນທຳການ){" "}
              </AlertTitle>
              <AlertDescription color="blue.700">
                ທ່ານມີເງິນລໍຖ້າຖອນ{" "}
                {formatCurrency(financeSummary?.totalBalance?.balance)}
              </AlertDescription>
            </Box>
          </Alert>
        )}
        <Box p={4} textAlign="center">
          <Button
            onClick={fetchData}
            leftIcon={<RepeatIcon />}
            colorScheme="teal"
            variant="solid"
            size="md"
            borderRadius="xl"
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(0.95)" }}
          >
            Refresh
          </Button>
        </Box>
        {/* Summary Cards */}
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={6}
          mb={8}
        >
          <Card bg={cardBg} borderColor={borderColor} borderWidth={1}>
            <CardBody>
              <Stat>
                <StatLabel color="gray.500">ຍອດລວມ</StatLabel>
                <StatNumber color="blue.600">
                  {formatCurrency(financeSummary?.totalSales || 0)}
                </StatNumber>
                <StatHelpText>
                  <StatArrow
                    type={financeSummary?.isPositive ? "increase" : "decrease"}
                  />
                  {financeSummary?.growthRate || 0}% ຈາກເດືອນທີ່ແລ້ວ
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor} borderWidth={1}>
            <CardBody>
              <Stat>
                <StatLabel color="gray.500">ລາຍໄດ້ສຸດທຶ</StatLabel>
                <StatNumber color="green.600">
                  {formatCurrency(financeSummary?.netEarnings || 0)}
                </StatNumber>
                <StatHelpText>ຫຼັງຫັກຄ່າຄອມມິຊັ່ນ</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor} borderWidth={1}>
            <CardBody>
              <Stat>
                <StatLabel color="gray.500">ຈຳນວນອໍເດີ້</StatLabel>
                <StatNumber color="purple.600">
                  {(financeSummary?.totalOrders || 0).toLocaleString()}
                </StatNumber>
                <StatHelpText>ອໍເດີທັງໝົດ</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor} borderWidth={1}>
            <CardBody>
              <Flex justify="space-between" align="center">
                <Stat flex="1">
                  <StatLabel color="gray.500">ຍອດທີ່ລໍຖ້າຖອນ</StatLabel>
                  <StatNumber color="orange.600">
                    {formatCurrency(financeSummary?.totalBalance?.balance || 0)}
                  </StatNumber>
                </Stat>
              </Flex>
              <Button
                colorScheme="green"
                leftIcon={<Download size={16} />}
                onClick={onOpen}
                isDisabled={
                  !financeSummary?.totalBalance?.balance ||
                  financeSummary?.totalBalance?.balance <= 0
                }
              >
                ຖອນເງຶນ
              </Button>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor} borderWidth={1}>
            <CardBody>
              <Stat>
                <StatLabel color="gray.500">ຍອດທີ່ຖອນແລ້ວ</StatLabel>
                <StatNumber color="gray.600">
                  {formatCurrency(financeSummary?.withdrawn || 0)}
                </StatNumber>
                <StatHelpText>ຖອນສຳເລັດແລ້ວ</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg} borderColor={borderColor} borderWidth={1}>
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading fontFamily={"Noto Sans Lao, serif"} size="md">
                  ບັນຊີຮັບເງິນ
                </Heading>
              </Flex>
            </CardHeader>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text>
                  <Text as="span" fontWeight="semibold">
                    ທະນາຄານ:
                  </Text>{" "}
                  {bankAccount.bankName}
                </Text>
                <Text>
                  <Text as="span" fontWeight="semibold">
                    ເລກທີ່ບັນຊີ:
                  </Text>{" "}
                  {bankAccount.accountNumber}
                </Text>
                <Text>
                  <Text as="span" fontWeight="semibold">
                    ຊື່ບັນຊີ:
                  </Text>{" "}
                  {bankAccount.accountName}
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </Grid>

        {/* Analytics Section */}
        <Card bg={cardBg} borderColor={borderColor} borderWidth={1} mb={8}>
          <CardHeader>
            <Flex
              justify="space-between"
              align="center"
              flexWrap="wrap"
              gap={4}
            >
              <Heading size="md" fontFamily={"Noto Sans Lao, serif"}>
                ສະຖິຕິການຂາຍ
              </Heading>
              <Select
                value={timeFilter}
                onChange={handleTimeFilterChange}
                w="auto"
                minW="150px"
              >
                {TIME_FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Flex>
          </CardHeader>
          <CardBody>
            {chartData?.length > 0 ? (
              <SalesBarChart chartData={chartData} />
            ) : (
              <Center h="300px">
                <Text color="gray.500">ບໍ່ມີຂໍ້ມູນສະຖິຕິ</Text>
              </Center>
            )}
          </CardBody>
        </Card>
        {/* Bank Account Info */}

        {/* Transaction Table */}
        <Card bg={cardBg} borderColor={borderColor} mb={8} borderWidth={2}>
          <CardHeader>
            <Flex
              justify="space-between"
              align="center"
              mb={4}
              flexWrap=""
              gap={4}
            >
              <Heading fontFamily={"Noto Sans Lao, serif"} size="md">
                ປະຫວັດທຸລະກຳ
              </Heading>
              <HStack spacing={4}>
                <Box position="relative">
                  <Input
                    placeholder="ຄົ້ນຫາທຸລະກຳ..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    maxW="200px"
                    pl={10}
                  />
                  <Box
                    position="absolute"
                    left={3}
                    top="50%"
                    transform="translateY(-50%)"
                    color="gray.400"
                  >
                    <Search size={16} />
                  </Box>
                </Box>
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  maxW="150px"
                >
                  {STATUS_FILTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </HStack>
            </Flex>
          </CardHeader>
          <CardBody overflowX="auto">
            {filteredTransactions?.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th fontFamily={"Noto Sans Lao, serif"}>ວັນທີ່</Th>
                    <Th fontFamily={"Noto Sans Lao, serif"}> ສາຖານະ</Th>
                    <Th fontFamily={"Noto Sans Lao, serif"} isNumeric>
                      ຍອດເງິນ
                    </Th>

                    <Th fontFamily={"Noto Sans Lao, serif"}>ຫມາຍເຫດ</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredTransactions?.map((transaction) => (
                    <Tr key={transaction._id}>
                      <Td>
                        {new Date(transaction.createdAt).toLocaleDateString(
                          "th-TH",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </Td>
                      <Td>
                        <Badge colorScheme={STATUS_COLORS[transaction.status]}>
                          {TRANSACTION_TYPES[transaction.status]}
                        </Badge>
                      </Td>
                      <Td
                        isNumeric
                        color={transaction.amount > 0 ? "green.600" : "red.600"}
                        fontWeight="medium"
                      >
                        {formatCurrency(Math.abs(transaction.amount))}
                      </Td>

                      <Td maxW="200px" isTruncated title={transaction.note}>
                        {transaction.note || "-"}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Center py={8}>
                <Text color="gray.500">ບໍ່ພົບທຸລະກຳ</Text>
              </Center>
            )}
          </CardBody>
        </Card>

        {/* Withdraw Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>ສົ່ງຄຳຂໍຖອນເງິນ</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertDescription>
                      ຍອດທີ່ສາມາດຖອນໄດ້:{" "}
                      <Text as="span" fontWeight="semibold">
                        {formatCurrency(
                          financeSummary?.totalBalance?.balance || 0
                        )}
                      </Text>
                    </AlertDescription>
                  </Box>
                </Alert>

                <FormControl isRequired>
                  <FormLabel>ຈຳນວນເງິນທີ່ຕ້ອງການຖອນ (LAK)</FormLabel>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={handleWithdrawAmountChange}
                    min="0"
                    step="0.01"
                    max={financeSummary?.totalBalance?.balance || 0}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>ໝາຍເຫດ (ທາງເລືອກ)</FormLabel>
                  <Textarea
                    placeholder="ລະບຸໝາຍເຫດເພີ່ມເຕີມ..."
                    value={withdrawNote}
                    onChange={handleWithdrawNoteChange}
                    rows={3}
                  />
                </FormControl>

                <Box w="100%" p={4} bg="gray.50" borderRadius="md">
                  <Text
                    fontSize="sm"
                    color="gray.600"
                    mb={2}
                    fontWeight="semibold"
                  >
                    ບັນຊີທີ່ຈະໄດ້ຮັບເງິນ:
                  </Text>
                  <Text fontSize="sm">{bankAccount?.bankName}</Text>
                  <Text fontSize="sm">{bankAccount?.accountNumber}</Text>
                  <Text fontSize="sm">{bankAccount?.accountName}</Text>
                </Box>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button
                variant="ghost"
                mr={3}
                onClick={onClose}
                isDisabled={isLoading}
              >
                ຍົກເລີກ
              </Button>
              <Button
                colorScheme="green"
                onClick={handleWithdraw}
                leftIcon={<Send size={16} />}
                isLoading={isLoading}
                loadingText="กำลังส่ง..."
              >
                ສົ່ງຄຳຂໍຖອນເງິນ
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default FinanceSellerPage;
