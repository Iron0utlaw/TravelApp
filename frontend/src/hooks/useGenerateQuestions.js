import { useState } from "react";
import axios from "axios";
import { useAuth } from "../services/authContext"; // Ensure you have this context

const useGenerateQuestions = (trip) => {
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useAuth(); // Access the authenticated user

  const generateQuestions = async () => {
    setLoading(true);
    setError(null);

    if (user) {
      try {
        const idToken = await user.getIdToken(); // Get the ID token

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/trips/generate-questions`,
          { trip },
          {
            headers: {
              Authorization: `Bearer ${idToken}`, // Include the token in headers
            },
          }
        );

        setQuestions(response.data.questions.questions);
      } catch (err) {
        console.error("Error generating questions:", err);
        setError(err.response?.data?.error || "Failed to generate questions");
      } finally {
        setLoading(false);
      }
    } else {
      setError("User is not authenticated");
      setLoading(false);
    }
  };

  return { questions, loading, error, generateQuestions };
};

export default useGenerateQuestions;
