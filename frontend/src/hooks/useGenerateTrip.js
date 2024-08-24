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
        "https://travelapp-igwl.onrender.com/api/generate-trip",
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
      console.log(response);
      setTrip(response.data.tripData);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return { trip, loading, error, generateTrip };
};

export default useGenerateTrip;
