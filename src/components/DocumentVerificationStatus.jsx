import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  Spinner,
  Center,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Icon,
  useColorModeValue,
  Circle,
  Progress,
  Heading,
} from "@chakra-ui/react";
import { CheckCircleIcon, TimeIcon, WarningIcon } from "@chakra-ui/icons";
import IdentityForm from "./IdentityForm";
import VerificationSuccess from "./VerificationSuccess";

// Constants
const VERIFICATION_STATUSES = {
  ACCESS: "access",
  PENDING: "pending",
  REJECTED: "rejected",
  DEFAULT: "default",
};

// Custom Hook สำหรับ Animation
const useLoadingAnimation = (isActive) => {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, [isActive]);

  return animationStep;
};

// Loading Animation Component
const LoadingDots = ({ step }) => (
  <Text as="span" color="blue.500">
    {".".repeat(step)}
  </Text>
);

// Verification Status Screen Component
const VerificationStatusScreen = ({ status }) => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const primaryColor = useColorModeValue("blue.500", "blue.400");

  const animationStep = useLoadingAnimation(
    status === VERIFICATION_STATUSES.PENDING
  );

  // Status configuration
  const statusConfig = useMemo(() => {
    switch (status) {
      case VERIFICATION_STATUSES.PENDING:
        return {
          title: "ກຳລັງກວດສອບເອກະສານ",
          subtitle: "ທາງທີມງານກຳລັງກວດສອບເອກະສານຂອງທ່ານ",
          icon: TimeIcon,
          color: primaryColor,
          alertStatus: "info",
          alertTitle: "ກວດສອບເອກະສານ",
          alertDescription:
            "ເຮົາຈະສົ່ງການແຈ້ງເຕືອນຜົນການກວດສອບໄປຍັງອີເມວຂອງທ່ານ ຫາກມີຂໍ້ສົງໄສສາມາດຕິດຕໍ່ທີມສະໜັບສໜູນໄດ້ຕະຫລອດ 24/7",
          statusText: "ກຳລັງກວດສອບ",
          estimatedTime: "24 ຊົ່ວໂມງ",
          progress: 75,
        };
      case VERIFICATION_STATUSES.REJECTED:
        return {
          title: "ເອກະສານບໍ່ຜ່ານການກວດສອບ",
          subtitle: "ກະລຸນາກວດສອບເອກະສານແລະອັບໂຫລດໃໝ່",
          icon: WarningIcon,
          color: "red.500",
          alertStatus: "error",
          alertTitle: "ການກວດສອບບໍ່ຜ່ານ",
          alertDescription:
            "ເອກະສານທີ່ສົ່ງມາບໍ່ຖືກຕ້ອງ ກະລຸນາກວດສອບແລະອັບໂຫລດໃໝ່",
          statusText: "ຕ້ອງແກ້ໄຂ",
          estimatedTime: "-",
          progress: 25,
        };
      default:
        return {
          title: "ກະລຸນາສົ່ງເອກະສານ",
          subtitle: "ອັບໂຫລດເອກະສານເພື່ອເລີ່ມຂັ້ນຕອນຢືນຢັນ",
          icon: TimeIcon,
          color: primaryColor,
          alertStatus: "warning",
          alertTitle: "ລໍຖ້າການສົ່ງເອກະສານ",
          alertDescription: "ກະລຸນາອັບໂຫລດເອກະສານຢືນຢັນຕົວຕົນເພື່ອດຳເນີນການຕໍ່",
          statusText: "ຍັງບໍ່ໄດ້ສົ່ງ",
          estimatedTime: "-",
          progress: 0,
        };
    }
  }, [status, primaryColor]);

  return (
    <Center minH="100vh" bg={bgColor}>
      <Box maxW="500px" w="full" px={4}>
        <VStack spacing={8}>
          {/* Icon และ Progress Ring */}
          <Box position="relative">
            <Box position="relative" w="120px" h="120px">
              {/* วงกลมนอก (Glow Effect) */}
              <Circle
                size="120px"
                bgGradient={`linear(to-br, ${statusConfig.color}20, ${statusConfig.color}40)`}
                boxShadow={`0 0 20px ${statusConfig.color}80`}
              />

              {/* วงกลมกลาง */}
              <Circle
                size="90px"
                bg={`${statusConfig.color}20`}
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="md"
              >
                {status === VERIFICATION_STATUSES.PENDING ? (
                  <Spinner
                    thickness="4px"
                    speed="0.8s"
                    emptyColor="gray.200"
                    color={statusConfig.color}
                    size="xl"
                  />
                ) : (
                  <Icon
                    as={statusConfig.icon}
                    boxSize={10}
                    color={statusConfig.color}
                  />
                )}
              </Circle>
            </Box>

            {/* Progress Ring */}
            <Box position="absolute" top="0" left="0" w="120px" h="120px">
              <Progress
                value={statusConfig.progress}
                size="lg"
                colorScheme={
                  status === VERIFICATION_STATUSES.REJECTED ? "red" : "blue"
                }
                bg="transparent"
                sx={{
                  "& > div": {
                    borderRadius: "50%",
                  },
                }}
              />
            </Box>
          </Box>

          {/* หัวข้อหลัก */}
          <Box textAlign="center">
            <Heading
              fontFamily="Noto Sans Lao, serif"
              fontSize="2xl"
              fontWeight="bold"
              color={textColor}
              mb={2}
            >
              {statusConfig.title}
              {status === VERIFICATION_STATUSES.PENDING && (
                <LoadingDots step={animationStep} />
              )}
            </Heading>
            <Text fontSize="lg" color="gray.500" lineHeight="tall">
              {statusConfig.subtitle}
            </Text>
          </Box>

          {/* Alert Box */}
          <Alert
            status={statusConfig.alertStatus}
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            py={6}
            rounded="lg"
            bg={useColorModeValue(
              statusConfig.alertStatus === "error" ? "red.50" : "blue.50",
              statusConfig.alertStatus === "error" ? "red.900" : "blue.900"
            )}
            border="1px"
            borderColor={useColorModeValue(
              statusConfig.alertStatus === "error" ? "red.200" : "blue.200",
              statusConfig.alertStatus === "error" ? "red.600" : "blue.600"
            )}
          >
            <AlertIcon boxSize="40px" mr={0} mb={4} />
            <AlertTitle mt={0} mb={2} fontSize="lg" fontWeight="semibold">
              {statusConfig.alertTitle}
            </AlertTitle>
            <AlertDescription maxWidth="sm" fontSize="md">
              {statusConfig.alertDescription}
            </AlertDescription>
          </Alert>

          {/* Status Information */}
          <Flex
            w="full"
            justify="space-between"
            p={6}
            bg={useColorModeValue("white", "gray.800")}
            rounded="lg"
            border="1px"
            borderColor={borderColor}
            shadow="sm"
          >
            <Box>
              <Text fontSize="sm" color="gray.500" mb={1}>
                ສະຖານະ
              </Text>
              <Text
                fontSize="md"
                fontWeight="semibold"
                color={statusConfig.color}
              >
                {statusConfig.statusText}
              </Text>
            </Box>
            <Box textAlign="right">
              <Text fontSize="sm" color="gray.500" mb={1}>
                ເວລາໂດຍປະມານ
              </Text>
              <Text fontSize="md" fontWeight="semibold" color={textColor}>
                {statusConfig.estimatedTime}
              </Text>
            </Box>
          </Flex>

          {/* Additional Actions for Rejected Status */}
          {status === VERIFICATION_STATUSES.REJECTED && (
            <Button
              colorScheme="red"
              variant="outline"
              size="lg"
              onClick={() => window.location.reload()}
            >
              ອັບໂຫລດເອກະສານໃໝ່
            </Button>
          )}
        </VStack>
      </Box>
    </Center>
  );
};

// Main Component
const DocumentVerificationStatus = ({ sellerInfo_data }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // จำลองการส่งเอกສาร
  const handleSubmitDocument = () => {
    setIsSubmitted(true);
  };

  const currentStatus = sellerInfo_data?.verificationStatus;

  // Determine which component to render
  const renderComponent = () => {
    // หากยืนยันสำเร็จแล้ว
    if (currentStatus === VERIFICATION_STATUSES.ACCESS) {
      return <VerificationSuccess />;
    }

    // หากถูกปฏิเสธ
    if (currentStatus === VERIFICATION_STATUSES.REJECTED) {
      return (
        <IdentityForm
          sellerInfo_data={sellerInfo_data}
          handleSubmitDocument={handleSubmitDocument}
        />
      );
    }

    // หากกำลังรอการอนุมัติหรือเพิ่งส่งเอกสาร
    if (isSubmitted || currentStatus === VERIFICATION_STATUSES.PENDING) {
      return (
        <VerificationStatusScreen status={VERIFICATION_STATUSES.PENDING} />
      );
    }

    // หากยังไม่ได้ส่งเอกสาร (default case)
    return (
      <IdentityForm
        sellerInfo_data={sellerInfo_data}
        handleSubmitDocument={handleSubmitDocument}
      />
    );
  };

  return <Box>{renderComponent()}</Box>;
};

export default DocumentVerificationStatus;
