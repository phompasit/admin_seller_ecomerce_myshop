import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  useToast,
  Container,
  Heading,
  Alert,
  AlertIcon,
  AlertDescription,
  CircularProgress,
  CircularProgressLabel,
  Divider,
  useColorModeValue,
  PinInput,
  PinInputField,
  Icon,
} from "@chakra-ui/react";
import { CheckIcon, TimeIcon, EmailIcon } from "@chakra-ui/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_otp, send_otp, verify_otp } from "../hooks/reducer/auth_reducer";

const OTPVerification = () => {
  // Redux state
  const { otpExpires, resetuuid } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { phone, uuid } = useParams();
  // Local state
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState();
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  // Color mode values
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  useEffect(() => {
    if (phone) {
      dispatch(get_otp({ phone }));
    }
  }, [dispatch, phone, otpExpires]);
  // Fetch OTP on mount - Fixed: removed dependency to prevent infinite loop
  useEffect(() => {
    // ถ้ายัง undefined หรือ null → รอ
    if (resetuuid === undefined || resetuuid === null) return;

    // ถ้ามีค่าแต่ไม่ตรง uuid → redirect
    if (resetuuid !== uuid) {
      navigate("/");
    }
  }, [resetuuid, uuid, navigate]);

  // Sync timeLeft with otpExpires from Redux
  useEffect(() => {
    if (otpExpires) {
      // Convert ISO string to Date object
      const expiryTime = new Date(otpExpires);
      const currentTime = new Date();

      // Calculate difference in milliseconds, then convert to seconds
      const diffInMs = expiryTime - currentTime;
      const diffInSeconds = Math.floor(diffInMs / 1000);

      // Set timeLeft (minimum 0, in case it's already expired)
      setTimeLeft(Math.max(0, diffInSeconds));
    }
  }, [otpExpires]);

  // Timer effect - only runs when timeLeft > 0
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    // navigate("/forgot-password");
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time display - memoized
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  // Check if timer is critical (30 seconds or less)
  const isTimerCritical = useMemo(() => timeLeft <= 30, [timeLeft]);
  const isTimerDanger = useMemo(() => timeLeft <= 10, [timeLeft]);

  // Handle OTP change
  const handleOtpChange = useCallback((value) => {
    setOtp(value);
    setError("");
    setIsComplete(value.length === 6);
  }, []);

  // Handle verification
  const handleVerify = useCallback(async () => {
    if (otp.length !== 6) {
      setError("ກະລຸນາໃສ່ລະຫັດ 6 ໂຕເລກໃຫ້ຄົບ (Please enter all 6 digits)");
      return;
    }

    if (timeLeft <= 0) {
      setError(
        "ລະຫັດໝົດອາຍຸແລ້ວ ກະລຸນາສົ່ງລະຫັດໃໝ່ (Code expired, please resend)"
      );
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const result = await dispatch(verify_otp({ phone, otp, uuid }));
      if (result.type === "auth/verify_otp/fulfilled") {
        toast({
          title: "ຢືນຢັນສຳເລັດ! (Verification Successful!)",
          description:
            "ລະຫັດ OTP ຖືກຕ້ອງ ການຢືນຢັນຕົວຕົນເສັດສິ້ນ (OTP verified successfully)",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setIsComplete(true);
      } else {
        setError(
          result.payload.message ||
            "ລະຫັດ OTP ບໍ່ຖືກຕ້ອງ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ (Invalid OTP, please try again)"
        );
      }
    } catch (error) {
      setError(
        error.message ||
          "ລະຫັດ OTP ບໍ່ຖືກຕ້ອງ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ (Invalid OTP, please try again)"
      );
      setOtp("");
      setIsComplete(false);

      toast({
        title: "ລະຫັດ OTP ບໍ່ຖືກຕ້ອງ (Invalid OTP)",
        description:
          "ກະລຸນາກວດສອບລະຫັດແລະລອງໃໝ່ອີກຄັ້ງ (Please check the code and try again)",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsVerifying(false);
    }
  }, [otp, phone, timeLeft, dispatch, toast]);

  // Handle resend OTP
  const handleResendOtp = useCallback(async () => {
    if (timeLeft > 0) return;

    setIsResending(true);
    setError("");
    setOtp("");
    setIsComplete(false);

    try {
      const result = await dispatch(send_otp({ phone, reset: "reset" }));
      if (result.type === "auth/verify_otp/fulfilled") {
        toast({
          title: "ສົ່ງລະຫັດໃໝ່ແລ້ວ (Code Resent)",
          description: `ລະຫັດ OTP ໃໝ່ຖືກສົ່ງໄປຍັງ ${phone} (New OTP sent to ${phone})`,
          status: "info",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        await dispatch(get_otp({ phone }));
      } else {
        toast({
          title: "ເກີດຂໍ້ຜິດພາດ (Error)",
          description:
            result.payload.message ||
            "ບໍ່ສົ່ງລະຫັດ OTP ກະລຸນາລອງໃໝ່ອີກຄັ້ງ (Failed to reset password)",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ (Error Occurred)",
        description:
          error.message ||
          "ບໍ່ສາມາດສົ່ງລະຫັດໃໝ່ໄດ້ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ (Cannot resend code, please try again)",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsResending(false);
    }
  }, [phone, timeLeft, dispatch, toast]);

  // Handle Enter key press
  const handleKeyPress = useCallback(
    (e) => {
      if (
        e.key === "Enter" &&
        otp.length === 6 &&
        !isVerifying &&
        timeLeft > 0
      ) {
        handleVerify();
      }
    },
    [otp.length, isVerifying, timeLeft, handleVerify]
  );

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="md" centerContent>
        <Box
          bg={cardBg}
          p={8}
          rounded="xl"
          shadow="lg"
          w="full"
          maxW="400px"
          border="1px"
          borderColor={borderColor}
        >
          <VStack spacing={6}>
            {/* Header */}
            <VStack spacing={3} textAlign="center">
              <Box
                p={3}
                bg="blue.50"
                rounded="full"
                border="2px"
                borderColor="blue.200"
              >
                <Icon as={EmailIcon} w={6} h={6} color="blue.500" />
              </Box>
              <Heading
                fontFamily={"Noto Sans Lao, serif"}
                size="lg"
                color={textColor}
              >
                ຢືນຢັນຕົວຕົນຂອງທ່ານ
              </Heading>
              <Text color={textColor} fontSize="sm">
                ພວກເຮົາໄດ້ສົ່ງລະຫັດ 6 ໂຕເລກໄປຍັງ
              </Text>
              <Text color="blue.500" fontWeight="semibold" fontSize="sm">
                {phone}
              </Text>
            </VStack>

            <Divider />

            {/* OTP Input */}
            <VStack spacing={4} w="full">
              <Text fontSize="sm" color={textColor} textAlign="center">
                ໃສ່ລະຫັດ 6 ໂຕເລກ (Enter 6-digit code)
              </Text>

              <HStack spacing={2} justify="center">
                <PinInput
                  value={otp}
                  onChange={handleOtpChange}
                  onComplete={handleVerify}
                  size="lg"
                  manageFocus
                  autoFocus
                  onKeyDown={handleKeyPress}
                  isDisabled={isVerifying || timeLeft <= 0}
                  placeholder=""
                >
                  {[...Array(6)].map((_, i) => (
                    <PinInputField
                      key={i}
                      w={12}
                      h={12}
                      fontSize="xl"
                      fontWeight="bold"
                      textAlign="center"
                      border="2px"
                      borderColor={error ? "red.300" : "gray.300"}
                      _focus={{
                        borderColor: error ? "red.500" : "blue.500",
                        boxShadow: error
                          ? "0 0 0 1px var(--chakra-colors-red-500)"
                          : "0 0 0 1px var(--chakra-colors-blue-500)",
                      }}
                      _hover={{
                        borderColor: error ? "red.400" : "gray.400",
                      }}
                      bg={cardBg}
                      rounded="lg"
                    />
                  ))}
                </PinInput>
              </HStack>

              {/* Error Display */}
              {error && (
                <Alert status="error" rounded="lg" fontSize="sm">
                  <AlertIcon />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Expired Warning */}
              {timeLeft <= 0 && !error && (
                <Alert status="warning" rounded="lg" fontSize="sm">
                  <AlertIcon />
                  <AlertDescription>
                    ລະຫັດໝົດອາຍຸແລ້ວ ກະລຸນາສົ່ງລະຫັດໃໝ່ (Code expired, please
                    resend)
                  </AlertDescription>
                </Alert>
              )}
            </VStack>

            {/* Timer */}
            <VStack spacing={2}>
              <HStack spacing={2} align="center">
                <Icon
                  as={TimeIcon}
                  color={isTimerCritical ? "red.500" : "gray.500"}
                />
                <Text
                  fontSize="sm"
                  color={isTimerCritical ? "red.500" : textColor}
                  fontWeight="medium"
                >
                  ລະຫັດໝົດອາຍຸໃນ {formatTime(timeLeft)} ນາທີ
                </Text>
              </HStack>

              {isTimerCritical && timeLeft > 0 && (
                <CircularProgress
                  value={(timeLeft / 90) * 100}
                  size="40px"
                  color={isTimerDanger ? "red.400" : "orange.400"}
                  thickness="8px"
                >
                  <CircularProgressLabel fontSize="xs">
                    {timeLeft}
                  </CircularProgressLabel>
                </CircularProgress>
              )}
            </VStack>

            {/* Action Buttons */}
            <VStack spacing={3} w="full">
              <Button
                colorScheme="blue"
                size="lg"
                w="full"
                onClick={handleVerify}
                isLoading={isVerifying}
                loadingText="ກຳລັງຢືນຢັນ... (Verifying...)"
                isDisabled={otp.length !== 6 || timeLeft <= 0}
                leftIcon={isComplete ? <CheckIcon /> : null}
                rounded="lg"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                transition="all 0.2s"
              >
                {isComplete
                  ? "ຢືນຢັນ (Verify)"
                  : "ໃສ່ລະຫັດໃຫ້ຄົບ 6 ໂຕເລກ (Enter 6 digits)"}
              </Button>

              <Button
                variant="ghost"
                size="md"
                onClick={handleResendOtp}
                isLoading={isResending}
                loadingText="ກຳລັງສົ່ງ... (Sending...)"
                isDisabled={timeLeft > 0}
                color="blue.500"
                _hover={{
                  bg: "blue.50",
                }}
                rounded="lg"
              >
                {timeLeft > 0
                  ? `ສົ່ງລະຫັດໃໝ່ (${formatTime(timeLeft)})`
                  : "ສົ່ງລະຫັດໃໝ່ (Resend Code)"}
              </Button>
            </VStack>

            {/* Help Text */}
            <Text fontSize="xs" color="gray.500" textAlign="center">
              ບໍ່ໄດ້ຮັບລະຫັດບໍ? ກວດສອບໂຟນເດີ spam ຫຼື
              <br />
              ລໍຖ້າຈົນກວ່າຈະສາມາດສົ່ງລະຫັດໃໝ່ໄດ້
              <br />
              (Didn't receive code? Check spam folder or wait to resend)
            </Text>
          </VStack>
        </Box>

        {/* Demo Instructions */}
        <Box mt={6} p={4} bg="blue.50" rounded="lg" maxW="400px">
          <Button
            variant="link"
            colorScheme="brand"
            onClick={() => {
              navigate("/");
              toast({
                title: "ກັບໄປໜ້າເຂົ້າສູ່ລະບົບ",
                description: "Returning to login...",
                status: "info",
                duration: 2000,
              });
            }}
          >
            ← ກັບໄປໜ້າເຂົ້າສູ່ລະບົບ (Back to Login)
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default OTPVerification;
