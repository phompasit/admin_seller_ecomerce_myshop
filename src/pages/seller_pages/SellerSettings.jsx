import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Switch,
  Button,
  Avatar,
  useToast,
  useColorModeValue,
  Text,
  Divider,
  InputGroup,
  InputRightElement,
  Select,
  Image,
  SimpleGrid,
  Card,
  CardBody,
  useBreakpointValue,
  Alert,
  AlertIcon,
  Spinner,
  Center,
  Badge,
} from "@chakra-ui/react";
import {
  FaUser,
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash,
  FaUpload,
  FaCheck,
  FaBell,
  FaCreditCard,
  FaCamera,
  FaUserCircle,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import DocumentVerificationStatus from "../../components/DocumentVerificationStatus";
import {
  get_user,
  getVerifyUser,
  unsubscribeNotification,
  updateSeller,
} from "../../hooks/reducer/auth_reducer";
import { registerPush } from "../notification/registerPush";
import { notication } from "../../hooks/reducer/sellers_reducer/provider_sellers";

// ============================================================================
// CONSTANTS & HELPERS
// ============================================================================

const BANKS = [
  { value: "ທະນາຄານການຄ້າຕ່າງປະເທດ", label: "ທະນາຄານການຄ້າຕ່າງປະເທດ" },
  { value: "ທະນາການສົ່ງເສີມກະສິກຳ", label: "ທະນາການສົ່ງເສີມກະສິກຳ" },
  { value: "ທະນາຄານພັດທະນາລາວ", label: "ທະນາຄານພັດທະນາລາວ" },
  { value: "ທະນາຄານອິນໂດຈີນ", label: "ທະນາຄານອິນໂດຈີນ" },
];

const VERIFICATION_STATUS = {
  PENDING: "pending",
  REJECTED: "reject",
  APPROVED: "access",
  NONE: null,
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

// Error Messages
const ERROR_MESSAGES = {
  FILE_TOO_LARGE: "file ບໍເກີນ (ສູງສຸດ 2MB)",
  INVALID_FILE_TYPE: "ປະເພດໄຟລບໍ່ຖືກຕ້ອງ (ຮອງຮັບສະເພາະ JPG, PNG)",
  NOTIFICATION_DENIED: "ທ່ານເຄີຍປະຕິເສດການແຈ້ງເຕືອນ",
  SAVE_ERROR: "ເກີດຂໍ້ຜຶດພາດໃນການບັນທຶກ",
  LOAD_ERROR: "ເກີດຂໍ້ຜິດພາດໃນການໂຫລດຂໍ້ມູນ",
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validate image file before upload
 * @param {File} file - File to validate
 * @returns {Object} - Validation result with isValid and error
 */
const validateImageFile = (file) => {
  if (!file) return { isValid: false, error: "ไม่พบไฟล์" };

  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: ERROR_MESSAGES.FILE_TOO_LARGE };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_FILE_TYPE };
  }

  return { isValid: true, error: null };
};

/**
 * Convert file to base64 for preview
 * @param {File} file - File to convert
 * @returns {Promise<string>} - Base64 string
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const SellerSettings = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [preview, setPreview] = useState({
    bank_account_images: "",
    store_images: "",
  });
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Form States
  const [sellerInfo, setSellerInfo] = useState({
    username: "",
    phone: "",
    email: "",
    role: "",
  });

  const [accountInfo, setAccountInfo] = useState({
    store_name: "",
    store_code: "",
    store_images: "",
  });

  const [storeAddress, setStoreAddress] = useState({
    address: "",
    description: "",
    status: "verified",
  });

  const [notifications, setNotifications] = useState({
    newOrders: true,
    paymentAlerts: false,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    bank_account_number: "",
    bank_account_name: "",
    bank_name: "ທະນາຄານການຄ້າຕ່າງປະເທດ",
    bank_account_images: "",
  });

  // Redux State
  const { userInfo, sellerInfo_data } = useSelector((state) => state.auth);

  // ============================================================================
  // RESPONSIVE VALUES
  // ============================================================================

  const tabOrientation = useBreakpointValue({
    base: "horizontal",
    lg: "vertical",
  });

  const containerPadding = useBreakpointValue({
    base: 2,
    sm: 4,
    md: 6,
    lg: 8,
  });

  const tabSize = useBreakpointValue({
    base: "sm",
    md: "md",
    lg: "lg",
  });

  const gridColumns = useBreakpointValue({
    base: 1,
    md: 2,
  });

  const buttonSize = useBreakpointValue({
    base: "md",
    md: "lg",
  });

  // Color Mode Values
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const cardBg = useColorModeValue("white", "gray.800");
  const alertBg = useColorModeValue("blue.50", "blue.900");

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const verificationStatus = useMemo(() => {
    return sellerInfo_data?.verificationStatus || VERIFICATION_STATUS.NONE;
  }, [sellerInfo_data?.verificationStatus]);

  const isVerified = useMemo(() => {
    return verificationStatus === VERIFICATION_STATUS.APPROVED;
  }, [verificationStatus]);

  const canEditProfile = useMemo(() => {
    return isVerified || verificationStatus === VERIFICATION_STATUS.NONE;
  }, [verificationStatus, isVerified]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsInitialLoading(true);
        await Promise.all([dispatch(get_user()), dispatch(getVerifyUser())]);
      } catch (error) {
        toast({
          title: "ເກີດຂໍ້ຜິດພາດ",
          description: error.message || ERROR_MESSAGES.LOAD_ERROR,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchInitialData();
  }, [dispatch, toast]);

  // Update form data when Redux state changes
  useEffect(() => {
    if (userInfo) {
      setSellerInfo({
        username: userInfo.username || "",
        phone: userInfo.phone || "",
        email: userInfo.email || "",
        role: userInfo.role || "",
      });
    }

    if (sellerInfo_data) {
      setAccountInfo({
        store_name: sellerInfo_data.store_name || "",
        store_code: sellerInfo_data.store_code || "",
        store_images: sellerInfo_data.store_images || "",
      });

      setStoreAddress({
        address: sellerInfo_data.address || "",
        description: sellerInfo_data.description || "",
        status: sellerInfo_data.status || "verified",
      });

      setPaymentSettings({
        bank_account_number: sellerInfo_data.bank_account_number || "",
        bank_account_name: sellerInfo_data.bank_account_name || "",
        bank_name: sellerInfo_data.bank_name || "ທະນາຄານການຄ້າຕ່າງປະເທດ",
        bank_account_images: sellerInfo_data.bank_account_images || "",
      });

      setPreview({
        bank_account_images: sellerInfo_data.bank_account_images || "",
        store_images: sellerInfo_data.store_images || "",
      });
    }
  }, [userInfo, sellerInfo_data]);

  // Initialize notification state
  useEffect(() => {
    const storedToggle = localStorage.getItem("toggle");
    setIsNotificationEnabled(storedToggle === "true");
  }, []);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  /**
   * Handle form save with error handling
   */
  const handleSave = useCallback(async () => {
    if (!isVerified && verificationStatus !== VERIFICATION_STATUS.NONE) {
      toast({
        title: "ບໍ່ສາມາດບັນທຶກຂໍ້ມູນໄດ້",
        description: "ກະລຸນາລໍຖ້າການຍືນຍັນຕົວຕົນໃຫ້ສຳເລັດກ່ອນ",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const updateData = {
        ...accountInfo,
        ...storeAddress,
        ...paymentSettings,
      };

      const res = await dispatch(updateSeller(updateData));
      console.log(res)
      if (res.error.message === "Rejected") {
        toast({
          title: "ເກີດຂໍ້ຜິດພາດ",
          description: res.payload?.message || ERROR_MESSAGES.SAVE_ERROR,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "ສຳເລັດ",
          description: res.payload?.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: error?.message || ERROR_MESSAGES.SAVE_ERROR,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    accountInfo,
    storeAddress,
    paymentSettings,
    dispatch,
    toast,
    isVerified,
    verificationStatus,
  ]);

  /**
   * Handle image upload with validation
   */
  const handleImageUpload = useCallback(
    async (file, type) => {
      if (!file) return;

      const validation = validateImageFile(file);
      if (!validation.isValid) {
        toast({
          title: "file ບໍ່ຖືກຕ້ອງ",
          description: validation.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      try {
        const base64 = await fileToBase64(file);

        setPreview((prev) => ({
          ...prev,
          [type]: base64,
        }));

        if (type === "bank_account_images") {
          setPaymentSettings((prev) => ({
            ...prev,
            bank_account_images: file,
          }));
        } else if (type === "store_images") {
          setAccountInfo((prev) => ({
            ...prev,
            store_images: file,
          }));
        }

        toast({
          title: "ອັບໂຫລດສຳເລັດ",
          description: "ຮູບພາບໄດ້ຖືກເລືອກແລ້ວ",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "ເກີດຂໍ້ຜິດພາດ",
          description: error.message || "ບໍ່ສາມາດອັບໂຫລດຮູບພາບໄດ້",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [toast]
  );

  /**
   * Handle notification toggle with permission check
   */
  const handleToggleNotification = useCallback(async () => {
    const permission = Notification.permission;

    try {
      if (permission === "default") {
        const result = await Notification.requestPermission();
        if (result === "granted") {
          const subscription = await registerPush(userInfo?._id);
          if (subscription) {
            dispatch(notication({ subscription }));
            localStorage.setItem("toggle", "true");
            setIsNotificationEnabled(true);
          }
        }
      } else if (permission === "granted") {
        if (isNotificationEnabled) {
          // Turn off notifications
          await dispatch(unsubscribeNotification(userInfo._id));
          localStorage.setItem("toggle", "false");
          setIsNotificationEnabled(false);
        } else {
          // Turn on notifications
          const subscription = await registerPush(userInfo._id);
          if (subscription) {
            localStorage.setItem("toggle", "true");
            dispatch(notication({ subscription }));
            setIsNotificationEnabled(true);
          }
        }
      } else if (permission === "denied") {
        setIsNotificationEnabled(false);
        toast({
          title: "ບໍ່ສາມາດແຈ້ງເຕືອນໄດ້",
          description: ERROR_MESSAGES.NOTIFICATION_DENIED,
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: error.message || "ບໍ່ສາມາດປ່ຽນການຕັ້ງຄ່າແຈ້ງເຕືອນໄດ້",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [isNotificationEnabled, userInfo?._id, dispatch, toast]);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  /**
   * Render verification alert based on status
   */
  const renderVerificationAlert = useCallback(() => {
    switch (verificationStatus) {
      case VERIFICATION_STATUS.PENDING:
        return (
          <Alert status="warning" mb={4}>
            <AlertIcon />
            ຢູ່ໃນຂັ້ນຕອນກວດສອບເອກະສານ
          </Alert>
        );
      case VERIFICATION_STATUS.REJECTED:
        return (
          <Alert status="error" mb={4}>
            <AlertIcon />
            ອະໄພ: ກະລຸນາກວດສອບເອກະສານໃໝ່
          </Alert>
        );
      case VERIFICATION_STATUS.NONE:
        return (
          <Alert status="warning" mb={4}>
            <AlertIcon />
            ກະລຸນາອັບໂຫລດເອກະສານເພື່ອຍືນຢັນຕົວຕົນ
          </Alert>
        );
      default:
        return null;
    }
  }, [verificationStatus]);

  /**
   * Render loading state
   */
  if (isInitialLoading) {
    return (
      <Center h="50vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text fontSize="lg" color="blue.500">
            ກຳລັງໂຫຼດຂໍ້ມູນ...
          </Text>
        </VStack>
      </Center>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <Container maxW="7xl" p={containerPadding}>
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        {/* Header Section */}
        <Box textAlign="center" py={{ base: 2, md: 4 }}>
          <Heading
            fontFamily="Noto Sans Lao, serif"
            size={{ base: "lg", md: "xl" }}
            mb={2}
            color="blue.600"
          >
            ການຕັ້ງຄ່າບັນຊີຜູ້ຂາຍ
          </Heading>
          <Text color={textColor} fontSize={{ base: "sm", md: "md" }}>
            ຈັດການຂໍ້ມູນຮ້ານຄ້າ ແລະ ການຕັ້ງຄ່າຕ່າງໆ
          </Text>

          {/* Verification Status Badge */}
          {isVerified && (
            <Badge
              colorScheme="green"
              mt={2}
              px={3}
              py={1}
              borderRadius="full"
              display="inline-flex"
              alignItems="center"
              fontSize={{ base: "sm", md: "md" }} // responsive font
            >
              <HStack spacing={2}>
                <FaCheckCircle />
                <Text fontWeight="medium">ຢືນຢັນແລ້ວ</Text>
              </HStack>
            </Badge>
          )}
        </Box>

        {/* Main Tabs */}
        <Tabs
          orientation={tabOrientation}
          variant="enclosed"
          colorScheme="blue"
          size={tabSize}
          index={activeTab}
          onChange={setActiveTab}
          isLazy
        >
          <TabList
            minW={{ base: "full", lg: "250px" }}
            flexDirection={{ base: "row", lg: "column" }}
            overflowX={{ base: "auto", lg: "visible" }}
            overflowY={{ base: "visible", lg: "auto" }}
          >
            <Tab fontSize={{ base: "xs", md: "sm" }} px={{ base: 2, md: 4 }}>
              <FaUserCircle style={{ marginRight: "8px" }} />
              <Box display={{ base: "none", sm: "block" }}>ບັນຊີຜູ້ຂາຍ</Box>
            </Tab>

            <Tab fontSize={{ base: "xs", md: "sm" }} px={{ base: 2, md: 4 }}>
              <FaUser style={{ marginRight: "8px" }} />
              <Box display={{ base: "none", sm: "block" }}>ບັນຊີຮ້ານ</Box>
            </Tab>

            <Tab fontSize={{ base: "xs", md: "sm" }} px={{ base: 2, md: 4 }}>
              <FaMapMarkerAlt style={{ marginRight: "8px" }} />
              <Box display={{ base: "none", sm: "block" }}>ທີ່ຢູ່</Box>
            </Tab>

            <Tab fontSize={{ base: "xs", md: "sm" }} px={{ base: 2, md: 4 }}>
              <FaBell style={{ marginRight: "8px" }} />
              <Box display={{ base: "none", sm: "block" }}>ແຈ້ງເຕືອນ</Box>
            </Tab>

            <Tab fontSize={{ base: "xs", md: "sm" }} px={{ base: 2, md: 4 }}>
              <FaCreditCard style={{ marginRight: "8px" }} />
              <Box display={{ base: "none", sm: "block" }}>ທະນາຄານ</Box>
            </Tab>

            <Tab fontSize={{ base: "xs", md: "sm" }} px={{ base: 2, md: 4 }}>
              <FaCheck style={{ marginRight: "8px" }} />
              <Box display={{ base: "none", sm: "block" }}>ຢືນຢັນ</Box>
            </Tab>

            {/* Save Button - Only show on larger screens in sidebar */}
            <Box
              textAlign="center"
              pt={4}
              display={{ base: "none", lg: "block" }}
            >
              {isVerified && (
                <Button
                  colorScheme="blue"
                  size={buttonSize}
                  onClick={handleSave}
                  isLoading={isLoading}
                  loadingText="ກຳລັງບັນທຶກ..."
                  leftIcon={<FaCheck />}
                  width="full"
                  isDisabled={!canEditProfile}
                >
                  ບັນທຶກໂປຣໄຟລ
                </Button>
              )}
            </Box>
          </TabList>

          <TabPanels flex="1">
            {/* Tab 1: Seller Account Info */}
            <TabPanel p={{ base: 2, md: 6 }}>
              {renderVerificationAlert()}

              {isVerified && (
                <Card bg={cardBg} shadow="md">
                  <CardBody>
                    <VStack spacing={6} align="stretch">
                      <Heading
                        fontFamily="Noto Sans Lao, serif"
                        size="md"
                        color="blue.500"
                      >
                        <FaUser
                          style={{ display: "inline", marginRight: "8px" }}
                        />
                        ຂໍ້ມູນບັນຊີຜູ້ຂາຍ
                      </Heading>

                      <SimpleGrid columns={gridColumns} spacing={4}>
                        <FormControl>
                          <FormLabel fontSize={{ base: "sm", md: "md" }}>
                            ຊື່ຜູ້ໃຊ້
                          </FormLabel>
                          <Input
                            value={sellerInfo.username}
                            isReadOnly
                            bg="gray.100"
                            size={{ base: "md", md: "lg" }}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize={{ base: "sm", md: "md" }}>
                            ເບີໂທລະສັບ
                          </FormLabel>
                          <Input
                            value={sellerInfo.phone}
                            isReadOnly
                            bg="gray.100"
                            size={{ base: "md", md: "lg" }}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize={{ base: "sm", md: "md" }}>
                            ອີເມວ
                          </FormLabel>
                          <Input
                            value={sellerInfo.email}
                            isReadOnly
                            bg="gray.100"
                            size={{ base: "md", md: "lg" }}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize={{ base: "sm", md: "md" }}>
                            ສະຖານະ
                          </FormLabel>
                          <Input
                            value={sellerInfo.role}
                            isReadOnly
                            bg="gray.100"
                            size={{ base: "md", md: "lg" }}
                          />
                        </FormControl>
                      </SimpleGrid>

                      <Box p={4} bg={alertBg} borderRadius="md">
                        <HStack>
                          <FaUser color="blue" />
                          <Text fontSize="sm">
                            ຂໍ້ມູນບັນຊີຜູ້ໃຊ້ບໍ່ສາມາດແກ້ໄຂໄດ້ ຖ້າຕ້ອງການປ່ຽນແປງ
                            ກະລຸນາຕິດຕໍ່ admin
                          </Text>
                        </HStack>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              )}
            </TabPanel>

            {/* Tab 2: Store Account Info */}
            <TabPanel p={{ base: 2, md: 6 }}>
              {renderVerificationAlert()}

              {isVerified && (
                <Card bg={cardBg} shadow="md">
                  <CardBody>
                    <VStack spacing={6} align="stretch">
                      <Heading
                        fontFamily="Noto Sans Lao, serif"
                        size="md"
                        color="blue.500"
                      >
                        <FaUser
                          style={{ display: "inline", marginRight: "8px" }}
                        />
                        ຂໍ້ມູນບັນຊີຮ້ານ
                      </Heading>

                      {/* Store Image Upload */}
                      <FormControl>
                        <FormLabel fontSize={{ base: "sm", md: "md" }}>
                          ຮູບໂປຣໄຟລຮ້ານ
                        </FormLabel>
                        <VStack
                          spacing={4}
                          align={{ base: "center", md: "start" }}
                        >
                          <HStack
                            spacing={4}
                            flexDirection={{ base: "column", md: "row" }}
                            align="center"
                          >
                            <Avatar
                              size={{ base: "lg", md: "xl" }}
                              src={preview?.store_images}
                              name={accountInfo?.store_name || "ຮ້ານຂາຍ"}
                              bg="blue.500"
                            />
                            <VStack align="start" spacing={2}>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleImageUpload(
                                    e.target.files[0],
                                    "store_images"
                                  )
                                }
                                id="store-upload"
                                display="none"
                              />
                              <Button
                                as="label"
                                htmlFor="store-upload"
                                leftIcon={<FaCamera />}
                                size={buttonSize}
                                variant="outline"
                                cursor="pointer"
                              >
                                ປ່ຽນຮູບ
                              </Button>
                              <Text
                                fontSize="xs"
                                color={textColor}
                                textAlign="center"
                              >
                                ຮອງຮັບໄຟລ JPG, PNG ຂະໜາດບໍ່ເກີນ 2MB
                              </Text>
                            </VStack>
                          </HStack>
                        </VStack>
                      </FormControl>

                      <SimpleGrid columns={gridColumns} spacing={4}>
                        <FormControl isRequired>
                          <FormLabel fontSize={{ base: "sm", md: "md" }}>
                            ຊື່ຮ້ານຄ້າ
                          </FormLabel>
                          <Input
                            value={accountInfo.store_name}
                            onChange={(e) =>
                              setAccountInfo({
                                ...accountInfo,
                                store_name: e.target.value,
                              })
                            }
                            placeholder="ລະບຸຊື່ຮ້ານຄ້າ"
                            size={{ base: "md", md: "lg" }}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize={{ base: "sm", md: "md" }}>
                            ລະຫັດຮ້ານຄ້າ
                          </FormLabel>
                          <Input
                            value={accountInfo.store_code}
                            isReadOnly
                            bg="gray.100"
                            size={{ base: "md", md: "lg" }}
                          />
                        </FormControl>
                      </SimpleGrid>

                      <Divider />
                    </VStack>
                  </CardBody>
                </Card>
              )}
            </TabPanel>

            {/* Tab 3: Store Address */}
            <TabPanel p={{ base: 2, md: 6 }}>
              {renderVerificationAlert()}

              {isVerified && (
                <Card bg={cardBg} shadow="md">
                  <CardBody>
                    <VStack spacing={6} align="stretch">
                      <Heading
                        fontFamily="Noto Sans Lao, serif"
                        size="md"
                        color="blue.500"
                      >
                        <FaMapMarkerAlt
                          style={{ display: "inline", marginRight: "8px" }}
                        />
                        ທີ່ຢູ່ຮ້ານຄ້າ
                      </Heading>

                      <FormControl isRequired>
                        <FormLabel fontSize={{ base: "sm", md: "md" }}>
                          ທີ່ຢູ່ຮ້ານຄ້າ
                        </FormLabel>
                        <Textarea
                          value={storeAddress.address}
                          onChange={(e) =>
                            setStoreAddress({
                              ...storeAddress,
                              address: e.target.value,
                            })
                          }
                          placeholder="ລະບຸທີ່ຢູ່ຮ້ານຄ້າໃຫ້ຄົບຖ້ວນ"
                          rows={3}
                          size={{ base: "md", md: "lg" }}
                          resize="vertical"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel fontSize={{ base: "sm", md: "md" }}>
                          ລາຍລະອຽດເພີ່ມເຕີມ
                        </FormLabel>
                        <Textarea
                          value={storeAddress.description}
                          onChange={(e) =>
                            setStoreAddress({
                              ...storeAddress,
                              description: e.target.value,
                            })
                          }
                          placeholder="ລາຍລະອຽດເພີ່ມເຕີມເຊັ່ນ: ຈຸດສຳຄັນທີ່ຢູ່ໃກ້ຄຽງ"
                          rows={2}
                          size={{ base: "md", md: "lg" }}
                          resize="vertical"
                        />
                      </FormControl>

                      <Box p={4} bg="blue.50" borderRadius="md">
                        <HStack>
                          <FaMapMarkerAlt color="blue" />
                          <Text fontSize="sm">
                            ທີ່ຢູ່ຮ້ານຄ້າຈະເປັນສ່ວນສໍາຄັນໃນການສື່ສານກັບລູກຄ້າ
                          </Text>
                        </HStack>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              )}
            </TabPanel>

            {/* Tab 4: Notifications */}
            <TabPanel p={{ base: 2, md: 6 }}>
              <Card bg={cardBg} shadow="md">
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <Heading
                      fontFamily="Noto Sans Lao, serif"
                      size="md"
                      color="blue.500"
                    >
                      <FaBell
                        style={{ display: "inline", marginRight: "8px" }}
                      />
                      ການຕັ້ງຄ່າແຈ້ງເຕືອນ
                    </Heading>

                    <VStack spacing={6} align="stretch">
                      <FormControl
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        flexDirection={{ base: "column", md: "row" }}
                        gap={{ base: 3, md: 0 }}
                      >
                        <Box textAlign={{ base: "center", md: "left" }}>
                          <FormLabel mb="0" fontSize={{ base: "sm", md: "md" }}>
                            ຮັບການແຈ້ງເຕືອນເມື່ອມີອໍເດີໃໝ່
                          </FormLabel>
                          <Text
                            fontSize="sm"
                            color={textColor}
                            textAlign={{ base: "center", md: "left" }}
                          >
                            ຈະເປັນການແຈ້ງເຕືອນເມື່ອມີອໍເດີໃໝ່ຂອງຮ້ານ
                          </Text>
                        </Box>
                        <Switch
                          isChecked={isNotificationEnabled}
                          onChange={handleToggleNotification}
                          colorScheme="green"
                          size={{ base: "md", md: "lg" }}
                        />
                      </FormControl>

                      <Divider />

                      <FormControl
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        flexDirection={{ base: "column", md: "row" }}
                        gap={{ base: 3, md: 0 }}
                      >
                        <Box textAlign={{ base: "center", md: "left" }}>
                          <FormLabel mb="0" fontSize={{ base: "sm", md: "md" }}>
                            ຮັບອີເມລເຕືອນການຊຳລະເງິນ
                          </FormLabel>
                          <Text
                            fontSize="sm"
                            color={textColor}
                            textAlign={{ base: "center", md: "left" }}
                          >
                            ສົ່ງອີເມລແຈ້ງເຕືອນເມື່ອລູກຄ້າຊຳລະເງິນແລ້ວ
                          </Text>
                        </Box>
                        <Switch
                          colorScheme="blue"
                          isChecked={notifications.paymentAlerts}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              paymentAlerts: e.target.checked,
                            })
                          }
                          size={{ base: "md", md: "lg" }}
                        />
                      </FormControl>
                    </VStack>

                    <Box p={4} bg="yellow.50" borderRadius="md">
                      <HStack>
                        <FaBell color="orange" />
                        <Text fontSize="sm">
                          ການແຈ້ງເຕືອນຈະຊ່ວຍໃຫ້ທ່ານບໍ່ພາດອໍເດີສຳຄັນ ແລະ
                          ຄຸ້ມຄອງທຸລະກິດໄດ້ດີຂຶ້ນ
                        </Text>
                      </HStack>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Tab 5: Payment Settings */}
            <TabPanel p={{ base: 2, md: 6 }}>
              {renderVerificationAlert()}

              {isVerified && (
                <Card bg={cardBg} shadow="md">
                  <CardBody>
                    <VStack spacing={6} align="stretch">
                      <Heading
                        fontFamily="Noto Sans Lao, serif"
                        size="md"
                        color="blue.500"
                      >
                        <FaCreditCard
                          style={{ display: "inline", marginRight: "8px" }}
                        />
                        ຕັ້ງຄ່າການຊຳລະເງິນ
                      </Heading>

                      <SimpleGrid columns={gridColumns} spacing={4}>
                        <FormControl isRequired>
                          <FormLabel fontSize={{ base: "sm", md: "md" }}>
                            ຊື່ທະນາຄານ
                          </FormLabel>
                          <Select
                            value={paymentSettings.bank_name}
                            onChange={(e) =>
                              setPaymentSettings({
                                ...paymentSettings,
                                bank_name: e.target.value,
                              })
                            }
                            size={{ base: "md", md: "lg" }}
                          >
                            {BANKS.map((bank) => (
                              <option key={bank.value} value={bank.value}>
                                {bank.label}
                              </option>
                            ))}
                          </Select>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel fontSize={{ base: "sm", md: "md" }}>
                            ຊື່ບັນຊີ
                          </FormLabel>
                          <Input
                            value={paymentSettings.bank_account_name}
                            onChange={(e) =>
                              setPaymentSettings({
                                ...paymentSettings,
                                bank_account_name: e.target.value,
                              })
                            }
                            placeholder="ຊື່ເຈົ້າຂອງບັນຊີ"
                            size={{ base: "md", md: "lg" }}
                          />
                        </FormControl>
                      </SimpleGrid>

                      <FormControl isRequired>
                        <FormLabel fontSize={{ base: "sm", md: "md" }}>
                          ເລກທີ່ບັນຊີທະນາຄານ
                        </FormLabel>
                        <Input
                          type="number"
                          value={paymentSettings.bank_account_number}
                          onChange={(e) =>
                            setPaymentSettings({
                              ...paymentSettings,
                              bank_account_number: e.target.value,
                            })
                          }
                          placeholder="ເລກທີ່ບັນຊີທະນາຄານ"
                          size={{ base: "md", md: "lg" }}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel fontSize={{ base: "sm", md: "md" }}>
                          ສຳເນົາປື້ມບັນຊີທະນາຄານ
                        </FormLabel>
                        <VStack spacing={4} align="start">
                          {preview?.bank_account_images && (
                            <Image
                              src={preview?.bank_account_images}
                              alt="Bank Account"
                              maxH={{ base: "150px", md: "200px" }}
                              borderRadius="md"
                              border="1px solid"
                              borderColor={borderColor}
                              objectFit="contain"
                            />
                          )}

                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(
                                e.target.files[0],
                                "bank_account_images"
                              )
                            }
                            id="bank-upload"
                            display="none"
                          />

                          <Button
                            as="label"
                            htmlFor="bank-upload"
                            leftIcon={<FaUpload />}
                            variant="outline"
                            cursor="pointer"
                            size={buttonSize}
                            width={{ base: "full", md: "auto" }}
                          >
                            ອັບໂຫລດສຳເນົາປື້ມບັນຊີ
                          </Button>

                          <Text fontSize="xs" color={textColor}>
                            ອັບໂຫລດສຳເນົາປື້ມບັນຊີທະນາຄານໜ້າທຳອິດ (JPG, PNG
                            ຂະໜາດບໍ່ເກີນ 2MB)
                          </Text>
                        </VStack>
                      </FormControl>

                      <Box p={4} bg="green.50" borderRadius="md">
                        <HStack>
                          <FaCreditCard color="green" />
                          <Text fontSize="sm">
                            ຂໍ້ມູນທະນາຄານຈະຖືກເກັບໃສ່ຢ່າງປອດໄພ ແລະ
                            ໃຊ້ສຳລັບການໂອນເງິນເທົ່ານັ້ນ
                          </Text>
                        </HStack>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              )}
            </TabPanel>

            {/* Tab 6: Identity Verification */}
            <TabPanel p={{ base: 2, md: 6 }}>
              <DocumentVerificationStatus sellerInfo_data={sellerInfo_data} />
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Mobile Save Button - Show only on smaller screens */}
        <Box
          bottom={4}
          display={{ base: "block", lg: "none" }}
          bg={cardBg}
          p={4}
          borderRadius="lg"
          shadow="lg"
          border="1px solid"
          borderColor={borderColor}
        >
          {isVerified && (
            <Button
              colorScheme="blue"
              size="lg"
              onClick={handleSave}
              isLoading={isLoading}
              loadingText="ກຳລັງບັນທຶກ..."
              leftIcon={<FaCheck />}
              width="full"
              isDisabled={!canEditProfile}
            >
              ບັນທຶກໂປຣໄຟລ
            </Button>
          )}

          {!canEditProfile && (
            <Text fontSize="xs" color="red.500" textAlign="center" mt={2}>
              <FaExclamationTriangle
                style={{ display: "inline", marginRight: "4px" }}
              />
              ກະລຸນາຢືນຢັນຕົວຕົນກ່ອນແກ້ໄຂຂໍ້ມູນ
            </Text>
          )}
        </Box>
      </VStack>
    </Container>
  );
};

// ============================================================================
// MEMOIZATION FOR PERFORMANCE
// ============================================================================

export default React.memo(SellerSettings);
