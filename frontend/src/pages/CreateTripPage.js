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
  CardHeader,
  CardBody,
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

  const formatBudget = (value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

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
      bg="gray.100"
    >
      <Heading as="h1" size="lg" textAlign="center" color="teal.500">
        Create Personalized Trip
      </Heading>

      <Card w={{ base: "90%", md: "60%", lg: "40%" }} shadow="lg" p={6}>
        <CardBody>
          <VStack spacing={4} align="stretch">
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

          {error && (
            <Text color="red.500" mt={4} textAlign="center">
              Error: {error}
            </Text>
          )}
          {loading && <LoadingScreen />}
        </CardBody>
      </Card>

      {trip && !loading && (
        <Box maxW="7xl" mx="auto" mt={8} p={4}>
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
      )}
    </Flex>
  );
};

export default CreateTrip;
