import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  HStack,
  Image,
  Card,
  CardBody,
  Divider,
  useToast,
  Grid,
  GridItem,
  IconButton,
  SimpleGrid,
  Heading,
  Spacer,
  Center,
  useColorModeValue,
  Skeleton,
  SkeletonText,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Select,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  ButtonGroup,
  Tooltip,
} from "@chakra-ui/react";
import {
  SearchIcon,
  ViewIcon,
  CheckIcon,
  CloseIcon,
  PhoneIcon,
  EmailIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InfoIcon,
} from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  get_sellers,
  reject_seller,
} from "../../hooks/reducer/admin_reducer/provider_reducer";
import { update_access_seller } from "../../hooks/reducer/auth_reducer";

// Mock Redux functions for demo

// Mock data

// Loading Skeleton Component
const SellerCardSkeleton = () => {
  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <Card bg={cardBg} boxShadow="md" borderRadius="lg" overflow="hidden">
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Skeleton height="150px" borderRadius="md" />
          <VStack align="stretch" spacing={2}>
            <Skeleton height="20px" width="70%" />
            <Skeleton height="16px" width="40%" />
            <SkeletonText mt="4" noOfLines={2} spacing="4" />
            <Skeleton height="16px" width="60%" />
            <Skeleton height="16px" width="80%" />
          </VStack>
          <Divider />
          <HStack spacing={2}>
            <Skeleton height="32px" flex={1} />
            <Skeleton height="32px" width="32px" />
            <Skeleton height="32px" width="32px" />
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

// Empty State Component
const EmptyState = ({ activeTab, searchTerm }) => {
  const getEmptyMessage = () => {
    if (searchTerm) {
      return {
        title: "ไม่พบผลการค้นหา",
        description: `ไม่พบข้อมูลผู้ขายที่ตรงกับ "${searchTerm}"`,
        icon: <SearchIcon boxSize={10} color="gray.400" />,
      };
    }

    switch (activeTab) {
      case "pending":
        return {
          title: "ไม่มีผู้ขายรออนุมัติ",
          description: "ยังไม่มีผู้ขายที่รอการอนุมัติในขณะนี้",
          icon: <InfoIcon boxSize={10} color="yellow.400" />,
        };
      case "access":
        return {
          title: "ไม่มีผู้ขายที่ผ่านการยืนยัน",
          description: "ยังไม่มีผู้ขายที่ผ่านการยืนยันแล้ว",
          icon: <CheckIcon boxSize={10} color="green.400" />,
        };
      case "rejected":
        return {
          title: "ไม่มีผู้ขายที่ไม่ผ่านการยืนยัน",
          description: "ยังไม่มีผู้ขายที่ถูกปฏิเสธ",
          icon: <CloseIcon boxSize={10} color="red.400" />,
        };
      default:
        return {
          title: "ไม่มีข้อมูลผู้ขาย",
          description: "ยังไม่มีผู้ขายสมัครเข้าร่วมระบบ",
          icon: <InfoIcon boxSize={10} color="gray.400" />,
        };
    }
  };

  const { title, description, icon } = getEmptyMessage();

  return (
    <Center h="400px">
      <VStack spacing={4}>
        {icon}
        <VStack spacing={2}>
          <Heading size="md" color="gray.500">
            {title}
          </Heading>
          <Text color="gray.400" textAlign="center">
            {description}
          </Text>
        </VStack>
      </VStack>
    </Center>
  );
};

// Seller Card Component
const SellerCard = ({ seller, onViewDetails, onApprove, onReject }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge colorScheme="yellow" variant="solid">
            รอดำเนินการ
          </Badge>
        );
      case "access":
        return (
          <Badge colorScheme="green" variant="solid">
            ผ่านการยืนยัน
          </Badge>
        );
      case "rejected":
        return (
          <Badge colorScheme="red" variant="solid">
            ไม่ผ่านการยืนยัน
          </Badge>
        );
      default:
        return (
          <Badge colorScheme="gray" variant="solid">
            ไม่ทราบสถานะ
          </Badge>
        );
    }
  };

  return (
    <Card
      bg={cardBg}
      boxShadow="md"
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
    >
      <CardBody>
        <VStack align="stretch" spacing={4}>
          {/* Store Image & Info */}
          <Box position="relative">
            <Image
              src={
                seller?.store_images ||
                "https://via.placeholder.com/400x150?text=No+Image"
              }
              alt={seller?.store_name}
              borderRadius="md"
              h="150px"
              w="100%"
              objectFit="cover"
              fallbackSrc="https://via.placeholder.com/400x150?text=No+Image"
            />
            <Box position="absolute" top={2} right={2}>
              {getStatusBadge(seller?.verificationStatus)}
            </Box>
          </Box>

          <VStack align="stretch" spacing={2}>
            <Heading size="sm" color={textColor} noOfLines={1}>
              {seller?.store_name || "ไม่ระบุชื่อร้าน"}
            </Heading>
            <Text fontSize="sm" color="gray.500">
              รหัส: {seller?.store_code || "ไม่ระบุ"}
            </Text>
            <Text fontSize="sm" color={textColor} noOfLines={2}>
              {seller?.description || "ไม่มีรายละเอียด"}
            </Text>

            <HStack spacing={2}>
              <PhoneIcon boxSize={3} color="gray.400" />
              <Text fontSize="xs" color="gray.500" noOfLines={1}>
                {seller?.user_id?.phone || "ไม่ระบุ"}
              </Text>
            </HStack>

            <HStack spacing={2}>
              <EmailIcon boxSize={3} color="gray.400" />
              <Text fontSize="xs" color="gray.500" noOfLines={1}>
                {seller?.user_id?.email || "ไม่ระบุ"}
              </Text>
            </HStack>
          </VStack>

          <Divider />

          {/* Actions */}
          <HStack spacing={2}>
            <Button
              size="sm"
              leftIcon={<ViewIcon />}
              colorScheme="blue"
              variant="outline"
              onClick={() => onViewDetails(seller)}
              flex={1}
            >
              ดูข้อมูล
            </Button>

            {seller?.verificationStatus === "pending" && (
              <>
                <Tooltip label="อนุมัติ">
                  <IconButton
                    size="sm"
                    icon={<CheckIcon />}
                    colorScheme="green"
                    onClick={() => onApprove(seller)}
                  />
                </Tooltip>
                <Tooltip label="ปฏิเสธ">
                  <IconButton
                    size="sm"
                    icon={<CloseIcon />}
                    colorScheme="red"
                    onClick={() => onReject(seller)}
                  />
                </Tooltip>
              </>
            )}
          </HStack>

          {/* Rejection Reason */}
          {seller?.verificationStatus === "rejected" &&
            seller?.rejectionReason && (
              <Alert status="error" borderRadius="md" fontSize="sm">
                <AlertIcon boxSize={4} />
                <Box>
                  <AlertTitle fontSize="sm">เหตุผลที่ไม่ผ่าน:</AlertTitle>
                  <AlertDescription fontSize="xs">
                    {seller.rejectionReason}
                  </AlertDescription>
                </Box>
              </Alert>
            )}
        </VStack>
      </CardBody>
    </Card>
  );
};

// Pagination Component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      const end = Math.min(totalPages, start + maxVisible - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <VStack spacing={4}>
      <Text fontSize="sm" color="gray.500">
        แสดง {startItem}-{endItem} จาก {totalItems} รายการ
      </Text>

      <HStack spacing={2}>
        <IconButton
          icon={<ChevronLeftIcon />}
          onClick={() => onPageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
          size="sm"
          variant="outline"
        />

        {getPageNumbers().map((page) => (
          <Button
            key={page}
            onClick={() => onPageChange(page)}
            size="sm"
            variant={currentPage === page ? "solid" : "outline"}
            colorScheme={currentPage === page ? "blue" : "gray"}
          >
            {page}
          </Button>
        ))}

        <IconButton
          icon={<ChevronRightIcon />}
          onClick={() => onPageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          size="sm"
          variant="outline"
        />
      </HStack>
    </VStack>
  );
};

// Main Component
const SellerManagementDashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(get_sellers());
  }, [dispatch]);
  const { loader, successMessage, errorMessage, all_sellers } = useSelector(
    (state) => state.provider_reducer
  );

  // States
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionSeller, setActionSeller] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [sellers, setSellers] = useState([]);

  // Modals
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isRejectOpen,
    onOpen: onRejectOpen,
    onClose: onRejectClose,
  } = useDisclosure();

  const toast = useToast();

  // Colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    setSellers(all_sellers || []);
  }, [all_sellers]);

  // Filtered sellers with pagination
  const { filteredSellers, paginatedSellers, totalPages } = useMemo(() => {
    const filtered =
      sellers?.filter((seller) => {
        if (!searchTerm || searchTerm.trim() === "") return true;

        const lowerSearch = searchTerm.toLowerCase();
        const matchesSearch =
          seller?.store_name?.toLowerCase()?.includes(lowerSearch) ||
          seller?.store_code?.toLowerCase()?.includes(lowerSearch) ||
          seller?.verificationData?.fullName
            ?.toLowerCase()
            ?.includes(lowerSearch);

        switch (activeTab) {
          case "pending":
            return matchesSearch && seller?.verificationStatus === "pending";
          case "access":
            return matchesSearch && seller?.verificationStatus === "access";
          case "rejected":
            return matchesSearch && seller?.verificationStatus === "rejected";
          default:
            return matchesSearch;
        }
      }) || [];

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return {
      filteredSellers: filtered,
      paginatedSellers: paginated,
      totalPages,
    };
  }, [sellers, searchTerm, activeTab, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  // Functions
  const handleApprove = (seller) => {
    const data = {
      id: seller._id,
      verificationStatus: "access",
    };
    dispatch(update_access_seller(data)).then(() => dispatch(get_sellers()));
    toast({
      title: "อนุมัติสำเร็จ",
      description: `อนุมัติร้านเรียบร้อยแล้ว`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "กรุณาระบุเหตุผล",
        description: "กรุณาระบุเหตุผลในการปฏิเสธ",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const data = {
      id: actionSeller._id,
      verificationStatus: "rejected",
      rejectionReason: rejectionReason,
    };
    await dispatch(reject_seller(data)).then(() => dispatch(get_sellers()));
    toast({
      title: "ปฏิเสธสำเร็จ",
      description: `ปฏิเสธร้าน ${
        actionSeller?.store_name || "Not have store Name"
      } เรียบร้อยแล้ว`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });

    setRejectionReason("");
    setActionSeller(null);
    onRejectClose();
  };

  const showSellerDetails = (seller) => {
    setSelectedSeller(seller);
    onOpen();
  };

  const openRejectModal = (seller) => {
    setActionSeller(seller);
    setRejectionReason("");
    onRejectOpen();
  };

  const getStatusCount = (status) => {
    return sellers?.filter((s) => s.verificationStatus === status).length || 0;
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Flex>
        {/* Sidebar */}
        <Box
          w="280px"
          bg={cardBg}
          borderRight="1px"
          borderColor={borderColor}
          minH="100vh"
          p={6}
        >
          <Heading size="lg" mb={6} color={textColor}>
            จัดการผู้ขาย
          </Heading>
          <VStack align="stretch" spacing={3}>
            <Button
              variant={activeTab === "all" ? "solid" : "ghost"}
              colorScheme={activeTab === "all" ? "blue" : "gray"}
              justifyContent="space-between"
              onClick={() => setActiveTab("all")}
              px={4}
              py={6}
            >
              <Text>ผู้ขายทั้งหมด</Text>
              <Badge colorScheme="blue" variant="subtle">
                {sellers?.length || 0}
              </Badge>
            </Button>
            <Button
              variant={activeTab === "pending" ? "solid" : "ghost"}
              colorScheme={activeTab === "pending" ? "yellow" : "gray"}
              justifyContent="space-between"
              onClick={() => setActiveTab("pending")}
              px={4}
              py={6}
            >
              <Text>รออนุมัติ</Text>
              <Badge colorScheme="yellow" variant="subtle">
                {getStatusCount("pending")}
              </Badge>
            </Button>
            <Button
              variant={activeTab === "access" ? "solid" : "ghost"}
              colorScheme={activeTab === "access" ? "green" : "gray"}
              justifyContent="space-between"
              onClick={() => setActiveTab("access")}
              px={4}
              py={6}
            >
              <Text>ผ่านแล้ว</Text>
              <Badge colorScheme="green" variant="subtle">
                {getStatusCount("access")}
              </Badge>
            </Button>
            <Button
              variant={activeTab === "rejected" ? "solid" : "ghost"}
              colorScheme={activeTab === "rejected" ? "red" : "gray"}
              justifyContent="space-between"
              onClick={() => setActiveTab("rejected")}
              px={4}
              py={6}
            >
              <Text>ไม่ผ่าน</Text>
              <Badge colorScheme="red" variant="subtle">
                {getStatusCount("rejected")}
              </Badge>
            </Button>
          </VStack>
        </Box>

        {/* Main Content */}
        <Box flex={1} p={6}>
          {/* Header */}
          <Flex mb={6} align="center" gap={4} wrap="wrap">
            <Heading size="md" color={textColor}>
              {activeTab === "all" && "ผู้ขายทั้งหมด"}
              {activeTab === "pending" && "ผู้ขายรออนุมัติ"}
              {activeTab === "access" && "ผู้ขายที่ผ่านการยืนยัน"}
              {activeTab === "rejected" && "ผู้ขายที่ไม่ผ่านการยืนยัน"}
            </Heading>
            <Spacer />
            <HStack spacing={4}>
              <Select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                w="auto"
                size="sm"
              >
                <option value={6}>6 รายการ/หน้า</option>
                <option value={9}>9 รายการ/หน้า</option>
                <option value={12}>12 รายการ/หน้า</option>
                <option value={18}>18 รายการ/หน้า</option>
              </Select>
              <InputGroup maxW="320px">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="ค้นหาชื่อร้าน, รหัสร้าน, หรือชื่อเจ้าของ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </HStack>
          </Flex>

          {/* Content */}
          {loader ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {Array.from({ length: itemsPerPage }).map((_, index) => (
                <SellerCardSkeleton key={index} />
              ))}
            </SimpleGrid>
          ) : paginatedSellers?.length > 0 ? (
            <>
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={6}
                mb={8}
              >
                {paginatedSellers.map((seller) => (
                  <SellerCard
                    key={seller.id}
                    seller={seller}
                    onViewDetails={showSellerDetails}
                    onApprove={handleApprove}
                    onReject={openRejectModal}
                  />
                ))}
              </SimpleGrid>

              <Center>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredSellers.length}
                />
              </Center>
            </>
          ) : (
            <EmptyState activeTab={activeTab} searchTerm={searchTerm} />
          )}
        </Box>
      </Flex>

      {/* Modal รายละเอียดผู้ขาย */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>รายละเอียดผู้ขาย</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedSeller && (
              <Grid
                templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
                gap={6}
              >
                {/* ข้อมูลร้านค้า */}
                <GridItem>
                  <Card>
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        <Heading size="md" color="blue.600">
                          ข้อมูลร้านค้า
                        </Heading>
                        <Image
                          src={
                            selectedSeller?.store_images ||
                            "https://via.placeholder.com/400x200?text=No+Image"
                          }
                          alt={selectedSeller?.store_name}
                          borderRadius="md"
                          h="200px"
                          w="100%"
                          objectFit="cover"
                          fallbackSrc="https://via.placeholder.com/400x200?text=No+Image"
                        />
                        <VStack align="stretch" spacing={2}>
                          <HStack>
                            <Text fontWeight="bold" minW="100px">
                              ชื่อร้าน:
                            </Text>
                            <Text>
                              {selectedSeller?.store_name || "ไม่ระบุ"}
                            </Text>
                          </HStack>
                          <HStack>
                            <Text fontWeight="bold" minW="100px">
                              รหัสร้าน:
                            </Text>
                            <Text>
                              {selectedSeller?.store_code || "ไม่ระบุ"}
                            </Text>
                          </HStack>
                          <VStack align="stretch">
                            <Text fontWeight="bold">ที่อยู่:</Text>
                            <Text pl={4}>
                              {selectedSeller?.address || "ไม่ระบุ"}
                            </Text>
                          </VStack>
                          <VStack align="stretch">
                            <Text fontWeight="bold">รายละเอียด:</Text>
                            <Text pl={4}>
                              {selectedSeller?.description || "ไม่มีรายละเอียด"}
                            </Text>
                          </VStack>
                          <HStack>
                            <Text fontWeight="bold" minW="100px">
                              สถานะ:
                            </Text>
                            <Badge
                              colorScheme={
                                selectedSeller?.verificationStatus === "pending"
                                  ? "yellow"
                                  : selectedSeller?.verificationStatus ===
                                    "access"
                                  ? "green"
                                  : "red"
                              }
                              variant="solid"
                            >
                              {selectedSeller?.verificationStatus === "pending"
                                ? "รอดำเนินการ"
                                : selectedSeller?.verificationStatus ===
                                  "access"
                                ? "ผ่านการยืนยัน"
                                : "ไม่ผ่านการยืนยัน"}
                            </Badge>
                          </HStack>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>

                {/* ข้อมูลบัญชีธนาคาร */}
                <GridItem>
                  <Card>
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        <Heading size="md" color="green.600">
                          ข้อมูลบัญชีธนาคาร
                        </Heading>
                        <Image
                          src={
                            selectedSeller?.bank_account_images ||
                            "https://via.placeholder.com/400x200?text=No+Bank+Image"
                          }
                          alt="สมุดบัญชี"
                          borderRadius="md"
                          h="200px"
                          w="100%"
                          objectFit="cover"
                          fallbackSrc="https://via.placeholder.com/400x200?text=No+Bank+Image"
                        />
                        <VStack align="stretch" spacing={2}>
                          <HStack>
                            <Text fontWeight="bold" minW="120px">
                              ธนาคาร:
                            </Text>
                            <Text>
                              {selectedSeller?.bank_name || "ไม่ระบุ"}
                            </Text>
                          </HStack>
                          <HStack>
                            <Text fontWeight="bold" minW="120px">
                              ชื่อบัญชี:
                            </Text>
                            <Text>
                              {selectedSeller?.bank_account_name || "ไม่ระบุ"}
                            </Text>
                          </HStack>
                          <HStack>
                            <Text fontWeight="bold" minW="120px">
                              เลขบัญชี:
                            </Text>
                            <Text>
                              {selectedSeller?.bank_account_number || "ไม่ระบุ"}
                            </Text>
                          </HStack>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>

                {/* ข้อมูลการยืนยันตัวตน */}
                <GridItem colSpan={{ base: 1, lg: 2 }}>
                  <Card>
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        <Heading size="md" color="purple.600">
                          ข้อมูลการยืนยันตัวตน
                        </Heading>

                        {/* รูปภาพเอกสาร */}
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <Box>
                            <Text fontWeight="bold" mb={2}>
                              รูปบัตรประชาชน
                            </Text>
                            <Image
                              src={
                                selectedSeller?.idCardImage ||
                                "https://via.placeholder.com/400x200?text=No+ID+Card"
                              }
                              alt="บัตรประชาชน"
                              borderRadius="md"
                              h="200px"
                              w="100%"
                              objectFit="cover"
                              fallbackSrc="https://via.placeholder.com/400x200?text=No+ID+Card"
                            />
                          </Box>
                          <Box>
                            <Text fontWeight="bold" mb={2}>
                              รูปถ่ายเซลฟี่
                            </Text>
                            <Center>
                              <Image
                                src={
                                  selectedSeller?.selfieImage ||
                                  "https://via.placeholder.com/200x200?text=No+Selfie"
                                }
                                alt="เซลฟี่"
                                borderRadius="full"
                                h="200px"
                                w="200px"
                                objectFit="cover"
                                fallbackSrc="https://via.placeholder.com/200x200?text=No+Selfie"
                              />
                            </Center>
                          </Box>
                        </SimpleGrid>

                        {/* ข้อมูลจากเอกสาร */}
                        <Grid
                          templateColumns={{
                            base: "1fr",
                            md: "repeat(2, 1fr)",
                          }}
                          gap={4}
                        >
                          <VStack align="stretch" spacing={2}>
                            <HStack>
                              <Text fontWeight="bold" minW="120px">
                                ชื่อ-นามสกุล:
                              </Text>
                              <Text>
                                {selectedSeller?.verificationData?.fullName ||
                                  "ไม่ระบุ"}
                              </Text>
                            </HStack>
                            <HStack>
                              <Text fontWeight="bold" minW="120px">
                                เลขบัตร:
                              </Text>
                              <Text>
                                {selectedSeller?.verificationData?.idNumber ||
                                  "ไม่ระบุ"}
                              </Text>
                            </HStack>
                            <HStack>
                              <Text fontWeight="bold" minW="120px">
                                ประเภทเอกสาร:
                              </Text>
                              <Text>
                                {selectedSeller?.verificationData
                                  ?.documentType === "id_card"
                                  ? "บัตรประชาชน"
                                  : selectedSeller?.verificationData
                                      ?.documentType === "passport"
                                  ? "พาสปอร์ต"
                                  : "ไม่ระบุ"}
                              </Text>
                            </HStack>
                          </VStack>
                          <VStack align="stretch" spacing={2}>
                            <HStack>
                              <CalendarIcon boxSize={4} />
                              <Text fontWeight="bold" minW="120px">
                                วันเกิด:
                              </Text>
                              <Text>
                                {selectedSeller?.verificationData?.birthDate
                                  ? new Date(
                                      selectedSeller.verificationData.birthDate
                                    ).toLocaleDateString("th-TH")
                                  : "ไม่ระบุ"}
                              </Text>
                            </HStack>
                            <HStack>
                              <CalendarIcon boxSize={4} />
                              <Text fontWeight="bold" minW="120px">
                                วันหมดอายุ:
                              </Text>
                              <Text>
                                {selectedSeller?.verificationData?.expiryDate
                                  ? new Date(
                                      selectedSeller.verificationData.expiryDate
                                    ).toLocaleDateString("th-TH")
                                  : "ไม่ระบุ"}
                              </Text>
                            </HStack>
                            <HStack>
                              <PhoneIcon boxSize={4} />
                              <Text fontWeight="bold" minW="120px">
                                เบอร์โทร:
                              </Text>
                              <Text>
                                {selectedSeller?.user_id?.phone || "ไม่ระบุ"}
                              </Text>
                            </HStack>
                          </VStack>
                        </Grid>

                        <VStack align="stretch">
                          <Text fontWeight="bold">ที่อยู่ตามเอกสาร:</Text>
                          <Text pl={4}>
                            {selectedSeller?.verificationData?.address ||
                              "ไม่ระบุ"}
                          </Text>
                        </VStack>

                        {selectedSeller?.verificationStatus === "rejected" &&
                          selectedSeller?.rejectionReason && (
                            <Alert status="error" borderRadius="md">
                              <AlertIcon />
                              <Box>
                                <AlertTitle fontSize="md">
                                  เหตุผลที่ไม่ผ่านการยืนยัน:
                                </AlertTitle>
                                <AlertDescription>
                                  {selectedSeller.rejectionReason}
                                </AlertDescription>
                              </Box>
                            </Alert>
                          )}
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            )}
          </ModalBody>

          <ModalFooter>
            <ButtonGroup spacing={3}>
              <Button variant="ghost" onClick={onClose}>
                ปิด
              </Button>
              {selectedSeller?.verificationStatus === "pending" && (
                <>
                  <Button
                    colorScheme="red"
                    onClick={() => {
                      onClose();
                      openRejectModal(selectedSeller);
                    }}
                  >
                    ปฏิเสธ
                  </Button>
                  <Button
                    colorScheme="green"
                    onClick={() => handleApprove(selectedSeller)}
                  >
                    อนุมัติ
                  </Button>
                </>
              )}
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal ปฏิเสธ */}
      <Modal isOpen={isRejectOpen} onClose={onRejectClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ปฏิเสธผู้ขาย</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle fontSize="sm">ยืนยันการปฏิเสธ</AlertTitle>
                  <AlertDescription fontSize="sm">
                    คุณกำลังจะปฏิเสธร้าน "{actionSeller?.store_name}"
                  </AlertDescription>
                </Box>
              </Alert>

              <FormControl isRequired isInvalid={!rejectionReason.trim()}>
                <FormLabel>เหตุผลในการปฏิเสธ</FormLabel>
                <Textarea
                  placeholder="กรุณาระบุเหตุผลในการปฏิเสธ เช่น เอกสารไม่ชัดเจน, ข้อมูลไม่ครบถ้วน, รูปภาพไม่ตรงกับเอกสาร เป็นต้น"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  resize="vertical"
                />
                <FormErrorMessage>กรุณาระบุเหตุผลในการปฏิเสธ</FormErrorMessage>
              </FormControl>

              <Text fontSize="sm" color="gray.500">
                เหตุผลนี้จะถูกแสดงให้ผู้ขายเห็น
                เพื่อให้สามารถแก้ไขและส่งข้อมูลใหม่ได้
              </Text>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <ButtonGroup spacing={3}>
              <Button
                variant="ghost"
                onClick={() => {
                  onRejectClose();
                  setRejectionReason("");
                  setActionSeller(null);
                }}
              >
                ยกเลิก
              </Button>
              <Button
                colorScheme="red"
                onClick={handleReject}
                isDisabled={!rejectionReason.trim()}
              >
                ยืนยันการปฏิเสธ
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SellerManagementDashboard;
