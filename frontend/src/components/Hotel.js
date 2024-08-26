import React from "react";
import {
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Text,
  Divider,
  CardFooter,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";

const Hotel = ({ hotel }) => {
  const handleHotelSearch = () => {
    const query = "hotels in " + hotel.HotelName;
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      "_blank"
    );
  };
  return (
    <Card maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <CardBody>
        <Image
          src={hotel["hotel image url"]}
          alt={hotel.HotelName}
          borderRadius="lg"
          height={200}
          width="100%"
          objectFit="cover"
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">{hotel.HotelName}</Heading>
          <Text>{hotel.descriptions}</Text>
          <Text>{hotel["Hotel address"]}</Text>
          <Text color="blue.600" fontSize="2xl">
            {hotel.Price}
          </Text>
          <Text color="yellow.500" fontSize="lg">
            Rating: {hotel.rating} ⭐
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="2">
          <Button onClick={handleHotelSearch} variant="solid" colorScheme="blue">
            Book Now
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default Hotel;
