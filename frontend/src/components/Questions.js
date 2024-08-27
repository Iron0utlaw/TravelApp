import { CheckCircleIcon, CopyIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  HStack,
  Icon,
  VStack,
  Text,
  UnorderedList,
  ListItem,
  Checkbox,
  Button,
  Alert,
  AlertIcon,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import useGenerateAITrip from "../hooks/useGenerateAITrip"; // Import the custom hook
import ReactMarkdown from "react-markdown";
import LoadingScreen from "./Loader";

const Questions = ({ trip, questions }) => {
  const [selectedOptions, setSelectedOptions] = useState(
    Array(questions.length).fill(null)
  );

  // Use the custom hook
  const { tripPlan, loading, error, generateAITrip } = useGenerateAITrip(
    trip,
    selectedOptions
  );

  const handleCheckboxChange = (questionIndex, optionValue) => {
    const updatedSelections = selectedOptions.map((selected, index) =>
      index === questionIndex ? optionValue : selected
    );
    setSelectedOptions(updatedSelections);
  };

  const handleSubmit = async () => {
    // Trigger the API call using the hook
    await generateAITrip();
  };

  const toast = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(tripPlan).then(
      () => {
        toast({
          title: "Copied to clipboard!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      },
      (err) => {
        toast({
          title: "Failed to copy!",
          description: "An error occurred while copying to clipboard.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    );
  };

  return (
    <Box mt={8}>
      <Heading as="h3" size="lg" mb={4} color="teal.600">
        AI Recommended Questions
      </Heading>
      <VStack spacing={6} align="start" width="full">
        {questions.map((q, questionIndex) => (
          <Box
            key={questionIndex}
            p={4}
            borderWidth={1}
            borderRadius="lg"
            boxShadow="md"
            w="full"
            bg="gray.50"
          >
            <HStack align="start" mb={2}>
              <Icon as={CheckCircleIcon} color="teal.500" boxSize={6} />
              <Text fontSize="lg" fontWeight="semibold">
                {q.question}
              </Text>
            </HStack>
            <UnorderedList mt={2} pl={10}>
              {q.options.map((option, optionIndex) => (
                <ListItem key={optionIndex} display="flex" alignItems="center">
                  <Checkbox
                    mr={2}
                    isChecked={selectedOptions[questionIndex] === option}
                    onChange={() => handleCheckboxChange(questionIndex, option)}
                  />
                  {option}
                </ListItem>
              ))}
            </UnorderedList>
          </Box>
        ))}
        {loading ? (
          <Box alignSelf={"center"}>
            <LoadingScreen type={"Questions"} />
          </Box>
        ) : (
          <Button
            colorScheme="teal"
            onClick={handleSubmit}
            alignSelf="flex-end"
          >
            Submit
          </Button>
        )}
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}
        {tripPlan && (
          <Box
            p={16}
            borderWidth={1}
            borderRadius="lg"
            boxShadow="md"
            w="full"
            bg="gray.100"
          >
            <HStack align="start" justifyContent={"space-between"} mb={4}>
              <Heading as="h4" size="md" mb={4}>
                Generated Trip Plan
              </Heading>
              <IconButton
                bgColor={"teal.500"}
                color={"white"}
                size="sm"
                icon={<Icon as={CopyIcon} boxSize={4} />}
                aria-label="Copy to clipboard"
                onClick={handleCopy}
              />
            </HStack>
            <ReactMarkdown>{tripPlan}</ReactMarkdown>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default Questions;
