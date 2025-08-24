import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  useColorModeValue,
  Text,
  Divider,
  Select,
  Image,
  SimpleGrid,
  Card,
  CardBody,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import {
  FaCamera,
  FaShieldAlt,
  FaCloudUploadAlt,
  FaIdCard,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  messageClear,
  updateSellerReject,
  verifyUserCreate,
} from "../hooks/reducer/auth_reducer";
import { useNavigate } from "react-router-dom";

// Constants
const VERIFICATION_STATUS = {
  PENDING: "pending",
  ACCESS: "access",
  REJECTED: "rejected",
};

const DOCUMENT_TYPES = {
  ID_CARD: "id_card",
  PASSPORT: "passport",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

// Initial form data
const INITIAL_VERIFICATION_DATA = {
  fullName: "",
  idNumber: "",
  documentType: DOCUMENT_TYPES.ID_CARD,
  birthDate: "",
  expiryDate: "",
  address: "",
};

const IdentityForm = ({ handleSubmitDocument, sellerInfo_data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const textColor = useColorModeValue("gray.600", "gray.300");
  const { successMessage, errorMessage } = useSelector((state) => state?.auth);

  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [idCardImage, setIdCardImage] = useState(null);
  const [selfieImage, setSelfieImage] = useState(null);
  const [preview, setPreview] = useState({});
  const [verificationStatus, setVerificationStatus] = useState(
    VERIFICATION_STATUS.PENDING
  );
  const [verificationData, setVerificationData] = useState(
    INITIAL_VERIFICATION_DATA
  );
  const [formErrors, setFormErrors] = useState({});

  // Initialize form data from props
  useEffect(() => {
    if (sellerInfo_data) {
      setVerificationStatus(
        sellerInfo_data?.verificationStatus || VERIFICATION_STATUS.PENDING
      );
      setVerificationData((prev) => ({
        ...prev,
        ...sellerInfo_data?.verificationData,
      }));

      if (sellerInfo_data?.idCardImage) {
        setIdCardImage(sellerInfo_data?.idCardImage);
        setPreview((prev) => ({
          ...prev,
          idCardImage: sellerInfo_data?.idCardImage,
        }));
      }

      if (sellerInfo_data?.selfieImage) {
        setSelfieImage(sellerInfo_data?.selfieImage);
        setPreview((prev) => ({
          ...prev,
          selfieImage: sellerInfo_data?.selfieImage,
        }));
      }
    }
  }, [sellerInfo_data]);
  // Handle toast messages
  useEffect(() => {
    if (errorMessage) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      dispatch(messageClear());
    }

    if (successMessage) {
      toast({
        title: "สำเร็จ",
        description: successMessage,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      dispatch(messageClear());
    }
  }, [errorMessage, successMessage, dispatch, toast]);

  // File validation
  const validateFile = (file) => {
    if (!file) {
      return "กรุณาเลือกไฟล์";
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "กรุณาเลือกไฟล์ภาพ (JPG, PNG) เท่านั้น";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "ขนาดไฟล์ต้องไม่เกิน 5MB";
    }

    return null;
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!verificationData.fullName.trim()) {
      errors.fullName = "กรุณากรอกชื่อ-นามสกุล";
    }

    if (!verificationData.idNumber.trim()) {
      errors.idNumber = "กรุณากรอกหมายเลขเอกสาร";
    } else {
      const expectedLength =
        verificationData.documentType === DOCUMENT_TYPES.ID_CARD ? 13 : 9;
      if (verificationData.idNumber.length !== expectedLength) {
        errors.idNumber = `หมายเลขเอกสารต้องมี ${expectedLength} หลัก`;
      }
    }

    if (!verificationData.birthDate) {
      errors.birthDate = "กรุณาเลือกวันเกิด";
    }

    if (!verificationData.expiryDate) {
      errors.expiryDate = "กรุณาเลือกวันหมดอายุ";
    }

    if (!verificationData.address.trim()) {
      errors.address = "กรุณากรอกที่อยู่";
    }

    // Validate dates
    if (verificationData.birthDate && verificationData.expiryDate) {
      const birthDate = new Date(verificationData.birthDate);
      const expiryDate = new Date(verificationData.expiryDate);
      const today = new Date();

      if (birthDate >= today) {
        errors.birthDate = "วันเกิดต้องเป็นวันที่ผ่านมาแล้ว";
      }

      if (expiryDate <= today) {
        errors.expiryDate = "เอกสารหมดอายุแล้ว";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle image upload with validation
  const handleImageUpload = useCallback(
    (file, type) => {
      const error = validateFile(file);
      if (error) {
        toast({
          title: "ไฟล์ไม่ถูกต้อง",
          description: error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview((prev) => ({
          ...prev,
          [type]: e.target.result,
        }));
      };
      reader.readAsDataURL(file);

      if (type === "idCardImage") {
        setIdCardImage(file);
      } else if (type === "selfieImage") {
        setSelfieImage(file);
      }
    },
    [toast]
  );

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setVerificationData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Handle form submission
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณาตรวจสอบข้อมูลและแก้ไขข้อผิดพลาด",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Check if images are uploaded (only for new submissions)
    if (verificationStatus !== VERIFICATION_STATUS.ACCESS) {
      if (!idCardImage && !preview.idCardImage) {
        toast({
          title: "กรุณาอัปโหลดเอกสาร",
          description: "กรุณาอัปโหลดรูปเอกสารประจำตัว",
          status: "error",
          duration: 3000,
          isClosable: true,
        });

        return;
      }

      if (!selfieImage && !preview.selfieImage) {
        toast({
          title: "กรุณาอัปโหลดรูปเซลฟี",
          description: "กรุณาอัปโหลดรูปเซลฟีคู่กับเอกสาร",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    try {
      setIsLoading(true);

      // Prepare form data
      const raw = verificationData;

      const datadoc = {
        fullName: String(raw?.fullName || "").trim(),
        idNumber: String(raw?.idNumber || "").trim(),
        documentType: ["id_card", "passport"].includes(raw?.documentType)
          ? raw.documentType
          : "id_card",
        birthDate: raw?.birthDate ? new Date(raw.birthDate) : null,
        expiryDate: raw?.expiryDate ? new Date(raw.expiryDate) : null,
        address: String(raw?.address || "").trim(),
      };

      const formData = new FormData();
      formData.append("verificationData", JSON.stringify(datadoc));
      formData.append("verificationStatus", VERIFICATION_STATUS.PENDING);
      if (idCardImage) {
        formData.append("idCardImage", idCardImage);
      }
      // if(image instanceof File){

      // }
      if (selfieImage) {
        formData.append("selfieImage", selfieImage);
      }
      // Dispatch appropriate action
      if (
        sellerInfo_data?.verificationStatus === VERIFICATION_STATUS.REJECTED
      ) {
        for (let pair of formData.entries()) {
          console.log(pair[0] + ":", pair[1]);
        }
        dispatch(
          updateSellerReject({ formData: formData, id: sellerInfo_data?._id })
        );
      } else {
        dispatch(verifyUserCreate(formData));
      }

      // Call callback function
      handleSubmitDocument();
    } catch (error) {
      console.error("Error submitting verification:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render verification status alert
  const renderStatusAlert = () => {
    switch (verificationStatus) {
      case VERIFICATION_STATUS.ACCESS:
        return (
          <Alert status="success" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>ຢືນຢັນຕົວຕົນສຳເລັດ</AlertTitle>
              <AlertDescription>
                ບັນຊີຂອງທ່ານໄດ້ຮັບການຢືນຢັນແລ້ວ
              </AlertDescription>
            </Box>
          </Alert>
        );
      case VERIFICATION_STATUS.PENDING:
        return (
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>ກຳລັງກວດສອບເອກະສານ</AlertTitle>
              <AlertDescription>
                ພວກເຮົາໄດ້ຮັບເອກະສານຂອງທ່ານແລ້ວ ກຳລັງກວດສອບແລະຈະແຈ້ງຜົນພາຍໃນ 1-3
                ວັນທຳການ
              </AlertDescription>
            </Box>
          </Alert>
        );
      case VERIFICATION_STATUS.REJECTED:
        return (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>การยืนยันไม่สำเร็จ</AlertTitle>
              <AlertDescription>
                ເອກະສານທີ່ສົ່ງມາບໍ່ຖືກຕ້ອງຫຼືບໍ່ຊັດເຈນ ກະລຸນາອັບໂຫລດເອກະສານໃໝ່
              </AlertDescription>
            </Box>
          </Alert>
        );
      default:
        return null;
    }
  };

  // Check if form is disabled
  const isFormDisabled = verificationStatus === VERIFICATION_STATUS.ACCESS;

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleVerificationSubmit}>
          <VStack spacing={6} align="stretch">
            {/* Header */}
            <Box textAlign="center">
              <Heading
                fontFamily="Noto Sans Lao, serif"
                size="lg"
                color="blue.500"
                mb={2}
              >
                <FaShieldAlt
                  style={{ display: "inline", marginRight: "8px" }}
                />
                ຢືນຢັນຕົວຕົນຜູ້ຂາຍ
              </Heading>
              <Text color={textColor} maxW="500px" mx="auto">
                ກະລຸນາອັບໂຫລດເອກະສານເພື່ອໃຫ້ຮ້ານຄ້າຂອງທ່ານໄດ້ຮັບການຢືນຢັນຈາກລະບົບ
                ການຢືນຢັ້ນຕົວຕົນຈະຊ່ວຍເພີ່ມຄວາມນ່າເຊື່ອຖື ແລະ
                ສ້າງຄວາມໝັ້ນໃຈໃຫ້ກັບລູກຄ້າ
              </Text>
            </Box>

            {/* Status Alert */}
            {renderStatusAlert()}

            {/* Basic Information */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isInvalid={!!formErrors.fullName}>
                <FormLabel>ຊື່ ແລະ ນາມສະກຸນ (ຕາມເອກະສານທາງການ)</FormLabel>
                <Input
                  value={verificationData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder="ລະບຸຊື່-ນາມສະກຸນໃຫ້ກົງກັບບັດ"
                  isDisabled={isFormDisabled}
                />
                {formErrors.fullName && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {formErrors.fullName}
                  </Text>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>ປະເພດເອກະສານ</FormLabel>
                <Select
                  value={verificationData.documentType}
                  onChange={(e) =>
                    handleInputChange("documentType", e.target.value)
                  }
                  isDisabled={isFormDisabled}
                >
                  <option value={DOCUMENT_TYPES.ID_CARD}>ບັດປະຊາຊົນ</option>
                  <option value={DOCUMENT_TYPES.PASSPORT}>
                    ໜັງສືເດີນທາງ (Passport)
                  </option>
                </Select>
              </FormControl>
            </SimpleGrid>

            <FormControl isInvalid={!!formErrors.idNumber}>
              <FormLabel>
                {verificationData.documentType === DOCUMENT_TYPES.ID_CARD
                  ? "ເລກທີ່ບັດປະຊາຊົນ"
                  : "ເລກທີ່ໜັງສືເດີນທາງ"}
              </FormLabel>
              <Input
                value={verificationData.idNumber}
                onChange={(e) => handleInputChange("idNumber", e.target.value)}
                placeholder={
                  verificationData.documentType === DOCUMENT_TYPES.ID_CARD
                    ? "1234567890123"
                    : "A1234567"
                }
                maxLength={
                  verificationData.documentType === DOCUMENT_TYPES.ID_CARD
                    ? 13
                    : 9
                }
                isDisabled={isFormDisabled}
              />
              {formErrors.idNumber && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {formErrors.idNumber}
                </Text>
              )}
            </FormControl>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <FormControl isInvalid={!!formErrors.birthDate}>
                <FormLabel>ວັນ/ເດືອນ/ປີເກີດ (ຕາມບັດ)</FormLabel>
                <Input
                  type="date"
                  value={verificationData.birthDate}
                  onChange={(e) =>
                    handleInputChange("birthDate", e.target.value)
                  }
                  isDisabled={isFormDisabled}
                />
                {formErrors.birthDate && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {formErrors.birthDate}
                  </Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!formErrors.expiryDate}>
                <FormLabel>ວັນ/ເດືອນ/ປີ ໝົດອາຍຸບັດ (ຕາມບັດ)</FormLabel>
                <Input
                  type="date"
                  value={verificationData.expiryDate}
                  onChange={(e) =>
                    handleInputChange("expiryDate", e.target.value)
                  }
                  isDisabled={isFormDisabled}
                />
                {formErrors.expiryDate && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {formErrors.expiryDate}
                  </Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!formErrors.address}>
                <FormLabel>ທີ່ຢູ່ (ຕາມບັດ)</FormLabel>
                <Input
                  type="text"
                  value={verificationData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="ບ້ານ......ເມືອງ.....ແຂວງ......"
                  isDisabled={isFormDisabled}
                />
                {formErrors.address && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {formErrors.address}
                  </Text>
                )}
              </FormControl>
            </SimpleGrid>

            <Divider />

            {/* Document Upload Section */}
            <Box>
              <Heading fontFamily="Noto Sans Lao, serif" size="md" mb={4}>
                ເອກະສານຢືນຢັນຕົວຕົນ
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {/* ID Card/Passport Upload */}
                <FormControl>
                  <FormLabel>
                    ຮູບຖ່າຍ
                    {verificationData.documentType === DOCUMENT_TYPES.ID_CARD
                      ? "ບັດປະຊາຊົນ"
                      : "ໜັງສືເດີນທາງ"}
                  </FormLabel>
                  <VStack spacing={4} align="stretch">
                    {preview?.idCardImage && (
                      <Box textAlign="center">
                        <Image
                          src={preview.idCardImage}
                          alt="ID Document"
                          maxH="200px"
                          borderRadius="md"
                          border="2px solid"
                          borderColor="blue.200"
                          mx="auto"
                        />
                      </Box>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageUpload(e.target.files[0], "idCardImage")
                      }
                      style={{ display: "none" }}
                      id="id-card-upload"
                      disabled={isFormDisabled}
                    />
                    <Button
                      as="label"
                      htmlFor="id-card-upload"
                      leftIcon={<FaCloudUploadAlt />}
                      colorScheme="blue"
                      variant="outline"
                      cursor="pointer"
                      size="lg"
                      isDisabled={isFormDisabled}
                    >
                      ອັບໂຫລດເອກະສານ
                    </Button>
                    <Text fontSize="sm" color={textColor} textAlign="center">
                      ຖ່າຍຮູບໃຫ້ຊັດເຈນ ໃຫ້ເຫັນຄົບທັງ 4 ມຸມ
                      <br />
                      ຮອງຮັບໄຟລ໌ JPG, PNG ຂະໜາດບໍ່ເກີນ 5MB
                    </Text>
                  </VStack>
                </FormControl>

                {/* Selfie with ID Upload */}
                <FormControl>
                  <FormLabel>ຮູບເຊວຟີຄູ່ກັບເອກະສານ</FormLabel>
                  <VStack spacing={4} align="stretch">
                    {preview?.selfieImage && (
                      <Box textAlign="center">
                        <Image
                          src={preview.selfieImage}
                          alt="Selfie with ID"
                          maxH="200px"
                          borderRadius="md"
                          border="2px solid"
                          borderColor="green.200"
                          mx="auto"
                        />
                      </Box>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageUpload(e.target.files[0], "selfieImage")
                      }
                      style={{ display: "none" }}
                      id="selfie-upload"
                      disabled={isFormDisabled}
                    />
                    <Button
                      as="label"
                      htmlFor="selfie-upload"
                      leftIcon={<FaCamera />}
                      colorScheme="green"
                      variant="outline"
                      cursor="pointer"
                      size="lg"
                      isDisabled={isFormDisabled}
                    >
                      ຖ່າຍຮູບເຊວຟີ
                    </Button>
                    <Text fontSize="sm" color={textColor} textAlign="center">
                      ຖ່າຍຮູບຕົນເອງໂດຍຖືເອກະສານໃນມື
                      <br />
                      ໃຫ້ເຫັນໃບໜ້າແລະເອກະສານຢ່າງຊັດເຈນ
                    </Text>
                  </VStack>
                </FormControl>
              </SimpleGrid>
            </Box>

            {/* Guidelines */}
            <Box
              p={4}
              bg={useColorModeValue("blue.50", "blue.900")}
              borderRadius="md"
            >
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                <FaIdCard style={{ display: "inline", marginRight: "8px" }} />
                ຄໍາແນະນໍາໃນການຖ່າຍຮູບເອກະສານ:
              </Text>
              <VStack align="start" spacing={1} fontSize="sm" color={textColor}>
                <Text>• ຖ່າຍໃນສະຖານທີ່ທີ່ມີແສງສວ່າງພຽງພໍ</Text>
                <Text>• ຂໍ້ຄວາມ ແລະ ຮູບໃນເອກະສານຕ້ອງແມ່ນມອງເຫັນຊັດເຈນ</Text>
                <Text>• ບໍ່ຄວນມີເງາຫຼືແສງສະທ້ອນໃນຮູບ</Text>
                <Text>• ຮູບເຊວຟີຕ້ອງເຫັນໃບໜ້າແລະເອກະສານຢ່າງຊັດເຈນ</Text>
              </VStack>
            </Box>

            {/* Submit Button */}
            <Box textAlign="center" pt={4}>
              <Button
                type="submit"
                colorScheme={
                  verificationStatus === VERIFICATION_STATUS.ACCESS
                    ? "green"
                    : "blue"
                }
                size="lg"
                isLoading={isLoading}
                loadingText="กำลังส่งข้อมูล..."
                leftIcon={<FaShieldAlt />}
                minW="250px"
                isDisabled={isFormDisabled}
              >
                {verificationStatus === VERIFICATION_STATUS.ACCESS
                  ? "ยืนยันแล้ว"
                  : "ส่งข้อมูลยืนยัน"}
              </Button>
            </Box>
          </VStack>
        </form>
      </CardBody>
    </Card>
  );
};

export default IdentityForm;
