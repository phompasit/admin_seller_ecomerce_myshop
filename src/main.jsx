import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
// 1. import `ChakraProvider` component
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import hook from "./hooks/index.js";
import { Box, Spinner, Text, HStack } from "@chakra-ui/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense
        fallback={
          <HStack
            spacing={3}
            align="center"
            justify="center"
            p={4}
            role="status"
            aria-busy
          >
            <Spinner thickness="4px" speed="0.8s" size="md" />
            <Text fontSize="sm" color="gray.600">
              ກຳລັງໂຫຼດ…
            </Text>
          </HStack>
        }
      >
        <ChakraProvider>
          <Provider store={hook}>
            <App />
            <Toaster
              toastOptions={{
                position: "top-right",
                style: {
                  background: "#283046",
                  color: "white",
                },
              }}
            />
          </Provider>
        </ChakraProvider>
      </Suspense>
    </BrowserRouter>
  </StrictMode>
);
