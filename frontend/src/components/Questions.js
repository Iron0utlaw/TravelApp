import { CheckCircleIcon } from "@chakra-ui/icons";
import { Box, Heading, HStack, Icon, VStack, Text, UnorderedList, ListItem, Checkbox, Button } from "@chakra-ui/react";
import React, { useState } from "react";

const Questions = ({ questions }) => {
  const [selectedOptions, setSelectedOptions] = useState(Array(questions.length).fill(null));

  const handleCheckboxChange = (questionIndex, optionValue) => {
    const updatedSelections = selectedOptions.map((selected, index) => 
      index === questionIndex ? optionValue : selected
    );
    setSelectedOptions(updatedSelections);
  };

  const handleSubmit = () => {
    // Create a JSON object with questions and selected answers
    const result = questions.map((q, index) => ({
      question: q.question,
      selectedAnswer: selectedOptions[index]
    }));

    // Output the JSON object
    console.log(JSON.stringify(result, null, 2));
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
        <Button
          colorScheme="teal"
          onClick={handleSubmit}
          alignSelf="flex-end"
        >
          Submit
        </Button>
      </VStack>
    </Box>
  );
};

export default Questions;
