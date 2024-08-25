import React, { useState, useRef } from "react";
import {
  Box,
  Input,
  List,
  ListItem,
  Text,
  useOutsideClick,
} from "@chakra-ui/react";

const LocationSearch = ({
  place,
  setPlace,
  fetchLocationSuggestions,
  suggestions,
  loadingSuggestions,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef();

  useOutsideClick({
    ref: ref,
    handler: () => setIsFocused(false),
  });

  return (
    <Box ref={ref} position="relative">
      <Input
        value={place}
        onChange={(e) => {
          setPlace(e.target.value);
          fetchLocationSuggestions(e.target.value);
        }}
        placeholder="Enter location"
        size="lg"
        onFocus={() => setIsFocused(true)}
      />
      {isFocused && loadingSuggestions && <Text>Loading suggestions...</Text>}
      {isFocused && suggestions.length > 0 && (
        <List
          mt={2}
          border="1px solid #ddd"
          borderRadius="md"
          position="absolute"
          width="100%"
          bg="white"
          zIndex="1000"
        >
          {suggestions.map((suggestion) => (
            <ListItem
              key={suggestion.id}
              padding="8px"
              _hover={{ backgroundColor: "gray.100" }}
              onClick={() => {
                setPlace(suggestion.name);
                setIsFocused(false); // Hide the suggestion list after selecting
              }}
            >
              {suggestion.name}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default LocationSearch;
