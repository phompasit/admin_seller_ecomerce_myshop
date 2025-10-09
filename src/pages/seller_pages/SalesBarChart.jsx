import React from "react";
import {
  Box,
  Text,
  Flex,
  Badge,
  useColorModeValue,
  HStack,
  VStack,
  Circle,
} from "@chakra-ui/react";
import { ResponsiveBar } from "@nivo/bar";

const SalesBarChart = ({ chartData }) => {
  // Process the data with fallback values
  const data =
    chartData?.map((item) => ({
      name: item.name,
      value: item.value || 0,
      date: item.date,
      peak: item.peak || 0,
      peak_growth: item.peak_growth || 0,
      peak_contribution: item.peak_contribution || 0,
    })) || [];

  // Chakra UI color mode values
  const bgGradient = useColorModeValue(
    "linear(to-br, gray.50, blue.50, purple.50)",
    "linear(to-br, gray.900, blue.900, purple.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  // Nivo theme for Chakra UI integration
  const theme = {
    background: "transparent",
    text: {
      fontSize: 12,
      fill: useColorModeValue("#4a5568", "#e2e8f0"),
      outlineWidth: 0,
    },
    axis: {
      domain: {
        line: {
          stroke: useColorModeValue("#e2e8f0", "#4a5568"),
          strokeWidth: 1,
        },
      },
      legend: {
        text: {
          fontSize: 13,
          fill: useColorModeValue("#2d3748", "#cbd5e1"),
          fontWeight: 600,
        },
      },
      ticks: {
        line: {
          stroke: useColorModeValue("#e2e8f0", "#4a5568"),
          strokeWidth: 1,
        },
        text: {
          fontSize: 11,
          fill: useColorModeValue("#718096", "#a0aec0"),
        },
      },
    },
    grid: {
      line: {
        stroke: useColorModeValue("#f7fafc", "#2d3748"),
        strokeWidth: 1,
        strokeOpacity: 0.8,
      },
    },
  };

  // Gradient colors for bars
  const colors = [
    "#3182ce",
    "#805ad5",
    "#d53f8c",
    "#e53e3e",
    "#38a169",
    "#d69e2e",
    "#00b5d8",
  ];
  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  return (
    <Box
      bgGradient={bgGradient}
      p={6}
      borderRadius="2xl"
      position="relative"
      overflow="hidden"
    >
      {/* Animated background elements */}
      <Box
        position="absolute"
        top="-50%"
        left="-50%"
        w="200%"
        h="200%"
        bgGradient="radial(circle, blue.500, transparent 70%)"
        opacity={0.03}
        animation="pulse 4s ease-in-out infinite"
      />

      <VStack spacing={6} align="stretch">
        {/* Header Section */}
        <Flex justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              bgGradient="linear(to-r, blue.400, purple.500, pink.500)"
              bgClip="text"
            >
              ແຜນພາບລາຍຮັບຂາຍ (Sales Revenue)
            </Text>
            <Text fontSize="sm" color={textColor} opacity={0.8}>
              ສະແດງລາຍຮັບຂາຍຕາມວັນໃນອາທິດນີ້
            </Text>
          </VStack>

          <HStack spacing={3}>
            <Circle size="8px" bg="green.400">
              <Box
                as="div"
                w="full"
                h="full"
                borderRadius="full"
                bg="green.400"
                animation="ping 2s cubic-bezier(0, 0, 0.2, 1) infinite"
                opacity={0.75}
              />
            </Circle>
            <Badge
              colorScheme="green"
              variant="subtle"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="xs"
            >
              Live Data
            </Badge>
          </HStack>
        </Flex>
        \\
        {/* Chart Container */}
        <Box
          bg={cardBg}
          borderRadius="2xl"
          border="1px"
          borderColor={borderColor}
          p={6}
          shadow="xl"
          position="relative"
          overflow="hidden"
        >
          {/* Subtle glow effect */}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            h="2px"
            bgGradient="linear(to-r, blue.400, purple.500, pink.500)"
          />

          <Box h="350px" w="full">
            <ResponsiveBar
              data={data}
              keys={["value"]}
              indexBy="name"
              margin={{ top: 30, right: 30, bottom: 80, left: 90 }}
              padding={0.2}
              colors={({ index }) => colors[index % colors.length]}
              borderRadius={8}
              theme={theme}
              axisBottom={{
                tickSize: 0,
                tickPadding: 16,
                tickRotation: -45,
                legend: "วัน",
                legendPosition: "middle",
                legendOffset: 60,
              }}
              axisLeft={{
                tickSize: 0,
                tickPadding: 16,
                tickRotation: 0,
                legend: "ລາຍຮັບ (LAK)",
                legendPosition: "middle",
                legendOffset: -70,
                fontFamily: "Noto Sans Lao, serif",
              }}
              enableGridY={true}
              enableGridX={false}
              animate={true}
              motionConfig={{
                mass: 1,
                tension: 120,
                friction: 14,
              }}
              tooltip={({ value, data, color }) => (
                <Box
                  bg={bg}
                  border="1px"
                  borderColor={border}
                  borderRadius="xl"
                  p={4}
                  shadow="2xl"
                  backdropFilter="blur(10px)"
                >
                  <HStack spacing={3}>
                    <Circle
                      size="12px"
                      bg={color}
                      shadow={`0 0 10px ${color}`}
                    />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="semibold" fontSize="sm">
                        {data.name}
                      </Text>
                      <Text fontSize="xs" color={textColor} opacity={0.8}>
                        {data.date}
                      </Text>
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        bgGradient="linear(to-r, blue.400, purple.500)"
                        bgClip="text"
                      >
                        {value.toLocaleString()} ກີບ
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              )}
              layers={[
                "grid",
                "axes",
                "bars",
                "markers",
                "legends",
                "annotations",
              ]}
            />
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default SalesBarChart;
