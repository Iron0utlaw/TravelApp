const express = require("express");
const { getUserTrips } = require("../controllers/userController");
const verifyFirebaseToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/trips", verifyFirebaseToken, getUserTrips);

module.exports = router;
