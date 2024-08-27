import { useState } from "react";
import axios from "axios";
import { useAuth } from "../services/authContext"; // Ensure you have this context

const useGenerateAITrip = (trip, questionsWithAnswers) => {
  const [tripPlan, setTripPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log(tripPlan);

  const { user } = useAuth(); // Access the authenticated user

  const generateAITrip = async () => {
    setLoading(true);
    setError(null);

    if (user) {
      try {
        const idToken = await user.getIdToken(); // Get the ID token

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/trips/generate-ai-trip`,
          { trip, questionsWithAnswers },
          {
            headers: {
              Authorization: `Bearer ${idToken}`, // Include the token in headers
            },
          }
        );

        setTripPlan(response.data.tripPlan); // Assuming the response contains the generated trip plan
      } catch (err) {
        console.error("Error generating AI trip plan:", err);
        setError(err.response?.data?.error || "Failed to generate AI trip plan");
      } finally {
        setLoading(false);
      }
    } else {
      setError("User is not authenticated");
      setLoading(false);
    }
  };

  return { tripPlan, loading, error, generateAITrip };
};

export default useGenerateAITrip;
