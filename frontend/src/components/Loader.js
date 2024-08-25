import React, { useState, useEffect } from "react";
import {
  Box,
  Spinner,
  Text,
  VStack,
  useColorModeValue,
  keyframes,
} from "@chakra-ui/react";

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const messages = [
  "Creating your personalized trip...",
  "Looking for the best hotels...",
  "Collecting the best places to visit...",
  "Preparing your itinerary...",
  "Almost ready! Just a moment..."
];

const LoadingScreen = () => {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prevMessage) => (prevMessage + 1) % messages.length);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      height="50vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing={4}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="teal.500"
          size="xl"
        />
        <Text
          fontSize="lg"
          animation={`${pulse} 2s ease-in-out infinite`}
        >
          {messages[currentMessage]}
        </Text>
      </VStack>
    </Box>
  );
};

export default LoadingScreen;
