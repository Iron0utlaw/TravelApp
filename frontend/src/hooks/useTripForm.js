import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import useGenerateTrip from "./useGenerateTrip";

const useTripForm = () => {
  const [place, setPlace] = useState("");
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [people, setPeople] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const currency = "INR";
  
  const MINIMUM_BUDGET_OUTSIDE_INDIA = 100000; // Example value, set accordingly
  const MAX_DAYS_ALLOWED = 5; // Maximum number of days allowed

  const cache = {}; // Cache object to store results
  const suggestionCache = {}; // Cache for location suggestions
  const toast = useToast();
  const { trip, loading, error, generateTrip } = useGenerateTrip();

  const fetchLocationSuggestions = async (query) => {
    if (!query) return;

    const cacheKey = `suggestions-${query}`;

    if (suggestionCache[cacheKey]) {
      setSuggestions(suggestionCache[cacheKey]);
      return;
    }

    setLoadingSuggestions(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/locations`, {
        params: { namePrefix: query },
      });

      const cities = response.data.map((city) => ({
        id: city._id,
        name: `${city.city}, ${city.region}, ${city.country}`,
        country: city.country,
      }));

      setSuggestions(cities);
      suggestionCache[cacheKey] = cities; // Cache the results
    } catch (err) {
      console.error("Error fetching location suggestions:", err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSubmit = () => {
    if (!place || !budget || !days || !people) {
      toast({
        title: "All fields are required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate if the place is in suggestions
    const selectedSuggestion = suggestions.find(
      (suggestion) => suggestion.name === place
    );

    if (!selectedSuggestion) {
      toast({
        title: "Please select a valid place from the suggestions.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Ensure the number of days does not exceed the maximum allowed
    if (parseInt(days) > MAX_DAYS_ALLOWED) {
      toast({
        title: `The number of days cannot exceed ${MAX_DAYS_ALLOWED}.`,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const isOutsideIndia = selectedSuggestion.country.toLowerCase() !== "india";

    // If location is outside India, check if the budget meets the minimum requirement
    if (isOutsideIndia && parseInt(budget) < MINIMUM_BUDGET_OUTSIDE_INDIA) {
      toast({
        title: `For trips outside India, the budget should be at least ₹${MINIMUM_BUDGET_OUTSIDE_INDIA}.`,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const cacheKey = `${place}-${budget}-${days}-${people}`;

    // Check if result exists in cache
    if (cache[cacheKey]) {
      console.log("Using cached data");
      return cache[cacheKey];
    }

    // Generate trip and store result in cache
    generateTrip({ place, budget, days, people, currency }).then((result) => {
      cache[cacheKey] = result; // Store the result in cache
    });
  };

  return {
    place,
    budget,
    days,
    people,
    suggestions,
    loadingSuggestions,
    loading,
    error,
    trip,
    setPlace,
    setBudget,
    setDays,
    setPeople,
    fetchLocationSuggestions, // Expose this function to be used in the component
    handleSubmit,
  };
};

export default useTripForm;
