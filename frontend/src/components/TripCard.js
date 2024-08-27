import React from "react";
import { Box, Heading, Text, Button, VStack, Image, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { formatBudget } from "../CommonUtils";

const TripCard = ({ trip, id }) => {
  const imageUrl = trip.Itinerary[0].Plan[0]["Place Image Url"];
  
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      shadow="md"
      _hover={{ shadow: "lg", transform: "scale(1.02)", transition: "all 0.3s" }}
    >
      <Image 
        src={imageUrl} 
        alt={`Image of ${trip.place}`} 
        objectFit="cover" 
        width="100%" 
        height="200px"
      />
      <Flex direction="column" p={4}>
        <VStack align="start" spacing={2}>
          <Heading as="h3" size="md">
            Trip to {trip.place}
          </Heading>
          <Text fontSize="sm">
            <strong>Budget:</strong> {formatBudget(trip.budget)} {trip.currency}
          </Text>
          <Text fontSize="sm">
            <strong>Days:</strong> {trip.days}
          </Text>
          <Text fontSize="sm">
            <strong>People:</strong> {trip.people}
          </Text>
        </VStack>
        <Button
          as={Link}
          to={`/trip/${id}`}
          colorScheme="teal"
          size="sm"
          mt={4}
          alignSelf="start"
        >
          Show More
        </Button>
      </Flex>
    </Box>
  );
};

export default TripCard;
