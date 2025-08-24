import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Card,
  CardHeader,
  CardBody,
  Text,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  FormErrorMessage,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';

const FlashSaleAdminDashboard = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  
  // Mock products data with product codes
  const [products] = useState([
    { id: 1, code: 'IP15P001', name: 'iPhone 15 Pro', price: 45900, category: 'Electronics' },
    { id: 2, code: 'SGS24001', name: 'Samsung Galaxy S24', price: 32900, category: 'Electronics' },
    { id: 3, code: 'MBP3001', name: 'MacBook Pro M3', price: 89900, category: 'Electronics' },
    { id: 4, code: 'APR001', name: 'AirPods Pro', price: 8990, category: 'Accessories' },
    { id: 5, code: 'IPA001', name: 'iPad Air', price: 24900, category: 'Electronics' },
    { id: 6, code: 'WTH001', name: 'Apple Watch Series 9', price: 15900, category: 'Accessories' },
    { id: 7, code: 'KBD001', name: 'Magic Keyboard', price: 4490, category: 'Accessories' },
    { id: 8, code: 'MSE001', name: 'Magic Mouse', price: 2490, category: 'Accessories' },
    { id: 9, code: 'CHG001', name: 'MagSafe Charger', price: 1590, category: 'Accessories' },
    { id: 10, code: 'CAM001', name: 'Canon EOS R6', price: 89900, category: 'Electronics' },
    { id: 11, code: 'LNS001', name: 'Canon RF 24-70mm f/2.8L', price: 85900, category: 'Electronics' },
    { id: 12, code: 'MON001', name: 'LG UltraWide Monitor 34"', price: 24900, category: 'Electronics' },
    { id: 13, code: 'SSD001', name: 'Samsung SSD 1TB', price: 3990, category: 'Electronics' },
    { id: 14, code: 'RAM001', name: 'Corsair RAM 32GB DDR5', price: 8990, category: 'Electronics' },
    { id: 15, code: 'GPU001', name: 'NVIDIA RTX 4080', price: 45900, category: 'Electronics' }
  ]);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Form states
  const [formData, setFormData] = useState({
    productId: '',
    discountPercent: '',
    startDateTime: '',
    endDateTime: ''
  });
  
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  
  // Flash sales data
  const [flashSales, setFlashSales] = useState([
    {
      id: 1,
      productId: 1,
      discountPercent: 20,
      startDateTime: '2025-08-25T10:00',
      endDateTime: '2025-08-25T23:59',
      status: 'scheduled'
    },
    {
      id: 2,
      productId: 2,
      discountPercent: 15,
      startDateTime: '2025-08-24T12:00',
      endDateTime: '2025-08-24T18:00',
      status: 'active'
    },
    {
      id: 3,
      productId: 4,
      discountPercent: 25,
      startDateTime: '2025-08-23T09:00',
      endDateTime: '2025-08-23T21:00',
      status: 'ended'
    }
  ]);

  // Get product by ID
  const getProduct = (productId) => {
    return products.find(p => p.id === parseInt(productId));
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    if (!originalPrice || !discountPercent) return 0;
    return originalPrice * (1 - discountPercent / 100);
  };

  // Get status based on current time
  const getFlashSaleStatus = (startDateTime, endDateTime) => {
    const now = new Date();
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    
    if (now < start) return 'scheduled';
    if (now > end) return 'ended';
    return 'active';
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.productId) {
      newErrors.productId = 'กรุณาเลือกสินค้า';
    }
    
    if (!formData.discountPercent) {
      newErrors.discountPercent = 'กรุณากรอกเปอร์เซ็นต์ส่วนลด';
    } else if (formData.discountPercent <= 0 || formData.discountPercent > 100) {
      newErrors.discountPercent = 'เปอร์เซ็นต์ส่วนลดต้องอยู่ระหว่าง 1-100';
    }
    
    if (!formData.startDateTime) {
      newErrors.startDateTime = 'กรุณาเลือกเวลาเริ่มต้น';
    }
    
    if (!formData.endDateTime) {
      newErrors.endDateTime = 'กรุณาเลือกเวลาสิ้นสุด';
    } else if (formData.startDateTime && formData.endDateTime <= formData.startDateTime) {
      newErrors.endDateTime = 'เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น';
    }
    
    // Check for overlapping flash sales (exclude current editing item)
    const existingSales = flashSales.filter(sale => sale.id !== editingId);
    const hasOverlap = existingSales.some(sale => {
      if (sale.productId !== parseInt(formData.productId)) return false;
      
      const existingStart = new Date(sale.startDateTime);
      const existingEnd = new Date(sale.endDateTime);
      const newStart = new Date(formData.startDateTime);
      const newEnd = new Date(formData.endDateTime);
      
      return (newStart < existingEnd && newEnd > existingStart);
    });
    
    if (hasOverlap) {
      newErrors.startDateTime = 'มี Flash Sale ของสินค้านี้ในช่วงเวลาที่ซ้ำซ้อน';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const newFlashSale = {
      id: editingId || Date.now(),
      productId: parseInt(formData.productId),
      discountPercent: parseFloat(formData.discountPercent),
      startDateTime: formData.startDateTime,
      endDateTime: formData.endDateTime,
      status: getFlashSaleStatus(formData.startDateTime, formData.endDateTime)
    };
    
    if (editingId) {
      setFlashSales(prev => prev.map(sale => 
        sale.id === editingId ? newFlashSale : sale
      ));
      toast({
        title: 'อัปเดต Flash Sale สำเร็จ',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      setFlashSales(prev => [...prev, newFlashSale]);
      toast({
        title: 'เพิ่ม Flash Sale สำเร็จ',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      productId: '',
      discountPercent: '',
      startDateTime: '',
      endDateTime: ''
    });
    setErrors({});
    setEditingId(null);
  };

  // Handle edit
  const handleEdit = (sale) => {
    setFormData({
      productId: sale.productId.toString(),
      discountPercent: sale.discountPercent.toString(),
      startDateTime: sale.startDateTime,
      endDateTime: sale.endDateTime
    });
    setEditingId(sale.id);
  };

  // Handle delete
  const handleDelete = () => {
    setFlashSales(prev => prev.filter(sale => sale.id !== deleteId));
    toast({
      title: 'ลบ Flash Sale สำเร็จ',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onClose();
    setDeleteId(null);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'blue';
      case 'active': return 'green';
      case 'ended': return 'gray';
      default: return 'gray';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled': return 'กำหนดการ';
      case 'active': return 'กำลังดำเนินการ';
      case 'ended': return 'สิ้นสุดแล้ว';
      default: return 'ไม่ทราบสถานะ';
    }
  };

  // Filter products based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  // Update statuses periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setFlashSales(prev => prev.map(sale => ({
        ...sale,
        status: getFlashSaleStatus(sale.startDateTime, sale.endDateTime)
      })));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const selectedProduct = getProduct(formData.productId);
  const discountedPrice = selectedProduct ? calculateDiscountedPrice(selectedProduct.price, formData.discountPercent) : 0;

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" color="gray.800" mb={2}>
            จัดการ Flash Sale
          </Heading>
          <Text color="gray.600">เพิ่มและจัดการ Flash Sale สำหรับสินค้าของคุณ</Text>
        </Box>

        {/* Add/Edit Flash Sale Form */}
        <Card>
          <CardHeader>
            <Flex>
              <Heading size="md">
                {editingId ? 'แก้ไข Flash Sale' : 'เพิ่ม Flash Sale ใหม่'}
              </Heading>
              <Spacer />
              {editingId && (
                <Button size="sm" variant="ghost" onClick={resetForm}>
                  ยกเลิก
                </Button>
              )}
            </Flex>
          </CardHeader>
          <CardBody>
            <VStack spacing={6}>
              <HStack spacing={4} w="full" align="flex-start">
                {/* Product Selection with Search */}
                <FormControl isInvalid={errors.productId} flex={2}>
                  <FormLabel>เลือกสินค้า</FormLabel>
                  <VStack spacing={2} align="stretch">
                    <Input
                      placeholder="ค้นหาจากรหัสสินค้าหรือชื่อสินค้า..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      size="md"
                    />
                    <Select
                      placeholder={filteredProducts.length === 0 ? "ไม่พบสินค้าที่ค้นหา" : "เลือกสินค้า"}
                      value={formData.productId}
                      onChange={(e) => setFormData(prev => ({...prev, productId: e.target.value}))}
                      maxH="200px"
                      overflowY="auto"
                    >
                      {filteredProducts.map(product => (
                        <option key={product.id} value={product.id}>
                          [{product.code}] {product.name} - ฿{product.price.toLocaleString()}
                        </option>
                      ))}
                    </Select>
                    {searchTerm && (
                      <Text fontSize="xs" color="gray.500">
                        พบ {filteredProducts.length} รายการ
                      </Text>
                    )}
                  </VStack>
                  <FormErrorMessage>{errors.productId}</FormErrorMessage>
                </FormControl>

                {/* Discount Percentage */}
                <FormControl isInvalid={errors.discountPercent} flex={1}>
                  <FormLabel>เปอร์เซ็นต์ส่วนลด (%)</FormLabel>
                  <NumberInput
                    min={1}
                    max={100}
                    value={formData.discountPercent}
                    onChange={(value) => setFormData(prev => ({...prev, discountPercent: value}))}
                  >
                    <NumberInputField placeholder="เช่น 20" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormErrorMessage>{errors.discountPercent}</FormErrorMessage>
                </FormControl>

                {/* Price Preview */}
                <FormControl flex={1}>
                  <FormLabel>ราคาหลังลด</FormLabel>
                  <Input
                    value={selectedProduct && discountedPrice ? `฿${discountedPrice.toLocaleString()}` : ''}
                    isReadOnly
                    bg="gray.50"
                    placeholder="ราคาจะแสดงอัตโนมัติ"
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4} w="full" align="flex-start">
                {/* Start DateTime */}
                <FormControl isInvalid={errors.startDateTime} flex={1}>
                  <FormLabel>เวลาเริ่มต้น</FormLabel>
                  <Input
                    type="datetime-local"
                    value={formData.startDateTime}
                    onChange={(e) => setFormData(prev => ({...prev, startDateTime: e.target.value}))}
                  />
                  <FormErrorMessage>{errors.startDateTime}</FormErrorMessage>
                </FormControl>

                {/* End DateTime */}
                <FormControl isInvalid={errors.endDateTime} flex={1}>
                  <FormLabel>เวลาสิ้นสุด</FormLabel>
                  <Input
                    type="datetime-local"
                    value={formData.endDateTime}
                    onChange={(e) => setFormData(prev => ({...prev, endDateTime: e.target.value}))}
                  />
                  <FormErrorMessage>{errors.endDateTime}</FormErrorMessage>
                </FormControl>
              </HStack>

              <HStack spacing={4}>
                <Button
                  colorScheme="blue"
                  leftIcon={<AddIcon />}
                  onClick={handleSubmit}
                >
                  {editingId ? 'อัปเดต Flash Sale' : 'เพิ่ม Flash Sale'}
                </Button>
                {editingId && (
                  <Button variant="outline" onClick={resetForm}>
                    ยกเลิก
                  </Button>
                )}
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Flash Sales Table */}
        <Card>
          <CardHeader>
            <Heading size="md">รายการ Flash Sale</Heading>
          </CardHeader>
          <CardBody>
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>สินค้า</Th>
                    <Th isNumeric>ส่วนลด</Th>
                    <Th isNumeric>ราคาเดิม</Th>
                    <Th isNumeric>ราคาหลังลด</Th>
                    <Th>ช่วงเวลา</Th>
                    <Th>สถานะ</Th>
                    <Th>การจัดการ</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {flashSales.map((sale) => {
                    const product = getProduct(sale.productId);
                    const discountedPrice = calculateDiscountedPrice(product?.price, sale.discountPercent);
                    const currentStatus = getFlashSaleStatus(sale.startDateTime, sale.endDateTime);
                    
                    return (
                      <Tr key={sale.id}>
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="medium">{product?.name}</Text>
                            <HStack>
                              <Badge colorScheme="blue" variant="outline" fontSize="xs">
                                {product?.code}
                              </Badge>
                              <Text fontSize="sm" color="gray.500">{product?.category}</Text>
                            </HStack>
                          </VStack>
                        </Td>
                        <Td isNumeric>
                          <Badge colorScheme="red" variant="subtle">
                            -{sale.discountPercent}%
                          </Badge>
                        </Td>
                        <Td isNumeric>฿{product?.price.toLocaleString()}</Td>
                        <Td isNumeric fontWeight="bold" color="red.500">
                          ฿{discountedPrice.toLocaleString()}
                        </Td>
                        <Td>
                          <VStack align="start" spacing={0}>
                            <Text fontSize="sm">
                              {new Date(sale.startDateTime).toLocaleDateString('th-TH', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              ถึง {new Date(sale.endDateTime).toLocaleDateString('th-TH', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Text>
                          </VStack>
                        </Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(currentStatus)} variant="subtle">
                            {getStatusText(currentStatus)}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton
                              icon={<EditIcon />}
                              size="sm"
                              colorScheme="blue"
                              variant="ghost"
                              onClick={() => handleEdit(sale)}
                              aria-label="แก้ไข"
                            />
                            <IconButton
                              icon={<DeleteIcon />}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => {
                                setDeleteId(sale.id);
                                onOpen();
                              }}
                              aria-label="ลบ"
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
              
              {flashSales.length === 0 && (
                <Box textAlign="center" py={8}>
                  <Text color="gray.500">ยังไม่มี Flash Sale</Text>
                </Box>
              )}
            </Box>
          </CardBody>
        </Card>
      </VStack>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              ยืนยันการลบ Flash Sale
            </AlertDialogHeader>

            <AlertDialogBody>
              คุณแน่ใจหรือไม่ว่าต้องการลบ Flash Sale นี้? การดำเนินการนี้ไม่สามารถยกเลิกได้
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                ยกเลิก
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                ลบ
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default FlashSaleAdminDashboard;