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
  Stat,
  StatLabel,
  StatNumber,
  IconButton,
  useToast,
  Switch,
  Tooltip,
  Card,
  CardBody,
  SimpleGrid,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import {
  Search,
  Edit,
  Eye,
  Check,
  X,
  Star,
  Download,
  Upload,
  TrendingUp,
  Package,
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
  reject_product,
  bulk_approve_products,
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
      const productName = sanitizeInput(product?.name || "").toLowerCase();
      const productBrand = sanitizeInput(product?.brand || "").toLowerCase();

      const matchesSearch =
        !sanitizedSearchTerm ||
        productName.includes(sanitizedSearchTerm) ||
        productBrand.includes(sanitizedSearchTerm);

      const matchesCategory =
        !categoryFilter || product.categoryId?.name === categoryFilter;
      const matchesSeller =
        !sellerFilter || product?.user_id?._id === sellerFilter;
      const matchesStatus = !statusFilter || product?.status === statusFilter;
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
    // onEdit,
    onPreview,
    onToggleFeatured,
    onToggleStatus,
  }) => {
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
          return "ອະນຸມັດແລ້ວ";
        case ACCESS_STATUS.PROCESS:
          return "ລໍຖ້າດຳເນີນການ";
        case ACCESS_STATUS.REJECTED:
          return "ຖືກປະຕິເສດ";
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
            {product.categoryId?.name || "ບໍ່ມີໝວດໝູ່"}
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
              <Tooltip label="ອະນຸມັດສິນຄ້າ">
                <IconButton
                  size="sm"
                  colorScheme="green"
                  variant="ghost"
                  icon={<Check size={16} />}
                  onClick={() => onApprove(product._id)}
                  aria-label="Approve product"
                />
              </Tooltip>
            )}
            {product.access_products !== ACCESS_STATUS.REJECTED && (
              <Tooltip label="ປະຕິເສດສິນຄ້າ">
                <IconButton
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  icon={<X size={16} />}
                  onClick={() => onReject(product)}
                  aria-label="Reject product"
                />
              </Tooltip>
            )}
            {/* 
            <Tooltip label="ແກ້ໄຂສິນຄ້າ">
              <IconButton
                size="sm"
                colorScheme="blue"
                variant="ghost"
                icon={<Edit size={16} />}
                onClick={() => onEdit(product)}
                aria-label="Edit product"
              />
            </Tooltip> */}
            <Tooltip label="ເບີ່ງຕົວຢ່າງ">
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
  // const {
  //   isOpen: isEditOpen,
  //   onOpen: onEditOpen,
  //   onClose: onEditClose,
  // } = useDisclosure();
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
        toast({
          title: "ເກີດຂໍ້ຜິດພາດ",
          description: error.message || "ບໍ່ສາມາດໂຫລດຂໍ້ມູນໄດ້",
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

  // Event handlers
  const handleApprove = useCallback(
    async (productId) => {
      if (!productId) return;

      setIsLoading(true);
      try {
        await dispatch(approve_seller(productId))
          .unwrap()
          .then(async (res) => {
            toast({
              title: "ສຳເລັດ",
              description: res.message || `ສຳເລັດ`,
              status: "success",
              duration: 3000,
              isClosable: true,
              position: "top-right",
            });
            await dispatch(get_product());
          })
          .catch((err) => {
            toast({
              title: "ເກີດຂໍ້ຜິດພາດ",
              description: err.message || `ກະລຸນາລອງໃໝ່`,
              status: "error",
              duration: 3000,
              isClosable: true,
              position: "top-right",
            });
          });
      } catch (error) {
        toast({
          title: "ເກີດຂໍ້ຜິດພາດ",
          description: error.message || "ບໍ່ສາມາດອະນຸມັດສິນຄ້າໄດ້ ກະລຸນາລອງໃໝ່",
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
      await dispatch(
        reject_product({
          id: currentProduct?._id,
          sanitizedReason: sanitizedReason,
        })
      )
        .unwrap()
        .then(async (res) => {
          toast({
            title: "ປະຕິເສດສິນຄ້າແລ້ວ",
            description: res.message || `ສຳເລັດ`,
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
          await dispatch(get_product());
        })
        .catch((err) => {
          toast({
            title: "ເກີດຂໍ້ຜິດພາດ",
            description: err.message || `ກະລຸນາລອງໃໝ່`,
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        });
      onRejectClose();
      setRejectReason("");
    } catch (error) {

      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: error.message||"ບໍ່ສາມາດປະຕິເສດສິນຄ້າໄດ້ ກະລຸນາລອງໃໝ່",
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
        await dispatch(toggleFeatured(productId))
          .unwrap()
          .then(async () => {
            await dispatch(get_product());
          })
          .catch((err) => {
            toast({
              title: "ເກີດຂໍ້ຜິດພາດ",
              description: err.message || `ກະລຸນາລອງໃໝ່`,
              status: "error",
              duration: 3000,
              isClosable: true,
              position: "top-right",
            });
          });
      } catch (error) {
        toast({
          title: "ເກີດຂໍ້ຜິດພາດ",
          description: error.message ||"ບໍ່ສາມາດປ່ຽນສະຖານະໄດ້",
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
        toast({
          title: "ເກີດຂໍ້ຜິດພາດ",
          description: error.message||"ບໍ່ສາມາດປ່ຽນສະຖານະໄດ້",
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
          title: "ກະລຸນາເລືອກສິນຄ້າ",
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
            await dispatch(
              bulk_approve_products({ ids: selectedProducts, status: "access" })
            );
            await dispatch(get_product()),
              toast({
                title: `ອະນຸມັດສິນຄ້າ ${count} ລາຍການແລ້ວ`,
                status: "success",
                duration: 3000,
                isClosable: true,
              });
            break;
          case BULK_ACTIONS.DISABLE:
            await dispatch(
              bulk_approve_products({
                ids: selectedProducts,
                status: "rejected",
              })
            );
            await dispatch(get_product()),
              toast({
                title: `ປະຕິເສດທຸກສິນຄ້າ ${count} ລາຍການແລ້ວ`,
                status: "info",
                duration: 3000,
                isClosable: true,
              });
            break;
          case BULK_ACTIONS.EXPORT:
            // Implement export functionality
            toast({
              title: `ສົ່ງອອກຂໍ້ມູນສິນຄ້າ ${count} ລາຍການແລ້ວ`,
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

        toast({
          title: "ເກີດຂໍ້ຜິດພາດ",
          description:error.message|| "ບໍ່ສາມາດດຳເນີນການໄດ້",
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
        title: "refresh success",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {

      toast({
        title: error.message||"ບໍ່ສາມາດລີເຟຮສໄດ້",
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
          <AlertTitle>ເກີດຂໍ້ຜິດພາດ!</AlertTitle>
          <AlertDescription>
            ບໍ່ສາມາດໂຫລດຂໍ້ມູນໄດ້ ກະລຸນາລອງໃໝ່
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
            <Heading fontFamily={"Noto Sans Lao, serif"} size="lg" mb={2}>
              ການຈັດການສິນຄ້າ
            </Heading>
            <Text color="gray.600">ຈັດການແລະອະນຸມັດສິນຄ້າຂອງຜູ້ຂາຍ</Text>
          </Box>
          <HStack>
            <Button
              leftIcon={<RefreshCw size={16} />}
              onClick={refreshData}
              isLoading={isLoading}
              size="sm"
              variant="outline"
            >
              refresh
            </Button>
          </HStack>
        </Flex>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
          <ProductStatsCard
            label="ສິນຄ້າທັງໝົດ"
            value={stats.total}
            color="blue"
          />
          <ProductStatsCard
            label="ລໍຖ້າດຳເນີນການ"
            value={stats.pending}
            color="yellow"
          />
          <ProductStatsCard
            label="ອະນຸມັດແລ້ວ"
            value={stats.approved}
            color="green"
          />
          <ProductStatsCard
            label="ຖືກປະຕິເສດ"
            value={stats.rejected}
            color="red"
          />
          <ProductStatsCard
            label="ສິນຄ້າເດ່ນ"
            value={stats.featured}
            color="purple"
          />
          <ProductStatsCard
            label="ສິນຄ້າທັງໝົດ"
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
                    placeholder="ຄົ້ນຫາສິນຄ້າ, ແບຣນ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    maxLength={100}
                  />
                </InputGroup>
                <Flex>
                  <Select
                    placeholder="ໝວດໝູ່"
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
                    placeholder="ຜູ້ຂາຍ"
                    value={sellerFilter}
                    onChange={(e) => setSellerFilter(e.target.value)}
                    minW="150px"
                  >
                    {get_seller?.map((seller) => (
                      <option key={seller._id} value={seller?.user_id}>
                        {seller.store_name}
                      </option>
                    ))}
                  </Select>

                  <Select
                    placeholder="ສະຖານະ"
                    value={accessFilter}
                    onChange={(e) => setAccessFilter(e.target.value)}
                    minW="150px"
                  >
                    <option value={ACCESS_STATUS.PROCESS}>
                      ລໍຖ້າດຳເນີນການ
                    </option>
                    <option value={ACCESS_STATUS.ACCESS}>ອະນຸມັດແລ້ວ</option>
                    <option value={ACCESS_STATUS.REJECTED}>ຖືກປະຕິເສດ</option>
                  </Select>

                  <Select
                    placeholder="ສະຖານະການຂາຍ"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    minW="150px"
                  >
                    <option value={PRODUCT_STATUS.AVAILABLE}>ພ້ອມຂາຍ</option>
                    <option value={PRODUCT_STATUS.OUT_OF_STOCK}>
                      ສິນຄ້າໝົດ
                    </option>
                    <option value={PRODUCT_STATUS.TEMPORARILY_UNAVAILABLE}>
                      ປິດຂາຍຊົ່ວຄາວ
                    </option>
                  </Select>
                </Flex>

                <Button
                  size="md"
                  variant="ghost"
                  onClick={clearFilters}
                  leftIcon={<X size={16} />}
                >
                  ລ້າງຕົວກຣອງ
                </Button>
              </HStack>

              {/* Bulk Actions */}
              <HStack w="full" justify="space-between">
                <HStack>
                  <Text fontSize="sm" color="gray.600">
                    ເລືອກແລ້ວ {selectedProducts.length} ລາຍການ
                  </Text>
                  {selectedProducts.length > 0 && (
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={onBulkOpen}
                      isDisabled={isLoading}
                    >
                      ການດຳເນີນການແບບກຸ່ມ
                    </Button>
                  )}
                </HStack>
                <HStack>
                  {/* <Button
                    leftIcon={<Download size={16} />}
                    size="sm"
                    variant="outline"
                    isDisabled={isLoading}
                  >
                    ສົ່ງອອກ Excel
                  </Button> */}
                  {/* <Button
                    leftIcon={<Upload size={16} />}
                    size="sm"
                    variant="outline"
                    isDisabled={isLoading}
                  >
                    ນຳເຂົ້າຂໍ້ມູນ
                  </Button> */}
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
                  ບໍ່ພົບສິນຄ້າທີ່ກົງກັບຄົ້ນຫາ
                </Text>
                <Button onClick={clearFilters} variant="outline">
                  ລ້າງຕົວກຣອງ
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
                      <Th fontFamily={"Noto Sans Lao, serif"}>ຮູບສິນຄ້າ</Th>
                      <Th fontFamily={"Noto Sans Lao, serif"}>ຊື່ສິນຄ້າ</Th>
                      <Th fontFamily={"Noto Sans Lao, serif"}>ຜູ້ຂາຍ</Th>
                      <Th fontFamily={"Noto Sans Lao, serif"}>ໝວດໝູ່</Th>
                      <Th fontFamily={"Noto Sans Lao, serif"}>ລາຄາ</Th>
                      <Th fontFamily={"Noto Sans Lao, serif"}>ຄົງເຫຼືອ</Th>
                      <Th fontFamily={"Noto Sans Lao, serif"}>ຍອດຂາຍ</Th>
                      <Th fontFamily={"Noto Sans Lao, serif"}>ສະຖານະອະນຸມັດ</Th>
                      <Th fontFamily={"Noto Sans Lao, serif"}>ສະຖານະຂາຍ</Th>
                      <Th fontFamily={"Noto Sans Lao, serif"}>ສິນຄ້າເດ່ນ</Th>
                      <Th fontFamily={"Noto Sans Lao, serif"}>ວັນທີ່ເພີ່ມ</Th>
                      <Th fontFamily={"Noto Sans Lao, serif"}>ການດຳເນີນການ</Th>
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
                          // onEditOpen();
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
          ສະແດງ {filteredProducts.length} ຈາກ {get_products?.length || 0} ລາຍການ
        </Text>
      </VStack>

      {/* Edit Product Modal  ແກ້ໄຂສິນຄ້າ*/}
      {/* <Modal isOpen={isEditOpen} onClose={onEditClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ແກ້ໄຂຂໍ້ມູນສິນຄ້າ</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {currentProduct && (
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>ຊື່ສິນຄ້າ</FormLabel>
                  <Input
                    defaultValue={currentProduct.name}
                    maxLength={100}
                    placeholder="ກະລຸນາລະບຸຊື້ສິນຄ້າ"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>ຄຳອະທິບາຍ</FormLabel>
                  <Textarea
                    defaultValue={currentProduct.description}
                    maxLength={1000}
                    placeholder="ກະລຸນາລະບຸຄຳອະທິບາຍສິນຄ້າ"
                    rows={4}
                  />
                </FormControl>
                <HStack w="full">
                  <FormControl>
                    <FormLabel>ລາຄາ (LAK)</FormLabel>
                    <NumberInput
                      defaultValue={currentProduct.price}
                      min={0}
                      max={1000000}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                  <FormControl>
                    <FormLabel>ລາຄາຫລຸດ (LAK)</FormLabel>
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
                    <FormLabel>ຈຳນວນຄົງເຫຼືອ</FormLabel>
                    <NumberInput
                      defaultValue={currentProduct.stock}
                      min={0}
                      max={999999}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                  <FormControl>
                    <FormLabel>ໝວດໝູ່</FormLabel>
                    <Select defaultValue={currentProduct.categoryId?.name}>
                      <option value="">ເລືອກໝວດໝູ່</option>
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
                    ສິນຄ້າເດ່ນ
                  </Checkbox>
                </Stack>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              ຍົກເລີກ
            </Button>
            <Button
              colorScheme="blue"
              onClick={onEditClose}
              isLoading={isLoading}
              loadingText="ກຳລັງບັນທຶກ..."
            >
              ບັນທຶກ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}

      {/* Reject Product Modal */}
      <Modal isOpen={isRejectOpen} onClose={onRejectClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ປະຕິເສດສິນຄ້າ</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Alert status="warning">
                <AlertIcon />
                <Box>
                  <AlertTitle>ຄຳເຕືອນ!</AlertTitle>
                  <AlertDescription>
                    ການປະຕິເສດສິນຄ້າສົ່ງຜົນໃຫ້ຜູ້ຂາຍບໍ່ສາມາດຂາຍສິນຄ້ານີ້ົໄດ້
                  </AlertDescription>
                </Box>
              </Alert>
              <Text>ກະລຸນາລະບຸເຫດຜົນທີ່ປະຕິເສດສິນຄ້າ:</Text>
              <Textarea
                placeholder="ເຫດຜົນທີ່ປະຕິເສດສິນຄ້າ ...."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                maxLength={500}
                rows={4}
              />
              <Text fontSize="sm" color="gray.500" alignSelf="flex-end">
                {rejectReason.length}/500 ຕົວອັກສອນ
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onRejectClose}>
              ຍົກເລີກ
            </Button>
            <Button
              colorScheme="red"
              onClick={handleReject}
              isDisabled={
                !rejectReason.trim() || rejectReason.trim().length < 10
              }
              isLoading={isLoading}
              loadingText="ກຳລັງປະຕິເສດ..."
            >
              ປະຕິເສດສິນຄ້າ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Product Preview Modal */}
      <Modal isOpen={isPreviewOpen} onClose={onPreviewClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ຕົວຢ່າງສິນຄ້າ</ModalHeader>
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
                <Heading fontFamily={"Noto Sans Lao, serif"} size="md">
                  {currentProduct.name}
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  {currentProduct.description || "ບໍ່ມີຄຳອະທິບາຍ"}
                </Text>
                <HStack spacing={3}>
                  <Text fontSize="2xl" fontWeight="bold" color="green.600">
                    LAK {currentProduct.price?.toLocaleString() || 0}
                  </Text>
                  {currentProduct.discount_price && (
                    <Text textDecoration="line-through" color="gray.500">
                      LAK {currentProduct.discount_price.toLocaleString()}
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
                  {currentProduct.categoryId?.name || "ບໍ່ມີໝວດໝູ່"}
                </Badge>
                <VStack align="start" spacing={2}>
                  <Text>
                    <strong>ຜູ້ຂາຍ:</strong>{" "}
                    {currentProduct.user_id?.username || "N/A"}
                  </Text>
                  <Text>
                    <strong>ຄົງເຫຼືອ:</strong> {currentProduct.stock || 0} ອັນ
                  </Text>
                  <Text>
                    <strong>ຍອດຂາຍ:</strong> {currentProduct.sold_count || 0}{" "}
                    ອັນ
                  </Text>
                  <Text>
                    <strong>ແບຣນ:</strong> {currentProduct.brand || "ບໍ່ລະບຸ"}
                  </Text>
                </VStack>
                {currentProduct.tags && currentProduct.tags.length > 0 && (
                  <HStack spacing={2} flexWrap="wrap">
                    <Text fontSize="sm" fontWeight="medium">
                      ແທ໋ກ:
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
            <Button onClick={onPreviewClose}>ປິດ</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Bulk Actions Modal */}
      <Modal isOpen={isBulkOpen} onClose={onBulkClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ການດຳເນີນການແບບກຸ່ມ</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Alert status="info">
                <AlertIcon />
                <Box>
                  <AlertTitle>ຂໍ້ມູນ</AlertTitle>
                  <AlertDescription>
                    ເຈົ້າໄດ້ເລືອກ {selectedProducts.length} ລາຍການ
                  </AlertDescription>
                </Box>
              </Alert>
              <Text>ເລືອກດຳເນີນການ:</Text>
              <VStack w="full" spacing={3}>
                <Button
                  w="full"
                  colorScheme="green"
                  leftIcon={<Check size={16} />}
                  onClick={() => handleBulkAction(BULK_ACTIONS.APPROVE)}
                  isDisabled={isLoading}
                  size="lg"
                >
                  ອະນຸມັດທັງໝົດ
                </Button>
                <Button
                  w="full"
                  colorScheme="orange"
                  leftIcon={<X size={16} />}
                  onClick={() => handleBulkAction(BULK_ACTIONS.DISABLE)}
                  isDisabled={isLoading}
                  size="lg"
                >
                  ປະຕິເສດທຸກສິນຄ້າທັງໝົດ
                </Button>
                <Button
                  w="full"
                  colorScheme="blue"
                  leftIcon={<Download size={16} />}
                  onClick={() => handleBulkAction(BULK_ACTIONS.EXPORT)}
                  isDisabled={isLoading}
                  size="lg"
                >
                  ສົ່ງອອກຂໍ້ມູນ
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
              ຍົກເລີກ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

ProductTableRow.displayName = "ProductTableRow";

export default ProductManagement;
