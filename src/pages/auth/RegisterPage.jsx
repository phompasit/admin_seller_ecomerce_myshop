import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Progress,
  Stack,
  Text,
  VStack,
  HStack,
  Icon,
  useToast,
  Spinner,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebook,
  FaShoppingCart,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  messageClear,
  seller_register,
} from "../../hooks/reducer/auth_reducer";
import { useNavigate } from "react-router-dom";
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreeTerms: false,
  });
  const dispatch = useDispatch();
  const { successMessage, errorMessage } = useSelector((state) => state?.auth);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  // Password strength calculation
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password))
      strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const getStrengthColor = (strength) => {
    if (strength <= 25) return "red";
    if (strength <= 50) return "orange";
    if (strength <= 75) return "yellow";
    return "green";
  };

  const getStrengthText = (strength) => {
    if (strength <= 25) return "อ่อน";
    if (strength <= 50) return "ปานกลาง";
    if (strength <= 75) return "ดี";
    return "แข็งแกร่ง";
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "กรุณากรอกชื่อเต็ม";
    }

    if (!formData.email.trim()) {
      newErrors.email = "กรุณากรอกอีเมล";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }

    if (!formData.password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
    } else if (formData.password.length < 8) {
      newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "กรุณายืนยันรหัสผ่าน";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    }

    if (
      formData.phone &&
      !/^[0-9]{10}$/.test(formData.phone.replace(/[^0-9]/g, ""))
    ) {
      newErrors.phone = "เบอร์โทรศัพท์ไม่ถูกต้อง";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "กรุณายอมรับข้อตกลงการใช้งาน";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      dispatch(seller_register(formData));
      // Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        agreeTerms: false,
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error?.data?.error?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const handleOAuthSignup = (provider) => {
  //   toast({
  //     title: `สมัครสมาชิกด้วย ${provider}`,
  //     description: "ฟีเจอร์นี้อยู่ระหว่างการพัฒนา",
  //     status: "info",
  //     duration: 3000,
  //     isClosable: true,
  //   });
  // };

  const cardBg = useColorModeValue("white", "gray.800");
  useEffect(() => {
    if (errorMessage) {
      toast({
        title: "Error",
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
      dispatch(messageClear());
    }
  }, [errorMessage, successMessage, dispatch, navigate, toast]);
  return (
    <>
      <Box minH="100vh" py={{ base: 8, md: 16 }}>
        <Container maxW="md" centerContent>
          <Card
            bg={cardBg}
            shadow="2xl"
            borderRadius="2xl"
            w="full"
            maxW="md"
            overflow="hidden"
          >
            <CardHeader
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              color="white"
              textAlign="center"
              py={8}
            >
              <VStack spacing={4}>
                <Icon as={FaShoppingCart} boxSize={12} />
                <Heading size="lg" fontWeight="bold">
                  Register Myshop
                </Heading>
                <Text fontSize="sm" opacity={0.9}>
                  Register for seller partner
                </Text>
              </VStack>
            </CardHeader>

            <CardBody p={8}>
              <VStack spacing={6} as="form" onSubmit={handleSubmit}>
                {/* Full Name */}
                <FormControl isInvalid={errors.username}>
                  <FormLabel>ชื่อเต็ม</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FaUser} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      name="username"
                      placeholder="กรอกชื่อเต็มของคุณ"
                      value={formData.username}
                      onChange={handleInputChange}
                      borderRadius="lg"
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.username}</FormErrorMessage>
                </FormControl>

                <Flex>
                  {/* Email */}
                  <FormControl paddingRight={4} isInvalid={errors.email}>
                    <FormLabel>อีเมล</FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon as={FaEnvelope} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        name="email"
                        type="email"
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        borderRadius="lg"
                      />
                    </InputGroup>
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>

                  {/* Password */}
                  <FormControl isInvalid={errors.password}>
                    <FormLabel>รหัสผ่าน</FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon as={FaLock} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="กรอกรหัสผ่าน"
                        value={formData.password}
                        onChange={handleInputChange}
                        borderRadius="lg"
                      />
                      <InputRightElement>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Icon as={showPassword ? FaEyeSlash : FaEye} />
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    {formData.password && (
                      <Box mt={2}>
                        <Progress
                          value={passwordStrength}
                          colorScheme={getStrengthColor(passwordStrength)}
                          size="sm"
                          borderRadius="md"
                        />
                        <Text
                          fontSize="xs"
                          color={`${getStrengthColor(passwordStrength)}.500`}
                          mt={1}
                        >
                          ความแข็งแกร่ง: {getStrengthText(passwordStrength)}
                        </Text>
                      </Box>
                    )}
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                </Flex>

                <Flex>
                  {/* Confirm Password */}
                  <FormControl
                    paddingRight={4}
                    isInvalid={errors.confirmPassword}
                  >
                    <FormLabel>ยืนยันรหัสผ่าน</FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon as={FaLock} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="ยืนยันรหัสผ่าน"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        borderRadius="lg"
                      />
                      <InputRightElement>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          <Icon as={showConfirmPassword ? FaEyeSlash : FaEye} />
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.confirmPassword}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Phone Number */}
                  <FormControl isInvalid={errors.phone}>
                    <FormLabel>เบอร์โทรศัพท์</FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon as={FaPhone} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        name="phone"
                        placeholder="08x-xxx-xxxx"
                        value={formData.phone}
                        onChange={handleInputChange}
                        borderRadius="lg"
                      />
                    </InputGroup>
                    <FormErrorMessage>{errors.phone}</FormErrorMessage>
                  </FormControl>
                </Flex>

                {/* Terms Agreement */}
                <FormControl isInvalid={errors.agreeTerms}>
                  <Checkbox
                    name="agreeTerms"
                    isChecked={formData.agreeTerms}
                    onChange={handleInputChange}
                    colorScheme="purple"
                  >
                    <Text fontSize="sm">
                      ฉันยอมรับ{" "}
                      <Link
                        color="purple.500"
                        href="#"
                        textDecoration="underline"
                      >
                        ข้อตกลงการใช้งาน
                      </Link>{" "}
                      และ{" "}
                      <Link
                        color="purple.500"
                        href="#"
                        textDecoration="underline"
                      >
                        นโยบายความเป็นส่วนตัว
                      </Link>
                    </Text>
                  </Checkbox>
                  <FormErrorMessage>{errors.agreeTerms}</FormErrorMessage>
                </FormControl>

                {/* Submit Button */}
                <Button
                  type="submit"
                  colorScheme="purple"
                  size="lg"
                  w="full"
                  borderRadius="lg"
                  isLoading={isLoading}
                  loadingText="กำลังสมัครสมาชิก..."
                  spinner={<Spinner />}
                  bgGradient="linear(to-r, purple.500, pink.500)"
                  _hover={{
                    bgGradient: "linear(to-r, purple.600, pink.600)",
                    transform: "translateY(-2px)",
                    shadow: "lg",
                  }}
                  transition="all 0.3s ease"
                >
                  สมัครสมาชิก
                </Button>

                {/* Login Link */}
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  มีบัญชีอยู่แล้ว?{" "}
                  <Link
                    href={"/login"}
                    color="purple.500"
                    fontWeight="semibold"
                  >
                    เข้าสู่ระบบ
                  </Link>
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default RegisterPage;
