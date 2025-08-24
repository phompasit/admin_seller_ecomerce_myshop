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
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div>loadingH</div>}>
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
