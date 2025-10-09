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
import { Link } from "react-router-dom";
import Outleted from "./Outleted";
import { useDispatch, useSelector } from "react-redux";
import { remove_logout } from "../hooks/reducer/auth_reducer";
import { useNavigate } from "react-router-dom";
import useSocket from "../pages/seller_pages/useSocket";
import { memo } from "react";
// Custom theme for better design
const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  semanticTokens: {
    colors: {
      
      "bg.surface": {
        default: "white",
        _dark: "gray.800",
      },
      "text.primary": {
        default: "gray.800",
        _dark: "gray.100",
      },
      "text.secondary": {
        default: "gray.600",
        _dark: "gray.300",
      },
      "brand.primary": {
        default: "blue.600",
        _dark: "blue.300",
      },
    },
  },
});


const MenuItem = memo(({ item, isCollapsed, onClick, isActive }) => {
  const { colorMode } = useColorMode();

  const hoverBg = { light: "blue.50", dark: "blue.900" }[colorMode];
  const activeBg = { light: "blue.100", dark: "blue.800" }[colorMode];
  const textColor = { light: "gray.700", dark: "gray.200" }[colorMode];
  const activeText = { light: "blue.600", dark: "blue.300" }[colorMode];

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
              color={isActive ? activeText : textColor}
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
              color={isActive ? activeText : textColor}
              noOfLines={1}
            >
              {item.label}
            </Text>
          )}
        </HStack>
      </Box>
    </Tooltip>
  );
});

const SidebarContent = ({
  isCollapsed,
  onToggle,
  onMenuClick,
  activeMenu,
  menuItems,
  removeOff,
  exp,
}) => {
  // const { colorMode, toggleColorMode } = useColorMode();
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
                {exp.username}
              </Text>
              <Text fontSize="xs" color={textColor} noOfLines={1}>
                {exp.phone}
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
          <Link key={index} to={item?.path}>
            <MenuItem
              key={index}
              item={item}
              isCollapsed={isCollapsed}
              isActive={activeMenu === item.label}
              onClick={() => onMenuClick(item.label)}
            />
          </Link>
        ))}
      </VStack>

      <Divider my={4} />

      {/* Theme Toggle & Logout */}
      <VStack spacing={1} p={3} align="stretch">
        {/* <Tooltip
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
        </Tooltip> */}

        <Tooltip label="Logout" placement="right" isDisabled={!isCollapsed}>
          <Box
            w="full"
            cursor="pointer"
            borderRadius="lg"
            transition="all 0.2s"
            onClick={removeOff}
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
                 ອອກຈາກລະບົບ
                </Text>
              )}
            </HStack>
          </Box>
        </Tooltip>
      </VStack>
    </Box>
  );
};

const MobileSidebar = ({
  isOpen,
  onClose,
  onMenuClick,
  activeMenu,
  menuItems,
  exp,
}) => {
  // const { colorMode, toggleColorMode } = useColorMode();

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
                {exp.username}
              </Text>
              <Text fontSize="xs" color={textColor}>
                {exp.phone}
              </Text>
            </Box>
          </HStack>
        </DrawerHeader>

        <DrawerBody p={3}>
          <VStack spacing={1} align="stretch">
            {menuItems.map((item, index) => (
              <Link to={item.path} key={index}>
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
              </Link>
            ))}
          </VStack>

          <Divider my={4} />

          <VStack spacing={1} align="stretch">
            {/* <Button
              variant="ghost"
              leftIcon={colorMode === "light" ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
              justifyContent="flex-start"
              fontWeight="medium"
              size="sm"
            >
              {colorMode === "light" ? "Dark Mode" : "Light Mode"}
            </Button> */}

            <Button
              variant="ghost"
              leftIcon={<FiLogOut />}
              colorScheme="red"
              justifyContent="flex-start"
              fontWeight="medium"
              size="sm"
            >
              ອອກຈາກລະບົບ
            </Button>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [menuItems, setMenuItems] = useState([]);
  const { exp } = useSelector((state) => state.auth);
  const { socket } = useSocket(exp?._id);
  useEffect(() => {
    if (!socket) return;

    socket.emit("registerUser", exp?._id);
    const fetchConversations = () => {
      socket.emit("conversation_all", { userId: exp?._id }, (response) => {
        if (response.status === "ok") {
          const unreadCount = response.data.reduce((acc, convo) => {
            return acc + (convo.unreadCount || 0);
          }, 0);
          const navs = get_all_link_routes(exp?.role, unreadCount);
          setMenuItems(navs);
        } else {
          console.error("Error:", response.message);
        }
      });
    };

    fetchConversations();
    // ✅ ใช้ event ที่ server ส่งจริง
    socket.on("updateUnreadCount", fetchConversations);
    return () => {
      socket.off("updateUnreadCount", fetchConversations);
    };
  }, [exp?.role, socket, exp?._id]);

  const isMobile = useBreakpointValue({ base: true, lg: false });
  // 🎨 Light / Dark mode values
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const contentBg = useColorModeValue("white", "gray.800");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleToggle = () => {
    if (isMobile) {
      onOpen();
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };
  const removeOff = () => {
    dispatch(remove_logout());
    navigate;
  };
  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
  };

  return (
    <ChakraProvider bg={bgColor} theme={theme}>
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
        \{/* Desktop Sidebar */}
        {!isMobile && (
          <SidebarContent
            isCollapsed={isCollapsed}
            onToggle={handleToggle}
            removeOff={removeOff}
            onMenuClick={handleMenuClick}
            activeMenu={activeMenu}
            menuItems={menuItems}
            exp={exp}
          />
        )}
        {/* Mobile Sidebar (Drawer) */}
        <MobileSidebar
          isOpen={isOpen}
          exp={exp}
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
            <Outleted />
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default MainLayout;
