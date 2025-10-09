import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  Icon,
} from "@chakra-ui/react";
import {
  FaCamera,
  FaShieldAlt,
  FaCloudUploadAlt,
  FaIdCard,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  get_user,
  getVerifyUser,
  messageClear,
  updateSellerReject,
  verifyUserCreate,
} from "../hooks/reducer/auth_reducer";

// Constants
const VERIFICATION_STATUS = {
  PENDING: "pending",
  ACCESS: "access",
  REJECTED: "rejected",
  DEFAULT: "default",
};

const DOCUMENT_TYPES = {
  ID_CARD: "id_card",
  PASSPORT: "passport",
};

const FILE_CONSTRAINTS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/jpg", "image/png"],
};

// Custom Hook สำหรับจัดการ Form
const useIdentityForm = (sellerInfo_data) => {
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    documentType: DOCUMENT_TYPES.ID_CARD,
    birthDate: "",
    expiryDate: "",
    address: "",
  });

  const [files, setFiles] = useState({
    idCardImage: null,
    selfieImage: null,
  });

  const [previews, setPreviews] = useState({
    idCardImage: null,
    selfieImage: null,
  });

  const [errors, setErrors] = useState({});

  // Initialize form data
  useEffect(() => {
    if (sellerInfo_data?.verificationData) {
      setFormData((prev) => ({
        ...prev,
        ...sellerInfo_data.verificationData,
      }));
    }

    if (sellerInfo_data?.idCardImage) {
      setPreviews((prev) => ({
        ...prev,
        idCardImage: sellerInfo_data.idCardImage,
      }));
    }

    if (sellerInfo_data?.selfieImage) {
      setPreviews((prev) => ({
        ...prev,
        selfieImage: sellerInfo_data.selfieImage,
      }));
    }
  }, [sellerInfo_data]);

  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: null,
        }));
      }
    },
    [errors]
  );

  return {
    formData,
    files,
    previews,
    errors,
    setFiles,
    setPreviews,
    setErrors,
    handleInputChange,
  };
};

// Validation utilities
const validateFile = (file) => {
  if (!file) return "ກະລຸນາເລືອກຮູບ";
  if (!FILE_CONSTRAINTS.ALLOWED_TYPES.includes(file.type)) {
    return "ກະລຸນາເລືອກຮູບພາບ (JPG, PNG) ເທົ່ານັ້ນ";
  }
  if (file.size > FILE_CONSTRAINTS.MAX_SIZE) {
    return "ຂະໜາດໄຟລບໍ່ເກີນ 5MB";
  }
  return null;
};

const validateForm = (formData) => {
  const errors = {};

  if (!formData.fullName.trim()) {
    errors.fullName = "ກະລຸນາລະບຸຊື່ ແລະ ນາມສະກຸນ";
  }

  if (!formData.idNumber.trim()) {
    errors.idNumber = "ກະລຸນາລະບຸເລກທີ່ເອກະສານ";
  } else {
    const expectedLength =
      formData.documentType === DOCUMENT_TYPES.ID_CARD ? 12 : 9;
    if (formData.idNumber.length !== expectedLength) {
      errors.idNumber = `ໝາຍເລກເອກະສານຕ້ອງມີ ${expectedLength} ຫຼັກ`;
    }
  }

  if (!formData.birthDate) {
    errors.birthDate = "ກະລຸນາເລືອກວັນເກີດ";
  }

  if (!formData.expiryDate) {
    errors.expiryDate = "ກະລຸນາເລືອກວັນໝົດອາຍຸ";
  }

  if (!formData.address.trim()) {
    errors.address = "ກະລຸນາລະບຸທີ່ຢູ່";
  }

  // Validate dates
  if (formData.birthDate && formData.expiryDate) {
    const birthDate = new Date(formData.birthDate);
    const expiryDate = new Date(formData.expiryDate);
    const today = new Date();

    if (birthDate >= today) {
      errors.birthDate = "ວັນເກິດຕ້ອງເປັນວັນທີ່ຜ່ານມາແລ້ວ";
    }

    if (expiryDate <= today) {
      errors.expiryDate = "ເອກະສານໝົດອາຍຸແລ້ວ";
    }
  }

  return errors;
};

// Status Alert Component
const StatusAlert = ({ status }) => {
  const alertConfig = useMemo(() => {
    switch (status) {
      case VERIFICATION_STATUS.ACCESS:
        return {
          status: "success",
          title: "ຢືນຢັນຕົວຕົນສຳເລັດ",
          description: "ບັນຊີຂອງທ່ານໄດ້ຮັບການຢືນຢັນແລ້ວ",
        };
      case VERIFICATION_STATUS.PENDING:
        return {
          status: "warning",
          title: "ກຳລັງກວດສອບເອກະສານ",
          description:
            "ພວກເຮົາໄດ້ຮັບເອກະສານຂອງທ່ານແລ້ວ ກຳລັງກວດສອບແລະຈະແຈ້ງຜົນພາຍໃນ 1-3 ວັນທຳການ",
        };
      case VERIFICATION_STATUS.REJECTED:
        return {
          status: "error",
          title: "ການຢືນຢັນບໍ່ສຳເລັດ",
          description:
            "ເອກະສານທີ່ສົ່ງມາບໍ່ຖືກຕ້ອງຫຼືບໍ່ຊັດເຈນ ກະລຸນາອັບໂຫລດເອກະສານໃໝ່",
        };
      default:
        return {
          status: "warning",
          title: "ກະລຸນາຢືນຢັນຕົວຕົນ",
          description: "ກະລຸນາອັບໂຫລດ ແລະ ລະບຸຂໍ້ມູນໃຫ້ຄົບຖ້ວນ",
        };
    }
  }, [status]);

  return (
    <Alert status={alertConfig.status} borderRadius="md">
      <AlertIcon />
      <Box>
        <AlertTitle>{alertConfig.title}</AlertTitle>
        <AlertDescription>{alertConfig.description}</AlertDescription>
      </Box>
    </Alert>
  );
};

// Image Upload Component
const ImageUpload = ({ id, label, preview, onUpload, error }) => {
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <VStack spacing={4} align="stretch">
        {preview && (
          <Box textAlign="center">
            <Image
              src={preview}
              alt={label}
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
          onChange={onUpload}
          style={{ display: "none" }}
          id={id}
        />
        <Button
          as="label"
          htmlFor={id}
          leftIcon={<Icon />}
          colorScheme="blue"
          variant="outline"
          cursor="pointer"
          size="lg"
        >
          {preview ? "ປ່ຽນຮູບ" : "ອັບໂຫລດ"}
        </Button>
        {error && (
          <Text color="red.500" fontSize="sm">
            {error}
          </Text>
        )}
      </VStack>
    </FormControl>
  );
};

// Main Component
const IdentityForm = ({ handleSubmitDocument, sellerInfo_data }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { successMessage, errorMessage } = useSelector((state) => state?.auth);

  const [isLoading, setIsLoading] = useState(false);
  const textColor = useColorModeValue("gray.600", "gray.300");

  const {
    formData,
    files,
    previews,
    errors,
    setFiles,
    setPreviews,
    setErrors,
    handleInputChange,
  } = useIdentityForm(sellerInfo_data);

  const verificationStatus =
    sellerInfo_data?.verificationStatus || VERIFICATION_STATUS.DEFAULT;
  const isFormDisabled = verificationStatus === VERIFICATION_STATUS.ACCESS;

  // Initialize data
  useEffect(() => {
    dispatch(get_user());
    dispatch(getVerifyUser());
  }, [dispatch]);

  // Handle toast messages
  useEffect(() => {
    if (errorMessage) {
      toast({
        title: "ເກິດຂໍ້ຜິດພາດ",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      dispatch(messageClear());
    }

    if (successMessage) {
      toast({
        title: "ສຳເລັດ",
        description: successMessage,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      dispatch(messageClear());
    }
  }, [errorMessage, successMessage, dispatch, toast]);

  // Handle image upload
  const handleImageUpload = useCallback(
    (type) => (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const error = validateFile(file);
      if (error) {
        setErrors((prev) => ({ ...prev, [type]: error }));
        toast({
          title: "ไฟล์ไม่ถูกต้อง",
          description: error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Clear error
      setErrors((prev) => ({ ...prev, [type]: null }));

      // Set file
      setFiles((prev) => ({ ...prev, [type]: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => ({ ...prev, [type]: e.target.result }));
      };
      reader.readAsDataURL(file);
    },
    [setErrors, setFiles, setPreviews, toast]
  );

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast({
        title: "ຂໍ້ມູນບໍ່ຄົບຖ້ວນ",
        description: "ກະລຸນາກວດສອບຂໍ້ມູນໃຫ້ຄົບຖ້ວນ",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Check required images for new submissions
    if (verificationStatus !== VERIFICATION_STATUS.ACCESS) {
      if (!files.idCardImage && !previews.idCardImage) {
        toast({
          title: "ກະລຸນາອັບໂຫລດເອກະສານ",
          description: "ກະລຸນາອັບໂຫລດເອກະສານ",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (!files.selfieImage && !previews.selfieImage) {
        toast({
          title: "ກະລຸນາເຊວຟີ",
          description: "ກະລຸນາອັບໂຫລດເຊວຟິກັບເອກະສານ",
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
      const processedData = {
        fullName: String(formData.fullName || "").trim(),
        idNumber: String(formData.idNumber || "").trim(),
        documentType: ["id_card", "passport"].includes(formData.documentType)
          ? formData.documentType
          : "id_card",
        birthDate: formData.birthDate ? new Date(formData.birthDate) : null,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
        address: String(formData.address || "").trim(),
      };

      const submitData = new FormData();
      submitData.append("verificationData", JSON.stringify(processedData));
      submitData.append("verificationStatus", VERIFICATION_STATUS.PENDING);

      if (files.idCardImage) {
        submitData.append("idCardImage", files.idCardImage);
      }
      if (files.selfieImage) {
        submitData.append("selfieImage", files.selfieImage);
      }

      // Submit based on current status
      if (verificationStatus === VERIFICATION_STATUS.REJECTED) {
        await dispatch(
          updateSellerReject({
            formData: submitData,
            id: sellerInfo_data?._id,
          })
        );
      } else {
        await dispatch(verifyUserCreate(submitData));
      }

      await dispatch(getVerifyUser());
      handleSubmitDocument();
    } catch (error) {
      console.error("Error submitting verification:", error);
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: "ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit}>
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
              </Text>
            </Box>

            {/* Status Alert */}
            <StatusAlert status={verificationStatus} />

            {/* Basic Information */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isInvalid={!!errors.fullName}>
                <FormLabel>ຊື່ ແລະ ນາມສະກຸນ</FormLabel>
                <Input
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder="ລະບຸຊື່-ນາມສະກຸນໃຫ້ກົງກັບບັດ"
                  isDisabled={isFormDisabled}
                />
                {errors.fullName && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.fullName}
                  </Text>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>ປະເພດເອກະສານ</FormLabel>
                <Select
                  value={formData.documentType}
                  onChange={(e) =>
                    handleInputChange("documentType", e.target.value)
                  }
                  isDisabled={isFormDisabled}
                >
                  <option value={DOCUMENT_TYPES.ID_CARD}>ບັດປະຊາຊົນ</option>
                  <option value={DOCUMENT_TYPES.PASSPORT}>ໜັງສືເດີນທາງ</option>
                </Select>
              </FormControl>
            </SimpleGrid>

            <FormControl isInvalid={!!errors.idNumber}>
              <FormLabel>
                {formData.documentType === DOCUMENT_TYPES.ID_CARD
                  ? "ເລກທີ່ບັດປະຊາຊົນ"
                  : "ເລກທີ່ໜັງສືເດີນທາງ"}
              </FormLabel>
              <Input
                value={formData.idNumber}
                onChange={(e) => handleInputChange("idNumber", e.target.value)}
                placeholder={
                  formData.documentType === DOCUMENT_TYPES.ID_CARD
                    ? "1234567890123"
                    : "A1234567"
                }
                maxLength={
                  formData.documentType === DOCUMENT_TYPES.ID_CARD ? 12 : 9
                }
                isDisabled={isFormDisabled}
              />
              {errors.idNumber && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.idNumber}
                </Text>
              )}
            </FormControl>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <FormControl isInvalid={!!errors.birthDate}>
                <FormLabel>ວັນເກີດ</FormLabel>
                <Input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) =>
                    handleInputChange("birthDate", e.target.value)
                  }
                  isDisabled={isFormDisabled}
                />
                {errors.birthDate && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.birthDate}
                  </Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.expiryDate}>
                <FormLabel>ວັນໝົດອາຍຸ</FormLabel>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    handleInputChange("expiryDate", e.target.value)
                  }
                  isDisabled={isFormDisabled}
                />
                {errors.expiryDate && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.expiryDate}
                  </Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.address}>
                <FormLabel>ທີ່ຢູ່</FormLabel>
                <Input
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="ບ້ານ......ເມືອງ.....ແຂວງ......"
                  isDisabled={isFormDisabled}
                />
                {errors.address && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errors.address}
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
                <ImageUpload
                  id="id-card-upload"
                  label={`ຮູບຖ່າຍ${
                    formData.documentType === DOCUMENT_TYPES.ID_CARD
                      ? "ບັດປະຊາຊົນ"
                      : "ໜັງສືເດີນທາງ"
                  }`}
                  preview={previews.idCardImage}
                  onUpload={handleImageUpload("idCardImage")}
                  error={errors.idCardImage}
                  icon={FaCloudUploadAlt}
                />

                <ImageUpload
                  id="selfie-upload"
                  label="ຮູບເຊວຟີຄູ່ກັບເອກະສານ"
                  preview={previews.selfieImage}
                  onUpload={handleImageUpload("selfieImage")}
                  error={errors.selfieImage}
                  icon={FaCamera}
                />
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
                <Text>• ຂໍ້ຄວາມ ແລະ ຮູບໃນເອກະສານຕ້ອງມອງເຫັນຊັດເຈນ</Text>
                <Text>• ບໍ່ຄວນມີເງົາຫຼືແສງສະທ້ອນໃນຮູບ</Text>
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
                loadingText="ກຳລັງສົ່ງຂໍ້ມູນ..."
                leftIcon={<FaShieldAlt />}
                minW="250px"
                isDisabled={isFormDisabled}
              >
                {verificationStatus === VERIFICATION_STATUS.ACCESS
                  ? "ຍືນຢັນແລ້ວ"
                  : "ສົ່ງຂໍ້ມູນຢືນຢັນ"}
              </Button>
            </Box>
          </VStack>
        </form>
      </CardBody>
    </Card>
  );
};

export default IdentityForm;
