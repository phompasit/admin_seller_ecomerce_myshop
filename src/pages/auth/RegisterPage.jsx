import React, { useState } from "react";
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
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEye,
  FaEyeSlash,
  FaShoppingCart,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { seller_register } from "../../hooks/reducer/auth_reducer";
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
  // const { successMessage, errorMessage } = useSelector((state) => state?.auth);
  // const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
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
    if (strength <= 25) return "ອ່ອນ";
    if (strength <= 50) return "ປານກາງ";
    if (strength <= 75) return "ດີ";
    return "ແຂງແຮງ";
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "ກະລຸນາລະບຸຊື່ເຕັມ";
    }

    if (!formData.email.trim()) {
      newErrors.email = "ກະລຸນາລະບຸອິເມວ";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "ຮູບແບອີເມວບໍ່ຖືກຕ້ອງ";
    }

    if (!formData.password) {
      newErrors.password = "ກະລຸນາລະບຸລະຫັດຜ່ານ";
    } else if (formData.password.length < 8) {
      newErrors.password = "ລະຫັດຜ່ານຢ່າງໜ້ອຍ 8 ຕົວອັກສອນ";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "ກະລຸນາລະບຸລະຫັດຜ່ານ";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "ລະຫັດບໍ່ກົງກັນ";
    }

    if (
      formData.phone &&
      !/^[0-9]{10}$/.test(formData.phone.replace(/[^0-9]/g, ""))
    ) {
      newErrors.phone = "ເບີໂທລະສັບບໍ່ຖືກຕ້ອງ";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "ກະລຸນາຍ້ອມຮັບຂໍ້ຕົກແລະການໃຊ້ງານ";
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
      toast({
        title: "ລົງທະບຽນສຳເລັດ",
        description: "ຍິນດີຕ້ອນຮັບ",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "ເກິດຂໍ້ຜິດພາດ",
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
  // useEffect(() => {
  //   if (errorMessage) {
  //     toast({
  //       title: "Error",
  //       description: errorMessage,
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //     dispatch(messageClear());
  //   }
  //   if (successMessage) {
  //     toast({
  //       title: "Success",
  //       description: successMessage,
  //       status: "success",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //     dispatch(messageClear());
  //   }
  // }, [errorMessage, successMessage, dispatch, navigate, toast]);
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
                <Heading
                  fontFamily={"Noto Sans Lao, serif"}
                  size="lg"
                  fontWeight="bold"
                >
                  ຍິນດີຕ້ອນຮັບສູ່ My Shop
                </Heading>
                <Text fontSize="sm" opacity={0.9}>
                  ລົງທະບຽນເພື່ອຮ່ວມພື້ນທີ່ຂາຍສິນຄ້າ
                </Text>
              </VStack>
            </CardHeader>

            <CardBody p={8}>
              <VStack spacing={6} as="form" onSubmit={handleSubmit}>
                {/* Full Name */}
                <FormControl isInvalid={errors.username}>
                  <FormLabel>ຊື່ ແລະ ນາມສະກຸນ</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FaUser} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      name="username"
                      placeholder="ຊື່ ແລະ ນາມສະກຸນ"
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
                    <FormLabel>ອີເມວ</FormLabel>
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
                    <FormLabel>ລະຫັດຜ່ານ</FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon as={FaLock} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="ລະບຸລະຫັດຜ່ານ"
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
                          ຄວາມແຂງແຮງ: {getStrengthText(passwordStrength)}
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
                    <FormLabel>ຢືນຢັນລະຫັດຜ່ານ</FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon as={FaLock} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="ຢືນຢັນລະຫັດຜ່ານ"
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
                    <FormLabel>ເບີີໂທລະສັບ</FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon as={FaPhone} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        name="phone"
                        placeholder="20XXXX"
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
                      ຂ້ອຍຍອມຮັບ{" "}
                      <Link
                        color="purple.500"
                        href="#"
                        textDecoration="underline"
                      >
                        ຂໍ້ຕົກລົງການໃຊ້ງານ
                      </Link>{" "}
                      ແລະ{" "}
                      <Link
                        color="purple.500"
                        href="#"
                        textDecoration="underline"
                      >
                        ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ
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
                  loadingText="ກຳລັງສະໝັກສະມາຊິກ..."
                  spinner={<Spinner />}
                  bgGradient="linear(to-r, purple.500, pink.500)"
                  _hover={{
                    bgGradient: "linear(to-r, purple.600, pink.600)",
                    transform: "translateY(-2px)",
                    shadow: "lg",
                  }}
                  transition="all 0.3s ease"
                >
                  ສະໝັກສະມາຊິກ
                </Button>

                {/* Login Link */}
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  ມີບັນຊີຢູ່ແລ້ວ?{" "}
                  <Link
                    href={"/login"}
                    color="purple.500"
                    fontWeight="semibold"
                  >
                    ເຂົ້າສູລະບົບ
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
