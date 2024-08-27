import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  ButtonGroup,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/authContext";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { motion } from "framer-motion";
import { Link as ScrollLink, Element } from "react-scroll";
import ExploreTrips from "../components/ExploreTrips";
import { blobStyles } from "../CommonUtils";

const floatingAnimation = {
  initial: {
    opacity: 0, // Start fully transparent
  },
  animate: {
    opacity: 1, // Fade in to full opacity
    y: [0, 20, 0], // Continuous up and down movement
    transition: {
      opacity: {
        duration: 2, // Opacity animation duration
        ease: "easeInOut", // Smooth transition for opacity
        once: true, // Ensures opacity animation happens only once
        delay: 0.5, // Delay the opacity animation
      },
      y: {
        repeat: Infinity, // Infinite loop for y-axis movement
        repeatType: "loop",
        duration: 5,
        ease: "easeInOut",
      },
    },
  },
};

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartYourJourney = () => {
    if (user) {
      navigate("/create-trip");
    } else {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then((result) => {
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
      textAlign="center"
      p={4}
      position="relative"
      overflow="hidden"
    >
      {/* Blob Shapes */}
      <motion.div {...floatingAnimation}>
        <Box
          {...blobStyles}
          top="-10%"
          left="-10%"
          width="300px"
          height="300px"
          bgGradient="radial(at 50% 50%, teal.500 0%, teal.300 100%)"
          borderRadius="50%"
        />
      </motion.div>
      <motion.div
        {...floatingAnimation}
        animate={{ ...floatingAnimation.animate, y: [-10, 10, -10] }}
      >
        <Box
          {...blobStyles}
          top="0"
          right="0"
          width={{ base: "100px", md: "500px" }}
          height={{ base: "100px", md: "500px" }}
          bgGradient="radial(at 50% 50%, teal.600 0%, teal.400 100%)"
          borderRadius="50%"
        />
      </motion.div>

      {/* Hero Section */}
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <VStack spacing={6} zIndex={1}>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Heading
              as="h1"
              size="3xl"
              bgGradient="linear(to-r, teal.500, teal.400, teal.300)"
              bgClip="text"
              textShadow="2px 2px rgba(0, 0, 0, 0.1)"
            >
              Welcome to TravelApp
            </Heading>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <Text
              fontSize={{ base: "xl", md: "2xl" }}
              maxW="lg"
              bgGradient="linear(to-r, teal.500, teal.400, teal.300)"
              bgClip="text"
              textShadow="1px 1px rgba(0, 0, 0, 0.1)"
            >
              Discover and plan your next adventure with ease. Create
              personalized trips, explore destinations, and make unforgettable
              memories.
            </Text>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 1 }}
          >
            <ButtonGroup spacing={4}>
              <Button
                size={{ base: "md", md: "lg" }}
                rounded="full"
                onClick={handleStartYourJourney}
                bgGradient="linear(to-r, teal.500, teal.400)"
                color="white"
                _hover={{ bgGradient: "linear(to-r, teal.600, teal.500)" }}
              >
                Start Your Journey
              </Button>
              <ScrollLink
                to="explore-trips-section"
                smooth={true}
                duration={800}
                offset={-70}
              >
                <Button
                  size={{ base: "md", md: "lg" }}
                  rounded="full"
                  colorScheme="teal"
                  variant="outline"
                  _hover={{ bg: "teal.50" }}
                >
                  Explore Trips
                </Button>
              </ScrollLink>
            </ButtonGroup>
          </motion.div>
        </VStack>
      </Box>

      {/* Explore Trips Section */}
      <Element name="explore-trips-section">
        <Box py={2} zIndex={1} position="relative">
          <ExploreTrips />
        </Box>
        <motion.div {...floatingAnimation}>
          <Box
            {...blobStyles}
            bottom="-800px" // Added 'px' unit to bottom value
            left="50%" // Center horizontally with left 50% and transform
            width="2000px" // Cover full width
            height="1600px" // Adjust the height as needed
            transform="translateX(-50%)" // Correct syntax for transform
            bgGradient="radial(at 50% 50%, teal.400 0%, teal.200 50%, teal.300 100%)"
            borderRadius="50% 50% 0 0" // Creates curvature at the top
            opacity={0.8}
          />
        </motion.div>
      </Element>
    </Box>
  );
};

export default LandingPage;
