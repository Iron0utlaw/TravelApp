import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Image,
  Spinner,
  Flex,
  Button,
} from "@chakra-ui/react";
import Slider from "react-slick";
import axios from "axios";
import { formatBudget } from "../CommonUtils";
import { Link } from "react-router-dom";

const ExploreTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(trips);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/random-trips`
        );
        setTrips(response.data.trips);
        setLoading(false);
      } catch (err) {
        setError("Failed to load trips.");
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Text fontSize="xl" color="red.500">
          {error}
        </Text>
      </Flex>
    );
  }

  // Slick carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  console.log(trips);

  return (
    <Box p={8}>
      <Heading as="h2" size="xl" mb={8} textAlign="center" color="teal.600">
        Explore Trips
      </Heading>
      <Slider {...settings}>
        {trips.map((trip, index) => (
          <Box key={index} px={4} py={4}>
            <Box p={6} borderRadius="md" shadow="md" bg="gray.100">
              <VStack spacing={4} align="stretch">
                <Heading
                  as="h3"
                  size={{ base: "sm", md: "md" }}
                  color="teal.500"
                >
                  {trip.tripData.place}
                </Heading>
                <Image
                  src={trip.tripData.HotelOptions[0]["hotel image url"]}
                  alt={`Trip to ${trip.tripData.place}`}
                  borderRadius="md"
                  height={200}
                  width="100%"
                  objectFit="cover"
                />
                <Text fontSize="md">
                  {trip.tripData.days} days for {trip.tripData.people} people
                </Text>
                <Text fontSize="lg" fontWeight="bold" color="teal.600">
                  Budget: {trip.tripData.currency}{" "}
                  {formatBudget(trip.tripData.budget)}
                </Text>
                <Button
                  as={Link}
                  to={`/trip/${trip._id}`}
                  colorScheme="teal"
                  size="sm"
                  mt={4}
                >
                  Show More
                </Button>
              </VStack>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default ExploreTrips;
