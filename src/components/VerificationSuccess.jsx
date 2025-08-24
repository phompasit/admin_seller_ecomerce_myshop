import React from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Icon,
  Container,
  useColorModeValue,
  Divider,
  useBreakpointValue,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

const VerificationSuccess = () => {
  // Responsive values
  const iconSize = useBreakpointValue({ base: "80px", md: "100px" });
  const headingSize = useBreakpointValue({ base: "xl", md: "1xl" });
  const containerPadding = useBreakpointValue({ base: 4, md: 8 });

  // Theme colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const successColor = useColorModeValue("green.500", "green.400");

  return (
    <Box
      bg={bgColor}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={containerPadding}
    >
      <Container maxW="md" centerContent>
        <Box>
          <VStack spacing={6}>
            {/* Animated Success Icon */}
            <Box position="relative">
              <Box
                bg={successColor}
                borderRadius="full"
                w={iconSize}
                h={iconSize}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon
                  as={CheckIcon}
                  color="white"
                  boxSize={{ base: "40px", md: "50px" }}
                  strokeWidth="3"
                />
              </Box>
            </Box>

            {/* Success Message */}
            <VStack spacing={3}>
              <Heading
                size={headingSize}
                color={successColor}
                fontWeight="bold"
                letterSpacing="-0.5px"
              >
                Verification Complete!
              </Heading>
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color={textColor}
                maxW="400px"
                lineHeight="1.6"
              >
                Your identity has been successfully verified. Welcome to our
                platform!
              </Text>
            </VStack>

            <Divider />

            {/* Additional Info */}
            <Text
              fontSize="xs"
              color={textColor}
              opacity={0.8}
              textAlign="center"
              maxW="300px"
            >
              Your verification is valid for 24 months. You can update your
              information anytime in your account settings.
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default VerificationSuccess;
