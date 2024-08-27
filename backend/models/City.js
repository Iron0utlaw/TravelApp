const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema({
  city: String,
  region: String,
  country: String,
});

module.exports = mongoose.model("City", CitySchema);
