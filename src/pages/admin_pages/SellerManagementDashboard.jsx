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
  edit_update_user,
  get_sellers,
  reject_seller,
  update_seller_fee,
} from "../../hooks/reducer/admin_reducer/provider_reducer";
import {
  statusActive_seller,
  update_access_seller,
} from "../../hooks/reducer/auth_reducer";
import { MdBlock } from "react-icons/md";
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
          <Heading
            fontFamily={"Noto Sans Lao, serif"}
            size="md"
            color="gray.500"
          >
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
            ລໍຖ້າດຳເນີນການ
          </Badge>
        );
      case "access":
        return (
          <Badge colorScheme="green" variant="solid">
            ຜ່ານການຢືນຢັນ
          </Badge>
        );
      case "rejected":
        return (
          <Badge colorScheme="red" variant="solid">
            ບໍ່ຜ່ານການຢືນຢັນ
          </Badge>
        );
      default:
        return (
          <Badge colorScheme="gray" variant="solid">
            ບໍ່ຮູ້ສະຖານະ
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
            <Heading
              fontFamily={"Noto Sans Lao, serif"}
              size="sm"
              color={textColor}
              noOfLines={1}
            >
              {seller?.store_name || "ບໍ່ລະບຸชื่อร้าน"}
            </Heading>
            <Text fontSize="sm" color="gray.500">
              ລະຫັດຜູ້ຂາຍ: {seller?.store_code || "ບໍ່ລະບຸ"}
            </Text>
            <Text fontSize="sm" color={textColor} noOfLines={2}>
              {seller?.description || "ไม่มีรายละเอียด"}
            </Text>

            <HStack spacing={2}>
              <PhoneIcon boxSize={3} color="gray.400" />
              <Text fontSize="xs" color="gray.500" noOfLines={1}>
                {seller?.user_id?.phone || "ບໍ່ລະບຸ"}
              </Text>
            </HStack>

            <HStack spacing={2}>
              <EmailIcon boxSize={3} color="gray.400" />
              <Text fontSize="xs" color="gray.500" noOfLines={1}>
                {seller?.user_id?.email || "ບໍ່ລະບຸ"}
              </Text>
            </HStack>
            <HStack
              spacing={2}
              px={3}
              py={1}
              borderRadius="full"
              bg={seller?.user_id?.active === false ? "green.50" : "red.50"}
              border="1px"
              borderColor={
                seller?.user_id?.active === false ? "green.200" : "red.200"
              }
              alignItems="center"
            >
              {seller?.user_id?.active === false ? (
                <MdBlock size={14} color="green" />
              ) : (
                <MdBlock size={14} color="red" />
              )}

              <Text
                fontSize="sm"
                fontWeight="bold"
                color={
                  seller?.user_id?.active === false ? "green.600" : "red.600"
                }
                noOfLines={1}
              >
                {seller?.user_id?.active === false
                  ? "ຍັງບໍ່ຖືກປິດກັ້ນ"
                  : "ຖືກປິດກັ້ນຊົ່ວຄາວ"}
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
              ເບີ່ງຂໍ້ມູນ
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
  const { loader, all_sellers } = useSelector(
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
  const [fee_system, setFee_system] = useState(0);
  const [vat, setVat] = useState(0);
  const {
    isOpen: editOpen,
    onOpen: editOnOpen,
    onClose: editOnClose,
  } = useDisclosure();
  const [formData, setFormData] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleEdit = (user) => {
    editOnOpen();
    setFormData({
      id: user?.user_id?._id,
      username: user?.user_id?.username || "",
      phone: user?.user_id?.phone || "",
      email: user?.user_id?.email || "",
      role: user?.user_id?.role || "active",
    });
  };
  const handleSave = async () => {
    // คุณสามารถเชื่อม API ตรงนี้ได้
    try {
      await dispatch(edit_update_user(formData))
        .unwrap()
        .then((res) => {
          toast({
            title: "ສຳເລັດ",
            description: res.message || `ສຳເລັດ`,
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
          dispatch(get_sellers());
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
      editOnClose();
    } catch (error) {
      toast({
        title: error.message || "ເກີດຂໍ້ຜິດພາດ ກະລຸນາລອງໃໝ່",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  const hanleFee = () => {
    try {
      const data = {
        id: selectedSeller._id,
        fee_system: fee_system,
        vat: vat,
      };
      dispatch(update_seller_fee(data)).then(() => dispatch(get_sellers()));
      toast({
        title: "ອັບເດດສໍາເລັດ",
        description: `ອັບເດດ ${
          selectedSeller?.store_name || "Not have store Name"
        } ແລ້ວ`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "ເກິດຂໍ້ຜິດພາດ",
        description: error.message || "ກະລຸນາລອງໃໝ່",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };
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
      title: "ອະນຸມັດສຳເລັດ",
      description: `ອະນຸມັດສຳເລັດແລ້ວ`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "ກະລຸນາລະບຸເຫດຜົນ",
        description: "ກະລຸນາລະບຸເຫດຜົນໃນການປະຕິເສດ",
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
      title: "ປະຕິເສດສຳເລັດ",
      description: `ປະຕິເສດຮ້ານ ${
        actionSeller?.store_name || "Not have store Name"
      } ແລ້ວ`,
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
  const handleToggleStatus = async (data) => {
    try {
      await dispatch(statusActive_seller(data?.user_id?._id)).then(() =>
        dispatch(get_sellers())
      );
      toast({
        title: "ສຳເລັດ",
        description: `ບ໋ອກຊົ່ວຄາວສຳເລັດ`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: error.message || `ເກີດຂໍ້ຜິດພາດ ລອງໃໝ່ອີກຄັ້ງ`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
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
          <Heading
            fontFamily={"Noto Sans Lao, serif"}
            size="lg"
            mb={6}
            color={textColor}
          >
            ຈັດການຜູ້ຂາຍ
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
              <Text>ຜູ້ຂາຍທັງໝົດ</Text>
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
              <Text>ລໍຖ້າອະນຸມັດ</Text>
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
              <Text>ຜ່ານແລ້ວ</Text>
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
              <Text>ບໍ່ຜ່ານ</Text>
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
            <Heading
              fontFamily={"Noto Sans Lao, serif"}
              size="md"
              color={textColor}
            >
              {activeTab === "all" && "ຜູ້ຂາຍທັງໝົດ"}
              {activeTab === "pending" && "ຜູ້ຂາຍລໍຖ້າອະນຸມັດ"}
              {activeTab === "access" && "ຜູ້ຂາຍທີ່ຜ່ານການຢືນຢັນ"}
              {activeTab === "rejected" && "ຜູ້ຂາຍທີ່ບໍ່ຜ່ານການຢືນຢັນ"}
            </Heading>
            <Spacer />
            <HStack spacing={4}>
              <Select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                w="auto"
                size="sm"
              >
                <option value={6}>6 ລາຍການ/ໜ້າ</option>
                <option value={9}>9 ລາຍການ/ໜ້າ</option>
                <option value={12}>12 ລາຍການ/ໜ້າ</option>
                <option value={18}>18 ລາຍການ/ໜ້າ</option>
              </Select>
              <InputGroup maxW="320px">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="ຄົ້ນຫາຊື່ຮ້ານ,ລະຫັດຮ້ານ..."
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
          <ModalHeader>ລາຍລະອຽດຜູ້ຂາຍ</ModalHeader>
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
                        <Heading
                          fontFamily={"Noto Sans Lao, serif"}
                          size="md"
                          color="blue.600"
                        >
                          ຂໍ້ມູນຮ້ານຄ້າ
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
                              ຊື່ຮ້ານຄ້າ:
                            </Text>
                            <Text>
                              {selectedSeller?.store_name || "ບໍ່ລະບຸ"}
                            </Text>
                          </HStack>
                          <HStack>
                            <Text fontWeight="bold" minW="100px">
                              ລະຫັດຮ້ານຄ້າ:
                            </Text>
                            <Text>
                              {selectedSeller?.store_code || "ບໍ່ລະບຸ"}
                            </Text>
                          </HStack>
                          <VStack align="stretch">
                            <Text fontWeight="bold">ທີ່ຢູ່:</Text>
                            <Text pl={4}>
                              {selectedSeller?.address || "ບໍ່ລະບຸ"}
                            </Text>
                          </VStack>
                          <VStack align="stretch">
                            <Text fontWeight="bold">ລາຍລະອຽດ:</Text>
                            <Text pl={4}>
                              {selectedSeller?.description || "ບໍ່ມີລາຍລະອຽດ"}
                            </Text>
                          </VStack>
                          <HStack>
                            <Text fontWeight="bold" minW="100px">
                              ສະຖານະ:
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
                                ? "ລໍຖ້າດຳເນີນການ"
                                : selectedSeller?.verificationStatus ===
                                  "access"
                                ? "ຜ່ານການຢືນຢັນ"
                                : "ບໍ່ຜ່ານການຢືນຢັນ"}
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
                        <Heading
                          fontFamily={"Noto Sans Lao, serif"}
                          size="md"
                          color="green.600"
                        >
                          ຂໍ້ມູນບັນຊີທະນາຄານ
                        </Heading>
                        <Image
                          src={
                            selectedSeller?.bank_account_images ||
                            "https://via.placeholder.com/400x200?text=No+Bank+Image"
                          }
                          alt="ສະມຸດບັນຊີ"
                          borderRadius="md"
                          h="200px"
                          w="100%"
                          objectFit="cover"
                          fallbackSrc="https://via.placeholder.com/400x200?text=No+Bank+Image"
                        />
                        <VStack align="stretch" spacing={2}>
                          <HStack>
                            <Text fontWeight="bold" minW="120px">
                              ທະນາຄານ:
                            </Text>
                            <Text>
                              {selectedSeller?.bank_name || "ບໍ່ລະບຸ"}
                            </Text>
                          </HStack>
                          <HStack>
                            <Text fontWeight="bold" minW="120px">
                              ຊື່ບັນຊີທະນາຄານ:
                            </Text>
                            <Text>
                              {selectedSeller?.bank_account_name || "ບໍ່ລະບຸ"}
                            </Text>
                          </HStack>
                          <HStack>
                            <Text fontWeight="bold" minW="120px">
                              ເລກບັນຊີທະນາຄານ:
                            </Text>
                            <Text>
                              {selectedSeller?.bank_account_number || "ບໍ່ລະບຸ"}
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
                        <Heading
                          fontFamily={"Noto Sans Lao, serif"}
                          size="md"
                          color="purple.600"
                        >
                          ຂໍ້ມູນການຢືນຢັນຕົວຕົນ
                        </Heading>

                        {/* รูปภาพเอกสาร */}
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <Box>
                            <Text fontWeight="bold" mb={2}>
                              ຮູບບັດເອກະສານ
                            </Text>
                            <Image
                              src={
                                selectedSeller?.idCardImage ||
                                "https://via.placeholder.com/400x200?text=No+ID+Card"
                              }
                              alt="ເອກະສານ"
                              borderRadius="md"
                              h="600px"
                              w="100%"
                              objectFit="cover"
                              fallbackSrc="https://via.placeholder.com/400x200?text=No+ID+Card"
                            />
                          </Box>
                          <Box>
                            <Text fontWeight="bold" mb={2}>
                              ຮູບຖ່າຍເຊວຟີ່
                            </Text>
                            <Center>
                              <Image
                                src={
                                  selectedSeller?.selfieImage ||
                                  "https://via.placeholder.com/200x200?text=No+Selfie"
                                }
                                alt="ເຊວຟີ່"
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
                                ຊື່ ແລະ ນາມສະກຸນ:
                              </Text>
                              <Text>
                                {selectedSeller?.verificationData?.fullName ||
                                  "ບໍ່ລະບຸ"}
                              </Text>
                            </HStack>
                            <HStack>
                              <Text fontWeight="bold" minW="120px">
                                ເລກບັດ:
                              </Text>
                              <Text>
                                {selectedSeller?.verificationData?.idNumber ||
                                  "ບໍ່ລະບຸ"}
                              </Text>
                            </HStack>
                            <HStack>
                              <Text fontWeight="bold" minW="120px">
                                ປະເພດບັດ:
                              </Text>
                              <Text>
                                {selectedSeller?.verificationData
                                  ?.documentType === "id_card"
                                  ? "ບັດປະຈຳຕົວ"
                                  : selectedSeller?.verificationData
                                      ?.documentType === "passport"
                                  ? "ພາສປອດ"
                                  : "ບໍ່ລະບຸ"}
                              </Text>
                            </HStack>
                          </VStack>
                          <VStack align="stretch" spacing={2}>
                            <HStack>
                              <CalendarIcon boxSize={4} />
                              <Text fontWeight="bold" minW="120px">
                                ວັນເກີດ:
                              </Text>
                              <Text>
                                {selectedSeller?.verificationData?.birthDate
                                  ? new Date(
                                      selectedSeller.verificationData.birthDate
                                    ).toLocaleDateString("th-TH")
                                  : "ບໍ່ລະບຸ"}
                              </Text>
                            </HStack>
                            <HStack>
                              <CalendarIcon boxSize={4} />
                              <Text fontWeight="bold" minW="120px">
                                ວັນໝົດອາຍຸຂອງບັດ:
                              </Text>
                              <Text>
                                {selectedSeller?.verificationData?.expiryDate
                                  ? new Date(
                                      selectedSeller.verificationData.expiryDate
                                    ).toLocaleDateString("th-TH")
                                  : "ບໍ່ລະບຸ "}
                              </Text>
                            </HStack>
                            <HStack>
                              <PhoneIcon boxSize={4} />
                              <Text fontWeight="bold" minW="120px">
                                ເບີໂທລະສັບ:
                              </Text>
                              <Text>
                                {selectedSeller?.user_id?.phone || "ບໍ່ລະບຸ"}
                              </Text>
                            </HStack>
                          </VStack>
                        </Grid>

                        <VStack align="stretch">
                          <Text fontWeight="bold">ທີ່ຢູ່ຕາມເອກະສານ:</Text>
                          <Text pl={4}>
                            {selectedSeller?.verificationData?.address ||
                              "ບໍ່ລະບຸ"}
                          </Text>
                        </VStack>
                        <VStack
                          align="stretch"
                          spacing={4}
                          p={5}
                          borderWidth="1px"
                          borderRadius="lg"
                          shadow="sm"
                          bg="white"
                        >
                          {/* หัวข้อ */}
                          <Text
                            fontWeight="bold"
                            fontSize="lg"
                            color="blue.600"
                          >
                            ຄ່າທຳນຽມລະບົບ
                          </Text>

                          {/* ฟอร์มค่าธรรมเนียม */}
                          <HStack spacing={3} align="center">
                            <Box flex="1">
                              <Text fontSize="sm" mb={1} color="gray.600">
                                ຄ່າທຳນຽມ (%)
                              </Text>
                              <Input
                                value={selectedSeller?.fee_system}
                                onChange={(e) => setFee_system(e.target.value)}
                                placeholder="ຄ່າທຳນຽມລະບົບ"
                                type="number"
                              />
                            </Box>

                            <Box flex="1">
                              <Text fontSize="sm" mb={1} color="gray.600">
                                ອາກອນມູນຄ່າເພີ່ມ
                                <Text
                                  as="span"
                                  color="red.400"
                                  fontWeight="medium"
                                  ml={1}
                                >
                                  (ຍັງບໍ່ເປີດນຳໃຊ້)
                                </Text>
                              </Text>
                              <Input
                                disabled
                                value={vat}
                                onChange={(e) => setVat(e.target.value)}
                                placeholder="ຄ່າອາກອນມູນຄ່າເພີ່ມ"
                                type="number"
                              />
                            </Box>
                          </HStack>

                          {/* Action buttons */}
                          <HStack spacing={3} pt={2}>
                            <Button onClick={hanleFee} colorScheme="blue">
                              ບັນທຶກ
                            </Button>

                            <Button
                              colorScheme="blue"
                              variant="outline"
                              onClick={() => handleEdit(selectedSeller)}
                            >
                              ແກ້ໄຂຂໍ້ມູນສ່ວນບຸກຄົນຜູ້ຂາຍ
                            </Button>

                            <Button
                              colorScheme={
                                selectedSeller?.user_id?.active === true
                                  ? "red"
                                  : "green"
                              }
                              onClick={() => handleToggleStatus(selectedSeller)}
                            >
                              {selectedSeller?.user_id?.active === true
                                ? "ຜູ້ຂາຍຖືກບ໋ອກ"
                                : "ບ໋ອກຜູ້ຂາຍຊົ່ວຄາວ"}
                            </Button>
                          </HStack>
                        </VStack>

                        {selectedSeller?.verificationStatus === "rejected" &&
                          selectedSeller?.rejectionReason && (
                            <Alert status="error" borderRadius="md">
                              <AlertIcon />
                              <Box>
                                <AlertTitle fontSize="md">
                                  ເຫດຜົນທີ່ປະຕິເສດ:
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
                ປິດ
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
                    ປະຕິເສດ
                  </Button>
                  <Button
                    colorScheme="green"
                    onClick={() => handleApprove(selectedSeller)}
                  >
                    ອະນຸມັດ
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
          <ModalHeader>ປະຕິເສດຜູ້ຂາຍ</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle fontSize="sm">ยืนยันการปฏิเสธ</AlertTitle>
                  <AlertDescription fontSize="sm">
                    ເຈົ້າກຳລັງປະຕິເສດຮ້ານ "{actionSeller?.store_name}"
                  </AlertDescription>
                </Box>
              </Alert>

              <FormControl isRequired isInvalid={!rejectionReason.trim()}>
                <FormLabel> ເຫດຜົນທີ່ປະຕິເສດ</FormLabel>
                <Textarea
                  placeholder=" ກະລຸນາລະບຸເຫດຜົນທີ່ປະຕິເສດ ເຊັ່ນ ເອກະສານບໍ່ຄົບ ບໍ່ແຈ້ງ ເປັນຕົ້ນ"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  resize="vertical"
                />
                <FormErrorMessage>ກະລຸນາລະບຸເຫດຜົນທີ່ປະຕິເສດ</FormErrorMessage>
              </FormControl>

              <Text fontSize="sm" color="gray.500">
                ເຫດຜົນນີ້ຈະຖືກສະແດງໃຫ້ຜູ້ຂາຍເຫັນ
                ເພື່ອໃຫ້ສາມາດແກ້ໄຂແລະສົ່ງຂໍ້ມູນມາໃຫມ່ໄດ້
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
                ຍົກເລີກ
              </Button>
              <Button
                colorScheme="red"
                onClick={handleReject}
                isDisabled={!rejectionReason.trim()}
              >
                ຢືນຢັນການປະຕິເສດ
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ///////////edit  isOpen: editOpen,
    onOpen: editOnOpen,
    onClose: editOnClose, */}
      <Modal isOpen={editOpen} onClose={editOnClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit User</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={3}>
              <FormLabel>Username</FormLabel>
              <Input
                name="username"
                value={formData?.username}
                onChange={handleChange}
                placeholder="Enter username"
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Phone</FormLabel>
              <Input
                name="phone"
                value={formData?.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData?.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Status</FormLabel>
              <Input value={formData?.role} disabled />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SellerManagementDashboard;
