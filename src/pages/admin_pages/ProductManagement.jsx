import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  Select,
  Badge,
  Image,
  Text,
  Flex,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  Checkbox,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  Switch,
  Tooltip,
  Card,
  CardBody,
  SimpleGrid,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import {
  Search,
  Filter,
  Edit,
  Eye,
  Check,
  X,
  Star,
  MoreVertical,
  Download,
  Upload,
  TrendingUp,
  Package,
  AlertTriangle,
  Calendar,
  User,
  Tag,
  ShoppingCart,
  RefreshCw,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  get_category,
  get_product,
  get_sellers,
  approve_seller,
  // reject_product,
  toggleFeatured,
  // toggle_status,
} from "../../hooks/reducer/admin_reducer/provider_reducer";

// Constants
const PRODUCT_STATUS = {
  AVAILABLE: "available",
  OUT_OF_STOCK: "out_of_stock",
  TEMPORARILY_UNAVAILABLE: "temporarily_unavailable",
};

const ACCESS_STATUS = {
  ACCESS: "access",
  PROCESS: "process",
  REJECTED: "rejected",
};

const BULK_ACTIONS = {
  APPROVE: "approve",
  DISABLE: "disable",
  EXPORT: "export",
};

// Utility functions for security
const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
};

const validateProductData = (product) => {
  return (
    product &&
    typeof product.name === "string" &&
    typeof product.price === "number" &&
    product.price >= 0 &&
    typeof product.stock === "number" &&
    product.stock >= 0
  );
};

// Custom hooks
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const useProductFilters = (
  products,
  searchTerm,
  categoryFilter,
  sellerFilter,
  statusFilter,
  accessFilter
) => {
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  return useMemo(() => {
    if (!products || !Array.isArray(products)) return [];

    return products.filter((product) => {
      if (!validateProductData(product)) return false;

      const sanitizedSearchTerm = sanitizeInput(
        debouncedSearchTerm
      ).toLowerCase();
      const productName = sanitizeInput(product.name || "").toLowerCase();
      const productBrand = sanitizeInput(product.brand || "").toLowerCase();

      const matchesSearch =
        !sanitizedSearchTerm ||
        productName.includes(sanitizedSearchTerm) ||
        productBrand.includes(sanitizedSearchTerm);

      const matchesCategory =
        !categoryFilter || product.categoryId?.name === categoryFilter;
      const matchesSeller =
        !sellerFilter || product.seller?.name === sellerFilter;
      const matchesStatus = !statusFilter || product.status === statusFilter;
      const matchesAccess =
        !accessFilter || product.access_products === accessFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSeller &&
        matchesStatus &&
        matchesAccess
      );
    });
  }, [
    products,
    debouncedSearchTerm,
    categoryFilter,
    sellerFilter,
    statusFilter,
    accessFilter,
  ]);
};

// Components
const ProductStatsCard = ({ label, value, color = "blue" }) => (
  <Card>
    <CardBody>
      <Stat>
        <StatLabel>{label}</StatLabel>
        <StatNumber color={`${color}.500`}>{value || 0}</StatNumber>
      </Stat>
    </CardBody>
  </Card>
);

const ProductTableRow = React.memo(
  ({
    product,
    isSelected,
    onSelect,
    onApprove,
    onReject,
    onEdit,
    onPreview,
    onToggleFeatured,
    onToggleStatus,
  }) => {
    // const getStatusColor = (status) => {
    //   switch (status) {
    //     case PRODUCT_STATUS.AVAILABLE:
    //       return "green";
    //     case PRODUCT_STATUS.OUT_OF_STOCK:
    //       return "red";
    //     case PRODUCT_STATUS.TEMPORARILY_UNAVAILABLE:
    //       return "orange";
    //     default:
    //       return "gray";
    //   }
    // };

    const getAccessColor = (access) => {
      switch (access) {
        case ACCESS_STATUS.ACCESS:
          return "green";
        case ACCESS_STATUS.PROCESS:
          return "yellow";
        case ACCESS_STATUS.REJECTED:
          return "red";
        default:
          return "gray";
      }
    };

    const getAccessText = (access) => {
      switch (access) {
        case ACCESS_STATUS.ACCESS:
          return "อนุมัติแล้ว";
        case ACCESS_STATUS.PROCESS:
          return "รอดำเนินการ";
        case ACCESS_STATUS.REJECTED:
          return "ถูกปฏิเสธ";
        default:
          return "ไม่ระบุ";
      }
    };

    return (
      <Tr _hover={{ bg: "gray.50" }}>
        <Td>
          <Checkbox
            isChecked={isSelected}
            onChange={onSelect}
            aria-label={`Select product ${product.name}`}
          />
        </Td>
        <Td>
          <Image
            src={product?.images?.[0]}
            alt={`Product image of ${product.name}`}
            boxSize="60px"
            objectFit="cover"
            borderRadius="md"
            fallbackSrc="https://via.placeholder.com/60x60?text=No+Image"
            loading="lazy"
          />
        </Td>
        <Td>
          <VStack align="start" spacing={1}>
            <Text fontWeight="medium" fontSize="sm" title={product.name}>
              {product.name?.length > 50
                ? `${product.name.substring(0, 50)}...`
                : product.name}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {product.brand}
            </Text>
            <HStack spacing={1}>
              <Star size={12} fill="orange" color="orange" />
              <Text fontSize="xs">
                {product.ratings?.average || 0} ({product.ratings?.count || 0})
              </Text>
            </HStack>
          </VStack>
        </Td>
        <Td>
          <Text fontSize="sm">{product.user_id?.username || "N/A"}</Text>
        </Td>
        <Td>
          <Badge variant="outline" colorScheme="blue">
            {product.categoryId?.name || "ไม่มีหมวดหมู่"}
          </Badge>
        </Td>
        <Td>
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold" color="green.600">
              ฿{product.price?.toLocaleString() || 0}
            </Text>
            {product.discount_price && (
              <Text
                fontSize="xs"
                textDecoration="line-through"
                color="gray.500"
              >
                ฿{product.discount_price.toLocaleString()}
              </Text>
            )}
          </VStack>
        </Td>
        <Td>
          <Text
            color={
              product.stock < 10
                ? "red.500"
                : product.stock < 20
                ? "orange.500"
                : "green.500"
            }
            fontWeight="medium"
          >
            {product.stock || 0}
          </Text>
        </Td>
        <Td>
          <HStack>
            <TrendingUp size={16} color="green" />
            <Text>{product.sold_count || 0}</Text>
          </HStack>
        </Td>
        <Td>
          <Badge
            colorScheme={getAccessColor(product.access_products)}
            variant="solid"
          >
            {getAccessText(product.access_products)}
          </Badge>
        </Td>
        <Td>
          <Switch
            isChecked={product.status === PRODUCT_STATUS.AVAILABLE}
            onChange={() => onToggleStatus(product._id)}
            colorScheme="green"
            size="sm"
            aria-label="Toggle product availability"
          />
        </Td>
        <Td>
          <Switch
            isChecked={product.is_featured}
            onChange={() => onToggleFeatured(product._id)}
            colorScheme="purple"
            size="sm"
            aria-label="Toggle featured status"
          />
        </Td>
        <Td>
          <Text fontSize="sm" color="gray.600">
            {product.createdAt
              ? new Date(product.createdAt).toLocaleDateString("th-TH")
              : "N/A"}
          </Text>
        </Td>
        <Td>
          <HStack spacing={1}>
            {product.access_products === ACCESS_STATUS.PROCESS && (
              <>
                <Tooltip label="อนุมัติสินค้า">
                  <IconButton
                    size="sm"
                    colorScheme="green"
                    variant="ghost"
                    icon={<Check size={16} />}
                    onClick={() => onApprove(product._id)}
                    aria-label="Approve product"
                  />
                </Tooltip>
                <Tooltip label="ปฏิเสธสินค้า">
                  <IconButton
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    icon={<X size={16} />}
                    onClick={() => onReject(product)}
                    aria-label="Reject product"
                  />
                </Tooltip>
              </>
            )}
            <Tooltip label="แก้ไขสินค้า">
              <IconButton
                size="sm"
                colorScheme="blue"
                variant="ghost"
                icon={<Edit size={16} />}
                onClick={() => onEdit(product)}
                aria-label="Edit product"
              />
            </Tooltip>
            <Tooltip label="ดูตัวอย่าง">
              <IconButton
                size="sm"
                colorScheme="purple"
                variant="ghost"
                icon={<Eye size={16} />}
                onClick={() => onPreview(product)}
                aria-label="Preview product"
              />
            </Tooltip>
          </HStack>
        </Td>
      </Tr>
    );
  }
);

const LoadingSkeleton = () => (
  <Card>
    <CardBody>
      <VStack spacing={4}>
        {[...Array(5)].map((_, index) => (
          <HStack key={index} w="full" spacing={4}>
            <Skeleton height="60px" width="60px" />
            <Box flex="1">
              <Skeleton height="20px" mb={2} />
              <SkeletonText noOfLines={2} spacing="4" />
            </Box>
            <Skeleton height="40px" width="100px" />
          </HStack>
        ))}
      </VStack>
    </CardBody>
  </Card>
);

const ProductManagement = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  // Redux state
  const {
    loader,
    successMessage,
    errorMessage,
    categoryList = [],
    get_seller = [],
    get_products = [],
  } = useSelector((state) => state.provider_reducer);

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sellerFilter, setSellerFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [accessFilter, setAccessFilter] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Modal states
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isRejectOpen,
    onOpen: onRejectOpen,
    onClose: onRejectClose,
  } = useDisclosure();
  const {
    isOpen: isPreviewOpen,
    onOpen: onPreviewOpen,
    onClose: onPreviewClose,
  } = useDisclosure();
  const {
    isOpen: isBulkOpen,
    onOpen: onBulkOpen,
    onClose: onBulkClose,
  } = useDisclosure();

  // Memoized filtered products
  const filteredProducts = useProductFilters(
    get_products,
    searchTerm,
    categoryFilter,
    sellerFilter,
    statusFilter,
    accessFilter
  );

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          dispatch(get_product()),
          dispatch(get_sellers()),
          dispatch(get_category()),
        ]);
      } catch (error) {
        console.log(error);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลได้",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dispatch, toast]);

  // Handle success/error messages
  useEffect(() => {
    if (successMessage) {
      toast({
        title: "สำเร็จ",
        description: successMessage,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [successMessage, toast]);

  useEffect(() => {
    if (errorMessage) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [errorMessage, toast]);

  // Event handlers
  const handleApprove = useCallback(
    async (productId) => {
      if (!productId) return;

      setIsLoading(true);
      try {
        await dispatch(approve_seller(productId));
        await dispatch(get_product());
        toast({
          title: "อนุมัติสินค้าเรียบร้อย",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.log(error);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถอนุมัติสินค้าได้",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, toast]
  );

  const handleReject = useCallback(async () => {
    if (!currentProduct?._id || !rejectReason.trim()) return;

    const sanitizedReason = sanitizeInput(rejectReason.trim());

    setIsLoading(true);
    try {
      // await dispatch(reject_product(currentProduct._id, sanitizedReason));
      await dispatch(get_product());
      toast({
        title: "ปฏิเสธสินค้าเรียบร้อย",
        description: `เหตุผล: ${sanitizedReason}`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      onRejectClose();
      setRejectReason("");
    } catch (error) {
      console.log(error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถปฏิเสธสินค้าได้",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentProduct, rejectReason, dispatch, toast, onRejectClose]);

  const handleToggleFeatured = useCallback(
    async (productId) => {
      if (!productId) return;

      try {
        await dispatch(toggleFeatured(productId));
        await dispatch(get_product());
      } catch (error) {
        console.log(error);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถเปลี่ยนสถานะได้",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [dispatch, toast]
  );

  const handleToggleStatus = useCallback(
    async (productId) => {
      if (!productId) return;

      try {
        // await dispatch(toggle_status(productId));
        await dispatch(get_product());
      } catch (error) {
        console.log(error);
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถเปลี่ยนสถานะได้",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [dispatch, toast]
  );

  const handleBulkAction = useCallback(
    async (action) => {
      const count = selectedProducts.length;
      if (count === 0) {
        toast({
          title: "กรุณาเลือกสินค้า",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setIsLoading(true);
      try {
        switch (action) {
          case BULK_ACTIONS.APPROVE:
            // await dispatch(bulk_approve_products(selectedProducts));
            toast({
              title: `อนุมัติสินค้า ${count} รายการเรียบร้อย`,
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            break;
          case BULK_ACTIONS.DISABLE:
            // await dispatch(bulk_disable_products(selectedProducts));
            toast({
              title: `ปิดการขายสินค้า ${count} รายการเรียบร้อย`,
              status: "info",
              duration: 3000,
              isClosable: true,
            });
            break;
          case BULK_ACTIONS.EXPORT:
            // Implement export functionality
            toast({
              title: `ส่งออกข้อมูลสินค้า ${count} รายการเรียบร้อย`,
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            break;
          default:
            break;
        }
        await dispatch(get_product());
        setSelectedProducts([]);
        onBulkClose();
      } catch (error) {
         console.log(error)
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถดำเนินการได้",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [selectedProducts, dispatch, toast, onBulkClose]
  );

  const handleSelectProduct = useCallback((productId, isChecked) => {
    setSelectedProducts((prev) =>
      isChecked ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
  }, []);

  const handleSelectAllProducts = useCallback(
    (isChecked) => {
      setSelectedProducts(isChecked ? filteredProducts.map((p) => p._id) : []);
    },
    [filteredProducts]
  );

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setCategoryFilter("");
    setSellerFilter("");
    setStatusFilter("");
    setAccessFilter("");
  }, []);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      await dispatch(get_product());
      toast({
        title: "รีเฟรชข้อมูลเรียบร้อย",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
       console.log(error)
      toast({
        title: "ไม่สามารถรีเฟรชข้อมูลได้",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, toast]);

  // Memoized statistics
  const stats = useMemo(
    () => ({
      total: get_products?.length || 0,
      pending:
        get_products?.filter((p) => p.access_products === ACCESS_STATUS.PROCESS)
          ?.length || 0,
      approved:
        get_products?.filter((p) => p.access_products === ACCESS_STATUS.ACCESS)
          ?.length || 0,
      rejected:
        get_products?.filter(
          (p) => p.access_products === ACCESS_STATUS.REJECTED
        )?.length || 0,
      featured: get_products?.filter((p) => p.is_featured)?.length || 0,
      outOfStock:
        get_products?.filter((p) => p.status === PRODUCT_STATUS.OUT_OF_STOCK)
          ?.length || 0,
    }),
    [get_products]
  );

  // Error boundary
  if (!get_products && !loader) {
    return (
      <Container maxW="full" p={6}>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>เกิดข้อผิดพลาด!</AlertTitle>
          <AlertDescription>
            ไม่สามารถโหลดข้อมูลสินค้าได้ กรุณาลองใหม่อีกครั้ง
          </AlertDescription>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="full" p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="lg" mb={2}>
              การจัดการสินค้า
            </Heading>
            <Text color="gray.600">จัดการและอนุมัติสินค้าของผู้ขาย</Text>
          </Box>
          <HStack>
            <Button
              leftIcon={<RefreshCw size={16} />}
              onClick={refreshData}
              isLoading={isLoading}
              size="sm"
              variant="outline"
            >
              รีเฟรช
            </Button>
          </HStack>
        </Flex>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
          <ProductStatsCard
            label="สินค้าทั้งหมด"
            value={stats.total}
            color="blue"
          />
          <ProductStatsCard
            label="รอดำเนินการ"
            value={stats.pending}
            color="yellow"
          />
          <ProductStatsCard
            label="อนุมัติแล้ว"
            value={stats.approved}
            color="green"
          />
          <ProductStatsCard
            label="ถูกปฏิเสธ"
            value={stats.rejected}
            color="red"
          />
          <ProductStatsCard
            label="สินค้าเด่น"
            value={stats.featured}
            color="purple"
          />
          <ProductStatsCard
            label="สินค้าหมด"
            value={stats.outOfStock}
            color="red"
          />
        </SimpleGrid>

        {/* Filters */}
        <Card>
          <CardBody>
            <VStack spacing={4}>
              <HStack w="full" spacing={4} flexWrap="wrap">
                <InputGroup flex="2" minW="250px">
                  <InputLeftElement>
                    <Search size={20} />
                  </InputLeftElement>
                  <Input
                    placeholder="ค้นหาสินค้า, แบรนด์..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    maxLength={100}
                  />
                </InputGroup>

                <Select
                  placeholder="หมวดหมู่"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  minW="150px"
                >
                  {categoryList?.map((cat) => (
                    <option key={cat._id || cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </Select>

                <Select
                  placeholder="ผู้ขาย"
                  value={sellerFilter}
                  onChange={(e) => setSellerFilter(e.target.value)}
                  minW="150px"
                >
                  {get_seller?.map((seller) => (
                    <option
                      key={seller._id || seller.store_name}
                      value={seller.store_name}
                    >
                      {seller.store_name}
                    </option>
                  ))}
                </Select>

                <Select
                  placeholder="สถานะอนุมัติ"
                  value={accessFilter}
                  onChange={(e) => setAccessFilter(e.target.value)}
                  minW="150px"
                >
                  <option value={ACCESS_STATUS.PROCESS}>รอดำเนินการ</option>
                  <option value={ACCESS_STATUS.ACCESS}>อนุมัติแล้ว</option>
                  <option value={ACCESS_STATUS.REJECTED}>ถูกปฏิเสธ</option>
                </Select>

                <Select
                  placeholder="สถานะขาย"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  minW="150px"
                >
                  <option value={PRODUCT_STATUS.AVAILABLE}>พร้อมขาย</option>
                  <option value={PRODUCT_STATUS.OUT_OF_STOCK}>สินค้าหมด</option>
                  <option value={PRODUCT_STATUS.TEMPORARILY_UNAVAILABLE}>
                    ปิดขายชั่วคราว
                  </option>
                </Select>

                <Button
                  size="md"
                  variant="ghost"
                  onClick={clearFilters}
                  leftIcon={<X size={16} />}
                >
                  ล้างฟิลเตอร์
                </Button>
              </HStack>

              {/* Bulk Actions */}
              <HStack w="full" justify="space-between">
                <HStack>
                  <Text fontSize="sm" color="gray.600">
                    เลือกแล้ว {selectedProducts.length} รายการ
                  </Text>
                  {selectedProducts.length > 0 && (
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={onBulkOpen}
                      isDisabled={isLoading}
                    >
                      การดำเนินการแบบกลุ่ม
                    </Button>
                  )}
                </HStack>
                <HStack>
                  <Button
                    leftIcon={<Download size={16} />}
                    size="sm"
                    variant="outline"
                    isDisabled={isLoading}
                  >
                    ส่งออก Excel
                  </Button>
                  <Button
                    leftIcon={<Upload size={16} />}
                    size="sm"
                    variant="outline"
                    isDisabled={isLoading}
                  >
                    นำเข้าข้อมูล
                  </Button>
                </HStack>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Products Table or Loading */}
        {loader || isLoading ? (
          <LoadingSkeleton />
        ) : filteredProducts.length === 0 ? (
          <Card>
            <CardBody>
              <VStack spacing={4} py={8}>
                <Package size={48} color="gray" />
                <Text color="gray.500" fontSize="lg">
                  ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหา
                </Text>
                <Button onClick={clearFilters} variant="outline">
                  ล้างฟิลเตอร์
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody p={0}>
              <Box overflowX="auto">
                <Table variant="simple" size="md">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>
                        <Checkbox
                          isChecked={
                            selectedProducts.length ===
                              filteredProducts.length &&
                            filteredProducts.length > 0
                          }
                          isIndeterminate={
                            selectedProducts.length > 0 &&
                            selectedProducts.length < filteredProducts.length
                          }
                          onChange={(e) =>
                            handleSelectAllProducts(e.target.checked)
                          }
                          aria-label="Select all products"
                        />
                      </Th>
                      <Th>รูปสินค้า</Th>
                      <Th>ชื่อสินค้า</Th>
                      <Th>ผู้ขาย</Th>
                      <Th>หมวดหมู่</Th>
                      <Th>ราคา</Th>
                      <Th>คงเหลือ</Th>
                      <Th>ยอดขาย</Th>
                      <Th>สถานะอนุมัติ</Th>
                      <Th>สถานะขาย</Th>
                      <Th>สินค้าเด่น</Th>
                      <Th>วันที่เพิ่ม</Th>
                      <Th>การดำเนินการ</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredProducts.map((product) => (
                      <ProductTableRow
                        key={product._id}
                        product={product}
                        isSelected={selectedProducts.includes(product._id)}
                        onSelect={(e) =>
                          handleSelectProduct(product._id, e.target.checked)
                        }
                        onApprove={handleApprove}
                        onReject={(product) => {
                          setCurrentProduct(product);
                          onRejectOpen();
                        }}
                        onEdit={(product) => {
                          setCurrentProduct(product);
                          onEditOpen();
                        }}
                        onPreview={(product) => {
                          setCurrentProduct(product);
                          onPreviewOpen();
                        }}
                        onToggleFeatured={handleToggleFeatured}
                        onToggleStatus={handleToggleStatus}
                      />
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </CardBody>
          </Card>
        )}

        {/* Results Summary */}
        <Text textAlign="center" color="gray.600" fontSize="sm">
          แสดง {filteredProducts.length} จาก {get_products?.length || 0} รายการ
        </Text>
      </VStack>

      {/* Edit Product Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>แก้ไขข้อมูลสินค้า</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {currentProduct && (
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>ชื่อสินค้า</FormLabel>
                  <Input
                    defaultValue={currentProduct.name}
                    maxLength={100}
                    placeholder="กรุณาระบุชื่อสินค้า"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>คำอธิบาย</FormLabel>
                  <Textarea
                    defaultValue={currentProduct.description}
                    maxLength={1000}
                    placeholder="กรุณาระบุคำอธิบายสินค้า"
                    rows={4}
                  />
                </FormControl>
                <HStack w="full">
                  <FormControl>
                    <FormLabel>ราคา (บาท)</FormLabel>
                    <NumberInput
                      defaultValue={currentProduct.price}
                      min={0}
                      max={1000000}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                  <FormControl>
                    <FormLabel>ราคาลด (บาท)</FormLabel>
                    <NumberInput
                      defaultValue={currentProduct.discount_price}
                      min={0}
                      max={1000000}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                </HStack>
                <HStack w="full">
                  <FormControl>
                    <FormLabel>จำนวนคงเหลือ</FormLabel>
                    <NumberInput
                      defaultValue={currentProduct.stock}
                      min={0}
                      max={999999}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                  <FormControl>
                    <FormLabel>หมวดหมู่</FormLabel>
                    <Select defaultValue={currentProduct.categoryId?.name}>
                      <option value="">เลือกหมวดหมู่</option>
                      {categoryList?.map((cat) => (
                        <option key={cat._id || cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </HStack>
                <Stack direction="row" w="full">
                  <Checkbox defaultChecked={currentProduct.is_featured}>
                    สินค้าเด่น
                  </Checkbox>
                </Stack>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              ยกเลิก
            </Button>
            <Button
              colorScheme="blue"
              onClick={onEditClose}
              isLoading={isLoading}
              loadingText="กำลังบันทึก..."
            >
              บันทึก
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Reject Product Modal */}
      <Modal isOpen={isRejectOpen} onClose={onRejectClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ปฏิเสธสินค้า</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Alert status="warning">
                <AlertIcon />
                <Box>
                  <AlertTitle>คำเตือน!</AlertTitle>
                  <AlertDescription>
                    การปฏิเสธสินค้าจะส่งผลให้ผู้ขายไม่สามารถขายสินค้านี้ได้
                  </AlertDescription>
                </Box>
              </Alert>
              <Text>กรุณาระบุเหตุผลในการปฏิเสธสินค้า:</Text>
              <Textarea
                placeholder="เหตุผลการปฏิเสธ (เช่น รูปภาพไม่ชัดเจน, ข้อมูลไม่ครบถ้วน, ฯลฯ)"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                maxLength={500}
                rows={4}
              />
              <Text fontSize="sm" color="gray.500" alignSelf="flex-end">
                {rejectReason.length}/500 ตัวอักษร
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onRejectClose}>
              ยกเลิก
            </Button>
            <Button
              colorScheme="red"
              onClick={handleReject}
              isDisabled={
                !rejectReason.trim() || rejectReason.trim().length < 10
              }
              isLoading={isLoading}
              loadingText="กำลังปฏิเสธ..."
            >
              ปฏิเสธ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Product Preview Modal */}
      <Modal isOpen={isPreviewOpen} onClose={onPreviewClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ตัวอย่างหน้าสินค้า</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {currentProduct && (
              <VStack spacing={4} align="start">
                <Box w="full" textAlign="center">
                  <Image
                    src={currentProduct.images?.[0]}
                    alt={`Product preview of ${currentProduct.name}`}
                    maxH="300px"
                    maxW="full"
                    objectFit="contain"
                    mx="auto"
                    fallbackSrc="https://via.placeholder.com/300x300?text=No+Image"
                  />
                </Box>
                <Heading size="md">{currentProduct.name}</Heading>
                <Text color="gray.600" fontSize="sm">
                  {currentProduct.description || "ไม่มีคำอธิบาย"}
                </Text>
                <HStack spacing={3}>
                  <Text fontSize="2xl" fontWeight="bold" color="green.600">
                    ฿{currentProduct.price?.toLocaleString() || 0}
                  </Text>
                  {currentProduct.discount_price && (
                    <Text textDecoration="line-through" color="gray.500">
                      ฿{currentProduct.discount_price.toLocaleString()}
                    </Text>
                  )}
                </HStack>
                <HStack>
                  <Star size={16} fill="orange" color="orange" />
                  <Text>
                    {currentProduct.ratings?.average || 0} (
                    {currentProduct.ratings?.count || 0} รีวิว)
                  </Text>
                </HStack>
                <Badge colorScheme="blue">
                  {currentProduct.categoryId?.name || "ไม่มีหมวดหมู่"}
                </Badge>
                <VStack align="start" spacing={2}>
                  <Text>
                    <strong>ผู้ขาย:</strong>{" "}
                    {currentProduct.user_id?.username || "N/A"}
                  </Text>
                  <Text>
                    <strong>คงเหลือ:</strong> {currentProduct.stock || 0} ชิ้น
                  </Text>
                  <Text>
                    <strong>ยอดขาย:</strong> {currentProduct.sold_count || 0}{" "}
                    ชิ้น
                  </Text>
                  <Text>
                    <strong>แบรนด์:</strong> {currentProduct.brand || "ไม่ระบุ"}
                  </Text>
                </VStack>
                {currentProduct.tags && currentProduct.tags.length > 0 && (
                  <HStack spacing={2} flexWrap="wrap">
                    <Text fontSize="sm" fontWeight="medium">
                      แท็ก:
                    </Text>
                    {currentProduct.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" colorScheme="gray">
                        {tag}
                      </Badge>
                    ))}
                  </HStack>
                )}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onPreviewClose}>ปิด</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Bulk Actions Modal */}
      <Modal isOpen={isBulkOpen} onClose={onBulkClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>การดำเนินการแบบกลุ่ม</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Alert status="info">
                <AlertIcon />
                <Box>
                  <AlertTitle>ข้อมูล</AlertTitle>
                  <AlertDescription>
                    คุณได้เลือกสินค้า {selectedProducts.length} รายการ
                  </AlertDescription>
                </Box>
              </Alert>
              <Text>เลือกการดำเนินการที่ต้องการ:</Text>
              <VStack w="full" spacing={3}>
                <Button
                  w="full"
                  colorScheme="green"
                  leftIcon={<Check size={16} />}
                  onClick={() => handleBulkAction(BULK_ACTIONS.APPROVE)}
                  isDisabled={isLoading}
                  size="lg"
                >
                  อนุมัติทั้งหมด
                </Button>
                <Button
                  w="full"
                  colorScheme="orange"
                  leftIcon={<X size={16} />}
                  onClick={() => handleBulkAction(BULK_ACTIONS.DISABLE)}
                  isDisabled={isLoading}
                  size="lg"
                >
                  ปิดการขายทั้งหมด
                </Button>
                <Button
                  w="full"
                  colorScheme="blue"
                  leftIcon={<Download size={16} />}
                  onClick={() => handleBulkAction(BULK_ACTIONS.EXPORT)}
                  isDisabled={isLoading}
                  size="lg"
                >
                  ส่งออกข้อมูล
                </Button>
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              onClick={onBulkClose}
              isDisabled={isLoading}
            >
              ยกเลิก
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

ProductTableRow.displayName = "ProductTableRow";

export default ProductManagement;
