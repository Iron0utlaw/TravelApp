const express = require("express");
const {
  generateTrip,
  getTrips,
  getTrip,
  generateTripQuestions,
  generateAITripController,
} = require("../controllers/tripController");
const verifyFirebaseToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/generate", verifyFirebaseToken, generateTrip);
router.get("/", verifyFirebaseToken, getTrips);
router.get("/:tripId", verifyFirebaseToken, getTrip);
router.post("/generate-questions", verifyFirebaseToken, generateTripQuestions);
router.post("/generate-ai-trip", verifyFirebaseToken, generateAITripController);

module.exports = router;
