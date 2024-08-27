import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../services/authContext";

const useFetchTripDetails = (tripId) => {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchTripDetails = async () => {
      if (user && tripId) {
        try {
          const idToken = await user.getIdToken();
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/trips/${tripId}`, {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });
          setTrip(response.data.trip.tripData);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching trip details:", error);
          setError("Failed to load trip details");
          setLoading(false);
        }
      }
    };

    fetchTripDetails();
  }, [user, tripId]);

  return { trip, loading, error };
};

export default useFetchTripDetails;
