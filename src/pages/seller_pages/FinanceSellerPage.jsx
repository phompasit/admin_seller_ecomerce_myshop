import React, { useState } from "react";
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
  Divider,
  Container,
  Switch,
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
} from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Download, Search, Sun, Moon, Edit, Send } from "lucide-react";

const FinanceSellerPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [timeFilter, setTimeFilter] = useState("30d");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawNote, setWithdrawNote] = useState("");

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Mock data
  const summaryData = {
    totalSales: 150000,
    netEarnings: 135000,
    totalOrders: 245,
    pendingPayout: 25000,
    withdrawn: 110000,
    growthRate: 12.5,
    isPositive: true,
  };

  const chartData = [
    { name: "จ", value: 4000 },
    { name: "อ", value: 3000 },
    { name: "พ", value: 5000 },
    { name: "พฤ", value: 2780 },
    { name: "ศ", value: 1890 },
    { name: "ส", value: 2390 },
    { name: "อา", value: 3490 },
  ];

  const transactions = [
    {
      id: 1,
      date: "2024-07-20",
      type: "ขาย",
      amount: 1500,
      status: "สำเร็จ",
      note: "ขายสินค้า #12345",
    },
    {
      id: 2,
      date: "2024-07-19",
      type: "ถอน",
      amount: -5000,
      status: "สำเร็จ",
      note: "ถอนเงินเข้าบัญชี",
    },
    {
      id: 3,
      date: "2024-07-18",
      type: "ขาย",
      amount: 2300,
      status: "สำเร็จ",
      note: "ขายสินค้า #12346",
    },
    {
      id: 4,
      date: "2024-07-17",
      type: "ขาย",
      amount: 890,
      status: "รอดำเนินการ",
      note: "ขายสินค้า #12347",
    },
    {
      id: 5,
      date: "2024-07-16",
      type: "ขาย",
      amount: 3200,
      status: "สำเร็จ",
      note: "ขายสินค้า #12348",
    },
  ];

  const bankAccount = {
    bankName: "ธนาคารกสิกรไทย",
    accountNumber: "123-4-56789-0",
    accountName: "นายจอห์น โด",
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณาระบุจำนวนเงินที่ต้องการถอน",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (parseFloat(withdrawAmount) > summaryData.pendingPayout) {
      toast({
        title: "ข้อผิดพลาด",
        description: "จำนวนเงินที่ต้องการถอนเกินยอดที่มี",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Simulate sending withdraw request to admin
    toast({
      title: "ส่งคำขอเรียบร้อย",
      description: `ส่งคำขอถอนเงิน ${parseFloat(
        withdrawAmount
      ).toLocaleString()} บาท ไปยังแอดมินเรียบร้อยแล้ว`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    setWithdrawAmount("");
    setWithdrawNote("");
    onClose();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "สำเร็จ":
        return "green";
      case "รอดำเนินการ":
        return "orange";
      default:
        return "gray";
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Box   p={4}>
      <Container maxW="7xl">
        {/* Header */}
        <Flex
          justify="space-between"
          align="center"
          mb={6}
          flexWrap="wrap"
          gap={4}
        >
          <Heading size="xl" color="blue.600">
            การเงินของผู้ขาย
          </Heading>

        </Flex>

        {/* Alert */}
        <Alert
          status="info"
          borderRadius="md"
          mb={6}
          bg="blue.50"
          borderColor="blue.200"
        >
          <AlertIcon color="blue.500" />
          <Box>
            <AlertTitle color="blue.800">แจ้งเตือน!</AlertTitle>
            <AlertDescription color="blue.700">
              คุณมีเงินรอถอน {formatCurrency(summaryData.pendingPayout)}
            </AlertDescription>
          </Box>
        </Alert>

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
                <StatLabel color="gray.500">ยอดขายรวม</StatLabel>
                <StatNumber color="blue.600">
                  {formatCurrency(summaryData.totalSales)}
                </StatNumber>
                <StatHelpText>
                  <StatArrow
                    type={summaryData.isPositive ? "increase" : "decrease"}
                  />
                  {summaryData.growthRate}% จากเดือนที่แล้ว
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor} borderWidth={1}>
            <CardBody>
              <Stat>
                <StatLabel color="gray.500">รายได้สุทธิ</StatLabel>
                <StatNumber color="green.600">
                  {formatCurrency(summaryData.netEarnings)}
                </StatNumber>
                <StatHelpText>หลังหักค่าคอมมิชชั่น</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor} borderWidth={1}>
            <CardBody>
              <Stat>
                <StatLabel color="gray.500">จำนวนออเดอร์</StatLabel>
                <StatNumber color="purple.600">
                  {summaryData.totalOrders.toLocaleString()}
                </StatNumber>
                <StatHelpText>ออเดอร์ทั้งหมด</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor} borderWidth={1}>
            <CardBody>
              <Flex justify="space-between" align="center">
                <Stat flex="1">
                  <StatLabel color="gray.500">ยอดที่รอถอน</StatLabel>
                  <StatNumber color="orange.600">
                    {formatCurrency(summaryData.pendingPayout)}
                  </StatNumber>
                </Stat>
                <Button
                  colorScheme="green"
                  leftIcon={<Download size={16} />}
                  onClick={onOpen}
                >
                  ถอนเงิน
                </Button>
              </Flex>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor} borderWidth={1}>
            <CardBody>
              <Stat>
                <StatLabel color="gray.500">ยอดที่ถอนแล้ว</StatLabel>
                <StatNumber color="gray.600">
                  {formatCurrency(summaryData.withdrawn)}
                </StatNumber>
                <StatHelpText>ถอนสำเร็จแล้ว</StatHelpText>
              </Stat>
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
              <Heading size="md">สถิติรายได้</Heading>
              <Select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                w="auto"
              >
                <option value="today">วันนี้</option>
                <option value="7d">7 วันที่ผ่านมา</option>
                <option value="30d">30 วันที่ผ่านมา</option>
                <option value="month">เดือนนี้</option>
                <option value="year">ปีนี้</option>
              </Select>
            </Flex>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), "รายได้"]}
                />
                <Bar dataKey="value" fill="#3182CE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Bank Account Info */}
        <Card bg={cardBg} borderColor={borderColor} borderWidth={1} mb={8}>
          <CardHeader>
            <Flex justify="space-between" align="center">
              <Heading size="md">บัญชีรับเงิน</Heading>
              <Button
                leftIcon={<Edit size={16} />}
                variant="outline"
                colorScheme="blue"
              >
                แก้ไขบัญชี
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            <VStack align="start" spacing={2}>
              <Text>
                <strong>ธนาคาร:</strong> {bankAccount.bankName}
              </Text>
              <Text>
                <strong>เลขที่บัญชี:</strong> {bankAccount.accountNumber}
              </Text>
              <Text>
                <strong>ชื่อบัญชี:</strong> {bankAccount.accountName}
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {/* Transaction Table */}
        <Card bg={cardBg} borderColor={borderColor} borderWidth={1}>
          <CardHeader>
            <Flex
              justify="space-between"
              align="center"
              mb={4}
              flexWrap="wrap"
              gap={4}
            >
              <Heading size="md">ประวัติธุรกรรม</Heading>
              <HStack spacing={4} flexWrap="wrap">
                <Input
                  placeholder="ค้นหาธุรกรรม..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search size={16} />}
                  maxW="200px"
                />
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  maxW="150px"
                >
                  <option value="all">ทุกสถานะ</option>
                  <option value="สำเร็จ">สำเร็จ</option>
                  <option value="รอดำเนินการ">รอดำเนินการ</option>
                </Select>
              </HStack>
            </Flex>
          </CardHeader>
          <CardBody overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>วันที่</Th>
                  <Th>ประเภท</Th>
                  <Th isNumeric>ยอดเงิน</Th>
                  <Th>สถานะ</Th>
                  <Th>หมายเหตุ</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredTransactions.map((transaction) => (
                  <Tr key={transaction.id}>
                    <Td>
                      {new Date(transaction.date).toLocaleDateString("th-TH")}
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={
                          transaction.type === "ขาย" ? "blue" : "purple"
                        }
                      >
                        {transaction.type}
                      </Badge>
                    </Td>
                    <Td
                      isNumeric
                      color={transaction.amount > 0 ? "green.600" : "red.600"}
                    >
                      {formatCurrency(Math.abs(transaction.amount))}
                    </Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </Td>
                    <Td>{transaction.note}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>

        {/* Withdraw Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>ส่งคำขอถอนเงิน</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertDescription>
                      ยอดที่สามารถถอนได้:{" "}
                      {formatCurrency(summaryData.pendingPayout)}
                    </AlertDescription>
                  </Box>
                </Alert>

                <FormControl>
                  <FormLabel>จำนวนเงินที่ต้องการถอน (บาท)</FormLabel>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>หมายเหตุ (ไม่บังคับ)</FormLabel>
                  <Textarea
                    placeholder="ระบุหมายเหตุเพิ่มเติม..."
                    value={withdrawNote}
                    onChange={(e) => setWithdrawNote(e.target.value)}
                  />
                </FormControl>

                <Box w="100%" p={4} bg="gray.50" borderRadius="md">
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    บัญชีที่จะโอนเงินเข้า:
                  </Text>
                  <Text fontSize="sm">{bankAccount.bankName}</Text>
                  <Text fontSize="sm">{bankAccount.accountNumber}</Text>
                  <Text fontSize="sm">{bankAccount.accountName}</Text>
                </Box>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                ยกเลิก
              </Button>
              <Button
                colorScheme="green"
                onClick={handleWithdraw}
                leftIcon={<Send size={16} />}
              >
                ส่งคำขอ
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default FinanceSellerPage;
