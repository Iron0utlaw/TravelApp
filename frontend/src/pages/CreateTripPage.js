import React, { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  SimpleGrid,
  Text,
  VStack,
  Flex,
  useToast,
  Divider,
} from "@chakra-ui/react";
import useGenerateTrip from "../hooks/useGenerateTrip";
import Hotel from "../components/Hotel";
import ItineraryDay from "../components/ItineraryDay";

const CreateTrip = () => {
  const [place, setPlace] = useState("");
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [people, setPeople] = useState("");
  const currency = "INR";

  const toast = useToast();
  const { trip, loading, error, generateTrip } = useGenerateTrip();

  const handleClick = () => {
    if (!place || !budget || !days || !people) {
      toast({
        title: "All fields are required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    generateTrip({ place, budget, days, people, currency });
  };

  return (
    <Box maxW="7xl" mx="auto" p={4}>
      <Heading as="h1" size="xl" textAlign="center" mb={8} color="teal.500">
        Create Personalized Trip
      </Heading>

      <VStack spacing={4} align="stretch">
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 4 }} spacing={4}>
          <Input
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="Enter location"
            size="lg"
          />
          <Input
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Enter budget"
            size="lg"
          />
          <Input
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="Enter number of days"
            size="lg"
          />
          <Input
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            placeholder="Enter number of people"
            size="lg"
          />
        </SimpleGrid>

        <Flex justify="center">
          <Button
            size="lg"
            rounded="full"
            colorScheme="teal"
            onClick={handleClick}
            isLoading={loading}
            mt={4}
          >
            Create Trip
          </Button>
        </Flex>
      </VStack>

      {error && (
        <Text color="red.500" mt={4} textAlign="center">
          Error: {error}
        </Text>
      )}

      {trip && !loading && (
        <>
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
        </>
      )}
    </Box>
  );
};

export default CreateTrip;
