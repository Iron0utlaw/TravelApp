import React, { useMemo } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Divider,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import useFetchTripDetails from "../hooks/useFetchTripDetails";
import useGenerateQuestions from "../hooks/useGenerateQuestions";
import Hotel from "../components/Hotel";
import ItineraryDay from "../components/ItineraryDay";
import Questions from "../components/Questions";
import ActionButtons from "../components/ActionButtons"; // Import ActionButtons

const TripDetailsPage = () => {
  const { id } = useParams();
  const { trip, loading, error } = useFetchTripDetails(id);
  const {
    questions,
    loading: generatingQuestions,
    error: generationError,
    generateQuestions,
  } = useGenerateQuestions(trip);

  const handleFlightSearch = useMemo(() => {
    const query = `flights to ${trip?.place || ""}`;
    return () =>
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        "_blank"
      );
  }, [trip]);

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
        {trip ? `Trip to ${trip.place} Details` : "Trip Details"}
      </Heading>

      <ActionButtons
        trip={trip}
        generatingQuestions={generatingQuestions}
        generateQuestions={generateQuestions}
        handleFlightSearch={handleFlightSearch}
      />

      {generationError && (
        <Box mt={4} color="red.500">
          Error generating questions: {generationError}
        </Box>
      )}

      {questions && <Questions trip={trip} questions={questions} />}

      {trip && (
        <>
          <Divider my={8} />
          {trip.HotelOptions?.length > 0 && (
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

          {trip.Itinerary?.length > 0 && (
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
