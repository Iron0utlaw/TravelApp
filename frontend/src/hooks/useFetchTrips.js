import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../services/authContext";

const useFetchTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchTrips = async () => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/trips`, {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });
          setTrips(response.data.trips);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching trips:", error);
          setError("Failed to load trips");
          setLoading(false);
        }
      }
    };

    fetchTrips();
  }, [user]);

  return { trips, loading, error };
};

export default useFetchTrips;
