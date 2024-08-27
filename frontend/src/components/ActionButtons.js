import React from "react";
import { Wrap, WrapItem, Button } from "@chakra-ui/react";
import { generateMarkdown } from "../CommonUtils";
import AIButton from "./AIButton";

const ActionButtons = ({
  trip,
  generatingQuestions,
  generateQuestions,
  handleFlightSearch,
}) => (
  <Wrap spacing={4} justify="center">
    <WrapItem>
      <AIButton
        isLoading={generatingQuestions}
        loadingText="Preparing questions..."
        onClick={generateQuestions}
        size="md"
        rounded="full"
      >
        Create AI Recommended Trip Plan
      </AIButton>
    </WrapItem>
    <WrapItem>
      <Button
        size="md"
        rounded="full"
        colorScheme="teal"
        onClick={handleFlightSearch}
      >
        Book Flights
      </Button>
    </WrapItem>
    <WrapItem>
      <Button
        size="md"
        rounded="full"
        colorScheme="teal"
        onClick={() => generateMarkdown(trip)}
      >
        Generate Markdown
      </Button>
    </WrapItem>
  </Wrap>
);

export default ActionButtons;
