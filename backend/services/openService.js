
const Trip = require("../models/Trip"); 
const City = require("../models/City");

const getRandomTrips = async () => {
  return await Trip.aggregate([{ $sample: { size: 5 } }]);
};

const getLocationSuggestions = async (namePrefix) => {
  return await City.find({
    $or: [
      { city: { $regex: new RegExp(namePrefix, "i") } },
      { region: { $regex: new RegExp(namePrefix, "i") } },
      { country: { $regex: new RegExp(namePrefix, "i") } },
    ],
  }).limit(10);
};

module.exports = {
  getRandomTrips,
  getLocationSuggestions,
};
