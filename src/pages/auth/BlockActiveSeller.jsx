import React from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Icon,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Card,
  CardBody,
  Divider,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdBlock, MdEmail, MdPhone } from "react-icons/md";

const BlockActiveSeller = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="md" centerContent>
        <VStack spacing={6} w="full">
          {/* Block Icon */}
          <Box textAlign="center">
            <Icon as={MdBlock} boxSize="80px" color="red.500" mb={4} />
            <Heading                     fontFamily={"Noto Sans Lao, serif"} size="xl" color="red.600" mb={2}>
              ບັນຊີຖືກປິດການໃຊ້ງານ
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Account Suspended
            </Text>
          </Box>

          {/* Main Alert */}
          <Alert status="error" borderRadius="lg" flexDirection="column" p={6}>
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={2} fontSize="lg">
              ບັນຊີຜູ້ຂາຍຂອງທ່ານຖືກປິດການໃຊ້ງານ
            </AlertTitle>
            <AlertDescription textAlign="center" maxWidth="sm">
              ເນື່ອງຈາກພົບການກະທຳທີ່ຜິດຈາກເງື່ອນໄຂການໃຊ້ງານ
              ກະລຸນາຕິດຕໍ່ຝາຍສະໜັບສະໜູນ
            </AlertDescription>
          </Alert>

          <Divider />

          {/* Contact Information */}
          <Card w="full" bg={cardBg}>
            <CardBody>
              <VStack spacing={4}>
                <Heading                     fontFamily={"Noto Sans Lao, serif"} size="md" color="gray.700">
                  ຕິດຕໍ່ຝ່າຍສະໜັບສະໜູນ
                </Heading>

                <VStack spacing={3} w="full">
                  <Button
                    leftIcon={<MdPhone />}
                    colorScheme="green"
                    variant="outline"
                    w="full"
                  >
                    ໂທລະສັບ: 020 96947226
                  </Button>
                </VStack>

                <Text fontSize="sm" color="gray.500" textAlign="center">
                  ທີມງານຈະຕອບກັນພາຍໃນ 1-2 ຊົ່ວໂມງ
                </Text>
              </VStack>
            </CardBody>
          </Card>

          {/* Additional Information */}
          <Box textAlign="center" w="full">
            <Text fontSize="sm" color="gray.500">
              ຫາກທ່ານຄິດວ່າການລະງັບບັນຊີນີ້ເປັນຄວາມຜິດພາດ{" "}
              <Link color="blue.500" textDecoration="underline">
                ກະລຸນາຕິດຕໍ່ຝາຍສະໜັບສະໜູນ
              </Link>
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default BlockActiveSeller;
