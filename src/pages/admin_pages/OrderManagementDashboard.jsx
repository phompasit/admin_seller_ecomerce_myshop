import React, { useState, useMemo } from 'react';
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
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Progress,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Image,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  RadioGroup,
  Radio,
  Stack
} from '@chakra-ui/react';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  Bell,
  AlertTriangle,
  Calendar,
  User,
  Store,
  CreditCard,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Plus,
  Minus,
  MoreVertical,
  Copy,
  MessageSquare,
  Camera,
  Upload,
  Save,
  X
} from 'lucide-react';

const OrderManagementDashboard = () => {
  const toast = useToast();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const { isOpen: isNoteOpen, onOpen: onNoteOpen, onClose: onNoteClose } = useDisclosure();
  
  // Sample data
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customer: { name: 'สมชาย ใจดี', email: 'somchai@email.com', phone: '081-234-5678', avatar: '' },
      store: { name: 'ร้านของใช้ในบ้าน', id: 'STORE-001' },
      total: 1250.00,
      status: 'pending',
      paymentStatus: 'paid',
      orderDate: '2024-01-15T10:30:00',
      items: [
        { name: 'หม้อหุงข้าว', quantity: 1, price: 890 },
        { name: 'กระทะ', quantity: 2, price: 180 }
      ],
      shippingAddress: {
        address: '123/45 ถ.สุขุมวิท แขวงคลองตัน',
        district: 'เขตวัฒนา',
        province: 'กรุงเทพมหานคร',
        zipcode: '10110'
      },
      timeline: [
        { status: 'ordered', date: '2024-01-15T10:30:00', completed: true },
        { status: 'paid', date: '2024-01-15T10:35:00', completed: true },
        { status: 'processing', date: null, completed: false },
        { status: 'shipped', date: null, completed: false },
        { status: 'delivered', date: null, completed: false }
      ],
      flags: ['high_value'],
      notes: [],
      refund: null
    },
    {
      id: 'ORD-002',
      customer: { name: 'สุดา แสงทอง', email: 'suda@email.com', phone: '082-345-6789', avatar: '' },
      store: { name: 'ร้านเสื้อผ้าแฟชั่น', id: 'STORE-002' },
      total: 2890.00,
      status: 'shipped',
      paymentStatus: 'paid',
      orderDate: '2024-01-14T14:20:00',
      items: [
        { name: 'เสื้อยืด', quantity: 3, price: 590 },
        { name: 'กางเกงยีนส์', quantity: 1, price: 1120 }
      ],
      shippingAddress: {
        address: '456/78 ถ.รัชดาภิเษก',
        district: 'เขตดินแดง',
        province: 'กรุงเทพมหานคร',
        zipcode: '10400'
      },
      timeline: [
        { status: 'ordered', date: '2024-01-14T14:20:00', completed: true },
        { status: 'paid', date: '2024-01-14T14:25:00', completed: true },
        { status: 'processing', date: '2024-01-14T16:00:00', completed: true },
        { status: 'shipped', date: '2024-01-15T09:00:00', completed: true },
        { status: 'delivered', date: null, completed: false }
      ],
      flags: [],
      notes: [
        { id: 1, text: 'ลูกค้าขอเปลี่ยนสี', author: 'Admin', date: '2024-01-14T15:00:00' }
      ],
      refund: null
    },
    {
      id: 'ORD-003',
      customer: { name: 'วิชัย รักเรียน', email: 'wichai@email.com', phone: '083-456-7890', avatar: '' },
      store: { name: 'ร้านหนังสือและเครื่องเขียน', id: 'STORE-003' },
      total: 450.00,
      status: 'cancelled',
      paymentStatus: 'refunded',
      orderDate: '2024-01-13T09:15:00',
      items: [
        { name: 'หนังสือ', quantity: 2, price: 180 },
        { name: 'ปากกา', quantity: 5, price: 18 }
      ],
      shippingAddress: {
        address: '789/12 ถ.พหลโยธิน',
        district: 'เขตจตุจักร',
        province: 'กรุงเทพมหานคร',
        zipcode: '10900'
      },
      timeline: [
        { status: 'ordered', date: '2024-01-13T09:15:00', completed: true },
        { status: 'paid', date: '2024-01-13T09:20:00', completed: true },
        { status: 'cancelled', date: '2024-01-13T11:30:00', completed: true }
      ],
      flags: ['customer_complaint'],
      notes: [
        { id: 1, text: 'ลูกค้าขอยกเลิก - สินค้าไม่ตรงตามที่ต้องการ', author: 'Admin', date: '2024-01-13T11:30:00' }
      ],
      refund: {
        amount: 450.00,
        status: 'completed',
        date: '2024-01-13T12:00:00'
      }
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // table or card
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    store: '',
    paymentStatus: ''
  });
  const [savedViews, setSavedViews] = useState([
    { name: 'รอดำเนินการ', filters: { status: 'pending' } },
    { name: 'มีปัญหา', filters: { flags: ['customer_complaint', 'high_value'] } }
  ]);

  // Filter logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchSearch = !filters.search || 
        order.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.store.name.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchStatus = !filters.status || order.status === filters.status;
      const matchPaymentStatus = !filters.paymentStatus || order.paymentStatus === filters.paymentStatus;
      const matchStore = !filters.store || order.store.name.toLowerCase().includes(filters.store.toLowerCase());

      return matchSearch && matchStatus && matchPaymentStatus && matchStore;
    });
  }, [orders, filters]);

  // Status colors and labels
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'orange', label: 'รอดำเนินการ', icon: Clock },
      processing: { color: 'blue', label: 'กำลังจัดเตรียม', icon: Package },
      shipped: { color: 'purple', label: 'กำลังจัดส่ง', icon: Truck },
      delivered: { color: 'green', label: 'จัดส่งแล้ว', icon: CheckCircle },
      cancelled: { color: 'red', label: 'ยกเลิก', icon: XCircle }
    };
    
    const config = statusConfig[status];
    const IconComponent = config.icon;
    
    return (
      <Badge colorScheme={config.color} display="flex" alignItems="center" gap={1}>
        <IconComponent size={12} />
        {config.label}
      </Badge>
    );
  };

  const getPaymentBadge = (status) => {
    const statusConfig = {
      pending: { color: 'orange', label: 'รอชำระ' },
      paid: { color: 'green', label: 'ชำระแล้ว' },
      refunded: { color: 'red', label: 'คืนเงินแล้ว' },
      processing: { color: 'blue', label: 'กำลังตรวจสอบ' }
    };
    
    const config = statusConfig[status];
    return <Badge colorScheme={config.color}>{config.label}</Badge>;
  };

  const getFlagBadge = (flag) => {
    const flagConfig = {
      high_value: { color: 'purple', label: 'ยอดสูง', icon: TrendingUp },
      customer_complaint: { color: 'red', label: 'ร้องเรียน', icon: AlertTriangle },
      duplicate_ip: { color: 'yellow', label: 'IP ซ้ำ', icon: Copy }
    };
    
    const config = flagConfig[flag];
    if (!config) return null;
    
    const IconComponent = config.icon;
    return (
      <Badge colorScheme={config.color} size="sm" display="flex" alignItems="center" gap={1}>
        <IconComponent size={10} />
        {config.label}
      </Badge>
    );
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: newStatus,
            timeline: order.timeline.map((step) => {
              if ((newStatus === 'processing' && step.status === 'processing') ||
                  (newStatus === 'shipped' && (step.status === 'processing' || step.status === 'shipped')) ||
                  (newStatus === 'delivered' && step.status !== 'cancelled')) {
                return { ...step, completed: true, date: new Date().toISOString() };
              }
              return step;
            })
          }
        : order
    ));
    
    toast({
      title: 'อัปเดตสถานะสำเร็จ',
      description: `เปลี่ยนสถานะคำสั่งซื้อ ${orderId} เป็น ${newStatus}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const exportOrders = (format) => {
    // Simulate export
    toast({
      title: 'กำลังส่งออกข้อมูล',
      description: `ส่งออกข้อมูลเป็น ${format.toUpperCase()} สำเร็จ`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const addNote = (orderId, noteText) => {
    if (!noteText.trim()) return;
    
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            notes: [...order.notes, {
              id: Date.now(),
              text: noteText,
              author: 'Admin',
              date: new Date().toISOString()
            }]
          }
        : order
    ));
    
    toast({
      title: 'เพิ่มหมายเหตุสำเร็จ',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  // Statistics
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
    
    return {
      total,
      pending,
      shipped,
      delivered,
      cancelled,
      totalRevenue,
      cancelRate: total > 0 ? ((cancelled / total) * 100).toFixed(1) : 0
    };
  }, [orders]);
console.log(setSavedViews)
  const OrderCard = ({ order }) => (
    <Card>
      <CardHeader pb={2}>
        <Flex justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold" fontSize="lg">{order.id}</Text>
            <Text fontSize="sm" color="gray.600">{new Date(order.orderDate).toLocaleDateString('th-TH')}</Text>
          </VStack>
          <VStack align="end" spacing={1}>
            {getStatusBadge(order.status)}
            <Text fontWeight="bold" color="green.500">฿{order.total.toLocaleString()}</Text>
          </VStack>
        </Flex>
      </CardHeader>
      <CardBody pt={0}>
        <VStack align="start" spacing={2}>
          <HStack>
            <User size={14} />
            <Text fontSize="sm">{order.customer.name}</Text>
          </HStack>
          <HStack>
            <Store size={14} />
            <Text fontSize="sm">{order.store.name}</Text>
          </HStack>
          <HStack>
            <CreditCard size={14} />
            {getPaymentBadge(order.paymentStatus)}
          </HStack>
          {order.flags.length > 0 && (
            <Wrap>
              {order.flags.map(flag => (
                <WrapItem key={flag}>
                  {getFlagBadge(flag)}
                </WrapItem>
              ))}
            </Wrap>
          )}
          <HStack mt={2} spacing={2}>
            <Button size="sm" leftIcon={<Eye size={14} />} onClick={() => {
              setSelectedOrder(order);
              onDetailOpen();
            }}>
              ดูรายละเอียด
            </Button>
            <Menu>
              <MenuButton as={IconButton} icon={<MoreVertical size={14} />} size="sm" variant="ghost" />
              <MenuList>
                <MenuItem onClick={() => updateOrderStatus(order.id, 'processing')}>
                  เปลี่ยนเป็น "กำลังจัดเตรียม"
                </MenuItem>
                <MenuItem onClick={() => updateOrderStatus(order.id, 'shipped')}>
                  เปลี่ยนเป็น "กำลังจัดส่ง"
                </MenuItem>
                <MenuItem onClick={() => updateOrderStatus(order.id, 'delivered')}>
                  เปลี่ยนเป็น "จัดส่งแล้ว"
                </MenuItem>
                <MenuItem onClick={() => updateOrderStatus(order.id, 'cancelled')} color="red.500">
                  ยกเลิกคำสั่งซื้อ
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
      ordered: 'สั่งซื้อ',
      paid: 'ชำระเงิน',
      processing: 'จัดเตรียมสินค้า',
      shipped: 'จัดส่ง',
      delivered: 'ได้รับสินค้า',
      cancelled: 'ยกเลิก'
    };

    return (
      <HStack spacing={4} align="start">
        <VStack spacing={0}>
          <Box
            w={8}
            h={8}
            borderRadius="full"
            bg={step.completed ? 'green.500' : 'gray.300'}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {step.completed ? (
              <CheckCircle size={16} color="white" />
            ) : (
              <Clock size={16} color="gray.600" />
            )}
          </Box>
          {!isLast && (
            <Box w={0.5} h={8} bg={step.completed ? 'green.500' : 'gray.300'} />
          )}
        </VStack>
        <VStack align="start" spacing={1} flex={1}>
          <Text fontWeight={step.completed ? 'bold' : 'normal'}>
            {stepLabels[step.status]}
          </Text>
          {step.date && (
            <Text fontSize="sm" color="gray.600">
              {new Date(step.date).toLocaleString('th-TH')}
            </Text>
          )}
        </VStack>
      </HStack>
    );
  };

  return (
    <Box p={6} maxW="100vw" bg="gray.50" minH="100vh">
      {/* Header */}
      <VStack align="start" spacing={6} mb={6}>
        <HStack justify="space-between" w="full">
          <VStack align="start" spacing={2}>
            <Text fontSize="3xl" fontWeight="bold">จัดการคำสั่งซื้อ</Text>
            <Text color="gray.600">ระบบจัดการคำสั่งซื้อ Marketplace</Text>
          </VStack>
          <HStack spacing={2}>
            <Button leftIcon={<Bell size={16} />} variant="ghost">
              แจ้งเตือน (3)
            </Button>
            <Menu>
              <MenuButton as={Button} rightIcon={<Download size={16} />}>
                ส่งออกข้อมูล
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => exportOrders('excel')}>Excel (.xlsx)</MenuItem>
                <MenuItem onClick={() => exportOrders('csv')}>CSV (.csv)</MenuItem>
                <MenuItem onClick={() => exportOrders('pdf')}>PDF (.pdf)</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </HStack>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 2, md: 4, lg: 7 }} spacing={4} w="full">
          <Stat>
            <StatLabel>คำสั่งซื้อทั้งหมด</StatLabel>
            <StatNumber>{stats.total}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>รอดำเนินการ</StatLabel>
            <StatNumber color="orange.500">{stats.pending}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>กำลังจัดส่ง</StatLabel>
            <StatNumber color="purple.500">{stats.shipped}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>จัดส่งแล้ว</StatLabel>
            <StatNumber color="green.500">{stats.delivered}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>ยกเลิก</StatLabel>
            <StatNumber color="red.500">{stats.cancelled}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>ยอดขายรวม</StatLabel>
            <StatNumber color="green.600">฿{stats.totalRevenue.toLocaleString()}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>อัตราการยกเลิก</StatLabel>
            <StatNumber color={stats.cancelRate > 10 ? 'red.500' : 'green.500'}>
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
                  placeholder="ค้นหาด้วยรหัสคำสั่งซื้อ, ชื่อลูกค้า, หรือร้านค้า..."
                  leftElement={<Search size={16} />}
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </Box>
              <Select
                placeholder="สถานะคำสั่งซื้อ"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                w="200px"
              >
                <option value="pending">รอดำเนินการ</option>
                <option value="processing">กำลังจัดเตรียม</option>
                <option value="shipped">กำลังจัดส่ง</option>
                <option value="delivered">จัดส่งแล้ว</option>
                <option value="cancelled">ยกเลิก</option>
              </Select>
              <Select
                placeholder="สถานะการชำระ"
                value={filters.paymentStatus}
                onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
                w="200px"
              >
                <option value="pending">รอชำระ</option>
                <option value="paid">ชำระแล้ว</option>
                <option value="processing">กำลังตรวจสอบ</option>
                <option value="refunded">คืนเงินแล้ว</option>
              </Select>
              <Button leftIcon={<Filter size={16} />} onClick={onFilterOpen}>
                ตัวกรองเพิ่มเติม
              </Button>
            </HStack>

            <HStack justify="space-between" w="full">
              <HStack>
                <Text fontSize="sm" color="gray.600">มุมมองที่บันทึกไว้:</Text>
                {savedViews.map(view => (
                  <Button
                    key={view.name}
                    size="sm"
                    variant="outline"
                    onClick={() => setFilters(prev => ({ ...prev, ...view.filters }))}
                  >
                    {view.name}
                  </Button>
                ))}
              </HStack>
              <HStack>
                <Text fontSize="sm" color="gray.600">แสดงผล:</Text>
                <RadioGroup value={viewMode} onChange={setViewMode}>
                  <Stack direction="row">
                    <Radio value="table">ตาราง</Radio>
                    <Radio value="card">การ์ด</Radio>
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
              รายการคำสั่งซื้อ ({filteredOrders.length})
            </Text>
            <Button leftIcon={<RefreshCw size={16} />} size="sm" variant="ghost">
              รีเฟรช
            </Button>
          </HStack>
        </CardHeader>
        <CardBody>
          {viewMode === 'table' ? (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>รหัสคำสั่งซื้อ</Th>
                    <Th>ลูกค้า</Th>
                    <Th>ร้านค้า</Th>
                    <Th>ยอดรวม</Th>
                    <Th>สถานะ</Th>
                    <Th>การชำระเงิน</Th>
                    <Th>วันที่สั่ง</Th>
                    <Th>แจ้งเตือน</Th>
                    <Th>จัดการ</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredOrders.map(order => (
                    <Tr key={order.id}>
                      <Td fontWeight="bold">{order.id}</Td>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text>{order.customer.name}</Text>
                          <Text fontSize="sm" color="gray.600">{order.customer.email}</Text>
                        </VStack>
                      </Td>
                      <Td>{order.store.name}</Td>
                      <Td fontWeight="bold" color="green.600">฿{order.total.toLocaleString()}</Td>
                      <Td>{getStatusBadge(order.status)}</Td>
                      <Td>{getPaymentBadge(order.paymentStatus)}</Td>
                      <Td>{new Date(order.orderDate).toLocaleDateString('th-TH')}</Td>
                      <Td>
                        {order.flags.length > 0 && (
                          <HStack>
                            {order.flags.map(flag => getFlagBadge(flag))}
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
                            <MenuButton as={IconButton} icon={<MoreVertical size={14} />} size="sm" variant="ghost" />
                            <MenuList>
                              <MenuItem onClick={() => updateOrderStatus(order.id, 'processing')}>
                                เปลี่ยนเป็น "กำลังจัดเตรียม"
                              </MenuItem>
                              <MenuItem onClick={() => updateOrderStatus(order.id, 'shipped')}>
                                เปลี่ยนเป็น "กำลังจัดส่ง"
                              </MenuItem>
                              <MenuItem onClick={() => updateOrderStatus(order.id, 'delivered')}>
                                เปลี่ยนเป็น "จัดส่งแล้ว"
                              </MenuItem>
                              <MenuItem onClick={() => updateOrderStatus(order.id, 'cancelled')} color="red.500">
                                ยกเลิกคำสั่งซื้อ
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
              {filteredOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </SimpleGrid>
          )}

          {filteredOrders.length === 0 && (
            <Box textAlign="center" py={10}>
              <Text color="gray.500">ไม่พบคำสั่งซื้อที่ตรงกับเงื่อนไขการค้นหา</Text>
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
                <Text>รายละเอียดคำสั่งซื้อ {selectedOrder?.id}</Text>
                <HStack>
                  {selectedOrder && getStatusBadge(selectedOrder.status)}
                  {selectedOrder && getPaymentBadge(selectedOrder.paymentStatus)}
                </HStack>
              </VStack>
              <HStack>
                <Menu>
                  <MenuButton as={Button} size="sm" leftIcon={<Edit size={14} />}>
                    เปลี่ยนสถานะ
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'processing');
                      onDetailClose();
                    }}>
                      เปลี่ยนเป็น "กำลังจัดเตรียม"
                    </MenuItem>
                    <MenuItem onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'shipped');
                      onDetailClose();
                    }}>
                      เปลี่ยนเป็น "กำลังจัดส่ง"
                    </MenuItem>
                    <MenuItem onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'delivered');
                      onDetailClose();
                    }}>
                      เปลี่ยนเป็น "จัดส่งแล้ว"
                    </MenuItem>
                    <MenuItem onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'cancelled');
                      onDetailClose();
                    }} color="red.500">
                      ยกเลิกคำสั่งซื้อ
                    </MenuItem>
                  </MenuList>
                </Menu>
                <Button size="sm" leftIcon={<MessageSquare size={14} />} onClick={onNoteOpen}>
                  เพิ่มหมายเหตุ
                </Button>
              </HStack>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedOrder && (
              <Tabs>
                <TabList>
                  <Tab>ข้อมูลทั่วไป</Tab>
                  <Tab>รายการสินค้า</Tab>
                  <Tab>ไทม์ไลน์</Tab>
                  <Tab>หมายเหตุ ({selectedOrder.notes?.length || 0})</Tab>
                  <Tab>การคืนเงิน</Tab>
                  <Tab>เอกสาร</Tab>
                </TabList>

                <TabPanels>
                  {/* General Info Tab */}
                  <TabPanel>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      {/* Customer Info */}
                      <Card>
                        <CardHeader>
                          <Text fontSize="lg" fontWeight="bold">ข้อมูลลูกค้า</Text>
                        </CardHeader>
                        <CardBody>
                          <VStack align="start" spacing={3}>
                            <HStack>
                              <Avatar size="sm" name={selectedOrder.customer.name} />
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="bold">{selectedOrder.customer.name}</Text>
                                <Text fontSize="sm" color="gray.600">{selectedOrder.customer.email}</Text>
                              </VStack>
                            </HStack>
                            <HStack>
                              <Phone size={16} />
                              <Text>{selectedOrder.customer.phone}</Text>
                            </HStack>
                          </VStack>
                        </CardBody>
                      </Card>

                      {/* Store Info */}
                      <Card>
                        <CardHeader>
                          <Text fontSize="lg" fontWeight="bold">ข้อมูลร้านค้า</Text>
                        </CardHeader>
                        <CardBody>
                          <VStack align="start" spacing={3}>
                            <HStack>
                              <Store size={16} />
                              <Text fontWeight="bold">{selectedOrder.store.name}</Text>
                            </HStack>
                            <Text fontSize="sm" color="gray.600">รหัสร้าน: {selectedOrder.store.id}</Text>
                          </VStack>
                        </CardBody>
                      </Card>

                      {/* Shipping Address */}
                      <Card>
                        <CardHeader>
                          <Text fontSize="lg" fontWeight="bold">ที่อยู่จัดส่ง</Text>
                        </CardHeader>
                        <CardBody>
                          <VStack align="start" spacing={2}>
                            <HStack align="start">
                              <MapPin size={16} style={{ marginTop: '2px' }} />
                              <VStack align="start" spacing={1}>
                                <Text>{selectedOrder.shippingAddress.address}</Text>
                                <Text>{selectedOrder.shippingAddress.district}</Text>
                                <Text>{selectedOrder.shippingAddress.province} {selectedOrder.shippingAddress.zipcode}</Text>
                              </VStack>
                            </HStack>
                          </VStack>
                        </CardBody>
                      </Card>

                      {/* Order Summary */}
                      <Card>
                        <CardHeader>
                          <Text fontSize="lg" fontWeight="bold">สรุปคำสั่งซื้อ</Text>
                        </CardHeader>
                        <CardBody>
                          <VStack align="start" spacing={3}>
                            <HStack justify="space-between" w="full">
                              <Text>วันที่สั่งซื้อ:</Text>
                              <Text>{new Date(selectedOrder.orderDate).toLocaleString('th-TH')}</Text>
                            </HStack>
                            <HStack justify="space-between" w="full">
                              <Text>ยอดรวม:</Text>
                              <Text fontWeight="bold" color="green.600" fontSize="lg">
                                ฿{selectedOrder.total.toLocaleString()}
                              </Text>
                            </HStack>
                            <HStack justify="space-between" w="full">
                              <Text>จำนวนรายการ:</Text>
                              <Text>{selectedOrder.items.length} รายการ</Text>
                            </HStack>
                            {selectedOrder.flags.length > 0 && (
                              <Box w="full">
                                <Text mb={2}>แจ้งเตือน:</Text>
                                <Wrap>
                                  {selectedOrder.flags.map(flag => (
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
                        <Text fontSize="lg" fontWeight="bold">รายการสินค้า</Text>
                      </CardHeader>
                      <CardBody>
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              <Th>สินค้า</Th>
                              <Th>จำนวน</Th>
                              <Th>ราคาต่อหน่วย</Th>
                              <Th>ราคารวม</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {selectedOrder.items.map((item, index) => (
                              <Tr key={index}>
                                <Td>{item.name}</Td>
                                <Td>{item.quantity}</Td>
                                <Td>฿{item.price.toLocaleString()}</Td>
                                <Td fontWeight="bold">฿{(item.price * item.quantity).toLocaleString()}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                        <Divider my={4} />
                        <HStack justify="space-between">
                          <Text fontSize="lg" fontWeight="bold">ยอดรวมทั้งสิ้น:</Text>
                          <Text fontSize="lg" fontWeight="bold" color="green.600">
                            ฿{selectedOrder.total.toLocaleString()}
                          </Text>
                        </HStack>
                      </CardBody>
                    </Card>
                  </TabPanel>

                  {/* Timeline Tab */}
                  <TabPanel>
                    <Card>
                      <CardHeader>
                        <Text fontSize="lg" fontWeight="bold">ไทม์ไลน์คำสั่งซื้อ</Text>
                      </CardHeader>
                      <CardBody>
                        <VStack align="start" spacing={4} w="full">
                          {selectedOrder.timeline.map((step, index) => (
                            <TimelineStep 
                              key={index} 
                              step={step} 
                              isLast={index === selectedOrder.timeline.length - 1} 
                            />
                          ))}
                        </VStack>
                      </CardBody>
                    </Card>
                  </TabPanel>

                  {/* Notes Tab */}
                  <TabPanel>
                    <VStack spacing={4} align="start" w="full">
                      {selectedOrder.notes && selectedOrder.notes.length > 0 ? (
                        selectedOrder.notes.map(note => (
                          <Card key={note.id} w="full">
                            <CardBody>
                              <VStack align="start" spacing={2}>
                                <HStack justify="space-between" w="full">
                                  <Text fontWeight="bold">{note.author}</Text>
                                  <Text fontSize="sm" color="gray.600">
                                    {new Date(note.date).toLocaleString('th-TH')}
                                  </Text>
                                </HStack>
                                <Text>{note.text}</Text>
                              </VStack>
                            </CardBody>
                          </Card>
                        ))
                      ) : (
                        <Alert status="info">
                          <AlertIcon />
                          <AlertTitle>ไม่มีหมายเหตุ</AlertTitle>
                          <AlertDescription>ยังไม่มีหมายเหตุสำหรับคำสั่งซื้อนี้</AlertDescription>
                        </Alert>
                      )}
                    </VStack>
                  </TabPanel>

                  {/* Refund Tab */}
                  <TabPanel>
                    <Card>
                      <CardHeader>
                        <Text fontSize="lg" fontWeight="bold">การคืนเงิน</Text>
                      </CardHeader>
                      <CardBody>
                        {selectedOrder.refund ? (
                          <VStack align="start" spacing={4}>
                            <HStack justify="space-between" w="full">
                              <Text>จำนวนเงินที่คืน:</Text>
                              <Text fontWeight="bold" color="red.500">
                                ฿{selectedOrder.refund.amount.toLocaleString()}
                              </Text>
                            </HStack>
                            <HStack justify="space-between" w="full">
                              <Text>สถานะ:</Text>
                              <Badge colorScheme={selectedOrder.refund.status === 'completed' ? 'green' : 'orange'}>
                                {selectedOrder.refund.status === 'completed' ? 'คืนเงินแล้ว' : 'กำลังดำเนินการ'}
                              </Badge>
                            </HStack>
                            <HStack justify="space-between" w="full">
                              <Text>วันที่คืนเงิน:</Text>
                              <Text>{new Date(selectedOrder.refund.date).toLocaleString('th-TH')}</Text>
                            </HStack>
                          </VStack>
                        ) : (
                          <VStack spacing={4}>
                            <Alert status="info">
                              <AlertIcon />
                              <AlertTitle>ไม่มีการคืนเงิน</AlertTitle>
                              <AlertDescription>คำสั่งซื้อนี้ยังไม่มีการร้องขอคืนเงิน</AlertDescription>
                            </Alert>
                            <Button colorScheme="red" size="sm" leftIcon={<DollarSign size={14} />}>
                              สร้างคำขอคืนเงิน
                            </Button>
                          </VStack>
                        )}
                      </CardBody>
                    </Card>
                  </TabPanel>

                  {/* Documents Tab */}
                  <TabPanel>
                    <Card>
                      <CardHeader>
                        <HStack justify="space-between">
                          <Text fontSize="lg" fontWeight="bold">เอกสารและไฟล์แนบ</Text>
                          <Button size="sm" leftIcon={<Upload size={14} />}>
                            อัปโหลดไฟล์
                          </Button>
                        </HStack>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={4} align="start">
                          <Alert status="info">
                            <AlertIcon />
                            <AlertTitle>ไม่มีเอกสาร</AlertTitle>
                            <AlertDescription>ยังไม่มีเอกสารที่แนบมากับคำสั่งซื้อนี้</AlertDescription>
                          </Alert>
                          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
                            <Button leftIcon={<FileText size={16} />} variant="outline">
                              ใบเสร็จ/ใบกำกับภาษี
                            </Button>
                            <Button leftIcon={<Camera size={16} />} variant="outline">
                              รูปสินค้าก่อนจัดส่ง
                            </Button>
                            <Button leftIcon={<Package size={16} />} variant="outline">
                              ใบปะหน้ากล่องพัสดุ
                            </Button>
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
          <ModalHeader>เพิ่มหมายเหตุ</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>หมายเหตุ</FormLabel>
              <Textarea
                placeholder="ใส่หมายเหตุของคุณที่นี่..."
                rows={4}
                id="note-textarea"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onNoteClose}>
              ยกเลิก
            </Button>
            <Button colorScheme="blue" onClick={() => {
              const textarea = document.getElementById('note-textarea');
              if (textarea && selectedOrder) {
                addNote(selectedOrder.id, textarea.value);
                textarea.value = '';
                onNoteClose();
              }
            }}>
              บันทึก
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Advanced Filter Modal */}
      <Modal isOpen={isFilterOpen} onClose={onFilterClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ตัวกรองขั้นสูง</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="start">
              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl>
                  <FormLabel>วันที่เริ่มต้น</FormLabel>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>วันที่สิ้นสุด</FormLabel>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  />
                </FormControl>
              </SimpleGrid>
              <FormControl>
                <FormLabel>ร้านค้า</FormLabel>
                <Input
                  placeholder="ชื่อร้านค้า"
                  value={filters.store}
                  onChange={(e) => setFilters(prev => ({ ...prev, store: e.target.value }))}
                />
              </FormControl>
              <FormControl>
                <FormLabel>ยอดขายขั้นต่ำ (บาท)</FormLabel>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minAmount || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                />
              </FormControl>
              <FormControl>
                <FormLabel>ยอดขายสูงสุด (บาท)</FormLabel>
                <Input
                  type="number"
                  placeholder="ไม่จำกัด"
                  value={filters.maxAmount || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => {
              setFilters({
                search: '',
                status: '',
                dateFrom: '',
                dateTo: '',
                store: '',
                paymentStatus: '',
                minAmount: '',
                maxAmount: ''
              });
            }}>
              ล้างทั้งหมด
            </Button>
            <Button colorScheme="blue" onClick={onFilterClose}>
              ใช้ตัวกรอง
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default OrderManagementDashboard;