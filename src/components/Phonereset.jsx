import React, { useState } from "react";
import {
  ChakraProvider,
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  InputGroup,
  InputLeftAddon,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  useToast,
  Icon,
  Flex,
  extendTheme,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { send_otp } from "../hooks/reducer/auth_reducer";
import { useNavigate } from "react-router-dom";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#e3f2fd",
      100: "#bbdefb",
      200: "#90caf9",
      300: "#64b5f6",
      400: "#42a5f5",
      500: "#2196f3",
      600: "#1e88e5",
      700: "#1976d2",
      800: "#1565c0",
      900: "#0d47a1",
    },
  },
});

const PhoneIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
    />
  </Icon>
);

const Phonereset = () => {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const validateLaosPhone = (number) => {
    // Laos phone numbers: 20XXXXXXXX (10 digits starting with 20)
    const laosPhoneRegex = /^20\d{8}$/;
    return laosPhoneRegex.test(number);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhone(value);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!phone) {
        setError("ກະລຸນາໃສ່ເບີໂທລະສັບ (Please enter phone number)");
        return;
      }

      if (!validateLaosPhone(phone)) {
        setError("ເບີໂທບໍ່ຖືກຕ້ອງ (Invalid Laos phone number)");
        return;
      }

      setIsLoading(true);

      // Simulate API call
      const resultAction = await dispatch(send_otp({ phone: phone }));
      if (resultAction.type === "auth/send_otp/fulfilled") {
        toast({
          title: "ສຳເລັດ (Success)",
          description:
            "ລະຫັດຢືນຢັນໄດ້ຖືກສົ່ງໄປທີ່ເບີໂທຂອງທ່ານແລ້ວ (Verification code sent to your phone)",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } else {
        toast({
          title: "ເກີດຂໍ້ຜິດພາດ",
          description: resultAction.payload.message || resultAction.payload,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: error.message || error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg="gray.50" py={12}>
        <Container maxW="md">
          <VStack spacing={8}>
            {/* Header */}
            <VStack spacing={2} textAlign="center">
              <Flex
                w={16}
                h={16}
                bg="brand.500"
                rounded="full"
                align="center"
                justify="center"
                mb={2}
              >
                <PhoneIcon boxSize={8} color="white" />
              </Flex>
              <Heading
                fontFamily={"Noto Sans Lao, serif"}
                size="xl"
                color="gray.800"
              >
                ຕັ້ງລະຫັດຜ່ານໃໝ່
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Reset Password
              </Text>
            </VStack>

            {/* Form Card */}
            <Box
              w="full"
              bg="white"
              rounded="xl"
              shadow="lg"
              p={8}
              borderTop="4px"
              borderColor="brand.500"
            >
              <VStack spacing={6}>
                <FormControl isInvalid={!!error}>
                  <FormLabel color="gray.700" fontWeight="semibold">
                    ເບີໂທລະສັບ (Phone Number)
                  </FormLabel>
                  <InputGroup size="lg">
                    <InputLeftAddon
                      bg="gray.100"
                      color="gray.600"
                      fontWeight="semibold"
                    >
                      +856
                    </InputLeftAddon>
                    <Input
                      type="tel"
                      placeholder="20XXXXXXXX"
                      value={phone}
                      onChange={handlePhoneChange}
                      focusBorderColor="brand.500"
                      _placeholder={{ color: "gray.400" }}
                    />
                  </InputGroup>
                  {!error && (
                    <FormHelperText color="gray.500">
                      ໃສ່ເບີໂທລະສັບລາວຂອງທ່ານ (Enter your Laos phone number)
                    </FormHelperText>
                  )}
                  <FormErrorMessage>{error}</FormErrorMessage>
                </FormControl>

                <Button
                  onClick={handleSubmit}
                  colorScheme="brand"
                  size="lg"
                  w="full"
                  isLoading={isLoading}
                  loadingText="ກຳລັງສົ່ງ..."
                  _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                  transition="all 0.2s"
                >
                  ສົ່ງລະຫັດຢືນຢັນ (Send Code)
                </Button>

                <Text fontSize="sm" color="gray.500" textAlign="center">
                  ທ່ານຈະໄດ້ຮັບລະຫັດຢືນຢັນທາງ SMS
                  <br />
                  You will receive a verification code via SMS
                </Text>
              </VStack>
            </Box>

            {/* Back to Login */}
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
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default Phonereset;
