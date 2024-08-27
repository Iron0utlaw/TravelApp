const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  tripsId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }],
});

module.exports = mongoose.model("User", userSchema);
