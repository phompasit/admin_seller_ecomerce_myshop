// utils/AuthProvider.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";
import { verifyToken } from "../hooks/reducer/auth_reducer";
import { Box, Spinner, Center, Text, VStack } from "@chakra-ui/react";
const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { token, isInitialized } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    const checkToken = async () => {
      await dispatch(verifyToken());
    };
    checkToken();
  }, [dispatch, location.pathname]);

  if (!isInitialized) {
    return (
      <Box
        minH="100vh"
        bg="gray.50"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Center>
          <VStack spacing={4}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="teal.500"
              size="xl"
            />
            <Text color="gray.600" fontSize="lg" fontWeight="medium">
              ກຳລັງໂຫລດຂໍ້ມູນ...
            </Text>
            <Text color="gray.400" fontSize="sm">
              Initializing app...
            </Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  // ไม่ต้องให้เข้า route ถ้ายังไม่มี token
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default AuthProvider;
