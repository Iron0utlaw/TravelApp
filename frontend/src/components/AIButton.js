
import React from "react";
import { Button } from "@chakra-ui/react";

const AIButton = ({ isLoading, loadingText, onClick, children }) => {
  return (
    <Button
      size="md"
      rounded="full"
      colorScheme="teal"
      isLoading={isLoading}
      loadingText={loadingText}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default AIButton;
