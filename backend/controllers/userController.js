const User = require("../models/User");

const getUserTrips = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.uid }).populate("tripsId");
    if (!user) {
      return res.status(404).json({ error: "No trips found for this user" });
    }
    res.status(200).json({ trips: user.tripsId });
  } catch (error) {
    console.error("Error fetching user trips:", error.message);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
};

module.exports = { getUserTrips };
