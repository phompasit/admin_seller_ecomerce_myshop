import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Select,
  Text,
  Image,
  Badge,
  Card,
  CardBody,
  Flex,
  Grid,
  VStack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Alert,
  AlertIcon,
  Textarea,
  NumberInput,
  NumberInputField,
  FormControl,
  FormLabel,
  useToast,
  Container,
  Heading,
  Divider,
  Tooltip,
  Spinner,
  Center,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  SimpleGrid,
  Tag,
  TagCloseButton,
  Wrap,
  WrapItem,
  TagLabel,
  FormHelperText,
} from "@chakra-ui/react";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  DeleteIcon,
  AddIcon,
} from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { get_category, get_sellers } from "../../hooks/reducer/admin_reducer/provider_reducer";
import {
  add_product,
  messageClear,
  get_product,
  delete_images_products,
  update_product,
  update_status,
} from "../../hooks/reducer/sellers_reducer/provider_sellers";

const ProductManagement = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(get_category());
    dispatch(get_product());
    dispatch(get_sellers())
  }, [dispatch]);

  const { loader, successMessage, errorMessage, product, } = useSelector(
    (state) => state.provider_sellers
  );
  const { categoryList } = useSelector((state) => state.provider_reducer);
  const [products, setProducts] = useState();
  const [filteredProducts, setFilteredProducts] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [newTag, setNewTag] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  /////filter categoryList status ===true can use
  const categoryL = categoryList?.filter((i) => i.status === true);
  // Filter และ Search
  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((product) => product.status === statusFilter);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchTerm, statusFilter]);
  useEffect(() => {
    setProducts(product);
    setFilteredProducts(product);
  }, [product]);
  // Pagination
  const totalPages = Math.ceil(filteredProducts?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "green";
      case "out_of_stock":
        return "red";
      case "discontinued":
        return "gray";
      case "temporarily_unavailable":
        return "orange";
      default:
        return "gray";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "available":
        return "วางขาย";
      case "out_of_stock":
        return "สินค้าหมด";
      case "discontinued":
        return "ยกเลิกจำหน่าย";
      case "temporarily_unavailable":
        return "หยุดจำหน่ายชั่วคราว";
      default:
        return status;
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      images: [],
      status: "available",
      low_stock_threshold: 5,
      categoryId: "",
      brand: "",
      sku: "",
      tags: [],
      size: [],
      colors: [],
      is_featured: false,
      shipping_info: {
        weight: 0,
        dimensions: { length: 0, width: 0, height: 0 },
        shipping_fee: 0,
      },
    });
    setSelectedImages([]);
    setIsEditing(false);
    onOpen();
  };

  const handleEditProduct = (product) => {
    setSelectedProduct({ ...product });
    setSelectedImages(product.images || []);
    setImageFiles(product.images || []);
    setIsEditing(true);
    onOpen();
  };

  const handleDeleteProduct = (productId) => {
    console.log("productId", productId);
    setProducts(products.filter((p) => p.id !== productId));
    toast({
      title: "ลบสินค้าสำเร็จ",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
console.log(selectedProduct)
  const handleSaveProduct = async () => {
    
    const productData = {
      ...selectedProduct,
      images: imageFiles,
    };
    if (isEditing) {
      console.log("edit");
      await dispatch(update_product(productData)).then(() =>
        dispatch(get_product())
      );
    } else {
      const newProduct = {
        ...productData,
      };
      await dispatch(add_product(newProduct)).then(() =>
        dispatch(get_product())
      );
    }
     onClose();
  };

  const handleToggleTemporaryStatus = async (product) => {
    const isTemporarilyUnavailable =
      product.status === "temporarily_unavailable";

    const newStatus = isTemporarilyUnavailable
      ? "available"
      : "temporarily_unavailable";

    try {
      await dispatch(
        update_status({ id: product._id, status: newStatus })
      ).then(() => dispatch(get_product()));
    } catch (error) {
      toast({
        title: error.data.error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const isLowStock = (stock, threshold) => stock <= threshold && stock > 0;

  // Handle file input for multiple images
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // สร้าง preview URL
    const newImageUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedImages((prev) => [...prev, ...newImageUrls]);

    // เก็บไฟล์จริงไว้ส่ง backend
    setImageFiles((prev) => [...prev, ...files]);
  };

  // Add image URL manually
  const addImageUrl = () => {
    const url = prompt("กรุณาใส่ URL ของรูปภาพ:");
    if (url && url.trim()) {
      setSelectedImages((prev) => [...prev, url.trim()]);
    }
  };

  // Remove image
  const removeImage = (index, data) => {
    console.log(index);
    if (isEditing) {
      //1   ,1,\\22
      if (data?.images?.length === index) {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
      } else {
        dispatch(delete_images_products({ index, id: data._id })).then(() =>
          dispatch(get_product())
        );
      }
    } else {
      setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    }
    onClose();
  };

  // Handle image navigation in table
  const handleImageNavigation = (productId, direction) => {
    const product = products.find((p) => p._id === productId);
    if (!product || !product.images || product.images.length <= 1) return;

    const currentIndex = currentImageIndex[productId] || 0;
    let newIndex;

    if (direction === "next") {
      newIndex = (currentIndex + 1) % product.images.length;
    } else {
      newIndex =
        currentIndex === 0 ? product.images.length - 1 : currentIndex - 1;
    }

    setCurrentImageIndex((prev) => ({
      ...prev,
      [productId]: newIndex,
    }));
  };
  // Tag management functions
  const addTag = () => {
    if (newTag.trim() && !selectedProduct.tags.includes(newTag.trim())) {
      setSelectedProduct({
        ...selectedProduct,
        tags: [...selectedProduct.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedProduct({
      ...selectedProduct,
      tags: selectedProduct.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  // Size management functions
  const addSize = () => {
    if (newSize && !selectedProduct.size.includes(newSize)) {
      setSelectedProduct({
        ...selectedProduct,
        size: [...selectedProduct.size, newSize],
      });
      setNewSize("");
    }
  };

  const removeSize = (sizeToRemove) => {
    setSelectedProduct({
      ...selectedProduct,
      size: selectedProduct.size.filter((size) => size !== sizeToRemove),
    });
  };

  // Color management functions
  const addColor = () => {
    if (newColor && !selectedProduct.colors.includes(newColor)) {
      setSelectedProduct({
        ...selectedProduct,
        colors: [...selectedProduct.colors, newColor],
      });
      setNewColor("");
    }
  };

  const removeColor = (colorToRemove) => {
    setSelectedProduct({
      ...selectedProduct,
      colors: selectedProduct.colors.filter((color) => color !== colorToRemove),
    });
  };
  useEffect(() => {
    if (successMessage) {
      toast({
        title: "สำเร็จ",
        description: successMessage,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast({
        title: "ข้อผิดพลาด",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, toast]);
  return (
    <Container maxW="container.xl" p={4}>
      {/* Header */}
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" color="blue.600" mb={2}>
            📦 จัดการสินค้า
          </Heading>
          <Text color="gray.600">จัดการสินค้าในร้านของคุณ</Text>
        </Box>

        <Divider />

        {/* Controls */}
        <Flex direction={{ base: "column", md: "row" }} gap={4} align="center">
          <Button
            colorScheme="blue"
            size="md"
            onClick={handleAddProduct}
            flexShrink={0}
          >
            ✅ เพิ่มสินค้าใหม่
          </Button>

          <HStack spacing={4} flex={1} w={{ base: "100%", md: "auto" }}>
            <Input
              placeholder="🔍 ค้นหาสินค้า..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              maxW="300px"
            />

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              maxW="200px"
            >
              <option value="all">🔘 ทั้งหมด</option>
              <option value="available">✅ วางขาย</option>
              <option value="out_of_stock">❌ สินค้าหมด</option>
              <option value="discontinued">⛔ ยกเลิกจำหน่าย</option>
              <option value="temporarily_unavailable">
                ⏸️ หยุดจำหน่ายชั่วคราว
              </option>
            </Select>
          </HStack>
        </Flex>

        {/* Products Table */}
        {currentProducts?.length === 0 ? (
          <Center py={10}>
            <VStack spacing={4}>
              <Text fontSize="xl" color="gray.500">
                😔 ไม่พบสินค้าที่ค้นหา
              </Text>
              <Button
                colorScheme="blue"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                ล้างตัวกรอง
              </Button>
            </VStack>
          </Center>
        ) : (
          <Box
            overflowX="auto"
            bg="white"
            borderRadius="lg"
            shadow="sm"
            border="1px"
            borderColor="gray.200"
          >
            <Box as="table" w="100%" style={{ tableLayout: "fixed" }}>
              {/* Table Header */}
              <Box as="thead" bg="gray.50">
                <Box as="tr">
                  <Box
                    as="th"
                    textAlign="left"
                    p={4}
                    borderBottom="1px"
                    borderColor="gray.200"
                    w="120px"
                  >
                    <Text fontWeight="semibold" fontSize="sm" color="gray.700">
                      รูปภาพ
                    </Text>
                  </Box>
                  <Box
                    as="th"
                    textAlign="left"
                    p={4}
                    borderBottom="1px"
                    borderColor="gray.200"
                    minW="200px"
                  >
                    <Text fontWeight="semibold" fontSize="sm" color="gray.700">
                      ชื่อสินค้า
                    </Text>
                  </Box>
                  <Box
                    as="th"
                    textAlign="left"
                    p={4}
                    borderBottom="1px"
                    borderColor="gray.200"
                    minW="250px"
                  >
                    <Text fontWeight="semibold" fontSize="sm" color="gray.700">
                      คำอธิบาย
                    </Text>
                  </Box>
                  <Box
                    as="th"
                    textAlign="right"
                    p={4}
                    borderBottom="1px"
                    borderColor="gray.200"
                    w="100px"
                  >
                    <Text fontWeight="semibold" fontSize="sm" color="gray.700">
                      ราคา
                    </Text>
                  </Box>
                  <Box
                    as="th"
                    textAlign="center"
                    p={4}
                    borderBottom="1px"
                    borderColor="gray.200"
                    w="80px"
                  >
                    <Text fontWeight="semibold" fontSize="sm" color="gray.700">
                      คงเหลือ
                    </Text>
                  </Box>
                  <Box
                    as="th"
                    textAlign="center"
                    p={4}
                    borderBottom="1px"
                    borderColor="gray.200"
                    w="120px"
                  >
                    <Text fontWeight="semibold" fontSize="sm" color="gray.700">
                      สถานะ
                    </Text>
                  </Box>
                  <Box
                    as="th"
                    textAlign="center"
                    p={4}
                    borderBottom="1px"
                    borderColor="gray.200"
                    w="200px"
                  >
                    <Text fontWeight="semibold" fontSize="sm" color="gray.700">
                      จัดการ
                    </Text>
                  </Box>
                </Box>
              </Box>

              {/* Table Body */}
              <Box as="tbody">
                {currentProducts?.map((product, index) => {
                  const currentIndex = currentImageIndex[product._id] || 0;
                  const displayImage =
                    product.images && product.images.length > 0
                      ? product.images[currentIndex]
                      : null;
                  return (
                    <Box
                      key={index}
                      as="tr"
                      bg={index % 2 === 0 ? "white" : "gray.25"}
                      _hover={{ bg: "blue.50" }}
                      transition="background-color 0.2s"
                    >
                      {/* Image with navigation */}
                      <Box
                        as="td"
                        p={4}
                        borderBottom="1px"
                        borderColor="gray.100"
                      >
                        <Box position="relative">
                          {/* Main image */}
                          <Image
                            src={displayImage}
                            alt={product.name}
                            width="80px"
                            height="80px"
                            objectFit="cover"
                            borderRadius="md"
                            fallbackSrc="https://via.placeholder.com/80x80?text=No+Image"
                            cursor="pointer"
                            onMouseEnter={() => setHoveredProduct(product._id)}
                            onMouseLeave={() => setHoveredProduct(null)}
                          />

                          {/* Image navigation buttons */}
                          {product.images && product.images.length > 1 && (
                            <HStack spacing={1} mt={1} justify="center">
                              <IconButton
                                size="xs"
                                variant="ghost"
                                icon={<ChevronLeftIcon />}
                                onClick={() =>
                                  handleImageNavigation(product._id, "prev")
                                }
                                aria-label="Previous image"
                              />
                              <Text fontSize="xs" color="gray.500">
                                {currentIndex + 1}/{product.images.length}
                              </Text>
                              <IconButton
                                size="xs"
                                variant="ghost"
                                icon={<ChevronRightIcon />}
                                onClick={() =>
                                  handleImageNavigation(product._id, "next")
                                }
                                aria-label="Next image"
                              />
                            </HStack>
                          )}

                          {/* Dropdown menu for all images */}
                          {product.images && product.images.length > 1 && (
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                icon={<ChevronDownIcon />}
                                size="xs"
                                variant="ghost"
                                position="absolute"
                                top={1}
                                right={1}
                                bg="blackAlpha.600"
                                color="white"
                                _hover={{ bg: "blackAlpha.800" }}
                                aria-label="View all images"
                              />
                              <MenuList maxH="300px" overflowY="auto">
                                {product.images.map((img, imgIndex) => (
                                  <MenuItem
                                    key={imgIndex}
                                    onClick={() =>
                                      setCurrentImageIndex((prev) => ({
                                        ...prev,
                                        [product._id]: imgIndex,
                                      }))
                                    }
                                    bg={
                                      imgIndex === currentIndex
                                        ? "blue.50"
                                        : "white"
                                    }
                                  >
                                    <HStack spacing={3}>
                                      <Image
                                        src={img}
                                        alt={`${product.name} ${imgIndex + 1}`}
                                        width="40px"
                                        height="40px"
                                        objectFit="cover"
                                        borderRadius="sm"
                                        fallbackSrc="https://via.placeholder.com/40x40?text=No"
                                      />
                                      <Text fontSize="sm">
                                        รูปที่ {imgIndex + 1}
                                      </Text>
                                    </HStack>
                                  </MenuItem>
                                ))}
                              </MenuList>
                            </Menu>
                          )}

                          {/* Preview on hover */}
                          {hoveredProduct === product._id && displayImage && (
                            <Box
                              position="fixed"
                              zIndex={1000}
                              top="50%"
                              left="50%"
                              transform="translate(-50%, -50%)"
                              bg="white"
                              p={4}
                              borderRadius="lg"
                              shadow="xl"
                              border="1px"
                              borderColor="gray.200"
                              maxW="300px"
                            >
                              <Image
                                src={displayImage}
                                alt={product.name}
                                width="100%"
                                height="200px"
                                objectFit="cover"
                                borderRadius="md"
                                fallbackSrc="https://via.placeholder.com/300x200?text=No+Image"
                              />
                              <Text
                                fontSize="sm"
                                fontWeight="semibold"
                                mt={2}
                                textAlign="center"
                              >
                                {product.name}
                              </Text>
                              {product.images && product.images.length > 1 && (
                                <Text
                                  fontSize="xs"
                                  color="gray.500"
                                  textAlign="center"
                                >
                                  รูปที่ {currentIndex + 1} จาก{" "}
                                  {product.images.length}
                                </Text>
                              )}
                            </Box>
                          )}
                        </Box>
                      </Box>

                      {/* Name */}
                      <Box
                        as="td"
                        p={4}
                        borderBottom="1px"
                        borderColor="gray.100"
                      >
                        <Text fontWeight="semibold" fontSize="sm" noOfLines={2}>
                          {product.name}
                        </Text>
                      </Box>

                      {/* Description */}
                      <Box
                        as="td"
                        p={4}
                        borderBottom="1px"
                        borderColor="gray.100"
                      >
                        <Text fontSize="sm" color="gray.600" noOfLines={2}>
                          {product.description}
                        </Text>
                      </Box>

                      {/* Price */}
                      <Box
                        as="td"
                        p={4}
                        borderBottom="1px"
                        borderColor="gray.100"
                        textAlign="right"
                      >
                        <Text fontWeight="bold" color="blue.600" fontSize="sm">
                          ฿{product.price.toLocaleString()}
                        </Text>
                      </Box>

                      {/* Stock */}
                      <Box
                        as="td"
                        p={4}
                        borderBottom="1px"
                        borderColor="gray.100"
                        textAlign="center"
                      >
                        <VStack spacing={1}>
                          <Text fontSize="sm" fontWeight="semibold">
                            {product.stock}
                          </Text>
                          {isLowStock(
                            product.stock,
                            product.low_stock_threshold
                          ) && (
                            <Tooltip label="สินค้าใกล้หมด" hasArrow>
                              <Text fontSize="xs" color="orange.500">
                                ⚠️
                              </Text>
                            </Tooltip>
                          )}
                        </VStack>
                      </Box>

                      {/* Status */}
                      <Box
                        as="td"
                        p={4}
                        borderBottom="1px"
                        borderColor="gray.100"
                        textAlign="center"
                      >
                        <Badge
                          colorScheme={getStatusColor(product.status)}
                          fontSize="xs"
                          borderRadius="full"
                          px={2}
                          py={1}
                        >
                          {getStatusText(product.status)}
                        </Badge>
                      </Box>

                      {/* Actions */}
                      <Box
                        as="td"
                        p={4}
                        borderBottom="1px"
                        borderColor="gray.100"
                      >
                        <HStack spacing={1} justify="center" flexWrap="wrap">
                          <Tooltip label="แก้ไขสินค้า" hasArrow>
                            <Button
                              size="sm"
                              colorScheme="blue"
                              variant="ghost"
                              onClick={() => handleEditProduct(product)}
                              fontSize="xs"
                              px={2}
                            >
                              ✏️
                            </Button>
                          </Tooltip>

                          <Tooltip
                            label={
                              product.status === "temporarily_unavailable"
                                ? "กลับมาวางขาย"
                                : "หยุดจำหน่ายชั่วคราว"
                            }
                            hasArrow
                          >
                            <Button
                              size="sm"
                              colorScheme={
                                product.status === "temporarily_unavailable"
                                  ? "green"
                                  : "orange"
                              }
                              variant="ghost"
                              onClick={() =>
                                handleToggleTemporaryStatus(product)
                              }
                              fontSize="xs"
                              px={2}
                            >
                              {product.status === "temporarily_unavailable"
                                ? "▶️"
                                : "⏸️"}
                            </Button>
                          </Tooltip>

                          <Tooltip label="ลบสินค้า" hasArrow>
                            <Button
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => handleDeleteProduct(product._id)}
                              fontSize="xs"
                              px={2}
                            >
                              🗑️
                            </Button>
                          </Tooltip>
                        </HStack>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box
            bg="white"
            p={4}
            borderRadius="lg"
            shadow="sm"
            border="1px"
            borderColor="gray.200"
          >
            <HStack spacing={2} justify="space-between" align="center">
              <Text fontSize="sm" color="gray.600">
                แสดง {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, filteredProducts.length)}{" "}
                จาก {filteredProducts.length} รายการ
              </Text>

              <HStack spacing={2}>
                <Button
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  isDisabled={currentPage === 1}
                  leftIcon={<ChevronLeftIcon />}
                  variant="outline"
                >
                  ก่อนหน้า
                </Button>

                <HStack spacing={1}>
                  {/* First page */}
                  {currentPage > 3 && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        variant="outline"
                      >
                        1
                      </Button>
                      {currentPage > 4 && (
                        <Text fontSize="sm" color="gray.500" px={1}>
                          ...
                        </Text>
                      )}
                    </>
                  )}

                  {/* Pages around current */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    if (pageNumber < 1 || pageNumber > totalPages) return null;

                    return (
                      <Button
                        key={pageNumber}
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        colorScheme={
                          currentPage === pageNumber ? "blue" : "gray"
                        }
                        variant={
                          currentPage === pageNumber ? "solid" : "outline"
                        }
                      >
                        {pageNumber}
                      </Button>
                    );
                  }).filter(Boolean)}

                  {/* Last page */}
                  {currentPage < totalPages - 2 && totalPages > 5 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <Text fontSize="sm" color="gray.500" px={1}>
                          ...
                        </Text>
                      )}
                      <Button
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        variant="outline"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </HStack>

                <Button
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  isDisabled={currentPage === totalPages}
                  rightIcon={<ChevronRightIcon />}
                  variant="outline"
                >
                  ถัดไป
                </Button>
              </HStack>

              <Select
                size="sm"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                w="auto"
                minW="100px"
              >
                <option value={6}>6 / หน้า</option>
                <option value={12}>12 / หน้า</option>
                <option value={24}>24 / หน้า</option>
                <option value={50}>50 / หน้า</option>
              </Select>
            </HStack>
          </Box>
        )}

        {/* Product Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent maxW="800px">
            <ModalHeader>
              {isEditing ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedProduct && (
                <Stack spacing={4}>
                  <HStack>
                    <FormControl>
                      <FormLabel>ชื่อสินค้า</FormLabel>
                      <Input
                        value={selectedProduct.name}
                        onChange={(e) =>
                          setSelectedProduct({
                            ...selectedProduct,
                            name: e.target.value,
                          })
                        }
                      />
                    </FormControl>
                    <FormControl flex={1}>
                      <FormLabel>แบรนด์</FormLabel>
                      <Input
                        value={selectedProduct.brand}
                        onChange={(e) =>
                          setSelectedProduct({
                            ...selectedProduct,
                            brand: e.target.value,
                          })
                        }
                        placeholder="ระบุแบรนด์"
                      />
                    </FormControl>
                  </HStack>
                  =
                  <FormControl>
                    <FormLabel>คำอธิบาย</FormLabel>
                    <Textarea
                      value={selectedProduct.description}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </FormControl>
                  <HStack>
                    <FormControl>
                      <FormLabel>ราคา (บาท)</FormLabel>
                      <NumberInput
                        value={selectedProduct.price}
                        onChange={(value) =>
                          setSelectedProduct({
                            ...selectedProduct,
                            price: parseInt(value) || 0,
                          })
                        }
                        min={0}
                      >
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>

                    <FormControl>
                      <FormLabel>จำนวนคงเหลือ</FormLabel>
                      <NumberInput
                        value={selectedProduct.stock}
                        onChange={(value) =>
                          setSelectedProduct({
                            ...selectedProduct,
                            stock: parseInt(value) || 0,
                          })
                        }
                        min={0}
                      >
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>
                  </HStack>
                  <HStack>
                    <FormControl>
                      <FormLabel>สถานะ</FormLabel>
                      <Select
                        value={selectedProduct.status}
                        onChange={(e) =>
                          setSelectedProduct({
                            ...selectedProduct,
                            status: e.target.value,
                          })
                        }
                      >
                        <option value="available">วางขาย</option>
                        <option value="out_of_stock">สินค้าหมด</option>
                        <option value="discontinued">ยกเลิกจำหน่าย</option>
                        <option value="temporarily_unavailable">
                          หยุดจำหน่ายชั่วคราว
                        </option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>แจ้งเตือนเมื่อเหลือ</FormLabel>
                      <NumberInput
                        value={selectedProduct.low_stock_threshold}
                        onChange={(value) =>
                          setSelectedProduct({
                            ...selectedProduct,
                            low_stock_threshold: parseInt(value) || 1,
                          })
                        }
                        min={1}
                      >
                        <NumberInputField />
                      </NumberInput>
                    </FormControl>
                  </HStack>
                  <HStack>
                    <FormControl flex={1}>
                      <FormLabel>SKU</FormLabel>
                      <Input
                      width={'200px'}
                        value={selectedProduct.sku}
                        onChange={(e) =>
                          setSelectedProduct({
                            ...selectedProduct,
                            sku: e.target.value,
                          })
                        }
                        placeholder="เช่น TSH-001-BLK-M"
                      />
                        <FormHelperText color={'red'}>ລະຫັດ ບາໂຄ້ດ</FormHelperText>
                    </FormControl>
                    <FormControl>
                      <FormLabel>ໝວດໝູ່</FormLabel>
                      <Select
                        value={selectedProduct.categoryId}
                        onChange={(e) =>
                          setSelectedProduct({
                            ...selectedProduct,
                            categoryId: e.target.value,
                          })
                        }
                      >
                        <option value="">ไม่มีหมวดหมู่</option>
                        {categoryL?.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </Select>
                      <FormHelperText color={'red'}>ກະລຸນາເລືອກ category ທຸກຄັ້ງເວລາອັບເດດ</FormHelperText>
                    </FormControl>
                  </HStack>
                  <FormControl>
                    <FormLabel>แท็ก</FormLabel>
                    <HStack mb={2}>
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="เพิ่มแท็ก"
                        size="sm"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                      />
                      <Button size="sm" onClick={addTag} colorScheme="blue">
                        เพิ่ม
                      </Button>
                    </HStack>
                  </FormControl>
                  <Wrap spacing={2}>
                    {selectedProduct?.tags?.map((tag, index) => (
                      <WrapItem key={index}>
                        <Tag size="sm" colorScheme="blue" variant="solid">
                          <TagLabel>{tag}</TagLabel>
                          <TagCloseButton onClick={() => removeTag(tag)} />
                        </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                  {/* Size & Colors Tab */}
                  <Stack spacing={6}>
                    {/* Sizes Section */}
                    <Box>
                      <FormLabel>ขนาดที่มีจำหน่าย</FormLabel>
                      <VStack align="stretch" spacing={3}>
                        <HStack>
                          <Input
                            value={newSize}
                            onChange={(e) => setNewSize(e.target.value)}
                            size="sm"
                            placeholder="เลือกขนาด"
                          />

                          <Button
                            size="sm"
                            onClick={addSize}
                            colorScheme="purple"
                            leftIcon={<AddIcon />}
                          >
                            เพิ่ม
                          </Button>
                        </HStack>
                        <Wrap spacing={2}>
                          {selectedProduct.size.map((size, index) => (
                            <WrapItem key={index}>
                              <Tag
                                size="md"
                                colorScheme="purple"
                                variant="solid"
                              >
                                <TagLabel>{size}</TagLabel>
                                <TagCloseButton
                                  onClick={() => removeSize(size)}
                                />
                              </Tag>
                            </WrapItem>
                          ))}
                        </Wrap>
                        {selectedProduct.size.length === 0 && (
                          <Text
                            fontSize="sm"
                            color="gray.500"
                            fontStyle="italic"
                          >
                            ยังไม่มีขนาดที่เลือก
                          </Text>
                        )}
                      </VStack>
                    </Box>

                    {/* Colors Section */}
                    <Box>
                      <FormLabel>สีที่มีจำหน่าย</FormLabel>
                      <VStack align="stretch" spacing={3}>
                        <HStack>
                          <Input
                            value={newColor}
                            onChange={(e) => setNewColor(e.target.value)}
                            size="sm"
                            placeholder="เลือกสี"
                          />

                          <Button
                            size="sm"
                            onClick={addColor}
                            colorScheme="green"
                            leftIcon={<AddIcon />}
                          >
                            เพิ่ม
                          </Button>
                        </HStack>
                        <Wrap spacing={2}>
                          {selectedProduct.colors.map((color, index) => (
                            <WrapItem key={index}>
                              <Tag
                                size="md"
                                colorScheme="green"
                                variant="solid"
                              >
                                <TagLabel>{color}</TagLabel>
                                <TagCloseButton
                                  onClick={() => removeColor(color)}
                                />
                              </Tag>
                            </WrapItem>
                          ))}
                        </Wrap>
                        {selectedProduct.colors.length === 0 && (
                          <Text
                            fontSize="sm"
                            color="gray.500"
                            fontStyle="italic"
                          >
                            ยังไม่มีสีที่เลือก
                          </Text>
                        )}
                      </VStack>
                    </Box>

                    <Box
                      p={3}
                      bg="blue.50"
                      borderRadius="md"
                      border="1px"
                      borderColor="blue.200"
                    >
                      <Text fontSize="sm" color="blue.700" fontWeight="medium">
                        💡 เคล็ดลับ:
                        ขนาดและสีที่หลากหลายจะช่วยเพิ่มโอกาสในการขาย
                      </Text>
                    </Box>
                  </Stack>
                  {/* Shipping Tab */}
                  <Stack spacing={4}>
                    <Heading size="md" color="blue.600">
                      ข้อมูลการจัดส่ง
                    </Heading>

                    <HStack>
                      <FormControl>
                        <FormLabel>น้ำหนัก (กิโลกรัม)</FormLabel>
                        <NumberInput
                          value={selectedProduct.shipping_info?.weight || 0}
                          onChange={(value) =>
                            setSelectedProduct({
                              ...selectedProduct,
                              shipping_info: {
                                ...selectedProduct.shipping_info,
                                weight: parseFloat(value) || 0,
                              },
                            })
                          }
                          min={0}
                          step={0.1}
                          precision={2}
                        >
                          <NumberInputField placeholder="0.0" />
                        </NumberInput>
                      </FormControl>

                      <FormControl>
                        <FormLabel>ค่าจัดส่ง (บาท)</FormLabel>
                        <NumberInput
                          value={
                            selectedProduct.shipping_info?.shipping_fee || 0
                          }
                          onChange={(value) =>
                            setSelectedProduct({
                              ...selectedProduct,
                              shipping_info: {
                                ...selectedProduct.shipping_info,
                                shipping_fee: parseInt(value) || 0,
                              },
                            })
                          }
                          min={0}
                        >
                          <NumberInputField placeholder="0" />
                        </NumberInput>
                      </FormControl>
                    </HStack>

                    <Box>
                      <FormLabel>ขนาดบรรจุภัณฑ์ (เซนติเมตร)</FormLabel>
                      <HStack>
                        <FormControl>
                          <Input
                            placeholder="ความยาว"
                            value={
                              selectedProduct.shipping_info?.dimensions
                                ?.length || ""
                            }
                            onChange={(e) =>
                              setSelectedProduct({
                                ...selectedProduct,
                                shipping_info: {
                                  ...selectedProduct.shipping_info,
                                  dimensions: {
                                    ...selectedProduct.shipping_info
                                      ?.dimensions,
                                    length: parseFloat(e.target.value) || 0,
                                  },
                                },
                              })
                            }
                          />
                        </FormControl>
                        <Text>×</Text>
                        <FormControl>
                          <Input
                            placeholder="ความกว้าง"
                            value={
                              selectedProduct.shipping_info?.dimensions
                                ?.width || ""
                            }
                            onChange={(e) =>
                              setSelectedProduct({
                                ...selectedProduct,
                                shipping_info: {
                                  ...selectedProduct.shipping_info,
                                  dimensions: {
                                    ...selectedProduct.shipping_info
                                      ?.dimensions,
                                    width: parseFloat(e.target.value) || 0,
                                  },
                                },
                              })
                            }
                          />
                        </FormControl>
                        <Text>×</Text>
                        <FormControl>
                          <Input
                            placeholder="ความสูง"
                            value={
                              selectedProduct.shipping_info?.dimensions
                                ?.height || ""
                            }
                            onChange={(e) =>
                              setSelectedProduct({
                                ...selectedProduct,
                                shipping_info: {
                                  ...selectedProduct.shipping_info,
                                  dimensions: {
                                    ...selectedProduct.shipping_info
                                      ?.dimensions,
                                    height: parseFloat(e.target.value) || 0,
                                  },
                                },
                              })
                            }
                          />
                        </FormControl>
                      </HStack>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        ใส่ขนาดบรรจุภัณฑ์เพื่อคำนวณค่าจัดส่งที่แม่นยำ
                      </Text>
                    </Box>

                    <Box
                      p={3}
                      bg="orange.50"
                      borderRadius="md"
                      border="1px"
                      borderColor="orange.200"
                    >
                      <Text
                        fontSize="sm"
                        color="orange.700"
                        fontWeight="medium"
                      >
                        📦
                        ข้อมูลการจัดส่งจะช่วยในการคำนวณค่าส่งและการเลือกบริการขนส่งที่เหมาะสม
                      </Text>
                    </Box>
                  </Stack>
                  {/* Enhanced Image Management Section */}
                  <FormControl>
                    <FormLabel>รูปภาพสินค้า</FormLabel>

                    {/* Upload and Add URL Buttons */}
                    <HStack spacing={2} mb={4}>
                      <Button
                        as="label"
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        cursor="pointer"
                      >
                        📁 อัพโหลดรูป
                        <Input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          display="none"
                        />
                      </Button>

                      <Button
                        size="sm"
                        colorScheme="green"
                        variant="outline"
                        onClick={addImageUrl}
                      >
                        🔗 เพิ่ม URL
                      </Button>

                      {selectedImages.length > 0 && (
                        <Text fontSize="sm" color="gray.600">
                          ({selectedImages.length} รูป)
                        </Text>
                      )}
                    </HStack>

                    {/* Images Grid Display */}
                    {selectedImages.length > 0 ? (
                      <SimpleGrid
                        columns={{ base: 2, md: 3, lg: 4 }}
                        spacing={4}
                      >
                        {selectedImages.map((img, index) => (
                          <Box
                            key={index}
                            position="relative"
                            borderWidth={2}
                            borderColor={index === 0 ? "blue.400" : "gray.200"}
                            borderRadius="lg"
                            overflow="hidden"
                            bg="gray.50"
                          >
                            {/* Image */}
                            <Image
                              src={img}
                              alt={`Product image ${index + 1}`}
                              width="100%"
                              height="120px"
                              objectFit="cover"
                              fallbackSrc="https://via.placeholder.com/150x120?text=Error"
                            />

                            {/* Main image indicator */}
                            {index === 0 && (
                              <Badge
                                position="absolute"
                                top={1}
                                left={1}
                                colorScheme="blue"
                                fontSize="xs"
                                borderRadius="full"
                              >
                                หลัก
                              </Badge>
                            )}

                            {/* Image controls */}
                            <HStack
                              position="absolute"
                              top={1}
                              right={1}
                              spacing={1}
                            >
                              {/* Set as main image */}
                              {index !== 0 && (
                                <Tooltip label="ตั้งเป็นรูปหลัก" hasArrow>
                                  <IconButton
                                    size="xs"
                                    colorScheme="blue"
                                    variant="solid"
                                    icon={<Text fontSize="xs">⭐</Text>}
                                    onClick={() => {
                                      const newImages = [...selectedImages];
                                      const [mainImage] = newImages.splice(
                                        index,
                                        1
                                      );
                                      newImages.unshift(mainImage);
                                      setSelectedImages(newImages);
                                    }}
                                    aria-label="Set as main image"
                                  />
                                </Tooltip>
                              )}

                              {/* Delete image */}
                              <Tooltip label="ลบรูป" hasArrow>
                                <IconButton
                                  size="xs"
                                  colorScheme="red"
                                  variant="solid"
                                  icon={<DeleteIcon />}
                                  onClick={() =>
                                    removeImage(index, selectedProduct)
                                  }
                                  aria-label="Delete image"
                                />
                              </Tooltip>
                            </HStack>

                            {/* Image order indicator */}
                            <Box
                              position="absolute"
                              bottom={1}
                              left={1}
                              bg="blackAlpha.700"
                              color="white"
                              px={2}
                              py={1}
                              borderRadius="sm"
                              fontSize="xs"
                            >
                              {index + 1}
                            </Box>
                          </Box>
                        ))}
                      </SimpleGrid>
                    ) : (
                      <Box
                        p={8}
                        border="2px"
                        borderColor="gray.200"
                        borderStyle="dashed"
                        borderRadius="lg"
                        textAlign="center"
                        bg="gray.50"
                      >
                        <VStack spacing={2}>
                          <Text fontSize="4xl">📷</Text>
                          <Text fontSize="sm" color="gray.500">
                            ยังไม่มีรูปภาพ
                          </Text>
                          <Text fontSize="xs" color="gray.400">
                            อัพโหลดรูปหรือเพิ่ม URL เพื่อเริ่มต้น
                          </Text>
                        </VStack>
                      </Box>
                    )}

                    {/* Image Management Tips */}
                    <Box
                      mt={3}
                      p={3}
                      bg="blue.50"
                      borderRadius="md"
                      border="1px"
                      borderColor="blue.200"
                    >
                      <Text fontSize="xs" color="blue.700" fontWeight="medium">
                        💡 เคล็ดลับการจัดการรูปภาพ:
                      </Text>
                      <VStack align="start" spacing={1} mt={1}>
                        <Text fontSize="xs" color="blue.600">
                          • รูปแรกจะเป็นรูปหลักที่แสดงในตาราง
                        </Text>
                        <Text fontSize="xs" color="blue.600">
                          • คลิก ⭐ เพื่อตั้งรูปใดรูปหนึ่งเป็นรูปหลัก
                        </Text>
                        <Text fontSize="xs" color="blue.600">
                          • สามารถอัพโหลดหลายรูปพร้อมกันได้
                        </Text>
                        <Text fontSize="xs" color="blue.600">
                          • รองรับไฟล์ JPG, PNG, GIF และ WebP
                        </Text>
                      </VStack>
                    </Box>
                  </FormControl>
                  <HStack spacing={3} pt={4}>
                    <Button
                      colorScheme="blue"
                      onClick={handleSaveProduct}
                      flex={1}
                      isDisabled={
                        !selectedProduct.name || !selectedProduct.description
                      }
                    >
                      {isEditing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
                    </Button>
                    <Button variant="ghost" onClick={onClose} flex={1}>
                      ยกเลิก
                    </Button>
                  </HStack>
                </Stack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

export default ProductManagement;
