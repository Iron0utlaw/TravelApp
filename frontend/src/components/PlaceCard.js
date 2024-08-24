import React from 'react';
import {
  Card,
  CardBody,
  Image,
  Stack,
  Heading,
  Text,
} from '@chakra-ui/react';

const PlaceCard = ({ place }) => {
  return (
    <Card maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <CardBody>
        <Image
          src={place["Place Image Url"]}
          alt={place.PlaceName}
          borderRadius="lg"
          height={200}
          width="100%"
          objectFit="cover" 
        />
        <Stack mt="4" spacing="2">
          <Heading size="md">{place.PlaceName}</Heading>
          <Text>{place["Place Details"]}</Text>
          <Text> <strong>Ticket Pricing:</strong> {place["ticket Pricing"]}</Text>
          <Text> <strong>Time to Travel:</strong> {place["Time to travel"]}</Text>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default PlaceCard;
