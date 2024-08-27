const {
  generateTripPlan,
  getUserTrips,
  getTripDetails,
  generateQuestions,
  generateAITrip,  // Keep this declaration
} = require("../services/tripService");

const generateTrip = async (req, res) => {
  try {
    const tripData = await generateTripPlan(req.body, req.user.uid);
    res.status(201).json({ message: "Trip saved successfully", tripData });
  } catch (error) {
    console.error("Error generating trip:", error.message);
    res.status(500).json({ error: "Failed to generate trip plan" });
  }
};

const getTrips = async (req, res) => {
  try {
    const trips = await getUserTrips(req.user.uid);
    if (trips === null) {
      return res.status(404).json({ error: "No user found" }); // Send 404 status for no user found
    }
    return res.status(200).json({ trips });
  } catch (error) {
    console.error("Error fetching trips:", error.message);
    return res.status(500).json({ error: "Failed to fetch trips" });
  }
};

const getTrip = async (req, res) => {
  try {
    const trip = await getTripDetails(req.params.tripId);
    res.status(200).json({ trip });
  } catch (error) {
    console.error("Error fetching trip details:", error.message);
    res.status(500).json({ error: "Failed to fetch trip details" });
  }
};

const generateTripQuestions = async (req, res) => {
  try {
    const questions = await generateQuestions(req.body);
    res.status(201).json({ message: "Questions generated successfully", questions });
  } catch (error) {
    console.error("Error generating questions:", error.message);
    res.status(500).json({ error: "Failed to generate questions" });
  }
};

const generateAITripController = async (req, res) => {
  try {
    const tripPlan = await generateAITrip(req.body);
    res.status(201).json({ message: "AI Trip plan generated successfully", tripPlan });
  } catch (error) {
    console.error("Error generating AI trip:", error.message);
    res.status(500).json({ error: "Failed to generate AI trip plan" });
  }
};


module.exports = {
  generateTrip,
  getTrips,
  getTrip,
  generateTripQuestions,
  generateAITripController,  // Keep this module export as well

};
