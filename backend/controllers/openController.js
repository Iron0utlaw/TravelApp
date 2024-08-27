const {
    getRandomTrips,
    getLocationSuggestions,
  } = require("../services/openService");

const getRandomTripSamples = async (req, res) => {
  try {
    const trips = await getRandomTrips();
    res.status(200).json({ trips });
  } catch (error) {
    console.error("Error fetching random trips:", error.message);
    res.status(500).json({ error: "Failed to fetch random trips" });
  }
};

const getLocations = async (req, res) => {
  try {
    const locations = await getLocationSuggestions(req.query.namePrefix);
    res.status(200).json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error.message);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
};

module.exports = {
  getRandomTripSamples,
  getLocations,
};
