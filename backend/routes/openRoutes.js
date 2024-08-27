const express = require("express");
const {
    getRandomTripSamples,
    getLocations,
  } = require("../controllers/openController");

const router = express.Router();

router.get("/random-trips", getRandomTripSamples);
router.get("/locations", getLocations);

module.exports = router;
