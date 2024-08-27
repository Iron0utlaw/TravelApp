import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../services/authContext";

const useFetchTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noUser, setNoUser] = useState(false); // New state for no user found

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
          
          // Handle 404 for no user found
          if (response.status === 404) {
            setNoUser(true);
          } else {
            setTrips(response.data.trips);
          }
          setLoading(false);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setNoUser(true); // Set noUser to true if 404 is received
          } else {
            console.error("Error fetching trips:", error);
            setError("Failed to load trips");
          }
          setLoading(false);
        }
      }
    };

    fetchTrips();
  }, [user]);

  return { trips, loading, error, noUser }; // Return noUser state
};

export default useFetchTrips;
