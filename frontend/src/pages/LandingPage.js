import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/authContext";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const LandingPage = () => {
  const { user } = useAuth(); // Access the user from the context
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      // If the user is already logged in, navigate to the Create Trip page
      navigate("/create-trip");
    } else {
      // If the user is not logged in, initiate the login flow
      const provider = new GoogleAuthProvider(); // Replace with the provider you need
      signInWithPopup(auth, provider)
        .then((result) => {
          // After successful login, navigate to the Create Trip page
          navigate("/create-trip");
        })
        .catch((error) => {
          console.error("Error during sign-in:", error);
        });
    }
  };

  return (
    <Box
      as="section"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="gray.50"
      textAlign="center"
      p={4}
    >
      <VStack spacing={6}>
        <Heading
          as="h1"
          size="2xl"
          bgGradient="linear(to-r, teal.500, green.500)"
          bgClip="text"
        >
          Welcome to TravelApp
        </Heading>
        <Text
          fontSize="xl"
          maxW="lg"
          bgGradient="linear(to-r, teal.500, green.500)"
          bgClip="text"
        >
          Discover and plan your next adventure with ease. Create personalized
          trips, explore destinations, and make unforgettable memories.
        </Text>
        <Button
          size="lg"
          rounded="full"
          colorScheme="teal"
          onClick={handleGetStarted}
          bgGradient="linear(to-r, teal.500, green.500)"
          color="white"
          _hover={{ bgGradient: "linear(to-r, teal.600, green.600)" }}
        >
          Get Started
        </Button>
      </VStack>
    </Box>
  );
};

export default LandingPage;
