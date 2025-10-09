import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Button,
  Switch,
  Image,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import {
  Upload,
  Save,
  X,
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  add_category,
  delete_category,
  get_category,
  messageClear,
  update_category,
} from "../../hooks/reducer/admin_reducer/provider_reducer";
const AdminAddCategory = () => {
  // Chakra UI hooks

  const toast = useToast();
  const fileInputRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(get_category());
  }, [dispatch]);
  const { successMessage, errorMessage, categoryList } = useSelector(
    (state) => state.provider_reducer
  );
  // Categories list
  const [categories, setCategories] = useState(categoryList);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    setCategories(categoryList);
  }, [categoryList]);

  // Form state for adding new category
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
    imagePreview: "",
    status: true,
  });

  // Form state for editing category
  const [editFormData, setEditFormData] = useState({
    id: null,
    name: "",
    description: "",
    image: null,
    imagePreview: "",
    status: true,
  });

  // Validation function
  const validateForm = (data) => {
    const newErrors = {};
    if (!data.name.trim()) {
      newErrors.name = "กรุณากรอกชื่อหมวดหมู่";
    }
    return newErrors;
  };

  // Handle input changes for add form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle input changes for edit form
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle status switch for add form
  const handleStatusChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      status: checked,
    }));
  };

  // Handle status switch for edit form
  const handleEditStatusChange = (checked) => {
    setEditFormData((prev) => ({
      ...prev,
      status: checked,
    }));
  };

  // Handle image upload for add form
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "ไฟล์ใหญ่เกินไป",
          description: "กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 5MB",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload for edit form
  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "ไฟล์ใหญ่เกินไป",
          description: "กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 5MB",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setEditFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image for add form
  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      imagePreview: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit new category
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add to categories list
      const newCategory = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
        image: formData.imagePreview || "/api/placeholder/100/100",
        status: formData.status,
      };

      setCategories((prev) => [...prev, newCategory]);
      dispatch(add_category(newCategory)).then(() => dispatch(get_category()));
      // Reset form
      setFormData({
        name: "",
        description: "",
        image: null,
        imagePreview: "",
        status: true,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message||"ไม่สามารถเพิ่มหมวดหมู่ได้ กรุณาลองใหม่อีกครั้ง",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit category
  const handleEdit = (category) => {
    setEditFormData({
      id: category?._id,
      name: category?.name,
      description: category?.description,
      image: category?.images,
      imagePreview: category?.images,
      status: category?.status,
    });
    onOpen();
  };
  // Submit edit category
  const handleEditSubmit = async () => {
    const validationErrors = validateForm(editFormData);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update categories list
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editFormData.id
            ? {
                ...cat,
                name: editFormData?.name,
                description: editFormData?.description,
                image: editFormData?.imagePreview,
                status: editFormData?.status,
              }
            : cat
        )
      );

      dispatch(
        update_category({
          id: editFormData.id,
          categoryData: {
            name: editFormData?.name,
            description: editFormData?.description,
            image: editFormData?.imagePreview,
            status: editFormData?.status,
          },
        })
      ).then(() => dispatch(get_category()));
      onClose();
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description:
          error.message || "ไม่สามารถแก้ไขหมวดหมู่ได้ กรุณาลองใหม่อีกครั้ง",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle delete category
  const handleDelete = (id) => {
    try {
      dispatch(delete_category(id)).then(() => dispatch(get_category()));
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description:
          error.message || "ไม่สามารถลบหมวดหมู่ได้ กรุณาลองใหม่อีกครั้ง",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: null,
      imagePreview: "",
      status: true,
    });
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (successMessage) {
      toast({
        title: "สำเร็จ",
        description: successMessage,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast({
        title: "ข้อผิดพลาด",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, toast]);
  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading  fontFamily={"Noto Sans Lao, serif"} size="xl" color="blue.600" mb={2}>
            ຈັດການໝວດໝູ່ສິນຄ້າ
          </Heading>
          <Text color="gray.600">ເພີ່ມແລະຈັດການໝວດໝູ່ສິນຄ້າ</Text>
        </Box>

        {/* Add Category Form */}
        <Card shadow="lg" borderRadius="xl">
          <CardHeader bg="blue.50" borderTopRadius="xl">
            <HStack>
              <Plus size={24} color="#3182CE" />
              <Heading  fontFamily={"Noto Sans Lao, serif"} size="lg" color="blue.600">
                ເພີ່ມໝວດໝູ່ໃໝ່
              </Heading>
            </HStack>
          </CardHeader>

          <CardBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                {/* Category Name */}
                <FormControl isInvalid={errors.name} isRequired>
                  <FormLabel fontWeight="semibold">ຊື່ໝວດໝູ່</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="ລະບຸຊື່ໝວດໝູ່ສິນຄ້າ..."
                    size="lg"
                    focusBorderColor="blue.400"
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>

                {/* Category Description */}
                <FormControl>
                  <FormLabel fontWeight="semibold">ຄຳອະທິບາຍໝວດໝູ່</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="ລະບຸຄຳອະທິບາຍໝວດໝູ່ (ບໍ່ບັງຄັບ)..."
                    size="lg"
                    focusBorderColor="blue.400"
                    resize="vertical"
                    minH="100px"
                  />
                </FormControl>

                {/* Image Upload */}
                <FormControl>
                  <FormLabel fontWeight="semibold">ຮູບພາບໝວດໝູ່</FormLabel>
                  <VStack spacing={4} align="stretch">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                      display="none"
                    />

                    {formData.imagePreview ? (
                      <Box position="relative" w="fit-content">
                        <Image
                          src={formData.imagePreview}
                          alt="Preview"
                          maxH="200px"
                          maxW="300px"
                          objectFit="cover"
                          borderRadius="lg"
                          border="2px solid"
                          borderColor="gray.200"
                        />
                        <IconButton
                          icon={<X size={16} />}
                          size="sm"
                          colorScheme="red"
                          position="absolute"
                          top="-2"
                          right="-2"
                          borderRadius="full"
                          onClick={removeImage}
                        />
                      </Box>
                    ) : (
                      <Button
                        leftIcon={<Upload size={20} />}
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        borderColor="blue.300"
                        color="blue.600"
                        _hover={{ bg: "blue.50" }}
                        size="lg"
                        h="120px"
                        flexDirection="column"
                        borderStyle="dashed"
                      >
                        <ImageIcon size={32} />
                        <Text mt={2}>ກົດເພື່ອອັບໂຫລດຮູບພາບ</Text>
                        <Text fontSize="sm" color="gray.500">
                          ຮອງຮັບຂະໜາດ JPG, PNG (ไม่เกิน 5MB)
                        </Text>
                      </Button>
                    )}
                  </VStack>
                </FormControl>

                {/* Status Switch */}
                <FormControl>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <FormLabel mb={0} fontWeight="semibold">
                        ສະຖານະໝວດໝູ່
                      </FormLabel>
                      <Text fontSize="sm" color="gray.600">
                        {formData.status ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                      </Text>
                    </VStack>
                    <HStack>
                      {formData.status ? (
                        <CheckCircle size={20} color="#38A169" />
                      ) : (
                        <XCircle size={20} color="#E53E3E" />
                      )}
                      <Switch
                        isChecked={formData.status}
                        onChange={(e) => handleStatusChange(e.target.checked)}
                        colorScheme="green"
                        size="lg"
                      />
                    </HStack>
                  </HStack>
                </FormControl>

                <Divider />

                {/* Submit Buttons */}
                <HStack spacing={4} justify="flex-end">
                  <Button
                    variant="ghost"
                    onClick={resetForm}
                    leftIcon={<X size={20} />}
                    size="lg"
                  >
                    ຍົກເລີກ
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    leftIcon={<Save size={20} />}
                    isLoading={isSubmitting}
                    loadingText="ກຳລັງບັນທຶກ..."
                    size="lg"
                  >
                    ບັນທຶກໝວດໝູ່
                  </Button>
                </HStack>
              </VStack>
            </form>
          </CardBody>
        </Card>

        {/* Categories List */}
        <Card shadow="lg" borderRadius="xl">
          <CardHeader bg="green.50" borderTopRadius="xl">
            <Heading  fontFamily={"Noto Sans Lao, serif"} size="lg" color="green.600">
              ລາຍການໝວດໝູ່ທັງໝົດ
            </Heading>
          </CardHeader>

          <CardBody>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>ຮູບພາບໝວດໝູ່</Th>
                    <Th>ຊື່ໝວດໝູ່</Th>
                    <Th>ຄຳອະທິບາຍໝວດໝູ່</Th>
                    <Th>ສະຖານະໝວດໝູ່</Th>
                    <Th textAlign="center">ຈັດການ</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {categories?.map((category) => (
                    <Tr key={category.id}>
                      <Td>
                        <Image
                          src={category?.images}
                          alt={category?.name}
                          boxSize="60px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                      </Td>
                      <Td fontWeight="semibold">{category.name}</Td>
                      <Td color="gray.600" maxW="200px" isTruncated>
                        {category?.description || "-"}
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={category.status ? "green" : "red"}
                          variant="subtle"
                          px={3}
                          py={1}
                          borderRadius="full"
                        >
                          {category.status ? "ເປີດໃຊ້ງານ" : "ປິດໃຊ້ງານ"}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack justify="center">
                          <IconButton
                            icon={<Edit size={16} />}
                            size="sm"
                            colorScheme="blue"
                            variant="ghost"
                            onClick={() => handleEdit(category)}
                          />
                          <IconButton
                            icon={<Trash2 size={16} />}
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleDelete(category._id)}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>

        {/* Edit Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color="blue.600">ແກ້ໄຂໝວດໝູ່</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                {/* Edit Category Name */}
                <FormControl isRequired>
                  <FormLabel fontWeight="semibold">ຊື່ໝວດໝູ່</FormLabel>
                  <Input
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    placeholder="ລະບຸຊື່ໝວດໝູ່..."
                    focusBorderColor="blue.400"
                  />
                </FormControl>

                {/* Edit Category Description */}
                <FormControl>
                  <FormLabel fontWeight="semibold">ຄຳອະທິບາຍໝວດໝູ່</FormLabel>
                  <Textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditInputChange}
                    placeholder="ຄຳອະທິບາຍໝວດໝູ່..."
                    focusBorderColor="blue.400"
                    resize="vertical"
                    minH="80px"
                  />
                </FormControl>

                {/* Edit Image Upload */}
                <FormControl>
                  <FormLabel fontWeight="semibold">ຮູບພາບໝວດໝູ່</FormLabel>
                  <VStack spacing={3} align="stretch">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageUpload}
                      display="none"
                      id="edit-file-input"
                    />

                    {editFormData.imagePreview && (
                      <Image
                        src={editFormData.imagePreview}
                        alt="Preview"
                        maxH="150px"
                        maxW="200px"
                        objectFit="cover"
                        borderRadius="md"
                        border="2px solid"
                        borderColor="gray.200"
                        mx="auto"
                      />
                    )}

                    <Button
                      leftIcon={<Upload size={16} />}
                      onClick={() =>
                        document.getElementById("edit-file-input")?.click()
                      }
                      variant="outline"
                      borderColor="blue.300"
                      color="blue.600"
                      _hover={{ bg: "blue.50" }}
                      size="sm"
                    >
                      เปลี่ยนรูปภาพ
                    </Button>
                  </VStack>
                </FormControl>

                {/* Edit Status Switch */}
                <FormControl>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <FormLabel mb={0} fontWeight="semibold">
                        ສະຖານະໝວດໝູ່
                      </FormLabel>
                      <Text fontSize="sm" color="gray.600">
                        {editFormData.status ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                      </Text>
                    </VStack>
                    <HStack>
                      {editFormData.status ? (
                        <CheckCircle size={18} color="#38A169" />
                      ) : (
                        <XCircle size={18} color="#E53E3E" />
                      )}
                      <Switch
                        isChecked={editFormData.status}
                        onChange={(e) =>
                          handleEditStatusChange(e.target.checked)
                        }
                        colorScheme="green"
                      />
                    </HStack>
                  </HStack>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Stack
                direction={{ base: "column", sm: "row" }}
                spacing={3}
                w="full"
              >
                <Button variant="ghost" onClick={onClose} flex={1}>
                  ຍົກເລີກ
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleEditSubmit}
                  leftIcon={<Save size={16} />}
                  flex={1}
                >
                  ບັນທຶກການແກ້ໄຂ
                </Button>
              </Stack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

export default AdminAddCategory;
