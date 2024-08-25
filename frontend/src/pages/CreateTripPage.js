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
} from "@chakra-ui/react";
import useTripForm from "../hooks/useTripForm";
import Hotel from "../components/Hotel";
import ItineraryDay from "../components/ItineraryDay";
import LoadingScreen from "../components/Loader";
import LocationSearch from "../components/LocationSearch";

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

  // Helper function to format the budget with commas
  const formatBudget = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleBudgetChange = (e) => {
    const formattedValue = e.target.value.replace(/,/g, "");
    setBudget(formattedValue);
  };

  return (
    <Box maxW="7xl" mx="auto" p={4}>
      <Heading as="h1" size="xl" textAlign="center" mb={8} color="teal.500">
        Create Personalized Trip
      </Heading>

      <VStack spacing={4} align="stretch">
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 4 }} spacing={4}>
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
        </SimpleGrid>

        <Flex justify="center">
          <Button
            size="lg"
            rounded="full"
            colorScheme="teal"
            onClick={handleSubmit}
            isDisabled={loading}
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

      {loading && <LoadingScreen />}

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
