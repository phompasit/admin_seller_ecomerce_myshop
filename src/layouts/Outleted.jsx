import React from "react";

import { Outlet } from "react-router-dom";
import { Text, VStack } from "@chakra-ui/react";
import VerifyNotification from "../pages/notification/VerifyNotification";

const Outleted = () => {
  return (
    <VStack spacing={6} align="center" justify="center" minH="60vh">
      <VerifyNotification />
      <Outlet />
    </VStack>
  );
};

export default Outleted;
