import React from "react";

import { Outlet } from "react-router-dom";
import { VStack } from "@chakra-ui/react";
const Outleted = () => {
  return (
    <VStack spacing={6} align="center" justify="center" minH="60vh">
      <Outlet />
    </VStack>
  );
};

export default Outleted;
