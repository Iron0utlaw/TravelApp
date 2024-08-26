import React from "react";
import { Box, Heading, SimpleGrid, Text, Divider, IconButton } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import useFetchTripDetails from "../hooks/useFetchTripDetails";
import Hotel from "../components/Hotel";
import ItineraryDay from "../components/ItineraryDay";
import json2md from "json2md";
import { DownloadIcon } from "@chakra-ui/icons";

const TripDetailsPage = () => {
  const { id } = useParams();
  const { trip, loading, error } = useFetchTripDetails(id);

  const generateMarkdown = () => {
    if (trip) {
      const markdownContent = json2md([
        { h1: `Trip to ${trip.place}` },
        { p: `Budget: ${trip.currency} ${trip.budget}` },
        { p: `Days: ${trip.days}` },
        { p: `People: ${trip.people}` },
        { h2: "Hotels" },
        {
          ul: trip.HotelOptions.map((hotel) => {
            return `${hotel.HotelName} - ${hotel["Hotel address"]} (Price: ${hotel.Price}, Rating: ${hotel.rating}/5)\n\nDescription: ${hotel.descriptions}`;
          }),
        },
        { h2: "Itinerary" },
        ...trip.Itinerary.map((day) => ({
          h3: day.Day,
          ul: day.Plan.map((place) => {
            return `${place.PlaceName}\n\nDetails: ${place["Place Details"]}\n\nTicket Pricing: ${place["ticket Pricing"]}\n\nTime to Travel: ${place["Time to travel"]}`;
          }),
          p: `Best Time to Visit: ${day["Best Time to Visit"]}`,
        })),
      ]);

      // Here you can download the markdown file
      const blob = new Blob([markdownContent], { type: "text/markdown" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "trip-details.md";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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

      <Box position="fixed" bottom="20px" right="20px" zIndex="1000">
        <IconButton
          aria-label="Generate Markdown"
          icon={<DownloadIcon />}
          onClick={generateMarkdown}
          variant="outline"
          color="white"
          bgColor="teal"
          size="lg"
          border="none"
        />
      </Box>

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
