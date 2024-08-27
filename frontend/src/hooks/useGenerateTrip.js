import { useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";

const useGenerateTrip = () => {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateTrip = async ({ place, budget, days, people, currency }) => {
    setLoading(true);
    setError(null);

    try {
      const auth = getAuth();
      const idToken = await auth.currentUser.getIdToken();

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/trips/generate`,
        {
          place,
          budget,
          days,
          people,
          currency,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      setTrip(response.data.tripData.tripData);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return { trip, loading, error, generateTrip };
};

export default useGenerateTrip;
