import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Box textAlign="center" py="10" px="6">
      <Heading as="h1" size="2xl" mb="4">
        404
      </Heading>
      <Text fontSize="lg" mb="6">
        Oops! The page you are looking for does not exist.
      </Text>
      <Button as={Link} to="/" colorScheme="teal" variant="solid">
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
