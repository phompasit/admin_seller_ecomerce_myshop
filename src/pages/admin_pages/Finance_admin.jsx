import React, { useState, useEffect, useCallback } from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  IconButton,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  VStack,
  HStack,
  Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Container,
  extendTheme,
  Image,
  Center,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import {
  SearchIcon,
  CheckIcon,
  CloseIcon,
  ViewIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  Approving_withdrawal,
  get_balance,
} from "../../hooks/reducer/finance_reducer/finance";
import { Building, Hash, Icon, Store, User } from "lucide-react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.50",
      },
    },
  },
});

const Finance_admin = () => {
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
    const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const { get_balances, loader: reduxLoading } = useSelector(
    (state) => state.finance
  );
  const [isLoading, setIsLoading] = useState();
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      await dispatch(get_balance());
    } catch (error) {
      toast({
        title: error.message || "ເກີດຂໍ້ຜິດພາດ",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, toast]);
  useEffect(() => {
    fetchData();
  }, [dispatch, fetchData]);
  // Process seller data with withdrawal information
  const processedSellers = get_balances?.map((seller) => {
    const pendingWithdrawals =
      seller.withdrewIds?.filter((w) => w?.status === "pending") || [];

    const totalWithdrawalAmount = pendingWithdrawals.reduce(
      (sum, w) => sum + (w?.amount || 0),
      0
    );

    return {
      ...seller,
      pendingCount: pendingWithdrawals.length,
      pendingAmount: totalWithdrawalAmount,
      withdrawalRequests: seller.withdrewIds || [],
    };
  });

  // Filter sellers based on search term
  const filteredSellers = processedSellers?.filter((seller) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      seller?.seller_id?.store_name?.toLowerCase().includes(searchLower) ||
      seller?.seller_id?.username?.toLowerCase().includes(searchLower) ||
      seller?.seller_id?.phone?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
      case "approved":
        return "green";
      case "pending":
        return "yellow";
      case "rejected":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
      case "approved":
        return "ສໍາເລັດ";
      case "pending":
        return "ລໍຖ້າດໍາເນີນການ";
      case "rejected":
        return "ປະຕິເສດ";
      default:
        return status;
    }
  };

  // const formatDate = (dateString) => {
  //   if (!dateString) return "-";
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString("lo-LA", {
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //   });
  // };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("lo-LA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleApproveClick = (request) => {
    setSelectedRequest(request);
    onOpen();
  };


  const handleApprove = () => {
    dispatch(
      Approving_withdrawal({
        selectedRequest: selectedRequest,
        status: "success",
      })
    )
      .then((res) => {
        toast({
          title: res.message || "ອະນຸມັດສຳເລັດ",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        dispatch(get_balance());
      })
      .catch((error) => {
        toast({
          title: error.message || "ເກີດຂໍ້ຜິດພາດ",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
    onClose();
    setSelectedRequest(null);
    // Refresh data
  };

  const handleReject = (data) => {
    try {
      dispatch(
        Approving_withdrawal({
          selectedRequest: data,
          status: "rejected",
        })
      )
        .then((res) => {
          toast({
            title: res.message || "ອະນຸມັດສຳເລັດ",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          dispatch(get_balance());
        })
        .catch((error) => {
          toast({
            title: error.message || "ເກີດຂໍ້ຜິດພາດ",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    } catch (error) {
      toast({
        title: error.message || "ເກີດຂໍ້ຜິດພາດ",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
   if (isLoading || reduxLoading) {
     return (
       <Center h="200px">
         <Spinner size="xl" color="blue.500" />
       </Center>
     );
   }
  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg="gray.50">
        {/* Header */}
        <Box bg="white" borderBottom="1px" borderColor="gray.200" px={6} py={4}>
          <Container maxW="container.xl">
            <Heading
              fontFamily="Noto Sans Lao, serif"
              size="lg"
              color="gray.800"
            >
              ຈັດການການເງິນຂອງຜູ້ຂາຍ
            </Heading>
            <Text fontSize="sm" color="gray.600" mt={1}>
              ລະບົບຈັດການຍອດເງິນ ແລະ ການຖອນເງິນຂອງຜູ້ຂາຍ
            </Text>
          </Container>
        </Box>
        <Box p={4} textAlign="center">
          <Button
            onClick={fetchData}
            leftIcon={<RepeatIcon />}
            colorScheme="teal"
            variant="solid"
            size="md"
            borderRadius="xl"
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(0.95)" }}
          >
            Refresh
          </Button>
        </Box>
        <Container maxW="container.xl" py={6}>
          <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap={6}>
            {/* Left Panel - Seller List */}
            <GridItem colSpan={{ base: 1, lg: 1 }}>
              <Card>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <Heading fontFamily="Noto Sans Lao, serif" size="md">
                      ລາຍຊື່ຜູ້ຂາຍ
                    </Heading>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.400" />
                      </InputLeftElement>
                      <Input
                        placeholder="ຄົ້ນຫາຜູ້ຂາຍ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                    <Divider />
                    <VStack
                      align="stretch"
                      spacing={0}
                      maxH="calc(160vh - 320px)"
                      overflowY="auto"
                      divider={<Divider />}
                    >
                      {filteredSellers && filteredSellers.length > 0 ? (
                        filteredSellers?.map((seller) => (
                          <Box
                            key={seller._id}
                            p={4}
                            cursor="pointer"
                            bg={
                              selectedSeller?._id === seller._id
                                ? "blue.50"
                                : "transparent"
                            }
                            borderLeft="4px"
                            borderLeftColor={
                              selectedSeller?._id === seller._id
                                ? "blue.500"
                                : "transparent"
                            }
                            _hover={{ bg: "gray.50" }}
                            onClick={() => setSelectedSeller(seller)}
                            transition="all 0.2s"
                          >
                            <Flex justify="space-between" align="flex-start">
                              <VStack align="start" spacing={2} flex={1}>
                                <Text
                                  fontWeight="semibold"
                                  fontSize="sm"
                                  noOfLines={1}
                                >
                                  {seller?.seller_id?.username || "N/A"} (
                                  {seller?.seller_model?.store_name})
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  {seller?.seller_id?.phone || ""}
                                </Text>
                                <VStack align="start" spacing={1} fontSize="xs">
                                  <HStack>
                                    <Text color="gray.600">ຄົງເຫຼືອ:</Text>
                                    <Text fontWeight="bold" color="blue.700">
                                      ₭{seller?.balance?.toLocaleString() || 0}
                                    </Text>
                                  </HStack>
                                </VStack>
                              </VStack>
                              {seller.pendingCount > 0 && (
                                <Badge
                                  colorScheme="yellow"
                                  fontSize="xs"
                                  ml={2}
                                >
                                  {seller.pendingCount} ລໍຖ້າ
                                </Badge>
                              )}
                            </Flex>
                          </Box>
                        ))
                      ) : (
                        <Box p={8} textAlign="center">
                          <Text color="gray.500">ບໍ່ມີຂໍ້ມູນຜູ້ຂາຍ</Text>
                        </Box>
                      )}
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>

            {/* Right Panel - Seller Details */}
            <GridItem colSpan={{ base: 1, lg: 2 }}>
              {selectedSeller ? (
                <VStack spacing={6} align="stretch">
                  {/* Summary Cards */}
                  <Grid
                    templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                    gap={4}
                  >
                    <Card>
                      <CardBody>
                        <Stat>
                          <StatLabel fontSize="sm" color="gray.600">
                            ຍອດຄົງເຫຼືອ
                          </StatLabel>
                          <StatNumber fontSize="2xl" color="blue.600">
                            ₭
                            {selectedSeller?.pendingAmount?.toLocaleString() ||
                              0}
                          </StatNumber>
                        </Stat>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardBody>
                        <Stat>
                          <StatLabel fontSize="sm" color="gray.600">
                            ລໍຖ້າອະນຸມັດ
                          </StatLabel>
                          <StatNumber fontSize="2xl" color="yellow.600">
                            {selectedSeller?.pendingCount || 0}
                          </StatNumber>
                        </Stat>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardBody>
                        <Stat>
                          <StatLabel fontSize="sm" color="gray.600">
                            ຈໍານວນລໍຖ້າອະນຸມັດ
                          </StatLabel>
                          <StatNumber fontSize="2xl" color="orange.600">
                            ₭
                            {selectedSeller?.pendingAmount?.toLocaleString() ||
                              0}
                          </StatNumber>
                        </Stat>
                      </CardBody>
                    </Card>
                  </Grid>

                  {/* Pending Withdrawal Requests */}
                  {selectedSeller?.withdrawalRequests?.filter(
                    (w) => w?.status === "pending"
                  )?.length > 0 && (
                    <Card>
                      <CardBody>
                        <VStack align="stretch" spacing={4}>
                          <Heading fontFamily="Noto Sans Lao, serif" size="md">
                            ຄໍາຂໍຖອນເງິນລໍຖ້າອະນຸມັດ
                          </Heading>
                          <Box overflowX="auto">
                            <Table variant="simple" size="sm">
                              <Thead>
                                <Tr>
                                  <Th fontFamily="Noto Sans Lao, serif">
                                    ຈໍານວນເງິນ
                                  </Th>
                                  <Th fontFamily="Noto Sans Lao, serif">
                                    ໝາຍເຫດ
                                  </Th>
                                  <Th fontFamily="Noto Sans Lao, serif">
                                    ວັນທີ່
                                  </Th>
                                  <Th fontFamily="Noto Sans Lao, serif">
                                    ສະຖານະ
                                  </Th>
                                  <Th fontFamily="Noto Sans Lao, serif">
                                    ການຈັດການ
                                  </Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {selectedSeller.withdrawalRequests
                                  ?.filter((w) => w?.status === "pending")
                                  ?.map((request) => (
                                    <Tr key={request._id}>
                                      <Td fontWeight="bold" color="blue.700">
                                        ₭{request.amount?.toLocaleString() || 0}
                                      </Td>
                                      <Td fontSize="sm">
                                        {request.note || "-"}
                                      </Td>
                                      <Td fontSize="sm">
                                        {formatDateTime(request.createdAt)}
                                      </Td>
                                      <Td>
                                        <Badge
                                          colorScheme={getStatusColor(
                                            request.status
                                          )}
                                          fontSize="xs"
                                        >
                                          {getStatusText(request.status)}
                                        </Badge>
                                      </Td>
                                      <Td>
                                        <HStack spacing={2}>
                                          <IconButton
                                            aria-label="ອະນຸມັດ"
                                            icon={<CheckIcon />}
                                            colorScheme="green"
                                            size="sm"
                                            onClick={() =>
                                              handleApproveClick(request)
                                            }
                                          />
                                          <IconButton
                                            aria-label="ປະຕິເສດ"
                                            icon={<CloseIcon />}
                                            colorScheme="red"
                                            size="sm"
                                            onClick={() =>
                                              handleReject(request)
                                            }
                                          />
                                        </HStack>
                                      </Td>
                                    </Tr>
                                  ))}
                              </Tbody>
                            </Table>
                          </Box>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}

                  {/* Transaction History */}
                  <Card>
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        <Heading fontFamily="Noto Sans Lao, serif" size="md">
                          ປະຫວັດການຖອນເງິນທັງໝົດ
                        </Heading>
                        <Box overflowX="auto">
                          <Table variant="simple" size="sm">
                            <Thead>
                              <Tr>
                                <Th fontFamily="Noto Sans Lao, serif">
                                  ຈໍານວນເງິນ
                                </Th>
                                <Th fontFamily="Noto Sans Lao, serif">
                                  ໝາຍເຫດ
                                </Th>
                                <Th fontFamily="Noto Sans Lao, serif">
                                  ສະຖານະ
                                </Th>
                                <Th fontFamily="Noto Sans Lao, serif">
                                  ວັນທີ່
                                </Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {selectedSeller?.withdrawalRequests &&
                              selectedSeller?.withdrawalRequests?.length > 0 ? (
                                selectedSeller.withdrawalRequests?.map((tx) => (
                                  <Tr key={tx._id}>
                                    <Td fontWeight="bold" color="blue.700">
                                      ₭{tx.amount?.toLocaleString() || 0}
                                    </Td>
                                    <Td fontSize="sm" color="gray.600">
                                      {tx.note || "-"}
                                    </Td>
                                    <Td>
                                      <Badge
                                        colorScheme={getStatusColor(tx.status)}
                                        fontSize="xs"
                                      >
                                        {getStatusText(tx.status)}
                                      </Badge>
                                    </Td>
                                    <Td fontSize="sm" color="gray.600">
                                      {formatDateTime(tx.createdAt)}
                                    </Td>
                                  </Tr>
                                ))
                              ) : (
                                <Tr>
                                  <Td colSpan={4} textAlign="center" py={8}>
                                    <Text color="gray.500">
                                      ບໍ່ມີປະຫວັດການຖອນເງິນ
                                    </Text>
                                  </Td>
                                </Tr>
                              )}
                            </Tbody>
                          </Table>
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>
                </VStack>
              ) : (
                <Card>
                  <CardBody>
                    <VStack spacing={4} py={12}>
                      <ViewIcon boxSize={16} color="gray.300" />
                      <Heading
                        fontFamily="Noto Sans Lao, serif"
                        size="md"
                        color="gray.700"
                      >
                        ເລືອກຜູ້ຂາຍເພື່ອເບິ່ງລາຍລະອຽດ
                      </Heading>
                      <Text color="gray.600" textAlign="center">
                        ກະລຸນາເລືອກຜູ້ຂາຍຈາກລາຍການດ້ານຊ້າຍເພື່ອເບິ່ງຂໍ້ມູນການເງິນ
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              )}
            </GridItem>
          </Grid>
        </Container>

        {/* Approval Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>ຢືນຢັນການອະນຸມັດຄໍາຂໍຖອນເງິນ</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedSeller && (
                <VStack align="stretch" spacing={4}>
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <VStack align="start" spacing={0} fontSize="sm">
                      <Text>ກະລຸນາກວດສອບຂໍ້ມູນກ່ອນອະນຸມັດ</Text>
                    </VStack>
                  </Alert>
                  <FormControl>
                    <FormLabel fontSize="sm">ຈໍານວນເງິນ</FormLabel>
                    <Input
                      value={`₭${
                        selectedRequest?.amount?.toLocaleString() || 0
                      }`}
                      isReadOnly
                      fontWeight="bold"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">ໝາຍເຫດ</FormLabel>
                    <Input value={selectedRequest?.note || "-"} isReadOnly />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">ວັນທີ່ຂໍຖອນ</FormLabel>
                    <Input
                      value={formatDateTime(selectedRequest?.createdAt)}
                      isReadOnly
                    />
                  </FormControl>
                  <Divider />
                  <Card
                    borderWidth="1px"
                    borderRadius="xl"
                    overflow="hidden"
                    transition="all 0.3s"
                    _hover={{ transform: "translateY(-4px)", shadow: "xl" }}
                  >
                    <Image
                      src={selectedSeller?.seller_model?.bank_account_images}
                      alt={selectedSeller?.seller_model?.bank_name}
                      objectFit="cover"
                      h="200px"
                      w="100%"
                      fallbackSrc="https://via.placeholder.com/400x250?text=Bank+Image"
                    />

                    <CardBody p={6}>
                      <VStack align="stretch" spacing={4}>
                        {/* Store Info */}
                        <Flex justify="space-between" align="center">
                          <HStack>
                            <Heading size="md">
                              {selectedSeller?.seller_model?.store_name}
                            </Heading>
                          </HStack>
                          <Badge
                            colorScheme="blue"
                            fontSize="sm"
                            px={3}
                            py={1}
                            borderRadius="full"
                          >
                            {selectedSeller?.seller_model?.store_code}
                          </Badge>
                        </Flex>

                        <Divider />

                        {/* Bank Details */}
                        <VStack align="stretch" spacing={3}>
                          <HStack>
                            <Box>
                              <Text fontSize="xs" fontWeight="medium">
                                ທະນາຄານ
                              </Text>
                              <Text fontSize="md" fontWeight="semibold">
                                {selectedSeller?.seller_model?.bank_name}
                              </Text>
                            </Box>
                          </HStack>

                          <HStack>
                            <Box>
                              <Text fontSize="xs" fontWeight="medium">
                                ຊື່ບັນຊີ
                              </Text>
                              <Text fontSize="md" fontWeight="semibold">
                                {
                                  selectedSeller?.seller_model
                                    ?.bank_account_name
                                }
                              </Text>
                            </Box>
                          </HStack>

                          <HStack>
                            <Box>
                              <Text fontSize="xs" fontWeight="medium">
                                ເລກທີ່ບັນຊີ
                              </Text>
                              <Text
                                fontSize="lg"
                                fontWeight="bold"
                                fontFamily="mono"
                                color="blue.600"
                              >
                                {
                                  selectedSeller?.seller_model
                                    ?.bank_account_number
                                }
                              </Text>
                            </Box>
                          </HStack>
                        </VStack>

                        <Button
                          colorScheme="blue"
                          size="sm"
                          mt={2}
                          onClick={() =>
                            navigator.clipboard.writeText(
                              selectedSeller?.seller_model?.bank_account_number
                            )
                          }
                        >
                          คัดลอกเลขบัญชี
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>

                  <HStack justify="space-between" fontSize="md">
                    <Text fontWeight="bold">ຈໍານວນເງິນທີ່ຜູ້ຂາຍຈະໄດ້ຮັບ:</Text>
                    <Text fontWeight="bold" color="green.600" fontSize="lg">
                      ₭{selectedRequest?.amount?.toLocaleString() || 0}
                    </Text>
                  </HStack>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                ຍົກເລີກ
              </Button>
              <Button colorScheme="green" onClick={handleApprove}>
                ອະນຸມັດຄໍາຂໍ
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  );
};

export default Finance_admin;
