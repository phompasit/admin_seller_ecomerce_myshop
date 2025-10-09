import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Input,
  Textarea,
  Button,
  Avatar,
  Badge,
  IconButton,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  FormLabel,
  useToast,
  Center,
} from "@chakra-ui/react";
import {
  FiSearch,
  FiSend,
  FiSmile,
  FiMoreVertical,
  FiArrowLeft,
  FiCheckSquare,
  FiCheckCircle,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { get_user } from "../../hooks/reducer/auth_reducer";
import Picker from "emoji-picker-react";
import useSocket from "../../pages/seller_pages/useSocket";

// Memoized Components for better performance
const CustomerItem = memo(
  ({ customer, isSelected, onClick, formatTimestamp }) => {
    const bgColor = useColorModeValue(
      isSelected ? "blue.50" : "transparent",
      isSelected ? "blue.900" : "transparent"
    );
    const hoverBg = useColorModeValue("gray.50", "gray.700");
    const textColor = useColorModeValue("gray.900", "white");
    const subtextColor = useColorModeValue("gray.600", "gray.300");

    const lastMessageTime = useMemo(
      () => formatTimestamp(customer?.updatedAt || customer?.createdAt),
      [customer?.updatedAt, customer?.createdAt, formatTimestamp]
    );

    const handleClick = useCallback(() => {
      onClick(customer);
    }, [onClick, customer]);
    const border = useColorModeValue("white", "gray.800");
    return (
      <Flex
        w="100%"
        p={4}
        cursor="pointer"
        bg={bgColor}
        _hover={{ bg: isSelected ? bgColor : hoverBg }}
        onClick={handleClick}
        borderBottom="1px"
        borderColor={useColorModeValue("gray.100", "gray.700")}
      >
        <Box position="relative">
          <Avatar
            size="md"
            src={customer.avatar}
            name={customer.clientdata.username}
          />
          {customer.isOnline && (
            <Box
              position="absolute"
              bottom={0}
              right={0}
              w={3}
              h={3}
              bg="green.400"
              borderRadius="full"
              border="2px"
              borderColor={border}
            />
          )}
        </Box>

        <VStack align="start" flex={1} ml={3} spacing={1}>
          <HStack justify="space-between" w="100%">
            <Text
              fontWeight="semibold"
              color={textColor}
              fontSize="sm"
              isTruncated
            >
              {customer.clientdata.username}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {lastMessageTime}
            </Text>
          </HStack>
          <HStack justify="space-between" w="100%">
            <Text fontSize="sm" color={subtextColor} isTruncated flex={1}>
              {customer?.lastMessage?.text}
            </Text>
            {customer?.unreadCount > 0 && (
              <Badge colorScheme="blue" borderRadius="full" fontSize="xs">
                {customer.unreadCount}
              </Badge>
            )}
          </HStack>
        </VStack>
      </Flex>
    );
  }
);

const Sidebar = memo(
  ({
    customers,
    selectedCustomer,
    onSelectCustomer,
    searchTerm,
    setSearchTerm,
    formatTimestamp,
    onClose,
  }) => {
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    // Memoize filtered customers to prevent unnecessary recalculations
    const filteredCustomers = useMemo(() => {
      if (!customers || !Array.isArray(customers)) return [];

      return customers.filter((customer) =>
        customer?.clientdata?.username
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }, [customers, searchTerm]);

    const handleSearchChange = useCallback(
      (e) => {
        setSearchTerm(e.target.value);
      },
      [setSearchTerm]
    );

    const handleSelectCustomer = useCallback(
      (customer) => {
        onSelectCustomer(customer);
        onClose?.();
      },
      [onSelectCustomer, onClose]
    );

    return (
      <VStack
        w="100%"
        h="100%"
        bg={bgColor}
        borderRight="1px"
        borderColor={borderColor}
        spacing={0}
      >
        <FormLabel fontWeight="bold" color="gray.600">
          ຄົ້ນຫາລູກຄ້າ
        </FormLabel>
        <Box p={4}  borderBottom="1px" borderColor={borderColor}>
          <Box position="relative">
            <Input
              placeholder="ຄົ້ນຫາສິນຄ້າ..."
              value={searchTerm}
              onChange={handleSearchChange}
              pl={10}
              borderRadius="lg"
              bg={useColorModeValue("gray.50", "gray.700")}
            />
            <FiSearch
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: useColorModeValue("#718096", "#A0AEC0"),
              }}
            />
          </Box>
        </Box>

        <VStack spacing={0} w="100%" flex={1} overflowY="auto">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <CustomerItem
                key={customer._id}
                customer={customer}
                formatTimestamp={formatTimestamp}
                isSelected={selectedCustomer?._id === customer._id}
                onClick={handleSelectCustomer}
              />
            ))
          ) : (
            <Box w="100%" py={4} textAlign="center" color="gray.500">
              ບໍ່ມີລູກຄ້າ
            </Box>
          )}
        </VStack>
      </VStack>
    );
  }
);

const ChatHeader = memo(({ onlineUsers, customer, onBack, userInfo }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  return (
    <Flex
      p={4}
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      align="center"
      minH="70px"
    >
      <IconButton
        icon={<FiArrowLeft />}
        variant="ghost"
        mr={2}
        onClick={onBack}
        display={{ base: "flex", md: "none" }}
        aria-label="Back"
      />

      <Box position="relative" mr={3}>
        <Avatar
          size="sm"
          src={customer.avatar}
          name={customer.clientdata?.username}
        />
        {onlineUsers && (
          <Box
            position="absolute"
            bottom={0}
            right={0}
            w={2}
            h={2}
            bg="green.400"
            borderRadius="full"
            border="1px"
            borderColor={bgColor}
          />
        )}
      </Box>

      <VStack align="start" spacing={0} flex={1}>
        <Text fontWeight="semibold" fontSize="md">
          {customer.clientdata?.username}
        </Text>
        <Text
          fontSize="xs"
          color={
            onlineUsers?.some((id) => id !== userInfo?._id)
              ? "green.500"
              : "gray.500"
          }
        >
          {onlineUsers?.some((id) => id !== userInfo?._id) ? "ອອນໄລ" : "ອ໋ອບໄລ"}
        </Text>
      </VStack>

      <HStack>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FiMoreVertical />}
            variant="ghost"
            aria-label="Options"
          />
          <MenuList>
            <MenuItem>ເບີ່ງໂປຣໄຟລ</MenuItem>
            <MenuItem>ປະຫວັດການສັ່ງຊື້</MenuItem>
            <MenuItem color="red.500">ບ໋ອກລູກຄ້າ</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
});

const DateSeparator = memo(({ date }) => (
  <Center my={4}>
    <Box
      px={3}
      py={1}
      borderRadius="md"
      bg="gray.300"
      _dark={{ bg: "gray.600" }}
      fontSize="sm"
      fontWeight="medium"
    >
      {date}
    </Box>
  </Center>
));

const MessageBubble = memo(({ message, isOwn }) => {
  const bgColor = useColorModeValue(
    isOwn ? "blue.500" : "gray.100",
    isOwn ? "blue.600" : "gray.700"
  );
  const textColor = useColorModeValue(
    isOwn ? "white" : "gray.900",
    isOwn ? "white" : "gray.100"
  );

  const messageTime = useMemo(() => {
    if (!message?.createdAt) return "";
    try {
      const date = new Date(message.createdAt);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  }, [message?.createdAt]);

  const getStatusIcon = useMemo(() => {
    switch (message.status) {
      case "sent":
        return <FiCheckCircle size={12} />;
      case "delivered":
        return <FiCheckSquare size={12} />;
      case "read":
        return <FiCheckSquare size={12} color="#00D4AA" />;
      default:
        return null;
    }
  }, [message.status]);

  return (
    <Flex justify={isOwn ? "flex-end" : "flex-start"} mb={2}>
      <Box maxW="70%">
        <Box
          bg={bgColor}
          color={textColor}
          px={4}
          py={2}
          borderRadius="lg"
          borderBottomRightRadius={isOwn ? "sm" : "lg"}
          borderBottomLeftRadius={isOwn ? "lg" : "sm"}
        >
          <Text fontSize="sm" wordBreak="break-word">
            {message.text}
          </Text>
        </Box>
        <HStack justify={isOwn ? "flex-end" : "flex-start"} mt={1} spacing={1}>
          <Text fontSize="xs" color="gray.500">
            {messageTime}
          </Text>
          {isOwn && getStatusIcon}
        </HStack>
      </Box>
    </Flex>
  );
});

const MessageList = memo(({ messages, userInfo }) => {
  const messagesBoxRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleScroll = useCallback(() => {
    const box = messagesBoxRef.current;
    if (!box) return;

    const isBottom = box.scrollHeight - box.scrollTop <= box.clientHeight + 50;
    setIsAtBottom(isBottom);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (isAtBottom && messagesBoxRef.current) {
      const scrollToBottom = () => {
        messagesBoxRef.current.scrollTop = messagesBoxRef.current.scrollHeight;
      };
      requestAnimationFrame(scrollToBottom);
    }
  }, [messages, isAtBottom]);

  const messageElements = useMemo(() => {
    if (!messages || messages.length === 0) {
      return (
        <Text textAlign="center" color="gray.500" py={8}>
          ຍັງບໍ່ມີຂໍ້ຄວາມ ເລີ່ມສົນທະນາກັນເລີຍ!
        </Text>
      );
    }

    let lastDate = null;
    return messages.map((message) => {
      const msgDate = new Date(message.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const isOwnMessage =
        message.sender?._id?.toString() === userInfo?._id?.toString() ||
        message.sender?.toString() === userInfo?._id?.toString();

      const showDateSeparator = msgDate !== lastDate;
      lastDate = msgDate;

      return (
        <React.Fragment key={message._id}>
          {showDateSeparator && <DateSeparator date={msgDate} />}
          <MessageBubble message={message} isOwn={isOwnMessage} />
        </React.Fragment>
      );
    });
  }, [messages, userInfo]);

  return (
    <Box
      flex={1}
      overflowY="auto"
      p={4}
      bg={useColorModeValue("gray.50", "gray.900")}
      ref={messagesBoxRef}
      onScroll={handleScroll}
    >
      {messageElements}
    </Box>
  );
});

const ChatInput = memo(({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const textareaRef = useRef(null);
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const onEmojiClick = useCallback((emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowPicker(false);
  }, []);

  const handleSend = useCallback(() => {
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      onSendMessage(trimmedMessage);
      setMessage("");
      setIsTyping(false);
    }
  }, [message, onSendMessage]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setMessage(value);
    setIsTyping(value.length > 0);
  }, []);

  const toggleEmojiPicker = useCallback(() => {
    setShowPicker((prev) => !prev);
  }, []);

  const isMessageEmpty = useMemo(() => !message.trim(), [message]);

  return (
    <Box p={4} bg={bgColor} borderTop="1px" borderColor={borderColor}>
      {isTyping && (
        <Text fontSize="xs" color="gray.500" mb={2}>
          กำลังพิมพ์...
        </Text>
      )}
      {showPicker && (
        <Box position="absolute" bottom="50px" zIndex={1000}>
          <Picker onEmojiClick={onEmojiClick} />
        </Box>
      )}
      <HStack spacing={2}>
        <IconButton
          icon={<FiSmile />}
          variant="ghost"
          aria-label="Emoji"
          size="sm"
          onClick={toggleEmojiPicker}
        />
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="ພິມຂໍ້ຄວາມ..."
          resize="none"
          minH="40px"
          maxH="120px"
          flex={1}
          borderRadius="lg"
        />
        <IconButton
          icon={<FiSend />}
          colorScheme="blue"
          onClick={handleSend}
          isDisabled={isMessageEmpty}
          aria-label="Send message"
        />
      </HStack>
    </Box>
  );
});

// Custom hook for managing socket connection and messages
const useSocketManager = (socket, userInfo, selectedCustomer) => {
  const [conversations, setConversations] = useState();
  const [currentMessages, setCurrentMessages] = useState();
  const [onlineUsers, setOnlineUsers] = useState([]);
  // Handle new messages from socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (!message?._id || !message?.conversationId) return;

      if (message?.conversationId === selectedCustomer?._id) {
        setCurrentMessages((prev) => {
          if (prev?.some((m) => m._id === message.tempMessageId)) return prev;
          return [...(prev || []), message];
        });
      }

      // TODO: ควรปรับให้ server ส่ง event เฉพาะห้อง เช่น "updateConversation"
      socket.emit("conversation_all", { userId: userInfo?._id }, (response) => {
        if (response.status === "ok") {
          setConversations(response.data);
        }
      });
    };

    // Initial fetch conversations
    socket.emit("conversation_all", { userId: userInfo?._id }, (response) => {
      if (response.status === "ok") {
        setConversations(response.data);
      } else {
        console.error("Error:", response.message);
      }
    });
    socket.emit("registerUser", userInfo?._id);
    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedCustomer?._id, userInfo?._id]);

  // Handle room joining and conver consation fetching
  useEffect(() => {
    if (!socket || !selectedCustomer?._id) return;
    socket.emit("joinRoom", selectedCustomer._id, userInfo?._id);
    socket.on("roomOnlineUsers", (onlineUsers) => {
      // เก็บ state ไว้โชว์ว่าใครออนไลน์ในห้องนี้
      setOnlineUsers(onlineUsers);
    });

    socket.emit(
      "getConversation",
      { conversationId: selectedCustomer._id },
      (response) => {
        if (response.status === "ok") {
          setCurrentMessages(response.messages);
        } else {
          console.error("Error:", response.message);
        }
      }
    );

    socket.on("userLeft", ({ userId, room }) => {
      console.log(`❌ User ${userId} left room ${room}`);
    });
    return () => {
      // ออกจากห้องเก่า
      if (selectedCustomer?._id) {
        socket.emit("leaveRoom", selectedCustomer._id, userInfo?._id);
      }
      socket.off("roomOnlineUsers");
      socket.off("userLeft");
    };
  }, [socket, selectedCustomer?._id, setOnlineUsers, userInfo?._id]);

  return { conversations, currentMessages, setCurrentMessages, onlineUsers };
};
// Main Component
const ChatCustomer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { isOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const toast = useToast();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { socket, isConnected } = useSocket(userInfo?._id);
  const [isLoading, setIsLoading] = useState(false);
  const {
    conversations,
    currentMessages,
    setCurrentMessages,
    
    onlineUsers = [], // ✅ default เป็น array ว่าง
  } = useSocketManager(socket, userInfo, selectedCustomer, toast, setIsLoading);

  // Initialize user data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await dispatch(get_user());
      } catch (err) {
        console.error(err);
      }
    };
    loadInitialData();
  }, [dispatch]);

  // Utility function for timestamp formatting
  const formatTimestamp = useCallback((timestamp) => {
    if (!timestamp) return "";

    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "";

      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString("th-TH", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  }, []);

  // Handle message sending
  const handleSendMessage = useCallback(
    (messageText) => {
      if (!socket || !selectedCustomer?._id || !userInfo?._id) return;

      const tempId = `temp_${Date.now()}_${Math.random()}`;
      const tempMessage = {
        _id: tempId,
        text: messageText,
        sender: {
          _id: userInfo._id,
          name: userInfo.name,
        },
        conversationId: selectedCustomer._id,
        createdAt: new Date().toISOString(),
        status: "sending",
      };

      try {
        // Optimistically add message to UI
        setCurrentMessages((prev) => [...(prev || []), tempMessage]);

        // Send message via socket
        socket.emit("sendMessage", {
          conversationId: selectedCustomer._id,
          text: messageText,
          sender: userInfo._id,
          tempMessageId: tempId,
        });

        // Simulate message status updates
        setTimeout(() => {
          setCurrentMessages(
            (prev) =>
              prev?.map((msg) =>
                msg._id === tempId ? { ...msg, status: "delivered" } : msg
              ) || []
          );
        }, 1000);

        setTimeout(() => {
          setCurrentMessages(
            (prev) =>
              prev?.map((msg) =>
                msg._id === tempId ? { ...msg, status: "read" } : msg
              ) || []
          );
        }, 3000);
      } catch (error) {
        console.error("Failed to send message:", error);
        setCurrentMessages((prev) =>
          (prev || []).filter((msg) => msg._id !== tempId)
        );
        toast({
          title: "Failed to send message",
          status: "error",
          duration: 3000,
        });
      }
    },
    [socket, selectedCustomer?._id, userInfo, toast, setCurrentMessages]
  );

  // Handle customer selection
  const handleSelectCustomer = useCallback(
    async (customer) => {
      try {
        setSelectedCustomer(customer);
        // Mark messages as read
        setTimeout(() => {
          if (socket && isConnected && customer._id) {
            socket.emit("registerUser", customer._id);
            socket.emit(
              "markAsRead",
              {
                conversationId: customer._id,
                userId: userInfo._id,
              },
              (ack) => console.log("Mark as read:", ack)
            );
          }
        }, 100);
      } catch (error) {
        console.error("Failed to select conversation:", error);
        toast({
          title: "Error",
          description: "Failed to load conversation",
          status: "error",
          duration: 3000,
        });
      }
    },
    [socket, isConnected, userInfo, toast]
  );

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (isMobile) {
      setSelectedCustomer(null);
    }
  }, [isMobile]);

  // Mobile view - selected customer
  if (isMobile && selectedCustomer) {
    return (
      <Flex h="100vh" direction="column">
        <ChatHeader
          onlineUsers={onlineUsers || []}
          customer={selectedCustomer}
          onBack={handleBack}
          userInfo={userInfo}
        />
        <MessageList messages={currentMessages} userInfo={userInfo} />
        <ChatInput onSendMessage={handleSendMessage} />
      </Flex>
    );
  }
 if (isLoading) {
    return (
      <Center h="200px">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }
  // Mobile view - customer list
  if (isMobile && !selectedCustomer) {
    return (
      <Box h="100vh">
        <Sidebar
          customers={conversations}
          selectedCustomer={selectedCustomer}
          onSelectCustomer={handleSelectCustomer}
          searchTerm={searchTerm}
          formatTimestamp={formatTimestamp}
          setSearchTerm={setSearchTerm}
          isLoading={isLoading}
        />
      </Box>
    );
  }
  // Desktop view
  return (
    <Flex w="1300px" h="100vh">
      <Box display={{ base: "none", md: "block" }}>
        <Sidebar
          customers={conversations}
          selectedCustomer={selectedCustomer}
          onSelectCustomer={handleSelectCustomer}
          searchTerm={searchTerm}
          formatTimestamp={formatTimestamp}
          setSearchTerm={setSearchTerm}
          isLoading={isLoading}
        />
      </Box>

      <Flex flex={1} direction="column">
        {selectedCustomer ? (
          <>
            <ChatHeader
              userInfo={userInfo}
              onlineUsers={onlineUsers || []}
              customer={selectedCustomer}
              onBack={handleBack}
            />
            <MessageList messages={currentMessages} userInfo={userInfo} />
            <ChatInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <Flex flex={1} align="center" justify="center">
            <VStack spacing={4}>
              <Text fontSize="2xl" color="gray.500">
                ເລືອກລູກຄ້າທີ່ຕ້ອງການແຊດ
              </Text>
              <Text color="gray.400">ເລືອກລູກຄ້າທີ່ຕ້ອງການສົນທະນາ</Text>
            </VStack>
          </Flex>
        )}
      </Flex>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>ລູກຄ້າ</DrawerHeader>
          <DrawerBody p={0}>
            <Sidebar
              isLoading={isLoading}
              customers={conversations}
              selectedCustomer={selectedCustomer}
              onSelectCustomer={handleSelectCustomer}
              onClose={onClose}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              formatTimestamp={formatTimestamp}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default ChatCustomer;
