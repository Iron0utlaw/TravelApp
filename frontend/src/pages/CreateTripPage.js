import React from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  SimpleGrid,
  Text,
  VStack,
  Flex,
  Divider,
  InputGroup,
  InputLeftAddon,
  Card,
  CardBody,
  useBreakpointValue,
} from "@chakra-ui/react";
import useTripForm from "../hooks/useTripForm";
import Hotel from "../components/Hotel";
import ItineraryDay from "../components/ItineraryDay";
import LoadingScreen from "../components/Loader";
import LocationSearch from "../components/LocationSearch";
import { motion } from "framer-motion";
import { blobStyles, formatBudget } from "../CommonUtils";

const CreateTrip = () => {
  const {
    place,
    budget,
    days,
    people,
    suggestions,
    loadingSuggestions,
    loading,
    error,
    trip,
    setPlace,
    setBudget,
    setDays,
    setPeople,
    fetchLocationSuggestions,
    handleSubmit,
  } = useTripForm();

  const blob1x = useBreakpointValue({ base: 100, md: 500 });
  const blob2x = useBreakpointValue({ base: -100, md: -500 });

  const blob1 = {
    initial: {
      opacity: 0, // Start fully transparent
    },
    animate: {
      opacity: 1, // Fade in to full opacity
      y: [0, 20, 0], // Continuous up and down movement
      x: !trip ? 0 : `${blob1x}px`, // Move to the right if trip is not created
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
        x: {
          duration: 0.5, // X-axis translation animation duration
          ease: "easeOut", // Smooth easing for x transition
        },
      },
    },
  };

  const blob2 = {
    initial: {
      opacity: 0, // Start fully transparent
    },
    animate: {
      opacity: 1, // Fade in to full opacity
      y: [0, 20, 0], // Continuous up and down movement
      x: !trip ? 0 : `${blob2x}px`, // Move to the right if trip is not created
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
        x: {
          duration: 0.5, // X-axis translation animation duration
          ease: "easeOut", // Smooth easing for x transition
        },
      },
    },
  };

  const handleBudgetChange = (e) => {
    const formattedValue = e.target.value.replace(/,/g, "");
    setBudget(formattedValue);
  };

  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      minH="100vh"
      p={4}
      position="relative" // Ensure blobs are correctly positioned behind content
      overflow="hidden" // Hide any overflow from floating blobs
    >
      {/* Blob Shapes */}
      <motion.div {...blob1}>
        <Box
          {...blobStyles}
          top="10%"
          left="10%"
          width={{ base: "150px", md: "200px" }}
          height={{ base: "150px", md: "200px" }}
          transform={{ base: "translateX(50px)", md: "translateX(150px)" }} //150px
          bgGradient="radial(at 50% 50%, teal.500 0%, teal.300 100%)"
          borderRadius="50%"
        />
      </motion.div>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Heading as="h1" size="lg" textAlign="center" color="teal.500">
          Create Personalized Trip
        </Heading>
      </motion.div>

      <motion.div {...blob2} animate={{ ...blob2.animate, y: [-10, 10, -10] }}>
        <Box
          {...blobStyles}
          top="30%"
          right="-10%"
          width={{ base: "200px", md: "400px" }}
          height={{ base: "200px", md: "400px" }}
          transform={{ base: "translateY(350px)", md: "translateY(150px)" }} //-100
          bgGradient="radial(at 50% 50%, teal.600 0%, teal.400 100%)"
          borderRadius="50%"
        />
      </motion.div>

      {!trip && (
        <Card
          w={{ base: "90%", md: "60%", lg: "40%" }}
          shadow="lg"
          p={6}
          mt={6}
          mb={8}
          zIndex={1} // Ensure the card stays above the blobs
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            width="100%"
          >
            <CardBody>
              {!trip && !loading && (
                <VStack spacing={6} align="stretch">
                  <LocationSearch
                    place={place}
                    setPlace={setPlace}
                    fetchLocationSuggestions={fetchLocationSuggestions}
                    suggestions={suggestions}
                    loadingSuggestions={loadingSuggestions}
                  />

                  <InputGroup>
                    <InputLeftAddon h="auto" children="₹" />
                    <Input
                      value={formatBudget(budget)}
                      onChange={handleBudgetChange}
                      placeholder="Enter budget"
                      size="lg"
                      type="text"
                    />
                  </InputGroup>

                  <Input
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    placeholder="Enter number of days"
                    size="lg"
                    type="number"
                  />
                  <Input
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                    placeholder="Enter number of people"
                    size="lg"
                    type="number"
                  />

                  <Button
                    size="lg"
                    rounded="full"
                    colorScheme="teal"
                    onClick={handleSubmit}
                    isDisabled={loading}
                  >
                    Create Trip
                  </Button>
                </VStack>
              )}

              {error && (
                <Text color="red.500" mt={4} textAlign="center">
                  Error: {error}
                </Text>
              )}
              {loading && <LoadingScreen type="Trip" mt={4} />}
            </CardBody>
          </motion.div>
        </Card>
      )}

      {trip && !loading && (
        <motion.div
          initial={{ opacity: 0 }} // Start off-screen with opacity 0
          animate={{ opacity: 1 }} // Fade in and slide in from the left
          transition={{ duration: 0.8, ease: "easeInOut", delay: 1 }} // Delay syncs with blob animation
        >
          <Box maxW="7xl" mx="auto" p={4}>
            <Divider my={8} />
            {trip.HotelOptions && trip.HotelOptions.length > 0 && (
              <Box>
                <Heading as="h2" size="lg" my={4}>
                  Hotels
                </Heading>
                <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={6}>
                  {trip.HotelOptions.map((hotel, index) => (
                    <Hotel key={index} hotel={hotel} />
                  ))}
                </SimpleGrid>
              </Box>
            )}

            {trip.Itinerary && trip.Itinerary.length > 0 && (
              <Box mt={8}>
                <Heading as="h2" size="lg" my={4}>
                  Itinerary
                </Heading>
                {trip.Itinerary.map((dayPlan, index) => (
                  <ItineraryDay key={index} dayPlan={dayPlan} />
                ))}
              </Box>
            )}
          </Box>
        </motion.div>
      )}
    </Flex>
  );
};

export default CreateTrip;
