import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import customTheme from "./utils/theme";
import { AuthProvider } from "./services/authContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <ChakraProvider theme={customTheme}>
      <App />
    </ChakraProvider>
  </AuthProvider>
);
