import React, { useEffect, useState } from "react";
import {
  Box,
  ChakraProvider,
  Flex,
  VStack,
  HStack,
  Text,
  IconButton,
  Badge,
  Avatar,
  Divider,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  Tooltip,
  Button,
  extendTheme,
  ColorModeScript,
} from "@chakra-ui/react";
import {

  FiLogOut,
  FiMenu,
  FiSun,
  FiMoon,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { get_all_link_routes } from "../navigation";

// Custom theme for better design
const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.900" : "gray.50",
      },
    }),
  },
});

const MenuItem = ({ item, isCollapsed, onClick, isActive }) => {
  const { colorMode } = useColorMode();
  const hoverBg = useColorModeValue("blue.50", "blue.900");
  const activeBg = useColorModeValue("blue.100", "blue.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const activeTextColor = useColorModeValue("blue.600", "blue.300");

  return (
    <Tooltip label={item.label} placement="right" isDisabled={!isCollapsed}>
      <Box
        w="full"
        cursor="pointer"
        onClick={onClick}
        transition="all 0.2s"
        borderRadius="lg"
        _hover={{ bg: hoverBg }}
        bg={isActive ? activeBg : "transparent"}
      >
        <HStack
          px={isCollapsed ? 3 : 4}
          py={3}
          spacing={isCollapsed ? 0 : 3}
          justify={isCollapsed ? "center" : "flex-start"}
        >
          <Box position="relative">
            <item.icon
              size={20}
              color={
                isActive
                  ? colorMode === "dark"
                    ? "#90CDF4"
                    : "#3182CE"
                  : textColor
              }
            />
            {item.badge && (
              <Badge
                position="absolute"
                top="-8px"
                right="-8px"
                colorScheme="red"
                borderRadius="full"
                fontSize="xs"
                minW="18px"
                h="18px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {item.badge}
              </Badge>
            )}
          </Box>
          {!isCollapsed && (
            <Text
              fontSize="sm"
              fontWeight={isActive ? "semibold" : "medium"}
              color={isActive ? activeTextColor : textColor}
              noOfLines={1}
            >
              {item.label}
            </Text>
          )}
        </HStack>
      </Box>
    </Tooltip>
  );
};

const SidebarContent = ({ isCollapsed, onToggle, onMenuClick, activeMenu,menuItems }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  // Menu items data
 
  return (
    <Box
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      w={isCollapsed ? "70px" : "260px"}
      h="100vh"
      transition="width 0.3s ease"
      position="fixed"
      left={0}
      top={0}
      zIndex={1000}
      boxShadow="lg"
    >
      {/* Header */}
      <Flex
        align="center"
        justify="space-between"
        px={isCollapsed ? 3 : 4}
        py={4}
        borderBottom="1px"
        borderColor={borderColor}
      >
        {!isCollapsed && (
          <HStack spacing={3}>
            <Avatar size="sm" name="Seller Store" bg="blue.500" />
            <Box>
              <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
                Seller Store
              </Text>
              <Text fontSize="xs" color={textColor} noOfLines={1}>
                Online Shop
              </Text>
            </Box>
          </HStack>
        )}
        {isCollapsed && <Avatar size="sm" name="Seller Store" bg="blue.500" />}

        <IconButton
          icon={isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          onClick={onToggle}
          variant="ghost"
          size="sm"
          aria-label="Toggle Sidebar"
        />
      </Flex>

      {/* Menu Items */}
      <VStack spacing={1} p={3} align="stretch">
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            item={item}
            isCollapsed={isCollapsed}
            isActive={activeMenu === item.label}
            onClick={() => onMenuClick(item.label)}
          />
        ))}
      </VStack>

      <Divider my={4} />

      {/* Theme Toggle & Logout */}
      <VStack spacing={1} p={3} align="stretch">
        <Tooltip
          label={`Switch to ${colorMode === "light" ? "Dark" : "Light"} Mode`}
          placement="right"
          isDisabled={!isCollapsed}
        >
          <Box
            w="full"
            cursor="pointer"
            onClick={toggleColorMode}
            borderRadius="lg"
            transition="all 0.2s"
            _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
          >
            <HStack
              px={isCollapsed ? 3 : 4}
              py={3}
              spacing={isCollapsed ? 0 : 3}
              justify={isCollapsed ? "center" : "flex-start"}
            >
              {colorMode === "light" ? (
                <FiMoon size={20} />
              ) : (
                <FiSun size={20} />
              )}
              {!isCollapsed && (
                <Text fontSize="sm" fontWeight="medium">
                  {colorMode === "light" ? "Dark Mode" : "Light Mode"}
                </Text>
              )}
            </HStack>
          </Box>
        </Tooltip>

        <Tooltip label="Logout" placement="right" isDisabled={!isCollapsed}>
          <Box
            w="full"
            cursor="pointer"
            borderRadius="lg"
            transition="all 0.2s"
            _hover={{ bg: useColorModeValue("red.50", "red.900") }}
          >
            <HStack
              px={isCollapsed ? 3 : 4}
              py={3}
              spacing={isCollapsed ? 0 : 3}
              justify={isCollapsed ? "center" : "flex-start"}
              color={useColorModeValue("red.600", "red.400")}
            >
              <FiLogOut size={20} />
              {!isCollapsed && (
                <Text fontSize="sm" fontWeight="medium">
                  Logout
                </Text>
              )}
            </HStack>
          </Box>
        </Tooltip>
      </VStack>
    </Box>
  );
};

const MobileSidebar = ({ isOpen, onClose, onMenuClick, activeMenu ,menuItems }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const textColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent maxW="280px">
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          <HStack spacing={3}>
            <Avatar size="sm" name="Seller Store" bg="blue.500" />
            <Box>
              <Text fontSize="sm" fontWeight="bold">
                Seller Store
              </Text>
              <Text fontSize="xs" color={textColor}>
                Online Shop
              </Text>
            </Box>
          </HStack>
        </DrawerHeader>

        <DrawerBody p={3}>
          <VStack spacing={1} align="stretch">
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                item={item}
                isCollapsed={false}
                isActive={activeMenu === item.label}
                onClick={() => {
                  onMenuClick(item.label);
                  onClose();
                }}
              />
            ))}
          </VStack>

          <Divider my={4} />

          <VStack spacing={1} align="stretch">
            <Button
              variant="ghost"
              leftIcon={colorMode === "light" ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
              justifyContent="flex-start"
              fontWeight="medium"
              size="sm"
            >
              {colorMode === "light" ? "Dark Mode" : "Light Mode"}
            </Button>

            <Button
              variant="ghost"
              leftIcon={<FiLogOut />}
              colorScheme="red"
              justifyContent="flex-start"
              fontWeight="medium"
              size="sm"
            >
              Logout
            </Button>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const SellerDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const { isOpen, onOpen, onClose } = useDisclosure();
 const [menuItems, setMenuItems] = useState([]);
  useEffect(() => {
    const role = "sellers";
    const navs = get_all_link_routes(role);
    setMenuItems(navs);
  }, []);
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const contentBg = useColorModeValue("white", "gray.800");

  const handleToggle = () => {
    if (isMobile) {
      onOpen();
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
  };

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Box bg={bgColor} minH="100vh">
        {/* Mobile Menu Button */}
        {isMobile && (
          <Box position="fixed" top={4} left={4} zIndex={1001}>
            <IconButton
              icon={<FiMenu />}
              onClick={onOpen}
              variant="solid"
              colorScheme="blue"
              size="md"
              boxShadow="lg"
              aria-label="Open Menu"
            />
          </Box>
        )}

        {/* Desktop Sidebar */}
        {!isMobile && (
          <SidebarContent
            isCollapsed={isCollapsed}
            onToggle={handleToggle}
            onMenuClick={handleMenuClick}
            activeMenu={activeMenu}
            menuItems={menuItems}
          />
        )}

        {/* Mobile Sidebar (Drawer) */}
        <MobileSidebar
          isOpen={isOpen}
          onClose={onClose}
          onMenuClick={handleMenuClick}
          activeMenu={activeMenu}
          menuItems={menuItems}
        />

        {/* Main Content Area */}
        <Box
          ml={isMobile ? 0 : isCollapsed ? "70px" : "260px"}
          transition="margin-left 0.3s ease"
          p={6}
          pt={isMobile ? 20 : 6}
        >
          <Box
            bg={contentBg}
            borderRadius="xl"
            p={8}
            boxShadow="sm"
            border="1px"
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            <VStack spacing={6} align="center" justify="center" minH="60vh">
              <Text fontSize="3xl" fontWeight="bold" textAlign="center">
                {activeMenu} Page
              </Text>
              <Text fontSize="lg" color="gray.500" textAlign="center">
                Welcome to your seller dashboard!
                {activeMenu === "Orders" &&
                  " You have 5 new orders to process."}
                {activeMenu === "Chat" && " You have 3 unread messages."}
              </Text>
              <Text fontSize="md" color="gray.400" textAlign="center">
                This is a demo content area. Your {activeMenu.toLowerCase()}{" "}
                content would go here.
              </Text>
            </VStack>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default SellerDashboard;
