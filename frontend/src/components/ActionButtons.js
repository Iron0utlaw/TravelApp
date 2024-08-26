import React from "react";
import { ButtonGroup, Button } from "@chakra-ui/react";
import { generateMarkdown } from "../CommonUtils";
import AIButton from "./AIButton";

const ActionButtons = ({
  trip,
  generatingQuestions,
  generateQuestions,
  handleFlightSearch,
}) => (
  <ButtonGroup>
    <AIButton
      isLoading={generatingQuestions}
      loadingText="Preparing questions..."
      onClick={generateQuestions}
    >
      Create AI Recommend Trip Plan
    </AIButton>
    <Button
      size="md"
      rounded="full"
      colorScheme="teal"
      onClick={handleFlightSearch}
    >
      Book Flights
    </Button>
    <Button
      size="md"
      rounded="full"
      colorScheme="teal"
      onClick={() => generateMarkdown(trip)}
    >
      Generate Markdown
    </Button>
  </ButtonGroup>
);

export default ActionButtons;
