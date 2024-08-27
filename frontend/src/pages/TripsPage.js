import React, { useState, useEffect } from "react";
import { Box, Heading, SimpleGrid, Text, Spinner, Center, Divider } from "@chakra-ui/react";
import TripCard from "../components/TripCard";
import useFetchTrips from "../hooks/useFetchTrips";

const TripsPage = () => {
  const { trips, loading, error, noUser } = useFetchTrips();
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (loading) {
        setShowLoading(true);
      }
    }, 300); // Set delay to 300ms (adjust as needed)

    return () => clearTimeout(delay);
  }, [loading]);

  if (loading && showLoading) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="teal.500" />
        <Text ml={4} fontSize="xl">Loading trips...</Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Center py={10}>
        <Text color="red.500" fontSize="xl">
          Error: {error}
        </Text>
      </Center>
    );
  }

  return (
    <Box maxW="7xl" mx="auto" p={4}>
      <Heading as="h1" size="xl" my={8} color="teal.500" textAlign="center">
        Your Trips
      </Heading>

      <Divider mb={8} />

      {!loading && noUser ? (
        <Center py={10}>
          <Text fontSize="xl" color="gray.500">
            No trips found. Create a trip to get started!
          </Text>
        </Center>
      ) : (
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={6}>
          {trips.map((trip) => (
            <TripCard key={trip._id} trip={trip.tripData} id={trip._id} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default TripsPage;
