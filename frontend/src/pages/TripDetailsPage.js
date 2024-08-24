import React from "react";
import { Box, Heading, SimpleGrid, Text, Divider } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import useFetchTripDetails from "../hooks/useFetchTripDetails";
import Hotel from "../components/Hotel";
import ItineraryDay from "../components/ItineraryDay";

const TripDetailsPage = () => {
  const { id } = useParams();
  const { trip, loading, error } = useFetchTripDetails(id);
  console.log(trip);

  if (loading) {
    return (
      <Box py={10} textAlign="center">
        <Text fontSize="xl">Loading trip details...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box py={10} textAlign="center">
        <Text color="red.500" fontSize="xl">
          Error: {error}
        </Text>
      </Box>
    );
  }

  return (
    <Box maxW="7xl" mx="auto" p={4}>
      <Heading as="h2" size="xl" my={8} color="teal.500" textAlign="center">
        Trip Details
      </Heading>

      {trip && (
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

export default TripDetailsPage;
