import React from 'react';
import { SimpleGrid, Heading, Stack } from '@chakra-ui/react';
import PlaceCard from './PlaceCard';

const ItineraryDay = ({ dayPlan }) => {
  return (
    <Stack spacing="6">
      <Heading paddingTop={4} size="lg">{dayPlan.Day}</Heading>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing="6">
        {dayPlan.Plan.map((place, index) => (
          <PlaceCard key={index} place={place} />
        ))}
      </SimpleGrid>
    </Stack>
  );
};

export default ItineraryDay;
