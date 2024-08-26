import React, { useState, useRef, useEffect } from "react";
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
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const ref = useRef();

  useOutsideClick({
    ref: ref,
    handler: () => setIsFocused(false),
  });

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0) {
        setPlace(suggestions[highlightedIndex].name);
        setIsFocused(false);
      }
    } else if (e.key === "Escape") {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      setHighlightedIndex(-1); // Reset the highlighted index when refocusing
    }
  }, [isFocused, suggestions]);

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
        onKeyDown={handleKeyDown}
      />
      {/* {isFocused && loadingSuggestions && <Text>Loading suggestions...</Text>} */}
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
          {suggestions.map((suggestion, index) => (
            <ListItem
              key={suggestion.id}
              padding="8px"
              _hover={{ backgroundColor: "gray.100" }}
              backgroundColor={
                highlightedIndex === index ? "gray.100" : "white"
              }
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
  