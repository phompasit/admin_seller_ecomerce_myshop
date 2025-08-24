import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import { CheckCircleIcon, TimeIcon } from "@chakra-ui/icons";
import IdentityForm from "./IdentityForm";
import VerificationSuccess from "./VerificationSuccess";

const DocumentVerificationStatus = ({ sellerInfo_data }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  // สี theme สำหรับ light/dark mode
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const primaryColor = useColorModeValue("blue.500", "blue.400");
  
  // จำลองการส่งเอกสาร
  const handleSubmitDocument = () => {
    setIsSubmitted(true);
  };

  // Animation สำหรับ loading dots
  useEffect(() => {
    if (isSubmitted) {
      const interval = setInterval(() => {
        setAnimationStep((prev) => (prev + 1) % 4);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isSubmitted]);

  // หน้าจอกำลังตรวจสอบ
  const VerificationStatusScreen = () => (
    <Center minH="100vh" bg={bgColor}>
      <Box>
        <VStack spacing={8}>
          {/* ไอคอนและ Spinner */}
          <Box position="relative">
            <Circle size="120px" bg={primaryColor} opacity={0.1}>
              <Circle size="80px" bg={primaryColor} opacity={0.2}>
                <Spinner
                  thickness="4px"
                  speed="0.8s"
                  emptyColor="gray.200"
                  color={primaryColor}
                  size="xl"
                />
              </Circle>
            </Circle>
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
            >
              <Icon as={TimeIcon} boxSize={8} color={primaryColor} />
            </Box>
          </Box>

          {/* หัวข้อหลัก */}
          <Box textAlign="center">
            <Text fontSize="3xl" fontWeight="bold" color={textColor} mb={2}>
              กำลังตรวจสอบเอกสารของคุณ
              <Text as="span" color={primaryColor}>
                {".".repeat(animationStep)}
              </Text>
            </Text>
            <Text fontSize="lg" color="gray.500" lineHeight="tall">
              ทางทีมงานกำลังตรวจสอบข้อมูลของคุณ โปรดรอผลภายใน 24 ชั่วโมง
            </Text>
          </Box>

          {/* Alert box */}
          <Alert
            status="info"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="auto"
            py={6}
            rounded="lg"
            bg={useColorModeValue("blue.50", "blue.900")}
            border="1px"
            borderColor={useColorModeValue("blue.200", "blue.600")}
          >
            <AlertIcon boxSize="40px" mr={0} mb={4} />
            <AlertTitle mt={0} mb={2} fontSize="lg" fontWeight="semibold">
              การตรวจสอบเอกสาร
            </AlertTitle>
            <AlertDescription maxWidth="sm" fontSize="md">
              เราจะส่งการแจ้งเตือนผลการตรวจสอบไปยังอีเมลของคุณ
              หากมีข้อสงสัยสามารถติดต่อทีมสนับสนุนได้ตลอด 24 ชั่วโมง
            </AlertDescription>
          </Alert>

          {/* ข้อมูลเพิ่มเติม */}
          <Flex
            w="full"
            justify="space-between"
            p={6}
            bg={useColorModeValue("gray.50", "gray.700")}
            rounded="lg"
            border="1px"
            borderColor={borderColor}
          >
            <Box>
              <Text fontSize="sm" color="gray.500" mb={1}>
                สถานะ
              </Text>
              <Text fontSize="md" fontWeight="semibold" color={primaryColor}>
                กำลังตรวจสอบ
              </Text>
            </Box>
            <Box textAlign="right">
              <Text fontSize="sm" color="gray.500" mb={1}>
                เวลาโดยประมาณ
              </Text>
              <Text fontSize="md" fontWeight="semibold" color={textColor}>
                24 ชั่วโมง
              </Text>
            </Box>
          </Flex>
        </VStack>
      </Box>
    </Center>
  );

  // ถ้าไม่มีข้อมูล sellerInfo_data ให้แสดง loading
  if (!sellerInfo_data) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="blue.500" />
        <Text mt={4} fontSize="lg" color="gray.500">
          กำลังโหลดข้อมูลผู้ขาย...
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      {sellerInfo_data?.verificationStatus === "access" ? (
        <VerificationSuccess />
      ) : sellerInfo_data?.verificationStatus === "rejected" ? (
        // เพิ่ม sellerInfo_data ที่หายไป
        <IdentityForm 
          sellerInfo_data={sellerInfo_data}
          handleSubmitDocument={handleSubmitDocument} 
        />
      ) : isSubmitted || sellerInfo_data?.verificationStatus === "pending" ? (
        <VerificationStatusScreen />
      ) : (
        // ตรวจสอบให้แน่ใจว่าส่ง sellerInfo_data ไปเสมอ
        <IdentityForm
          sellerInfo_data={sellerInfo_data}
          handleSubmitDocument={handleSubmitDocument}
        />
      )}
    </Box>
  );
};

export default DocumentVerificationStatus;