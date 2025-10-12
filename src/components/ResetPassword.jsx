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
  InputLeftElement,
  InputRightElement,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  useToast,
  Icon,
  Flex,
  Progress,
  List,
  ListItem,
  ListIcon,
  Divider,
  extendTheme,
  IconButton,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  WarningIcon,
  ViewIcon,
  ViewOffIcon,
  LockIcon,
} from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { get_otp, reset_password } from "../hooks/reducer/auth_reducer";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

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

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resetuuid } = useSelector((state) => state.auth);
  const { phone, otp, uuid } = useParams();
  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 10;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };
  useEffect(() => {
    // ถ้ายัง undefined หรือ null → รอ
    if (resetuuid === undefined || resetuuid === null) return;

    // ถ้ามีค่าแต่ไม่ตรง uuid → redirect
    if (resetuuid !== uuid) {
      navigate("/");
    }
  }, [resetuuid, uuid, navigate]);
  useEffect(() => {
    if (phone) {
      dispatch(get_otp({ phone }));
    }
  }, [dispatch, phone]);
  const passwordStrength = calculatePasswordStrength(formData.password);

  const getStrengthColor = (strength) => {
    if (strength < 40) return "red";
    if (strength < 70) return "orange";
    return "green";
  };

  const getStrengthText = (strength) => {
    if (strength < 40) return { lao: "ອ່ອນ", en: "Weak" };
    if (strength < 70) return { lao: "ປານກາງ", en: "Medium" };
    return { lao: "ແຂງ", en: "Strong" };
  };

  // Password validation rules
  const passwordRules = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle blur
  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
    validateField(field);
  };

  // Validate individual field
  const validateField = (field) => {
    let error = "";

    if (field === "password") {
      if (!formData.password) {
        error = "ກະລຸນາໃສ່ລະຫັດຜ່ານ (Please enter password)";
      } else if (formData.password.length < 8) {
        error = "ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 8 ໂຕອັກສອນ (Minimum 8 characters)";
      } else if (!passwordRules.uppercase || !passwordRules.lowercase) {
        error =
          "ຕ້ອງມີຕົວອັກສອນພິມໃຫຍ່ແລະພິມນ້ອຍ (Must have uppercase & lowercase)";
      } else if (!passwordRules.number) {
        error = "ຕ້ອງມີຕົວເລກ (Must contain number)";
      }
    }

    if (field === "confirmPassword") {
      if (!formData.confirmPassword) {
        error = "ກະລຸນາຢືນຢັນລະຫັດຜ່ານ (Please confirm password)";
      } else if (formData.password !== formData.confirmPassword) {
        error = "ລະຫັດຜ່ານບໍ່ກົງກັນ (Passwords do not match)";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    return error === "";
  };

  // Validate all fields
  const validateForm = () => {
    const passwordValid = validateField("password");
    const confirmPasswordValid = validateField("confirmPassword");
    return passwordValid && confirmPasswordValid;
  };

  // Handle submit
  const handleSubmit = async () => {
    // Mark all fields as touched
    setTouched({
      password: true,
      confirmPassword: true,
    });

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      const result = await dispatch(
        reset_password({ phone, otp, password: formData.password })
      );
      if (result.type === "auth/reset_password/fulfilled") {
        toast({
          title: `ສຳເລັດ! (Success!) ${result.payload.message}`,
          description:
            "ລະຫັດຜ່ານຂອງທ່ານໄດ້ຖືກປ່ຽນແປງແລ້ວ (Your password has been reset successfully)",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        navigate("/");
      } else {
        toast({
          title: "ເກີດຂໍ້ຜິດພາດ (Error)",
          description:
            result.payload.message ||
            "ບໍ່ສາມາດປ່ຽນລະຫັດຜ່ານໄດ້ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ (Failed to reset password)",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }

      // Reset form
    } catch (error) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ (Error)",
        description:
          error.message ||
          "ບໍ່ສາມາດປ່ຽນລະຫັດຜ່ານໄດ້ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ (Failed to reset password)",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
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
                <Icon as={LockIcon} boxSize={8} color="white" />
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
              <Text color="gray.500" fontSize="sm" textAlign="center" mt={2}>
                ກະລຸນາສ້າງລະຫັດຜ່ານໃໝ່ທີ່ແຂງແຮງ
                <br />
                Create a strong new password
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
                {/* New Password Field */}
                <FormControl
                  isInvalid={touched.password && errors.password}
                  isRequired
                >
                  <FormLabel color="gray.700" fontWeight="semibold">
                    ລະຫັດຜ່ານໃໝ່ (New Password)
                  </FormLabel>
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={LockIcon} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="ໃສ່ລະຫັດຜ່ານໃໝ່"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur("password")}
                      focusBorderColor="brand.500"
                      _placeholder={{ color: "gray.400" }}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        size="sm"
                        _hover={{ bg: "transparent" }}
                      />
                    </InputRightElement>
                  </InputGroup>
                  {touched.password && errors.password ? (
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  ) : (
                    <FormHelperText color="gray.500">
                      ຢ່າງໜ້ອຍ 8 ໂຕອັກສອນ (Minimum 8 characters)
                    </FormHelperText>
                  )}
                </FormControl>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <Box w="full">
                    <Flex justify="space-between" mb={2}>
                      <Text fontSize="sm" color="gray.600">
                        ຄວາມແຂງແຮງ (Strength):
                      </Text>
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color={`${getStrengthColor(passwordStrength)}.500`}
                      >
                        {getStrengthText(passwordStrength).lao} (
                        {getStrengthText(passwordStrength).en})
                      </Text>
                    </Flex>
                    <Progress
                      value={passwordStrength}
                      size="sm"
                      colorScheme={getStrengthColor(passwordStrength)}
                      rounded="full"
                      hasStripe
                      isAnimated
                    />
                  </Box>
                )}

                {/* Password Requirements */}
                {formData.password && (
                  <Box w="full" p={4} bg="gray.50" rounded="lg">
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.700"
                      mb={3}
                    >
                      ຂໍ້ກຳນົດລະຫັດຜ່ານ (Password Requirements):
                    </Text>
                    <List spacing={2}>
                      <ListItem
                        fontSize="sm"
                        color={passwordRules.length ? "green.600" : "gray.500"}
                      >
                        <ListIcon
                          as={
                            passwordRules.length ? CheckCircleIcon : WarningIcon
                          }
                          color={
                            passwordRules.length ? "green.500" : "gray.400"
                          }
                        />
                        ຢ່າງໜ້ອຍ 8 ໂຕອັກສອນ (At least 8 characters)
                      </ListItem>
                      <ListItem
                        fontSize="sm"
                        color={
                          passwordRules.uppercase ? "green.600" : "gray.500"
                        }
                      >
                        <ListIcon
                          as={
                            passwordRules.uppercase
                              ? CheckCircleIcon
                              : WarningIcon
                          }
                          color={
                            passwordRules.uppercase ? "green.500" : "gray.400"
                          }
                        />
                        ມີຕົວອັກສອນພິມໃຫຍ່ (Contains uppercase letter)
                      </ListItem>
                      <ListItem
                        fontSize="sm"
                        color={
                          passwordRules.lowercase ? "green.600" : "gray.500"
                        }
                      >
                        <ListIcon
                          as={
                            passwordRules.lowercase
                              ? CheckCircleIcon
                              : WarningIcon
                          }
                          color={
                            passwordRules.lowercase ? "green.500" : "gray.400"
                          }
                        />
                        ມີຕົວອັກສອນພິມນ້ອຍ (Contains lowercase letter)
                      </ListItem>
                      <ListItem
                        fontSize="sm"
                        color={passwordRules.number ? "green.600" : "gray.500"}
                      >
                        <ListIcon
                          as={
                            passwordRules.number ? CheckCircleIcon : WarningIcon
                          }
                          color={
                            passwordRules.number ? "green.500" : "gray.400"
                          }
                        />
                        ມີຕົວເລກ (Contains number)
                      </ListItem>
                      <ListItem
                        fontSize="sm"
                        color={passwordRules.special ? "green.600" : "gray.500"}
                      >
                        <ListIcon
                          as={
                            passwordRules.special
                              ? CheckCircleIcon
                              : WarningIcon
                          }
                          color={
                            passwordRules.special ? "green.500" : "gray.400"
                          }
                        />
                        ມີອັກຂະລະພິເສດ (Contains special character) - ແນະນຳ
                      </ListItem>
                    </List>
                  </Box>
                )}

                <Divider />

                {/* Confirm Password Field */}
                <FormControl
                  isInvalid={touched.confirmPassword && errors.confirmPassword}
                  isRequired
                >
                  <FormLabel color="gray.700" fontWeight="semibold">
                    ຢືນຢັນລະຫັດຜ່ານ (Confirm Password)
                  </FormLabel>
                  <InputGroup size="lg">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={LockIcon} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="ໃສ່ລະຫັດຜ່ານອີກຄັ້ງ"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={() => handleBlur("confirmPassword")}
                      focusBorderColor="brand.500"
                      _placeholder={{ color: "gray.400" }}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        icon={
                          showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />
                        }
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        variant="ghost"
                        size="sm"
                        _hover={{ bg: "transparent" }}
                      />
                    </InputRightElement>
                  </InputGroup>
                  {touched.confirmPassword && errors.confirmPassword ? (
                    <FormErrorMessage>
                      {errors.confirmPassword}
                    </FormErrorMessage>
                  ) : (
                    <FormHelperText color="gray.500">
                      ໃສ່ລະຫັດຜ່ານອີກຄັ້ງເພື່ອຢືນຢັນ (Re-enter password to
                      confirm)
                    </FormHelperText>
                  )}
                </FormControl>

                {/* Match Indicator */}
                {formData.password && formData.confirmPassword && (
                  <Box w="full">
                    {formData.password === formData.confirmPassword ? (
                      <Flex align="center" color="green.600" fontSize="sm">
                        <CheckCircleIcon mr={2} />
                        <Text>ລະຫັດຜ່ານກົງກັນ (Passwords match)</Text>
                      </Flex>
                    ) : (
                      <Flex align="center" color="red.600" fontSize="sm">
                        <WarningIcon mr={2} />
                        <Text>ລະຫັດຜ່ານບໍ່ກົງກັນ (Passwords do not match)</Text>
                      </Flex>
                    )}
                  </Box>
                )}

                {/* Submit Button */}
                <Button
                  colorScheme="brand"
                  size="lg"
                  w="full"
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  loadingText="ກຳລັງປ່ຽນລະຫັດຜ່ານ..."
                  _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                  transition="all 0.2s"
                  isDisabled={
                    !formData.password ||
                    !formData.confirmPassword ||
                    passwordStrength < 40
                  }
                >
                  ປ່ຽນລະຫັດຜ່ານ (Reset Password)
                </Button>
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

export default ResetPassword;
