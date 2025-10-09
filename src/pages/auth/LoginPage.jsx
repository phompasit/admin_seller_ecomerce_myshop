import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  VStack,
  useColorModeValue,
  useToast,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { login, messageClear } from "../../hooks/reducer/auth_reducer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { errorMessage, successMessage } = useSelector((state) => state.auth);
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const containerSize = useBreakpointValue({ base: "sm", md: "md" });
  const logoSize = useBreakpointValue({ base: "2xl", md: "4xl" });

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      if (!phone || !password) {
        toast({
          title: "ກະລຸນາລະບຸໃຫ້ຄົບຖ້ວນ",
          description: "ໂປຣດໃສ່ເບີໂທແລະລະຫັດຜ່ານ",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      dispatch(
        login({
          phone: phone,
          password: password,
        })
      )
    } catch (error) {
      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (errorMessage) {
      toast({
        title: "ເກີດຂໍຜິດພາດ",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      dispatch(messageClear());
    }
    if (successMessage) {
      toast({
        title: "Success",
        description: successMessage,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
      dispatch(messageClear());
    }
  }, [errorMessage, successMessage, dispatch, navigate, toast]);
  return (
    <>
      <Box
        minH="100vh"
        bgImage="url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJzaG9wcGluZy1iYWciIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmN2Y3ZjciLz4KICAgICAgPHBhdGggZD0iTTMwIDIwaDQwdjYwSDMweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTJlOGYwIiBzdHJva2Utd2lkdGg9IjIiLz4KICAgICAgPHBhdGggZD0iTTM1IDE1aDMwdjEwSDM1eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTJlOGYwIiBzdHJva2Utd2lkdGg9IjIiLz4KICAgICAgPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNSIgZmlsbD0iI2UyZThmMCIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3Nob3BwaW5nLWJhZykiLz4KPC9zdmc+')"
        bgSize="300px 300px"
        bgRepeat="repeat"
        bgAttachment="fixed"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={4}
      >
        <Container maxW={containerSize} py={8}>
          <VStack spacing={8}>
            {/* Logo */}
            <Heading
              as="h1"
              size={logoSize}
              textAlign="center"
              bgGradient="linear(to-r, blue.400, blue.600)"
              bgClip="text"
              fontWeight="bold"
            >
              MyShop
            </Heading>

            {/* Login Form */}
            <Box
              bg={bgColor}
              p={{ base: 6, md: 8 }}
              rounded="2xl"
              shadow="2xl"
              w="full"
              maxW="md"
              border="1px"
              borderColor={borderColor}
              backdropFilter="blur(10px)"
            >
              <VStack spacing={6}>
                <Stack spacing={4} w="full">
                  <FormControl id="phone" isRequired>
                    <FormLabel color={textColor} fontWeight="semibold">
                      ເບີໂທລະສັບ
                    </FormLabel>
                    <Input
                      type="number"
                      placeholder="ລະບຸເບິໂທລະສັບ"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      bg="white"
                      border="2px"
                      borderColor="gray.200"
                      _hover={{
                        borderColor: "blue.300",
                        shadow: "sm",
                      }}
                      _focus={{
                        borderColor: "blue.400",
                        shadow: "lg",
                      }}
                      rounded="lg"
                      size="lg"
                    />
                  </FormControl>

                  <FormControl id="password" isRequired>
                    <FormLabel color={textColor} fontWeight="semibold">
                      ລະຫັດຜ່ານ
                    </FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="ລະບຸລະຫັດຜ່ານ"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        bg="white"
                        border="2px"
                        borderColor="gray.200"
                        _hover={{
                          borderColor: "blue.300",
                          shadow: "sm",
                        }}
                        _focus={{
                          borderColor: "blue.400",
                          shadow: "lg",
                        }}
                        rounded="lg"
                        size="lg"
                      />
                      <InputRightElement h="full">
                        <IconButton
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          aria-label="ສະແດງລະຫັດຜ່ານ"
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <Flex justifyContent="flex-end">
                    <Link
                      color="blue.500"
                      fontSize="sm"
                      _hover={{
                        color: "blue.600",
                        textDecoration: "none",
                      }}
                    >
                      ລືມລະຫັດຜ່ານ?
                    </Link>
                  </Flex>

                  <Button
                    colorScheme="blue"
                    size="lg"
                    w="full"
                    isLoading={isLoading}
                    loadingText="กำลังเข้าสู่ระบบ..."
                    onClick={handleLogin}
                    rounded="lg"
                    _hover={{
                      transform: "translateY(-2px)",
                      shadow: "lg",
                    }}
                    transition="all 0.3s ease"
                    fontWeight="bold"
                    fontSize="md"
                  >
                    ເຂົ້າສູລະບົບ
                  </Button>
                </Stack>

                {/* Divider */}
                {/* <HStack w="full" spacing={4}>
                  <Divider />
                  <Text color={textColor} fontSize="sm" fontWeight="medium">
                    หรือ
                  </Text>
                  <Divider />
                </HStack> */}

                {/* Social Login */}
                {/* <VStack spacing={3} w="full">
                  <Button
                    variant="outline"
                    size="lg"
                    w="full"
                    leftIcon={<FaGoogle />}
                    onClick={() => handleSocialLogin("Google")}
                    rounded="lg"
                    _hover={{
                      bg: "red.50",
                      borderColor: "red.300",
                      transform: "translateY(-1px)",
                    }}
                    transition="all 0.3s ease"
                    fontWeight="semibold"
                  >
                    เข้าสู่ระบบด้วย Google
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    w="full"
                    leftIcon={<FaFacebookF />}
                    onClick={() => handleSocialLogin("Facebook")}
                    rounded="lg"
                    _hover={{
                      bg: "blue.50",
                      borderColor: "blue.300",
                      transform: "translateY(-1px)",
                    }}
                    transition="all 0.3s ease"
                    fontWeight="semibold"
                  >
                    เข้าสู่ระบบด้วย Facebook
                  </Button>
                </VStack> */}

                {/* Sign up link */}
                <Text color={textColor} fontSize="sm" textAlign="center">
                  ຍັງບໍ່ມີບັນຊີ?{" "}
                  <Link
                    href={"/register"}
                    color="blue.500"
                    fontWeight="semibold"
                    _hover={{
                      color: "blue.600",
                      textDecoration: "none",
                    }}
                  >
                    ສະໝັກສະມາຊິກ
                  </Link>
                </Text>
              </VStack>
            </Box>
          </VStack>
        </Container>
      </Box>
    </>
  );
};

export default LoginPage;
