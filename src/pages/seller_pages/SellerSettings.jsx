import React, { useEffect, useState } from "react";
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
  IconButton,
  useToast,
  useColorModeValue,
  Text,
  Divider,
  Badge,
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
} from "react-icons/fa";
import DocumentVerificationStatus from "../../components/DocumentVerificationStatus";
import { useDispatch, useSelector } from "react-redux";
import {
  get_user,
  getVerifyUser,
  unsubscribeNotification,
  updateSeller,
} from "../../hooks/reducer/auth_reducer";
import { registerPush } from "../notification/registerPush";
import { notication } from "../../hooks/reducer/sellers_reducer/provider_sellers";
const SellerSettings = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(get_user());
    dispatch(getVerifyUser());
  }, [dispatch]);
  const { loader, userInfo, sellerInfo_data } = useSelector(
    (state) => state.auth
  );
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null); // สำหรับโชว์รูป
  const [isNotificationEnabled, setIsNotificationEnabled] = useState();
  const handleToggleNotification = async () => {
    const permission = Notification.permission;

    if (permission === "default") {
      const ask = await Notification.requestPermission();
      if (ask === "granted") {
        const sub = await registerPush(userInfo._id);
        if (sub) {
          dispatch(notication({ subscription: sub }));
          setIsNotificationEnabled(true); // ✅ แจ้งเตือนเปิด
        }
      }
    } else if (permission === "granted") {
      if (isNotificationEnabled) {
        // 👇 ปิดแจ้งเตือน
        await dispatch(unsubscribeNotification(userInfo._id));
        localStorage.setItem("toggle", false);
        setIsNotificationEnabled(false);
      } else {
        // 👇 เปิดใหม่
        const sub = await registerPush(userInfo._id);
        if (sub) {
          localStorage.setItem("toggle", true);
          dispatch(notication({ subscription: sub }));
          setIsNotificationEnabled(true);
        }
      }
    } else if (permission === "denied") {
      setIsNotificationEnabled(false);
      alert("คุณเคยปฏิเสธการแจ้งเตือน กรุณาไปเปิดใน Settings ของเบราว์เซอร์");
    }
  };

  useEffect(() => {
    const data = localStorage.getItem("toggle");
    setIsNotificationEnabled(data);
  }, []);
  console.log(Notification.permission);
  // Colors for light/dark mode
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.300");
  // Responsive values
  const tabOrientation = useBreakpointValue({
    base: "horizontal",
    md: "vertical",
  });
  const containerPadding = useBreakpointValue({ base: 4, md: 6 });
  const [sellerInfo, setSellerInfo] = useState({
    username: "",
    phone: "0812345678",
    email: "seller@example.com",
    role: "",
  });
  // Form states
  const [accountInfo, setAccountInfo] = useState({
    store_name: "ร้านขายของดี",
    store_code: "STORE001",
    store_images: "",
  });

  const [storeAddress, setStoreAddress] = useState({
    address: "123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110",
    description: "อยู่ใกล้สถานีรถไฟฟ้า BTS",
    status: "verified",
  });

  const [notifications, setNotifications] = useState({
    newOrders: true,
    paymentAlerts: false,
  });
  const [paymentSettings, setPaymentSettings] = useState({
    bank_account_number: "1234567890",
    bank_account_name: "นาย สมชาย ใจดี",
    bank_name: "ธนาคารกรุงเทพ",
    bank_account_images: "",
  });
  useEffect(() => {
    setSellerInfo({
      username: userInfo?.username,
      phone: userInfo?.phone,
      email: userInfo?.email,
      role: userInfo?.role,
    });
    setAccountInfo({
      store_name: sellerInfo_data?.store_name || "",
      store_code: sellerInfo_data?.store_code || "",
      store_images: sellerInfo_data?.store_images || "",
    });
    setStoreAddress({
      address: sellerInfo_data?.address || "",
      description: sellerInfo_data?.description || "",
      status: sellerInfo_data?.status || "verified",
    });
    setPaymentSettings({
      bank_account_number: sellerInfo_data?.bank_account_number || "",
      bank_account_name: sellerInfo_data?.bank_account_name || "",
      bank_name: sellerInfo_data?.bank_name || "ธนาคารกรุงเทพ",
      bank_account_images: sellerInfo_data?.bank_account_images || "",
    });
    setPreview({
      bank_account_images: sellerInfo_data?.bank_account_images || "",
      store_images: sellerInfo_data?.store_images || "",
    });
  }, [userInfo, sellerInfo_data]);
  const handleSave = async () => {
    setIsLoading(true);

    try {
      await dispatch(
        updateSeller({
          ...accountInfo,
          ...storeAddress,
          ...paymentSettings,
        })
      );
      toast({
        title: "บันทึกสำเร็จ!",
        description: "ข้อมูลการตั้งค่าได้รับการอัปเดตแล้ว",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleImageUpload = (file, type) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview((prev) => ({
        ...prev,
        [type]: e.target.result, // เก็บเฉพาะเพื่อ preview เท่านั้น
      }));
    };
    reader.readAsDataURL(file);

    if (type === "bank_account_images") {
      setPaymentSettings((prev) => ({
        ...prev,
        bank_account_images: file, // เก็บ File object สำหรับ sending
      }));
    } else if (type === "store_images") {
      setAccountInfo((prev) => ({
        ...prev,
        store_images: file,
      }));
    }
  };

  if (loader) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="xl" color="blue.500">
          กำลังโหลดข้อมูล...
        </Text>
      </Box>
    );
  }

  return (
    <Container maxW="6xl" p={containerPadding}>
      <VStack spacing={6} align="stretch">
        <Box textAlign="center">
          <Heading fontFamily={"Noto Sans Lao, serif"} size="xl" mb={2}>
            ການຕັ້ງຄ່າບັນຊີຜູ້ຂາຍ
          </Heading>
          <Text color={textColor}>ຈັດການຂໍ້ມູນຮ້ານຄ້າ</Text>
        </Box>

        <Tabs
          orientation={tabOrientation}
          variant="enclosed"
          colorScheme="blue"
          size="lg"
        >
          <TabList minW={{ base: "full", md: "200px" }}>
            <Tab>
              <FaUserCircle style={{ marginRight: "8px" }} />
              ຂໍ້ມູນບັນຊີຜູ້ຂາຍ
            </Tab>
            <Tab>
              <FaUser style={{ marginRight: "8px" }} />
              ຂໍ້ມູນບັນຊີຮ້ານ
            </Tab>

            <Tab>
              <FaMapMarkerAlt style={{ marginRight: "8px" }} />
              ທີ່ຢູ່ຮ້ານ
            </Tab>
            <Tab>
              <FaBell style={{ marginRight: "8px" }} />
              ການແຈ້ງເຕືອນ
            </Tab>
            <Tab>
              <FaCreditCard style={{ marginRight: "8px" }} />
              ບັນຊີທະນາຄານ
            </Tab>
            <Tab>
              <FaCreditCard style={{ marginRight: "8px" }} />
              ຢືນຢັນຕົວຕົນ
            </Tab>
            {/* Save Button */}
            <Box textAlign="center" pt={4}>
              <Button
                colorScheme="blue"
                size="lg"
                onClick={handleSave}
                isLoading={isLoading}
                loadingText="กำลังบันทึก..."
                leftIcon={<FaCheck />}
                minW="50px"
              >
                บันทึกการเปลี่ยนแปลง
              </Button>
            </Box>
          </TabList>

          <TabPanels flex="1">
            <TabPanel>
              {sellerInfo_data?.verificationStatus === "pending" && (
                <Alert status="warning">
                  <AlertIcon />
                  ຢູ່ໃນຂັ້ນຕອນກວດສອບເອກະສານ
                </Alert>
              )}
              {!sellerInfo_data?.verificationStatus && (
                <Alert status="warning">
                  <AlertIcon />
                  ກະລຸນາອັບໂຫລດເອກະສານເພື່ອຍືນຢັນຕົວຕົນ
                </Alert>
              )}
              {sellerInfo_data?.verificationStatus === "reject" && (
                <Alert status="error">
                  <AlertIcon />
                  ອະໄພ: ກະລຸນາກວດສອບເອກະສານໃໝ່
                </Alert>
              )}
              {sellerInfo_data?.verificationStatus === "access" && (
                <Card>
                  <CardBody>
                    <VStack spacing={4} align={"stretch"}>
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
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <FormControl isRequired>
                          <FormLabel>ເບີໂທລະສັບ</FormLabel>
                          <Input
                            isDisabled
                            value={sellerInfo.phone}
                            onChange={(e) =>
                              setSellerInfo({
                                ...sellerInfo,
                                phone: e.target.value,
                              })
                            }
                            placeholder="0812345678"
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>ອີເມວ</FormLabel>
                          <Input
                            type="email"
                            isDisabled
                            value={sellerInfo.email}
                            onChange={(e) =>
                              setSellerInfo({
                                ...sellerInfo,
                                email: e.target.value,
                              })
                            }
                            placeholder="seller@example.com"
                          />
                        </FormControl>
                        <FormControl isRequired>
                          <FormLabel>ສະຖານະ</FormLabel>
                          <Input isDisabled value={sellerInfo.role} />
                        </FormControl>
                      </SimpleGrid>
                      <Button
                        colorScheme="blue"
                        size="lg"
                        onClick={handleSave}
                        isLoading={isLoading}
                        loadingText="กำลังบันทึก..."
                        leftIcon={<FaCheck />}
                        minW="50px"
                      >
                        ບັນທຶກ
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              )}
            </TabPanel>
            {/* Account Info Tab */}
            <TabPanel>
              {sellerInfo_data?.verificationStatus === "pending" && (
                <Alert status="warning">
                  <AlertIcon />
                  ຢູ່ໃນຂັ້ນຕອນກວດສອບເອກະສານ
                </Alert>
              )}
              {!sellerInfo_data?.verificationStatus && (
                <Alert status="warning">
                  <AlertIcon />
                  ກະລຸນາອັບໂຫລດເອກະສານເພື່ອຍືນຢັນຕົວຕົນ
                </Alert>
              )}
              {sellerInfo_data?.verificationStatus === "reject" && (
                <Alert status="error">
                  <AlertIcon />
                  ອະໄພ: ກະລຸນາກວດສອບເອກະສານໃໝ່
                </Alert>
              )}
              {sellerInfo_data?.verificationStatus === "access" && (
                <Card>
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

                      {/* Profile Image Upload */}
                      <FormControl>
                        <FormLabel>ຮູບໂປຣໄຟລຮ້ານ</FormLabel>
                        <HStack spacing={4}>
                          <Avatar
                            size="xl"
                            src={preview?.store_images}
                            name={preview?.store_name || "ຮ້ານຂາຍ"}
                            bg="blue.500"
                          />
                          <VStack align="start">
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
                            />
                            <Button
                              as="label"
                              htmlFor="profile-upload"
                              leftIcon={<FaCamera />}
                              size="sm"
                              variant="outline"
                              cursor="pointer"
                            >
                              ປ່ຽນຮູບ
                            </Button>
                            <Text fontSize="sm" color={textColor}>
                              ຮອງຮັບໄຟລ JPG, PNG ຂະໜາດບໍ່ເກີນ 2MB
                            </Text>
                          </VStack>
                        </HStack>
                      </FormControl>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <FormControl isRequired>
                          <FormLabel>ຊື່ຮ້ານຄ້າ</FormLabel>
                          <Input
                            value={accountInfo.store_name}
                            onChange={(e) =>
                              setAccountInfo({
                                ...accountInfo,
                                store_name: e.target.value,
                              })
                            }
                            placeholder="ລະບຸຊື່ຮ້ານຄ້າ"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>ລະຫັດຮ້ານຄ້າ</FormLabel>
                          <HStack>
                            <Input value={accountInfo.store_code} isReadOnly />
                          </HStack>
                        </FormControl>
                      </SimpleGrid>
                      {/* ///user information */}
                      <Divider />
                    </VStack>
                  </CardBody>
                </Card>
              )}
            </TabPanel>

            {/* Store Address Tab */}
            <TabPanel>
              {sellerInfo_data?.verificationStatus === "pending" && (
                <Alert status="warning">
                  <AlertIcon />
                  ຢູ່ໃນຂັ້ນຕອນກວດສອບເອກະສານ
                </Alert>
              )}
              {!sellerInfo_data?.verificationStatus && (
                <Alert status="warning">
                  <AlertIcon />
                  ກະລຸນາອັບໂຫລດເອກະສານເພື່ອຍືນຢັນຕົວຕົນ
                </Alert>
              )}
              {sellerInfo_data?.verificationStatus === "reject" && (
                <Alert status="error">
                  <AlertIcon />
                  ອະໄພ: ກະລຸນາກວດສອບເອກະສານໃໝ່
                </Alert>
              )}
              {sellerInfo_data?.verificationStatus === "access" && (
                <Card>
                  <CardBody>
                    <VStack spacing={6} align="stretch">
                      <HStack justify="space-between">
                        <Heading
                          fontFamily={"Noto Sans Lao, serif"}
                          size="md"
                          color="blue.500"
                        >
                          <FaMapMarkerAlt
                            style={{ display: "inline", marginRight: "8px" }}
                          />
                          ທີ່ຢູ່ຮ້ານຄ້າ
                        </Heading>
                      </HStack>

                      <FormControl isRequired>
                        <FormLabel>ທີ່ຢູ່ຮ້ານຄ້າ</FormLabel>
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
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>ລາຍລະອຽດເພີ່ມເຕີມ</FormLabel>
                        <Textarea
                          value={storeAddress.description}
                          onChange={(e) =>
                            setStoreAddress({
                              ...storeAddress,
                              description: e.target.value,
                            })
                          }
                          placeholder="ລາຍລະອຽດເພີ່ມເຕີມເ"
                          rows={2}
                        />
                      </FormControl>

                      <Box p={4} bg={"blue.100"} borderRadius="md">
                        <HStack>
                          <FaMapMarkerAlt color="blue" />
                          <Text fontSize="sm">
                            ທີ່ຢູ່ຮ້ານຄ້າຈະເປັນສ່ວນສໍາຄັນໃນການສື່ສານ
                          </Text>
                        </HStack>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              )}
            </TabPanel>

            {/* Notifications Tab */}
            <TabPanel>
              <Card>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <Heading
                      fontFamily={"Noto Sans Lao, serif"}
                      size="md"
                      color="blue.500"
                    >
                      <FaBell
                        style={{ display: "inline", marginRight: "8px" }}
                      />
                      ການຕັ້ງຄ່າແຈ້ງເຕືອນ
                    </Heading>

                    <VStack spacing={4} align="stretch">
                      <FormControl
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box>
                          <FormLabel mb="0">
                            ຮັບການແຈ້ງເຕືອນເມື່ອມີອໍເດີໃໝ່
                          </FormLabel>
                          <Text fontSize="sm" color={textColor}>
                            ຈະເປັນການແຈ້ງເຕືອນເມື່ອມີອໍເດີໃໝ່ຂອງຮ້ານ
                          </Text>
                        </Box>
                        <Switch
                          isChecked={isNotificationEnabled}
                          onChange={handleToggleNotification}
                          colorScheme="green"
                        >
                          เปิดการแจ้งเตือน
                        </Switch>
                      </FormControl>

                      <Divider />

                      <FormControl
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box>
                          <FormLabel mb="0">ຮັບອີເມລເຕືອນການຊຳລະເງິນ</FormLabel>
                          <Text fontSize="sm" color={textColor}>
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
                        />
                      </FormControl>
                    </VStack>

                    <Box p={4} bg={"yellow.100"} borderRadius="md">
                      <HStack>
                        <FaBell color="orange" />
                        <Text fontSize="sm">
                          ການແຈ້ງເຕືອນຈະຊ່ວຍໃຫ້ທ່ານບໍ່ພາດອໍເດີສຳຄັນ
                        </Text>
                      </HStack>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>

            {/* Payment Settings Tab */}
            <TabPanel>
              {sellerInfo_data?.verificationStatus === "pending" && (
                <Alert status="warning">
                  <AlertIcon />
                  ຢູ່ໃນຂັ້ນຕອນກວດສອບເອກະສານ
                </Alert>
              )}
              {!sellerInfo_data?.verificationStatus && (
                <Alert status="warning">
                  <AlertIcon />
                  ກະລຸນາອັບໂຫລດເອກະສານເພື່ອຍືນຢັນຕົວຕົນ
                </Alert>
              )}
              {sellerInfo_data?.verificationStatus === "reject" && (
                <Alert status="error">
                  <AlertIcon />
                  ອະໄພ: ກະລຸນາກວດສອບເອກະສານໃໝ່
                </Alert>
              )}
              {sellerInfo_data?.verificationStatus === "access" && (
                <Card>
                  <CardBody>
                    <VStack spacing={6} align="stretch">
                      <Heading size="md" color="blue.500">
                        <FaCreditCard
                          style={{ display: "inline", marginRight: "8px" }}
                        />
                        ຕັ້ງຄ່າການຊຳລະເງິນ
                      </Heading>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <FormControl isRequired>
                          <FormLabel>ຊື່ທະນາຄານ</FormLabel>
                          <Select
                            value={paymentSettings.bank_name}
                            onChange={(e) =>
                              setPaymentSettings({
                                ...paymentSettings,
                                bank_name: e.target.value,
                              })
                            }
                          >
                            <option value="ທະນາຄານການຄ້າຕ່າງປະເທດ">
                              ທະນາຄານການຄ້າຕ່າງປະເທດ
                            </option>
                            <option value="ທະນາການສົ່ງເສີມກະສິກຳ">
                              ທະນາການສົ່ງເສີມກະສິກຳ
                            </option>
                            <option value="ທະນາຄານພັດທະນາລາວ">
                              ທະນາຄານພັດທະນາລາວ
                            </option>
                            <option value="ທະນາຄານອິນໂດຈີນ">
                              ທະນາຄານອິນໂດຈີນ
                            </option>
                          </Select>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>ຊື່ບັນຊີ</FormLabel>
                          <Input
                            value={paymentSettings.bank_account_name}
                            onChange={(e) =>
                              setPaymentSettings({
                                ...paymentSettings,
                                bank_account_name: e.target.value,
                              })
                            }
                            placeholder="ຊື່ເຈົ້າຂອງບັນຊີ"
                          />
                        </FormControl>
                      </SimpleGrid>

                      <FormControl isRequired>
                        <FormLabel>ເລກທີ່ບັນຊີທະນາຄານ</FormLabel>
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
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>ປື້ມບັນຊີທະນາຄານ</FormLabel>
                        <VStack spacing={4} align="start">
                          {preview?.bank_account_images && (
                            <Image
                              src={preview?.bank_account_images}
                              alt="Bank QR Code"
                              maxH="200px"
                              borderRadius="md"
                              border="1px solid"
                              borderColor={borderColor}
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
                          />
                          <Button
                            as="label"
                            htmlFor="bank-upload"
                            leftIcon={<FaUpload />}
                            variant="outline"
                            cursor="pointer"
                          >
                            ອັບໂຫລດປື້ມບັນຊີທະນາຄານ
                          </Button>
                          <Text fontSize="sm" color={textColor}>
                            ອັບໂຫລດປື້ມບັນຊີທະນາຄານ
                          </Text>
                        </VStack>
                      </FormControl>

                      <Box p={4} bg={"green.100"} borderRadius="md">
                        <HStack>
                          <FaCreditCard color="green" />
                          <Text fontSize="sm">
                            ຂໍໍໍ້ມູນທະນາຄານຈະຖືກເກັບໃສ່ຢ່າງປອດໄພແລະໃຊ້ສໍາລັບການໂອນເງິນ
                          </Text>
                        </HStack>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              )}
            </TabPanel>

            {/* Identity Verification Tab */}
            <TabPanel>
              <DocumentVerificationStatus sellerInfo_data={sellerInfo_data} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default SellerSettings;
