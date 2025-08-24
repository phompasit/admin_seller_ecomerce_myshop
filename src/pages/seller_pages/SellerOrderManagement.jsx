import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  HStack,
  VStack,
  Divider,
  useToast,
  Checkbox,
  Stack,
} from "@chakra-ui/react";
import { ViewIcon, DownloadIcon, RepeatIcon } from "@chakra-ui/icons";
import { Printer } from "lucide-react";

const SellerOrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [dateRange, setDateRange] = useState("7days");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [bulkPrintOrders, setBulkPrintOrders] = useState([]);
  const [selectedOrdersForPrint, setSelectedOrdersForPrint] = useState(
    new Set()
  );

  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose,
  } = useDisclosure();
  const {
    isOpen: isStatusOpen,
    onOpen: onStatusOpen,
    onClose: onStatusClose,
  } = useDisclosure();
  const {
    isOpen: isPrintOpen,
    onOpen: onPrintOpen,
    onClose: onPrintClose,
  } = useDisclosure();

  const toast = useToast();

  // Mock data
  const [orders, setOrders] = useState();
  useEffect(() => {
    setOrders([
      {
        id: "ORD001",
        customerName: "สมชาย ใจดี",
        customerPhone: "081-234-5678",
        items: [
          { name: "เสื้อยืดสีขาว", quantity: 2, price: 250 },
          { name: "กางเกงยีนส์", quantity: 1, price: 890 },
        ],
        total: 1390,
        status: "pending",
        paymentStatus: "unpaid",
        paymentMethod: "bank_transfer",
        orderDate: "2025-07-20",
        address: "123 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110",
        note: "ขอส่งเร็วๆ หน่อยครับ",
        trackingNumber: "",
        isPrinted: false,
      },
      {
        id: "ORD002",
        customerName: "สมหญิง รักดี",
        customerPhone: "082-345-6789",
        items: [{ name: "กระเป๋าหนัง", quantity: 1, price: 1200 }],
        total: 1200,
        status: "shipping",
        paymentStatus: "paid",
        paymentMethod: "credit_card",
        orderDate: "2025-07-19",
        address: "456 ถ.ราชดำเนิน เขตพระนคร กรุงเทพฯ 10200",
        note: "",
        trackingNumber: "TH123456789",
        isPrinted: true,
      },
      {
        id: "ORD003",
        customerName: "วิชัย เก่งมาก",
        customerPhone: "083-456-7890",
        items: [{ name: "รองเท้าผ้าใบ", quantity: 1, price: 2500 }],
        total: 2500,
        status: "completed",
        paymentStatus: "paid",
        paymentMethod: "cod",
        orderDate: "2025-07-18",
        address: "789 ถ.พหลโยธิน เขตจตุจักร กรุงเทพฯ 10900",
        note: "ของขวัญวันเกิด",
        trackingNumber: "TH987654321",
        isPrinted: true,
      },
      {
        id: "ORD004",
        customerName: "มานี สวยงาม",
        customerPhone: "084-567-8901",
        items: [{ name: "เดรสสีแดง", quantity: 1, price: 1800 }],
        total: 1800,
        status: "cancelled",
        paymentStatus: "refunded",
        paymentMethod: "bank_transfer",
        orderDate: "2025-07-17",
        address: "321 ถ.สีลม เขตบางรัก กรุงเทพฯ 10500",
        note: "ยกเลิกเนื่องจากขนาดไม่เหมาะสม",
        trackingNumber: "",
        isPrinted: false,
      },
    ]);
  }, []);
  // Filter orders based on search and filters
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch =
        searchTerm === "" ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchPayment =
        paymentFilter === "all" || order.paymentStatus === paymentFilter;
      const matchPaymentMethod =
        paymentMethodFilter === "all" ||
        order.paymentMethod === paymentMethodFilter;

      return matchSearch && matchStatus && matchPayment && matchPaymentMethod;
    });
  }, [searchTerm, statusFilter, paymentFilter, paymentMethodFilter, orders]);

  // Calculate summary stats
  const summary = useMemo(() => {
    const total = orders.length;
    const shipping = orders.filter((o) => o.status === "shipping").length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const unpaid = orders.filter((o) => o.paymentStatus === "unpaid").length;
    const cancelled = orders.filter((o) => o.status === "cancelled").length;

    return { total, shipping, pending, unpaid, cancelled };
  }, [orders]);

  // Status badge colors
  const getStatusColor = (status) => {
    const colors = {
      pending: "orange",
      shipping: "blue",
      completed: "green",
      cancelled: "red",
    };
    return colors[status] || "gray";
  };

  const getStatusText = (status) => {
    const texts = {
      pending: "รอดำเนินการ",
      shipping: "จัดส่งแล้ว",
      completed: "สำเร็จ",
      cancelled: "ยกเลิก",
    };
    return texts[status] || status;
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: "green",
      unpaid: "red",
      refunded: "purple",
    };
    return colors[status] || "gray";
  };

  const getPaymentStatusText = (status) => {
    const texts = {
      paid: "จ่ายแล้ว",
      unpaid: "ยังไม่จ่าย",
      refunded: "คืนเงินแล้ว",
    };
    return texts[status] || status;
  };

  const getPaymentMethodText = (method) => {
    const texts = {
      bank_transfer: "โอนเงิน",
      credit_card: "บัตรเครดิต",
      cod: "เก็บเงินปลายทาง",
    };
    return texts[method] || method;
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    onDetailOpen();
  };

  const handleStatusChange = (order) => {
    setSelectedOrder(order);
    onStatusOpen();
  };

  const handleUpdateStatus = (newStatus) => {
    toast({
      title: "อัปเดตสถานะสำเร็จ",
      description: `เปลี่ยนสถานะคำสั่งซื้อ ${
        selectedOrder.id
      } เป็น ${getStatusText(newStatus)}`,
      status: "success",
      duration: 3000,
    });
    onStatusClose();
  };

  const handleDownloadInvoice = (order) => {
    toast({
      title: "ดาวน์โหลดใบเสร็จ",
      description: `กำลังดาวน์โหลดใบเสร็จสำหรับคำสั่งซื้อ ${order.id}`,
      status: "info",
      duration: 3000,
    });
  };

  const handlePrintLabel = (order) => {
    toast({
      title: "พิมพ์ใบปะหน้า",
      description: `กำลังพิมพ์ใบปะหน้าสำหรับคำสั่งซื้อ ${order.id}`,
      status: "info",
      duration: 3000,
    });

    // Mark as printed
    order.isPrinted = true;
  };

  const handleSelectForPrint = (orderId, isSelected) => {
    const newSelected = new Set(selectedOrdersForPrint);
    if (isSelected) {
      newSelected.add(orderId);
    } else {
      newSelected.delete(orderId);
    }
    setSelectedOrdersForPrint(newSelected);
  };

  const handleBulkPrint = () => {
    const selectedOrders = filteredOrders.filter((order) =>
      selectedOrdersForPrint.has(order.id)
    );
    setBulkPrintOrders(selectedOrders);
    onPrintOpen();
  };

  const confirmBulkPrint = () => {
    bulkPrintOrders.forEach((order) => {
      order.isPrinted = true;
    });

    toast({
      title: "พิมพ์ใบปะหน้าเรียบร้อย",
      description: `พิมพ์ใบปะหน้าทั้งหมด ${bulkPrintOrders.length} รายการ`,
      status: "success",
      duration: 3000,
    });

    setSelectedOrdersForPrint(new Set());
    onPrintClose();
  };

  return (
    <Container maxW="8xl" py={6}>
      {/* Header */}
      <Box mb={6}>
        <Heading size="lg" color="gray.800" mb={2}>
          จัดการคำสั่งซื้อของผู้ขาย
        </Heading>
        <Text color="gray.600">
          ดูและจัดการคำสั่งซื้อทั้งหมดของคุณในที่เดียว
        </Text>
      </Box>

      {/* Summary Cards */}
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(3, 1fr)",
          lg: "repeat(5, 1fr)",
        }}
        gap={4}
        mb={6}
      >
        <GridItem>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>คำสั่งซื้อทั้งหมด</StatLabel>
                <StatNumber>{summary.total}</StatNumber>
                <StatHelpText>✅ ทั้งหมด</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>กำลังจัดส่ง</StatLabel>
                <StatNumber>{summary.shipping}</StatNumber>
                <StatHelpText>📦 จัดส่งแล้ว</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>รอการจัดส่ง</StatLabel>
                <StatNumber>{summary.pending}</StatNumber>
                <StatHelpText>🚚 รอดำเนินการ</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>รอชำระเงิน</StatLabel>
                <StatNumber>{summary.unpaid}</StatNumber>
                <StatHelpText>🕐 ยังไม่จ่าย</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>ถูกยกเลิก</StatLabel>
                <StatNumber>{summary.cancelled}</StatNumber>
                <StatHelpText>❌ ยกเลิกแล้ว</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      {/* Filters */}
      <Card mb={6}>
        <CardBody>
          <VStack spacing={4}>
            {/* Time Range Filter */}
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={4}
              w="full"
              align="center"
            >
              <Text fontWeight="semibold" whiteSpace="nowrap">
                🔄 ช่วงเวลา:
              </Text>
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                maxW="200px"
              >
                <option value="today">วันนี้</option>
                <option value="7days">7 วันที่ผ่านมา</option>
                <option value="month">เดือนนี้</option>
                <option value="custom">เลือกวันที่</option>
              </Select>
            </Flex>

            {/* Search and Filters */}
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(5, 1fr)",
              }}
              gap={4}
              w="full"
            >
              <GridItem colSpan={{ base: 1, md: 2, lg: 2 }}>
                <Input
                  placeholder="🔍 ค้นหา: หมายเลขคำสั่งซื้อ, ชื่อลูกค้า, สินค้า"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </GridItem>
              <GridItem>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">สถานะทั้งหมด</option>
                  <option value="pending">รอดำเนินการ</option>
                  <option value="shipping">จัดส่งแล้ว</option>
                  <option value="completed">สำเร็จ</option>
                  <option value="cancelled">ยกเลิก</option>
                </Select>
              </GridItem>
              <GridItem>
                <Select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                >
                  <option value="all">การชำระทั้งหมด</option>
                  <option value="paid">จ่ายแล้ว</option>
                  <option value="unpaid">ยังไม่จ่าย</option>
                  <option value="refunded">คืนเงินแล้ว</option>
                </Select>
              </GridItem>
              <GridItem>
                <Select
                  value={paymentMethodFilter}
                  onChange={(e) => setPaymentMethodFilter(e.target.value)}
                >
                  <option value="all">ช่องทางทั้งหมด</option>
                  <option value="bank_transfer">โอนเงิน</option>
                  <option value="credit_card">บัตรเครดิต</option>
                  <option value="cod">เก็บเงินปลายทาง</option>
                </Select>
              </GridItem>
            </Grid>

            {/* Bulk Actions */}
            {selectedOrdersForPrint.size > 0 && (
              <Flex
                justify="space-between"
                align="center"
                w="full"
                bg="blue.50"
                p={3}
                borderRadius="md"
              >
                <Text fontWeight="semibold">
                  เลือกไว้ {selectedOrdersForPrint.size} รายการ
                </Text>
                <Button
                  colorScheme="blue"
                  leftIcon={<Printer />}
                  onClick={handleBulkPrint}
                >
                  พิมพ์ใบปะหน้าทั้งหมด
                </Button>
              </Flex>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardBody p={0}>
          <Box overflowX="auto">
            <Table variant="simple" size={{ base: "sm", md: "md" }}>
              <Thead bg="gray.50">
                <Tr>
                  <Th>
                    <Checkbox
                      isChecked={
                        selectedOrdersForPrint.size === filteredOrders.length &&
                        filteredOrders.length > 0
                      }
                      isIndeterminate={
                        selectedOrdersForPrint.size > 0 &&
                        selectedOrdersForPrint.size < filteredOrders.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOrdersForPrint(
                            new Set(filteredOrders.map((o) => o.id))
                          );
                        } else {
                          setSelectedOrdersForPrint(new Set());
                        }
                      }}
                    />
                  </Th>
                  <Th>คำสั่งซื้อ</Th>
                  <Th>ลูกค้า</Th>
                  <Th>สินค้า</Th>
                  <Th isNumeric>ยอดรวม</Th>
                  <Th>สถานะ</Th>
                  <Th>การชำระเงิน</Th>
                  <Th>วันที่</Th>
                  <Th>จัดการ</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredOrders.map((order) => (
                  <Tr key={order.id} _hover={{ bg: "gray.50" }}>
                    <Td>
                      <Checkbox
                        isChecked={selectedOrdersForPrint.has(order.id)}
                        onChange={(e) =>
                          handleSelectForPrint(order.id, e.target.checked)
                        }
                      />
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">{order.id}</Text>
                        {order.isPrinted && (
                          <Badge colorScheme="green" size="sm">
                            ปริ้นแล้ว
                          </Badge>
                        )}
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium">{order.customerName}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {order.customerPhone}
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={0}>
                        {order.items.slice(0, 2).map((item, index) => (
                          <Text key={index} fontSize="sm">
                            {item.name} x{item.quantity}
                          </Text>
                        ))}
                        {order.items.length > 2 && (
                          <Text fontSize="sm" color="gray.500">
                            และอีก {order.items.length - 2} รายการ
                          </Text>
                        )}
                      </VStack>
                    </Td>
                    <Td isNumeric>
                      <Text fontWeight="semibold">
                        ฿{order.total.toLocaleString()}
                      </Text>
                    </Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Badge
                          colorScheme={getPaymentStatusColor(
                            order.paymentStatus
                          )}
                          size="sm"
                        >
                          {getPaymentStatusText(order.paymentStatus)}
                        </Badge>
                        <Text fontSize="xs" color="gray.500">
                          {getPaymentMethodText(order.paymentMethod)}
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      <Text fontSize="sm">{order.orderDate}</Text>
                    </Td>
                    <Td>
                      <HStack spacing={1}>
                        <IconButton
                          size="sm"
                          icon={<ViewIcon />}
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => handleViewOrder(order)}
                        />
                        <IconButton
                          size="sm"
                          icon={<RepeatIcon />}
                          colorScheme="orange"
                          variant="ghost"
                          onClick={() => handleStatusChange(order)}
                        />
                        <IconButton
                          size="sm"
                          icon={<DownloadIcon />}
                          colorScheme="green"
                          variant="ghost"
                          onClick={() => handleDownloadInvoice(order)}
                        />
                        <IconButton
                          size="sm"
                          icon={<Printer />}
                          colorScheme="purple"
                          variant="ghost"
                          onClick={() => handlePrintLabel(order)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </Card>

      {/* Order Detail Modal */}
      <Modal isOpen={isDetailOpen} onClose={onDetailClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>รายละเอียดคำสั่งซื้อ {selectedOrder?.id}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedOrder && (
              <VStack spacing={4} align="stretch">
                {/* Customer Info */}
                <Box>
                  <Heading size="sm" mb={2}>
                    ข้อมูลลูกค้า
                  </Heading>
                  <Text>
                    <strong>ชื่อ:</strong> {selectedOrder.customerName}
                  </Text>
                  <Text>
                    <strong>โทร:</strong> {selectedOrder.customerPhone}
                  </Text>
                  <Text>
                    <strong>ที่อยู่:</strong> {selectedOrder.address}
                  </Text>
                </Box>

                <Divider />

                {/* Order Items */}
                <Box>
                  <Heading size="sm" mb={2}>
                    รายการสินค้า
                  </Heading>
                  {selectedOrder.items.map((item, index) => (
                    <Flex key={index} justify="space-between" py={1}>
                      <Text>
                        {item.name} x{item.quantity}
                      </Text>
                      <Text fontWeight="semibold">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </Text>
                    </Flex>
                  ))}
                  <Divider my={2} />
                  <Flex justify="space-between" fontWeight="bold">
                    <Text>รวมทั้งหมด</Text>
                    <Text>฿{selectedOrder.total.toLocaleString()}</Text>
                  </Flex>
                </Box>

                <Divider />

                {/* Order Status */}
                <Box>
                  <Heading size="sm" mb={2}>
                    สถานะคำสั่งซื้อ
                  </Heading>
                  <HStack spacing={4}>
                    <Badge colorScheme={getStatusColor(selectedOrder.status)}>
                      {getStatusText(selectedOrder.status)}
                    </Badge>
                    <Badge
                      colorScheme={getPaymentStatusColor(
                        selectedOrder.paymentStatus
                      )}
                    >
                      {getPaymentStatusText(selectedOrder.paymentStatus)}
                    </Badge>
                  </HStack>
                  {selectedOrder.trackingNumber && (
                    <Text mt={2}>
                      <strong>Tracking:</strong> {selectedOrder.trackingNumber}
                    </Text>
                  )}
                </Box>

                {/* Customer Note */}
                {selectedOrder.note && (
                  <>
                    <Divider />
                    <Box>
                      <Heading size="sm" mb={2}>
                        ข้อความจากลูกค้า
                      </Heading>
                      <Text bg="gray.50" p={3} borderRadius="md">
                        {selectedOrder.note}
                      </Text>
                    </Box>
                  </>
                )}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onDetailClose}>
              ปิด
            </Button>
            <Button
              colorScheme="orange"
              onClick={() => handleStatusChange(selectedOrder)}
            >
              เปลี่ยนสถานะ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Status Change Modal */}
      <Modal isOpen={isStatusOpen} onClose={onStatusClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>เปลี่ยนสถานะคำสั่งซื้อ {selectedOrder?.id}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3} align="stretch">
              <Button
                colorScheme="orange"
                variant="outline"
                onClick={() => handleUpdateStatus("pending")}
              >
                รอดำเนินการ
              </Button>
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={() => handleUpdateStatus("shipping")}
              >
                จัดส่งแล้ว
              </Button>
              <Button
                colorScheme="green"
                variant="outline"
                onClick={() => handleUpdateStatus("completed")}
              >
                สำเร็จ
              </Button>
              <Button
                colorScheme="red"
                variant="outline"
                onClick={() => handleUpdateStatus("cancelled")}
              >
                ยกเลิก
              </Button>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onStatusClose}>ยกเลิก</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Bulk Print Confirmation Modal */}
      <Modal isOpen={isPrintOpen} onClose={onPrintClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ยืนยันการพิมพ์ใบปะหน้า</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>คุณต้องการพิมพ์ใบปะหน้าสำหรับคำสั่งซื้อต่อไปนี้:</Text>
            <VStack align="stretch" spacing={2} maxH="300px" overflowY="auto">
              {bulkPrintOrders.map((order) => (
                <Box key={order.id} p={3} bg="gray.50" borderRadius="md">
                  <Text fontWeight="semibold">{order.id}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {order.customerName} - ฿{order.total.toLocaleString()}
                  </Text>
                  {order.isPrinted && (
                    <Badge colorScheme="green" size="sm" mt={1}>
                      เคยปริ้นแล้ว
                    </Badge>
                  )}
                </Box>
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onPrintClose}>
              ยกเลิก
            </Button>
            <Button colorScheme="blue" onClick={confirmBulkPrint}>
              ยืนยันพิมพ์ทั้งหมด
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default SellerOrderManagement;
