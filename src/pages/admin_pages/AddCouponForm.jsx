import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  Button,
  Text,
  Heading,
  useToast,
  Grid,
  GridItem,
  Divider,
  Badge,
  Flex,
  Spacer,
  Textarea,
  Checkbox,
  CheckboxGroup,
  Stack,
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputLeftElement,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Switch,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  RadioGroup,
  Radio,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Container,
  useBreakpointValue,
  Collapse,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Center,
  Spinner,
  Progress,
} from "@chakra-ui/react";
import {
  SearchIcon,
  EditIcon,
  DeleteIcon,
  AddIcon,
  CalendarIcon,
  WarningIcon,
  InfoIcon,
  CheckCircleIcon,
  TimeIcon,
  ViewIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  add_coupon,
  get_coupon,
  get_product,
  get_sellers,
  update_coupons,
} from "../../hooks/reducer/admin_reducer/provider_reducer";

const AddCouponForm = () => {
  // Original Redux logic (unchanged)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(get_product());
    dispatch(get_sellers());
    dispatch(get_coupon());
  }, [dispatch]);

  const {
    loader,
    get_products,
    get_seller,
    get_coupons,
  } = useSelector((state) => state.provider_reducer);

  const [stores, setStores] = useState();
  const [coupons, setCoupons] = useState();
  const [products, setProducts] = useState();

  useEffect(() => {
    setProducts(get_products);
    setStores(get_seller);
    setCoupons(get_coupons);
  }, [get_products, get_seller, get_coupons]);

  // Original form state (unchanged)
  const [formData, setFormData] = useState({
    coupon_code: "",
    discount_type: "percentage",
    discount_value: "",
    start_date: "",
    end_date: "",
    min_order_amount: 0,
    max_discount_amount: 0,
    usage_limit: 0,
    used_count: 0,
    status: "active",
    description: "",
    applicable_type: "all_system",
    applicable_stores: [],
    applicable_products: [],
  });

  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [selectedStores, setSelectedStores] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // UI state for responsive design
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const modalSize = useBreakpointValue({ base: "full", md: "6xl" });
  const cardSpacing = useBreakpointValue({ base: 4, md: 6 });
  
  // Color mode values
  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [couponToDelete, setCouponToDelete] = useState(null);

  // All original functions remain unchanged
  const validateForm = () => {
    const newErrors = {};

    if (!formData.coupon_code.trim()) {
      newErrors.coupon_code = "กรุณากรอกรหัสคูปอง";
    }

    if (!formData.discount_value || formData.discount_value <= 0) {
      newErrors.discount_value = "กรุณากรอกมูลค่าส่วนลดที่ถูกต้อง";
    }

    if (
      formData.discount_type === "percentage" &&
      formData.discount_value > 100
    ) {
      newErrors.discount_value = "เปอร์เซ็นต์ส่วนลดต้องไม่เกิน 100%";
    }

    if (!formData.start_date) {
      newErrors.start_date = "กรุณาเลือกวันที่เริ่มต้น";
    }

    if (!formData.end_date) {
      newErrors.end_date = "กรุณาเลือกวันที่สิ้นสุด";
    }

    if (
      formData.start_date &&
      formData.end_date &&
      formData.start_date >= formData.end_date
    ) {
      newErrors.end_date = "วันที่สิ้นสุดต้องหลังจากวันที่เริ่มต้น";
    }

    if (
      formData.applicable_type === "specific_stores" &&
      selectedStores.length === 0
    ) {
      newErrors.stores = "กรุณาเลือกร้านค้าอย่างน้อย 1 ร้าน";
    }

    if (
      formData.applicable_type === "specific_products" &&
      selectedProducts.length === 0
    ) {
      newErrors.products = "กรุณาเลือกสินค้าอย่างน้อย 1 รายการ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleApplicableTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      applicable_type: value,
      applicable_stores: [],
      applicable_products: [],
    }));
    setSelectedStores([]);
    setSelectedProducts([]);

    setErrors((prev) => ({
      ...prev,
      stores: null,
      products: null,
    }));
  };

  const handleStoreSelection = (e, store) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      setFormData((prev) => ({
        ...prev,
        applicable_stores: [store.user_id],
        applicable_products: [],
      }));
      setSelectedProducts([]);
      setSelectedStores((prev) =>
        prev.find((s) => s._id === store._id) ? prev : [...prev, store]
      );
    } else {
      setSelectedStores((prev) => prev.filter((s) => s._id !== store._id));
    }
  };

  const handleProductSelection = (productIds) => {
    setSelectedProducts(productIds);
    setFormData((prev) => ({
      ...prev,
      applicable_products: productIds,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const couponData = {
        ...formData,
        applicable_stores:
          formData.applicable_type === "specific_stores"
            ? selectedStores.map((store) => store.user_id)
            : [],
        applicable_products:
          formData.applicable_type === "specific_products"
            ? selectedProducts
            : [],
        id: editingCoupon ? editingCoupon._id : undefined,
      };

      if (editingCoupon) {
        dispatch(update_coupons(couponData)).then(() => dispatch(get_coupon()));
        console.log("edit", couponData);
      } else {
        setCoupons((prev) => [...prev, couponData]);
        dispatch(add_coupon(couponData)).then(() => dispatch(get_coupon()));
        console.log("add", couponData);
        toast({
          title: "สำเร็จ",
          description: "เพิ่มคูปองใหม่เรียบร้อยแล้ว",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      handleCancel();
      onClose();
    }
  };

  const handleCancel = () => {
    setFormData({
      coupon_code: "",
      discount_type: "percentage",
      discount_value: "",
      start_date: "",
      end_date: "",
      min_order_amount: 0,
      max_discount_amount: 0,
      usage_limit: 0,
      used_count: 0,
      status: "active",
      description: "",
      applicable_type: "all_system",
      applicable_stores: [],
      applicable_products: [],
    });
    setSelectedStores([]);
    setSelectedProducts([]);
    setErrors({});
    setEditingCoupon(null);
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);

    setFormData({
      ...coupon,
      start_date: coupon.start_date
        ? new Date(coupon.start_date).toISOString().split("T")[0]
        : "",
      end_date: coupon.end_date
        ? new Date(coupon.end_date).toISOString().split("T")[0]
        : "",
    });

    if (
      coupon.applicable_type === "specific_stores" &&
      coupon.applicable_stores
    ) {
      const selectedStoreObjects =
        stores?.filter((store) =>
          coupon.applicable_stores.includes(store.user_id)
        ) || [];
      setSelectedStores(selectedStoreObjects);
    } else {
      setSelectedStores([]);
    }

    if (
      coupon.applicable_type === "specific_products" &&
      coupon.applicable_products
    ) {
      setSelectedProducts(coupon.applicable_products);
    } else {
      setSelectedProducts([]);
    }

    onOpen();
  };

  const handleDelete = (coupon) => {
    setCouponToDelete(coupon);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    setCoupons((prev) =>
      prev.filter((coupon) => coupon.id !== couponToDelete.id)
    );
    toast({
      title: "สำเร็จ",
      description: "ลบคูปองเรียบร้อยแล้ว",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onDeleteClose();
    setCouponToDelete(null);
  };

  const getCouponStatus = (coupon) => {
    const now = new Date();
    const startDate = new Date(coupon.start_date);
    const endDate = new Date(coupon.end_date);
    const daysUntilExpiry = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

    if (coupon.status === "inactive") return "inactive";
    if (endDate < now) return "expired";
    if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) return "expiring_soon";
    if (startDate <= now && endDate >= now) return "active";
    return "pending";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "gray";
      case "expired":
        return "red";
      case "expiring_soon":
        return "orange";
      case "pending":
        return "blue";
      default:
        return "gray";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "ใช้งานได้";
      case "inactive":
        return "ไม่ใช้งาน";
      case "expired":
        return "หมดอายุ";
      case "expiring_soon":
        return "กำลังหมดอายุ";
      case "pending":
        return "รอเริ่มใช้งาน";
      default:
        return status;
    }
  };

  const getApplicableText = (coupon) => {
    switch (coupon.applicable_type) {
      case "all_system":
        return "ทั้งระบบ";
      case "specific_stores": {
        const storeNames = coupon.applicable_stores
          .map((id) => stores?.find((s) => s._id === id)?.name)
          .filter(Boolean);
        return storeNames.length > 0 ? storeNames.join(", ") : "ไม่ระบุร้าน";
      }
      case "specific_products": {
        const productNames = coupon.applicable_products
          .map((id) => products?.find((p) => p._id === id)?.name)
          .filter(Boolean);
        return productNames.length > 0
          ? `${productNames.length} สินค้า`
          : "ไม่ระบุสินค้า";
      }
      default:
        return "ไม่ระบุ";
    }
  };

  const filteredCoupons = coupons?.filter((coupon) => {
    const matchesSearch =
      coupon.coupon_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || getCouponStatus(coupon) === statusFilter;

    let matchesStore = true;
    if (storeFilter !== "all") {
      const storeId = parseInt(storeFilter);
      if (coupon.applicable_type === "all_system") {
        matchesStore = true;
      } else if (coupon.applicable_type === "specific_stores") {
        matchesStore = coupon.applicable_stores.includes(storeId);
      } else if (coupon.applicable_type === "specific_products") {
        const storeProducts = products.filter((p) => p.user_id._id === storeId);
        matchesStore = storeProducts.some((p) =>
          coupon.applicable_products.includes(p.id)
        );
      }
    }

    return matchesSearch && matchesStatus && matchesStore;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount || 0);
  };

  const handleChange = (values) => {
    setSelectedStores(values);
  };

  // Loading state
  if (loader) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6}>
          <Card w="full" bg={cardBg}>
            <CardBody>
              <VStack spacing={4}>
                <Spinner size="xl" color="blue.500" />
                <Text>กำลังโหลดข้อมูล...</Text>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    );
  }

  return (
    <Box bg={bg} minH="100vh">
      <Container maxW="container.xl" py={cardSpacing}>
        <VStack spacing={cardSpacing} align="stretch">
          {/* Enhanced Header with Stats */}
          <Card 
            shadow="xl" 
            bg={cardBg} 
            borderWidth="1px" 
            borderColor={borderColor}
            _hover={{ shadow: "2xl" }}
            transition="all 0.2s"
          >
            <CardHeader>
              <VStack spacing={4}>
                <Flex 
                  direction={{ base: "column", lg: "row" }} 
                  justify="space-between" 
                  align={{ base: "stretch", lg: "center" }}
                  w="full"
                  gap={4}
                >
                  <VStack align={{ base: "center", lg: "start" }} spacing={2}>
                    <Heading 
                      size={{ base: "lg", md: "xl" }} 
                      color="blue.600"
                      textAlign={{ base: "center", lg: "left" }}
                    >
                      🎫 จัดการคูปองส่วนลด
                    </Heading>
                    <Text 
                      color="gray.600" 
                      fontSize={{ base: "sm", md: "md" }}
                      textAlign={{ base: "center", lg: "left" }}
                    >
                      จัดการคูปองสำหรับทั้งระบบ ร้านค้าเฉพาะ หรือสินค้าเฉพาะ
                    </Text>
                  </VStack>
                  
                  <Button
                    leftIcon={<AddIcon />}
                    colorScheme="blue"
                    size={{ base: "md", md: "lg" }}
                    onClick={() => {
                      handleCancel();
                      onOpen();
                    }}
                    shadow="lg"
                    _hover={{ 
                      transform: "translateY(-2px)",
                      shadow: "xl"
                    }}
                    transition="all 0.2s"
                    w={{ base: "full", lg: "auto" }}
                  >
                    เพิ่มคูปองใหม่
                  </Button>
                </Flex>

                {/* Stats Cards */}
                <SimpleGrid 
                  columns={{ base: 2, md: 4 }} 
                  spacing={4} 
                  w="full"
                  pt={4}
                >
                  <Card size="sm" bg="green.50" borderLeft="4px" borderLeftColor="green.400">
                    <CardBody>
                      <Stat>
                        <StatLabel fontSize="xs" color="green.600">ใช้งานได้</StatLabel>
                        <StatNumber fontSize="lg" color="green.700">
                          {coupons?.filter(c => getCouponStatus(c) === 'active').length || 0}
                        </StatNumber>
                      </Stat>
                    </CardBody>
                  </Card>
                  
                  <Card size="sm" bg="orange.50" borderLeft="4px" borderLeftColor="orange.400">
                    <CardBody>
                      <Stat>
                        <StatLabel fontSize="xs" color="orange.600">กำลังหมดอายุ</StatLabel>
                        <StatNumber fontSize="lg" color="orange.700">
                          {coupons?.filter(c => getCouponStatus(c) === 'expiring_soon').length || 0}
                        </StatNumber>
                      </Stat>
                    </CardBody>
                  </Card>
                  
                  <Card size="sm" bg="red.50" borderLeft="4px" borderLeftColor="red.400">
                    <CardBody>
                      <Stat>
                        <StatLabel fontSize="xs" color="red.600">หมดอายุ</StatLabel>
                        <StatNumber fontSize="lg" color="red.700">
                          {coupons?.filter(c => getCouponStatus(c) === 'expired').length || 0}
                        </StatNumber>
                      </Stat>
                    </CardBody>
                  </Card>
                  
                  <Card size="sm" bg="blue.50" borderLeft="4px" borderLeftColor="blue.400">
                    <CardBody>
                      <Stat>
                        <StatLabel fontSize="xs" color="blue.600">ทั้งหมด</StatLabel>
                        <StatNumber fontSize="lg" color="blue.700">
                          {coupons?.length || 0}
                        </StatNumber>
                      </Stat>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </VStack>
            </CardHeader>
          </Card>

          {/* Enhanced Search and Filter */}
          <Card shadow="lg" bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <VStack spacing={4}>
                {/* Search Bar */}
                <InputGroup size="lg">
                  <InputLeftElement>
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="🔍 ค้นหาด้วยรหัสคูปองหรือคำอธิบาย..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    bg="white"
                    borderRadius="xl"
                    fontSize={{ base: "sm", md: "md" }}
                    _focus={{
                      borderColor: "blue.400",
                      shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                    }}
                  />
                </InputGroup>

                {/* Filter Toggle for Mobile */}
                {isMobile && (
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    rightIcon={showFilters ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    w="full"
                    justifyContent="space-between"
                  >
                    ตัวกรอง
                  </Button>
                )}

                {/* Filters */}
                <Collapse in={!isMobile || showFilters}>
                  <Grid 
                    templateColumns={{ base: "1fr", md: "1fr 1fr" }} 
                    gap={4}
                    w="full"
                  >
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium">สถานะ</FormLabel>
                      <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        bg="white"
                        borderRadius="lg"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        <option value="all">📊 สถานะทั้งหมด</option>
                        <option value="active">✅ ใช้งานได้</option>
                        <option value="expiring_soon">⏰ กำลังหมดอายุ</option>
                        <option value="expired">❌ หมดอายุ</option>
                        <option value="inactive">⏸️ ไม่ใช้งาน</option>
                        <option value="pending">⏳ รอเริ่มใช้งาน</option>
                      </Select>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="medium">ร้านค้า</FormLabel>
                      <Select
                        value={storeFilter}
                        onChange={(e) => setStoreFilter(e.target.value)}
                        bg="white"
                        borderRadius="lg"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        <option value="all">🏪 ร้านค้าทั้งหมด</option>
                        {stores?.map((store) => (
                          <option key={store._id} value={store._id}>
                            {store.store_name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Collapse>
              </VStack>
            </CardBody>
          </Card>

          {/* Enhanced Coupons Display */}
          <Card shadow="xl" bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody p={0}>
              {/* Desktop Table View */}
              <Box display={{ base: "none", lg: "block" }}>
                <TableContainer>
                  <Table variant="simple" size="md">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th py={4} fontSize="sm" fontWeight="bold">รหัสคูปอง</Th>
                        <Th py={4} fontSize="sm" fontWeight="bold">ส่วนลด</Th>
                        <Th py={4} fontSize="sm" fontWeight="bold">วันที่ใช้งาน</Th>
                        <Th py={4} fontSize="sm" fontWeight="bold">การใช้งาน</Th>
                        <Th py={4} fontSize="sm" fontWeight="bold">สถานะ</Th>
                        <Th py={4} fontSize="sm" fontWeight="bold">ขอบเขต</Th>
                        <Th py={4} fontSize="sm" fontWeight="bold">จัดการ</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredCoupons?.map((coupon, index) => {
                        const currentStatus = getCouponStatus(coupon);
                        return (
                          <Tr 
                            key={index}
                            _hover={{ bg: "gray.50" }}
                            transition="all 0.2s"
                          >
                            <Td py={4}>
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="bold" fontSize="md" color="blue.600">
                                  {coupon.coupon_code}
                                </Text>
                                <Text fontSize="sm" color="gray.600" noOfLines={2}>
                                  {coupon.description}
                                </Text>
                              </VStack>
                            </Td>
                            <Td py={4}>
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="semibold" fontSize="lg">
                                  {coupon.discount_type === "percentage"
                                    ? `${coupon.discount_value}%`
                                    : formatCurrency(coupon.discount_value)}
                                </Text>
                                {coupon.min_order_amount > 0 && (
                                  <Text fontSize="xs" color="gray.600">
                                    ขั้นต่ำ {formatCurrency(coupon.min_order_amount)}
                                  </Text>
                                )}
                                {coupon.max_discount_amount > 0 && (
                                  <Text fontSize="xs" color="gray.600">
                                    สูงสุด {formatCurrency(coupon.max_discount_amount)}
                                  </Text>
                                )}
                              </VStack>
                            </Td>
                            <Td py={4}>
                              <VStack align="start" spacing={1}>
                                <Text fontSize="sm" fontWeight="medium">
                                  📅 {formatDate(coupon.start_date)}
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                  📅 {formatDate(coupon.end_date)}
                                </Text>
                              </VStack>
                            </Td>
                            <Td py={4}>
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="semibold">
                                  {coupon.used_count} / {coupon.usage_limit || "ไม่จำกัด"}
                                </Text>
                                {coupon.usage_limit > 0 && (
                                  <Box w="60px">
                                    <Progress
                                      value={(coupon.used_count / coupon.usage_limit) * 100}
                                      size="sm"
                                      colorScheme="blue"
                                      borderRadius="md"
                                    />
                                  </Box>
                                )}
                              </VStack>
                            </Td>
                            <Td py={4}>
                              <Badge
                                colorScheme={getStatusColor(currentStatus)}
                                variant="subtle"
                                px={3}
                                py={1}
                                borderRadius="full"
                                fontSize="xs"
                                fontWeight="bold"
                              >
                                {getStatusText(currentStatus)}
                              </Badge>
                            </Td>
                            <Td py={4}>
                              <VStack align="start" spacing={1}>
                                <Badge
                                  colorScheme={
                                    coupon.applicable_type === "all_system"
                                      ? "purple"
                                      : coupon.applicable_type === "specific_stores"
                                      ? "blue"
                                      : "green"
                                  }
                                  variant="subtle"
                                  px={2}
                                  py={1}
                                  borderRadius="md"
                                  fontSize="xs"
                                >
                                  {coupon.applicable_type === "all_system"
                                    ? "🌐 ทั้งระบบ"
                                    : coupon.applicable_type === "specific_stores"
                                    ? "🏪 ร้านเฉพาะ"
                                    : "📦 สินค้าเฉพาะ"}
                                </Badge>
                                <Text fontSize="xs" color="gray.600" noOfLines={1}>
                                  {getApplicableText(coupon)}
                                </Text>
                              </VStack>
                            </Td>
                            <Td py={4}>
                              <HStack spacing={2}>
                                <IconButton
                                  icon={<EditIcon />}
                                  size="sm"
                                  colorScheme="blue"
                                  variant="ghost"
                                  onClick={() => handleEdit(coupon)}
                                  _hover={{ 
                                    bg: "blue.100",
                                    transform: "scale(1.05)"
                                  }}
                                  transition="all 0.2s"
                                  borderRadius="lg"
                                />
                                <IconButton
                                  icon={<DeleteIcon />}
                                  size="sm"
                                  colorScheme="red"
                                  variant="ghost"
                                  onClick={() => handleDelete(coupon)}
                                  _hover={{ 
                                    bg: "red.100",
                                    transform: "scale(1.05)"
                                  }}
                                  transition="all 0.2s"
                                  borderRadius="lg"
                                />
                              </HStack>
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Mobile Card View */}
              <Box display={{ base: "block", lg: "none" }} p={4}>
                <VStack spacing={4}>
                  {filteredCoupons?.map((coupon) => {
                    const currentStatus = getCouponStatus(coupon);
                    return (
                      <Card 
                        key={coupon._id} 
                        w="full" 
                        shadow="md"
                        borderWidth="1px"
                        borderColor={borderColor}
                        _hover={{ shadow: "lg" }}
                        transition="all 0.2s"
                      >
                        <CardBody p={4}>
                          <VStack spacing={3} align="stretch">
                            {/* Header */}
                            <Flex justify="space-between" align="start">
                              <VStack align="start" spacing={1} flex="1">
                                <Text fontWeight="bold" fontSize="lg" color="blue.600">
                                  {coupon.coupon_code}
                                </Text>
                                <Text fontSize="sm" color="gray.600" noOfLines={2}>
                                  {coupon.description}
                                </Text>
                              </VStack>
                              <Badge
                                colorScheme={getStatusColor(currentStatus)}
                                variant="subtle"
                                px={3}
                                py={1}
                                borderRadius="full"
                                fontSize="xs"
                                fontWeight="bold"
                              >
                                {getStatusText(currentStatus)}
                              </Badge>
                            </Flex>

                            <Divider />

                            {/* Content */}
                            <SimpleGrid columns={2} spacing={3}>
                              <VStack align="start" spacing={1}>
                                <Text fontSize="xs" color="gray.500" fontWeight="medium">
                                  ส่วนลด
                                </Text>
                                <Text fontWeight="bold" fontSize="lg" color="green.600">
                                  {coupon.discount_type === "percentage"
                                    ? `${coupon.discount_value}%`
                                    : formatCurrency(coupon.discount_value)}
                                </Text>
                                {coupon.min_order_amount > 0 && (
                                  <Text fontSize="xs" color="gray.600">
                                    ขั้นต่ำ {formatCurrency(coupon.min_order_amount)}
                                  </Text>
                                )}
                              </VStack>

                              <VStack align="start" spacing={1}>
                                <Text fontSize="xs" color="gray.500" fontWeight="medium">
                                  การใช้งาน
                                </Text>
                                <Text fontWeight="semibold">
                                  {coupon.used_count} / {coupon.usage_limit || "ไม่จำกัด"}
                                </Text>
                                {coupon.usage_limit > 0 && (
                                  <Box w="full">
                                    <Progress 
                                      value={(coupon.used_count / coupon.usage_limit) * 100}
                                      size="sm"
                                      colorScheme="blue"
                                      borderRadius="md"
                                    />
                                  </Box>
                                )}
                              </VStack>
                            </SimpleGrid>

                            <VStack align="start" spacing={2}>
                              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                                วันที่ใช้งาน
                              </Text>
                              <HStack spacing={2} fontSize="sm">
                                <Text>📅 {formatDate(coupon.start_date)}</Text>
                                <Text color="gray.400">-</Text>
                                <Text>📅 {formatDate(coupon.end_date)}</Text>
                              </HStack>
                            </VStack>

                            <VStack align="start" spacing={2}>
                              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                                ขอบเขตการใช้งาน
                              </Text>
                              <HStack>
                                <Badge
                                  colorScheme={
                                    coupon.applicable_type === "all_system"
                                      ? "purple"
                                      : coupon.applicable_type === "specific_stores"
                                      ? "blue"
                                      : "green"
                                  }
                                  variant="subtle"
                                  fontSize="xs"
                                >
                                  {coupon.applicable_type === "all_system"
                                    ? "🌐 ทั้งระบบ"
                                    : coupon.applicable_type === "specific_stores"
                                    ? "🏪 ร้านเฉพาะ"
                                    : "📦 สินค้าเฉพาะ"}
                                </Badge>
                              </HStack>
                              <Text fontSize="xs" color="gray.600">
                                {getApplicableText(coupon)}
                              </Text>
                            </VStack>

                            <Divider />

                            {/* Actions */}
                            <HStack spacing={2} justify="center">
                              <Button
                                leftIcon={<EditIcon />}
                                size="sm"
                                colorScheme="blue"
                                variant="outline"
                                onClick={() => handleEdit(coupon)}
                                flex="1"
                                _hover={{ 
                                  bg: "blue.50",
                                  transform: "translateY(-1px)"
                                }}
                                transition="all 0.2s"
                              >
                                แก้ไข
                              </Button>
                              <Button
                                leftIcon={<DeleteIcon />}
                                size="sm"
                                colorScheme="red"
                                variant="outline"
                                onClick={() => handleDelete(coupon)}
                                flex="1"
                                _hover={{ 
                                  bg: "red.50",
                                  transform: "translateY(-1px)"
                                }}
                                transition="all 0.2s"
                              >
                                ลบ
                              </Button>
                            </HStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })}
                </VStack>
              </Box>

              {/* Empty State */}
              {filteredCoupons?.length === 0 && (
                <Center py={12}>
                  <VStack spacing={4}>
                    <Text fontSize="6xl">🔍</Text>
                    <VStack spacing={2}>
                      <Text fontSize="lg" fontWeight="medium" color="gray.600">
                        ไม่พบคูปองที่ตรงกับเงื่อนไขการค้นหา
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        ลองเปลี่ยนคำค้นหาหรือตัวกรอง หรือสร้างคูปองใหม่
                      </Text>
                    </VStack>
                    <Button
                      leftIcon={<AddIcon />}
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => {
                        handleCancel();
                        onOpen();
                      }}
                    >
                      เพิ่มคูปองใหม่
                    </Button>
                  </VStack>
                </Center>
              )}
            </CardBody>
          </Card>
        </VStack>

        {/* Enhanced Add/Edit Coupon Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
          <ModalContent 
            borderRadius="2xl" 
            shadow="2xl"
            maxH="90vh"
            overflowY="auto"
            mx={{ base: 2, md: 4 }}
          >
            <ModalHeader 
              bg="blue.500" 
              color="white" 
              borderTopRadius="2xl"
              py={6}
            >
              <HStack spacing={3}>
                <Box bg="white" p={2} borderRadius="xl">
                  <Text fontSize="2xl">🎫</Text>
                </Box>
                <VStack align="start" spacing={0}>
                  <Text fontSize="xl" fontWeight="bold">
                    {editingCoupon ? "✏️ แก้ไขคูปอง" : "➕ เพิ่มคูปองใหม่"}
                  </Text>
                  <Text fontSize="sm" opacity={0.9}>
                    {editingCoupon ? "อัปเดตข้อมูลคูปอง" : "สร้างคูปองส่วนลดใหม่"}
                  </Text>
                </VStack>
              </HStack>
            </ModalHeader>
            <ModalCloseButton color="white" size="lg" />
            
            <ModalBody p={6}>
              <form onSubmit={handleSubmit}>
                <VStack spacing={8} align="stretch">
                  {/* Basic Information */}
                  <Card bg="blue.50" borderLeft="4px" borderLeftColor="blue.400">
                    <CardHeader pb={3}>
                      <HStack>
                        <Text fontSize="2xl">📝</Text>
                        <Heading size="md" color="blue.700">ข้อมูลพื้นฐาน</Heading>
                      </HStack>
                    </CardHeader>
                    <CardBody pt={0}>
                      <Grid
                        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                        gap={6}
                      >
                        <FormControl isInvalid={errors.coupon_code} isRequired>
                          <FormLabel fontWeight="semibold" color="gray.700">
                            🏷️ รหัสคูปอง
                          </FormLabel>
                          <Input
                            type="text"
                            value={formData?.coupon_code}
                            onChange={(e) =>
                              handleInputChange(
                                "coupon_code",
                                e.target.value.toUpperCase()
                              )
                            }
                            placeholder="เช่น WELCOME20"
                            textTransform="uppercase"
                            bg="white"
                            borderRadius="lg"
                            fontSize="lg"
                            fontWeight="bold"
                            _focus={{
                              borderColor: "blue.400",
                              shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                            }}
                          />
                          <FormErrorMessage>{errors.coupon_code}</FormErrorMessage>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontWeight="semibold" color="gray.700">
                            ⚡ สถานะ
                          </FormLabel>
                          <Select
                            value={formData?.status}
                            onChange={(e) =>
                              handleInputChange("status", e.target.value)
                            }
                            bg="white"
                            borderRadius="lg"
                            _focus={{
                              borderColor: "blue.400",
                              shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                            }}
                          >
                            <option value="active">✅ ใช้งานได้</option>
                            <option value="inactive">⏸️ ไม่ใช้งาน</option>
                          </Select>
                        </FormControl>
                      </Grid>

                      <FormControl mt={6}>
                        <FormLabel fontWeight="semibold" color="gray.700">
                          📄 คำอธิบาย
                        </FormLabel>
                        <Textarea
                          value={formData?.description}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          placeholder="อธิบายเกี่ยวกับคูปองนี้..."
                          resize="vertical"
                          bg="white"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "blue.400",
                            shadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
                          }}
                        />
                      </FormControl>
                    </CardBody>
                  </Card>

                  {/* Discount Settings */}
                  <Card bg="green.50" borderLeft="4px" borderLeftColor="green.400">
                    <CardHeader pb={3}>
                      <HStack>
                        <Text fontSize="2xl">💰</Text>
                        <Heading size="md" color="green.700">การตั้งค่าส่วนลด</Heading>
                      </HStack>
                    </CardHeader>
                    <CardBody pt={0}>
                      <Grid
                        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                        gap={6}
                      >
                        <FormControl>
                          <FormLabel fontWeight="semibold" color="gray.700">
                            🏷️ ประเภทส่วนลด
                          </FormLabel>
                          <Select
                            value={formData?.discount_type}
                            onChange={(e) =>
                              handleInputChange("discount_type", e.target.value)
                            }
                            bg="white"
                            borderRadius="lg"
                            _focus={{
                              borderColor: "green.400",
                              shadow: "0 0 0 1px rgba(72, 187, 120, 0.6)"
                            }}
                          >
                            <option value="percentage">📊 เปอร์เซ็นต์</option>
                            <option value="fixed">💵 จำนวนเงินคงที่</option>
                          </Select>
                        </FormControl>

                        <FormControl isInvalid={errors.discount_value} isRequired>
                          <FormLabel fontWeight="semibold" color="gray.700">
                            💎 มูลค่าส่วนลด{" "}
                            {formData?.discount_type === "percentage"
                              ? "(%)"
                              : "(บาท)"}
                          </FormLabel>
                          <NumberInput
                            min={0}
                            max={
                              formData?.discount_type === "percentage"
                                ? 100
                                : undefined
                            }
                            value={formData?.discount_value || ""}
                            onChange={(valueString) =>
                              handleInputChange("discount_value", valueString)
                            }
                          >
                            <NumberInputField
                              placeholder={
                                formData?.discount_type === "percentage"
                                  ? "20"
                                  : "100"
                              }
                              bg="white"
                              borderRadius="lg"
                              fontSize="lg"
                              fontWeight="semibold"
                              _focus={{
                                borderColor: "green.400",
                                shadow: "0 0 0 1px rgba(72, 187, 120, 0.6)"
                              }}
                            />
                          </NumberInput>
                          <FormErrorMessage>{errors.discount_value}</FormErrorMessage>
                        </FormControl>
                      </Grid>

                      <Grid
                        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                        gap={6}
                        mt={6}
                      >
                        <FormControl>
                          <FormLabel fontWeight="semibold" color="gray.700">
                            📈 ยอดสั่งซื้อขั้นต่ำ (บาท)
                          </FormLabel>
                          <NumberInput
                            min={0}
                            value={formData?.min_order_amount || 0}
                            onChange={(valueString, valueNumber) =>
                              handleInputChange(
                                "min_order_amount",
                                valueNumber || 0
                              )
                            }
                          >
                            <NumberInputField 
                              placeholder="ยอดสั่งซื้อขั้นต่ำ"
                              bg="white"
                              borderRadius="lg"
                              _focus={{
                                borderColor: "green.400",
                                shadow: "0 0 0 1px rgba(72, 187, 120, 0.6)"
                              }}
                            />
                          </NumberInput>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontWeight="semibold" color="gray.700">
                            🎯 จำนวนส่วนลดสูงสุด (บาท)
                          </FormLabel>
                          <NumberInput
                            min={0}
                            value={formData?.max_discount_amount || 0}
                            onChange={(valueString, valueNumber) =>
                              handleInputChange(
                                "max_discount_amount",
                                valueNumber || 0
                              )
                            }
                          >
                            <NumberInputField 
                              placeholder="จำนวนส่วนลดสูงสุด"
                              bg="white"
                              borderRadius="lg"
                              _focus={{
                                borderColor: "green.400",
                                shadow: "0 0 0 1px rgba(72, 187, 120, 0.6)"
                              }}
                            />
                          </NumberInput>
                        </FormControl>
                      </Grid>
                    </CardBody>
                  </Card>

                  {/* Date Range */}
                  <Card bg="purple.50" borderLeft="4px" borderLeftColor="purple.400">
                    <CardHeader pb={3}>
                      <HStack>
                        <Text fontSize="2xl">📅</Text>
                        <Heading size="md" color="purple.700">ระยะเวลาใช้งาน</Heading>
                      </HStack>
                    </CardHeader>
                    <CardBody pt={0}>
                      <Grid
                        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                        gap={6}
                      >
                        <FormControl isInvalid={errors.start_date} isRequired>
                          <FormLabel fontWeight="semibold" color="gray.700">
                            🚀 วันที่เริ่มต้น
                          </FormLabel>
                          <Input
                            type="date"
                            value={formData?.start_date}
                            onChange={(e) =>
                              handleInputChange("start_date", e.target.value)
                            }
                            bg="white"
                            borderRadius="lg"
                            _focus={{
                              borderColor: "purple.400",
                              shadow: "0 0 0 1px rgba(159, 122, 234, 0.6)"
                            }}
                          />
                          <FormErrorMessage>{errors.start_date}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.end_date} isRequired>
                          <FormLabel fontWeight="semibold" color="gray.700">
                            🏁 วันที่สิ้นสุด
                          </FormLabel>
                          <Input
                            type="date"
                            value={formData?.end_date}
                            onChange={(e) =>
                              handleInputChange("end_date", e.target.value)
                            }
                            bg="white"
                            borderRadius="lg"
                            _focus={{
                              borderColor: "purple.400",
                              shadow: "0 0 0 1px rgba(159, 122, 234, 0.6)"
                            }}
                          />
                          <FormErrorMessage>{errors.end_date}</FormErrorMessage>
                        </FormControl>
                      </Grid>
                    </CardBody>
                  </Card>

                  {/* Usage Limits */}
                  <Card bg="orange.50" borderLeft="4px" borderLeftColor="orange.400">
                    <CardHeader pb={3}>
                      <HStack>
                        <Text fontSize="2xl">🔢</Text>
                        <Heading size="md" color="orange.700">ข้อจำกัดการใช้งาน</Heading>
                      </HStack>
                    </CardHeader>
                    <CardBody pt={0}>
                      <Grid
                        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                        gap={6}
                      >
                        <FormControl>
                          <FormLabel fontWeight="semibold" color="gray.700">
                            🎟️ จำนวนครั้งที่ใช้ได้
                          </FormLabel>
                          <NumberInput
                            min={0}
                            value={formData?.usage_limit || 0}
                            onChange={(valueString, valueNumber) =>
                              handleInputChange("usage_limit", valueNumber || 0)
                            }
                          >
                            <NumberInputField
                              placeholder="0 = ไม่จำกัด"
                              bg="white"
                              borderRadius="lg"
                              _focus={{
                                borderColor: "orange.400",
                                shadow: "0 0 0 1px rgba(251, 211, 141, 0.6)"
                              }}
                            />
                          </NumberInput>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontWeight="semibold" color="gray.700">
                            📊 จำนวนครั้งที่ถูกใช้แล้ว
                          </FormLabel>
                          <NumberInput isReadOnly>
                            <NumberInputField
                              value={formData?.used_count}
                              bg="gray.100"
                              borderRadius="lg"
                              cursor="not-allowed"
                              fontWeight="semibold"
                            />
                          </NumberInput>
                        </FormControl>
                      </Grid>
                    </CardBody>
                  </Card>

                  {/* Applicable Scope */}
                  <Card bg="red.50" borderLeft="4px" borderLeftColor="red.400">
                    <CardHeader pb={3}>
                      <HStack>
                        <Text fontSize="2xl">🎯</Text>
                        <Heading size="md" color="red.700">ขอบเขตการใช้งาน</Heading>
                      </HStack>
                    </CardHeader>
                    <CardBody pt={0}>
                      <FormControl isInvalid={errors.stores || errors.products}>
                        <FormLabel fontWeight="semibold" color="gray.700" mb={4}>
                          เลือกขอบเขตการใช้งาน
                        </FormLabel>
                        
                        <RadioGroup
                          value={formData.applicable_type}
                          onChange={handleApplicableTypeChange}
                        >
                          <VStack align="start" spacing={6}>
                            <Card 
                              p={4} 
                              w="full" 
                              bg={formData.applicable_type === "all_system" ? "purple.100" : "white"}
                              borderColor={formData.applicable_type === "all_system" ? "purple.300" : "gray.200"}
                              borderWidth="2px"
                              cursor="pointer"
                              _hover={{ shadow: "md" }}
                              transition="all 0.2s"
                            >
                              <Radio 
                                value="all_system"
                                size="lg"
                                colorScheme="purple"
                              >
                                <VStack align="start" spacing={2} ml={2}>
                                  <HStack>
                                    <Text fontSize="xl">🌐</Text>
                                    <Text fontWeight="bold" fontSize="lg">
                                      ใช้ได้ทั้งระบบ
                                    </Text>
                                  </HStack>
                                  <Text fontSize="sm" color="gray.600">
                                    คูปองนี้สามารถใช้ได้กับทุกร้านค้าและทุกสินค้าในระบบ
                                  </Text>
                                </VStack>
                              </Radio>
                            </Card>

                            <Card 
                              p={4} 
                              w="full" 
                              bg={formData.applicable_type === "specific_stores" ? "blue.100" : "white"}
                              borderColor={formData.applicable_type === "specific_stores" ? "blue.300" : "gray.200"}
                              borderWidth="2px"
                              cursor="pointer"
                              _hover={{ shadow: "md" }}
                              transition="all 0.2s"
                            >
                              <Radio 
                                value="specific_stores"
                                size="lg"
                                colorScheme="blue"
                              >
                                <VStack align="start" spacing={2} ml={2}>
                                  <HStack>
                                    <Text fontSize="xl">🏪</Text>
                                    <Text fontWeight="bold" fontSize="lg">
                                      ใช้ได้เฉพาะร้านค้าที่เลือก
                                    </Text>
                                  </HStack>
                                  <Text fontSize="sm" color="gray.600">
                                    คูปองนี้สามารถใช้ได้เฉพาะกับร้านค้าที่เลือกเท่านั้น
                                  </Text>
                                </VStack>
                              </Radio>
                            </Card>

                            <Card 
                              p={4} 
                              w="full" 
                              bg={formData.applicable_type === "specific_products" ? "green.100" : "white"}
                              borderColor={formData.applicable_type === "specific_products" ? "green.300" : "gray.200"}
                              borderWidth="2px"
                              cursor="pointer"
                              _hover={{ shadow: "md" }}
                              transition="all 0.2s"
                            >
                              <Radio 
                                value="specific_products"
                                size="lg"
                                colorScheme="green"
                              >
                                <VStack align="start" spacing={2} ml={2}>
                                  <HStack>
                                    <Text fontSize="xl">📦</Text>
                                    <Text fontWeight="bold" fontSize="lg">
                                      ใช้ได้เฉพาะสินค้าที่เลือก
                                    </Text>
                                  </HStack>
                                  <Text fontSize="sm" color="gray.600">
                                    คูปองนี้สามารถใช้ได้เฉพาะกับสินค้าที่เลือกเท่านั้น
                                  </Text>
                                </VStack>
                              </Radio>
                            </Card>
                          </VStack>
                        </RadioGroup>

                        {/* Store Selection */}
                        {formData.applicable_type === "specific_stores" && (
                          <Box mt={8}>
                            <Alert status="info" mb={6} borderRadius="lg">
                              <AlertIcon />
                              <AlertDescription>
                                <strong>เลือกร้านค้าที่ต้องการให้ใช้คูปองได้</strong>
                              </AlertDescription>
                            </Alert>

                            <CheckboxGroup
                              value={selectedStores}
                              onChange={handleChange}
                            >
                              <Grid
                                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                                gap={4}
                              >
                                {stores?.map((store) => (
                                  <Card 
                                    key={store._id}
                                    p={4}
                                    borderWidth="2px"
                                    borderColor={selectedStores.some(s => s._id === store._id) ? "blue.300" : "gray.200"}
                                    bg={selectedStores.some(s => s._id === store._id) ? "blue.50" : "white"}
                                    _hover={{ shadow: "md" }}
                                    transition="all 0.2s"
                                  >
                                    <Checkbox
                                      isChecked={selectedStores.some(
                                        (s) => s._id === store._id
                                      )}
                                      onChange={(e) =>
                                        handleStoreSelection(e, store)
                                      }
                                      size="lg"
                                      colorScheme="blue"
                                    >
                                      <VStack align="start" spacing={1} ml={2}>
                                        <HStack>
                                          <Text fontSize="lg">🏪</Text>
                                          <Text fontWeight="bold">
                                            {store.store_name}
                                          </Text>
                                        </HStack>
                                        <Text fontSize="sm" color="gray.600">
                                          รหัส: {store.store_code}
                                        </Text>
                                      </VStack>
                                    </Checkbox>
                                  </Card>
                                ))}
                              </Grid>
                            </CheckboxGroup>

                            {selectedStores.length > 0 && (
                              <Box mt={6} p={4} bg="blue.50" borderRadius="lg">
                                <Text fontSize="sm" mb={3} fontWeight="bold" color="blue.700">
                                  ร้านค้าที่เลือก ({selectedStores.length} ร้าน):
                                </Text>
                                <Flex wrap="wrap" gap={2}>
                                  {selectedStores.map((store) => (
                                    <Tag
                                      key={store._id}
                                      size="md"
                                      colorScheme="blue"
                                      borderRadius="full"
                                    >
                                      <TagLabel>🏪 {store.store_name}</TagLabel>
                                    </Tag>
                                  ))}
                                </Flex>
                              </Box>
                            )}
                          </Box>
                        )}

                        {/* Product Selection */}
                        {formData.applicable_type === "specific_products" && (
                          <Box mt={8}>
                            <Alert status="info" mb={6} borderRadius="lg">
                              <AlertIcon />
                              <AlertDescription>
                                <strong>เลือกสินค้าที่ต้องการให้ใช้คูปองได้ (แยกตามร้านค้า)</strong>
                              </AlertDescription>
                            </Alert>

                            <Tabs variant="enclosed" colorScheme="green">
                              <TabList flexWrap="wrap">
                                {stores?.map((store) => (
                                  <Tab 
                                    key={store._id}
                                    fontSize={{ base: "sm", md: "md" }}
                                    _selected={{ 
                                      bg: "green.500", 
                                      color: "white" 
                                    }}
                                  >
                                    🏪 {store.store_name}
                                  </Tab>
                                ))}
                              </TabList>
                              <TabPanels>
                                {stores?.map((store) => {
                                  const storeProducts = products?.filter(
                                    (p) => p.user_id._id === store.user_id
                                  );
                                  return (
                                    <TabPanel key={store._id} px={0}>
                                      {storeProducts?.length > 0 ? (
                                        <CheckboxGroup
                                          value={selectedProducts}
                                          onChange={handleProductSelection}
                                        >
                                          <Grid
                                            templateColumns={{ 
                                              base: "1fr", 
                                              md: "repeat(2, 1fr)",
                                              lg: "repeat(3, 1fr)"
                                            }}
                                            gap={4}
                                          >
                                            {storeProducts.map((product) => (
                                              <Card 
                                                key={product._id}
                                                p={4}
                                                borderWidth="2px"
                                                borderColor={selectedProducts.includes(product._id) ? "green.300" : "gray.200"}
                                                bg={selectedProducts.includes(product._id) ? "green.50" : "white"}
                                                _hover={{ shadow: "md" }}
                                                transition="all 0.2s"
                                              >
                                                <Checkbox
                                                  value={product._id}
                                                  size="lg"
                                                  colorScheme="green"
                                                >
                                                  <VStack align="start" spacing={1} ml={2}>
                                                    <HStack>
                                                      <Text fontSize="lg">📦</Text>
                                                      <Text fontWeight="bold" fontSize="sm">
                                                        {product.name}
                                                      </Text>
                                                    </HStack>
                                                    <Text fontSize="xs" color="gray.600">
                                                      {formatCurrency(product.price)} | {product.category}
                                                    </Text>
                                                  </VStack>
                                                </Checkbox>
                                              </Card>
                                            ))}
                                          </Grid>
                                        </CheckboxGroup>
                                      ) : (
                                        <Center py={12}>
                                          <VStack spacing={3}>
                                            <Text fontSize="4xl">📦</Text>
                                            <Text color="gray.500" textAlign="center">
                                              ไม่มีสินค้าในร้านนี้
                                            </Text>
                                          </VStack>
                                        </Center>
                                      )}
                                    </TabPanel>
                                  );
                                })}
                              </TabPanels>
                            </Tabs>

                            {selectedProducts.length > 0 && (
                              <Box mt={6} p={4} bg="green.50" borderRadius="lg">
                                <Text fontSize="sm" mb={3} fontWeight="bold" color="green.700">
                                  สินค้าที่เลือก ({selectedProducts.length} รายการ):
                                </Text>
                                <Flex wrap="wrap" gap={2}>
                                  {selectedProducts.map((productId) => {
                                    const product = products?.find(
                                      (p) => p._id === productId
                                    );
                                    const store = stores?.find(
                                      (s) => s.user_id._id === product?.user_id._id
                                    );
                                    return (
                                      <Tag
                                        key={productId}
                                        size="md"
                                        colorScheme="green"
                                        borderRadius="full"
                                      >
                                        <TagLabel>
                                          📦 {product?.name} ({store?.store_name})
                                        </TagLabel>
                                      </Tag>
                                    );
                                  })}
                                </Flex>
                              </Box>
                            )}
                          </Box>
                        )}

                        <FormErrorMessage fontSize="md" mt={4}>
                          {errors.stores || errors.products}
                        </FormErrorMessage>
                      </FormControl>
                    </CardBody>
                  </Card>
                </VStack>
              </form>
            </ModalBody>

            <ModalFooter 
              bg="gray.50" 
              borderBottomRadius="2xl"
              py={6}
            >
              <HStack spacing={4} w="full" justify="end">
                <Button 
                  variant="ghost" 
                  onClick={onClose}
                  size="lg"
                  _hover={{ bg: "gray.200" }}
                >
                  ❌ ยกเลิก
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleSubmit}
                  isDisabled={!formData.coupon_code || !formData.discount_value}
                  size="lg"
                  leftIcon={editingCoupon ? <EditIcon /> : <AddIcon />}
                  shadow="lg"
                  _hover={{ 
                    transform: "translateY(-2px)",
                    shadow: "xl"
                  }}
                  transition="all 0.2s"
                  isLoading={loader}
                  loadingText={editingCoupon ? "กำลังบันทึก..." : "กำลังเพิ่ม..."}
                >
                  {editingCoupon ? "💾 บันทึกการแก้ไข" : "➕ บันทึกคูปอง"}
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Enhanced Delete Confirmation Dialog */}
        <AlertDialog isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <AlertDialogOverlay bg="blackAlpha.600" backdropFilter="blur(10px)">
            <AlertDialogContent 
              borderRadius="2xl" 
              shadow="2xl"
              mx={{ base: 2, md: 4 }}
            >
              <AlertDialogHeader 
                fontSize="xl" 
                fontWeight="bold"
                bg="red.500"
                color="white"
                borderTopRadius="2xl"
                py={6}
              >
                <HStack spacing={3}>
                  <Text fontSize="2xl">⚠️</Text>
                  <Text>ยืนยันการลบคูปอง</Text>
                </HStack>
              </AlertDialogHeader>

              <AlertDialogBody py={8}>
                <VStack align="start" spacing={6}>
                  <Box>
                    <Text fontSize="lg" mb={2}>
                      คุณแน่ใจหรือไม่ที่จะลบคูปอง
                    </Text>
                    <Card bg="red.50" p={4} borderRadius="lg">
                      <Text 
                        fontWeight="bold" 
                        fontSize="xl" 
                        color="red.600"
                        textAlign="center"
                      >
                        "{couponToDelete?.coupon_code}"
                      </Text>
                    </Card>
                  </Box>
                  
                  <Alert status="warning" borderRadius="lg">
                    <AlertIcon />
                    <AlertDescription>
                      <strong>คำเตือน:</strong> การดำเนินการนี้ไม่สามารถย้อนกลับได้
                      และจะส่งผลต่อลูกค้าที่อาจกำลังใช้คูปองนี้
                    </AlertDescription>
                  </Alert>
                </VStack>
              </AlertDialogBody>

              <AlertDialogFooter bg="gray.50" borderBottomRadius="2xl" py={6}>
                <HStack spacing={4}>
                  <Button 
                    onClick={onDeleteClose}
                    size="lg"
                    _hover={{ bg: "gray.200" }}
                  >
                    ❌ ยกเลิก
                  </Button>
                  <Button 
                    colorScheme="red" 
                    onClick={confirmDelete}
                    size="lg"
                    leftIcon={<DeleteIcon />}
                    shadow="lg"
                    _hover={{ 
                      transform: "translateY(-2px)",
                      shadow: "xl"
                    }}
                    transition="all 0.2s"
                  >
                    🗑️ ลบคูปอง
                  </Button>
                </HStack>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Container>
    </Box>
  );
};

export default AddCouponForm;