const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const CitySchema = new mongoose.Schema({
  city: String,
  region: String,
  country: String,
});

const City = mongoose.model("City", CitySchema);

const cities = [
    { city: "New York", region: "New York", country: "United States" },
    { city: "Los Angeles", region: "California", country: "United States" },
    { city: "Chicago", region: "Illinois", country: "United States" },
    { city: "Houston", region: "Texas", country: "United States" },
    { city: "Phoenix", region: "Arizona", country: "United States" },
    { city: "Philadelphia", region: "Pennsylvania", country: "United States" },
    { city: "San Antonio", region: "Texas", country: "United States" },
    { city: "San Diego", region: "California", country: "United States" },
    { city: "Dallas", region: "Texas", country: "United States" },
    { city: "San Jose", region: "California", country: "United States" },
    { city: "London", region: "England", country: "United Kingdom" },
    { city: "Manchester", region: "England", country: "United Kingdom" },
    { city: "Birmingham", region: "England", country: "United Kingdom" },
    { city: "Glasgow", region: "Scotland", country: "United Kingdom" },
    { city: "Edinburgh", region: "Scotland", country: "United Kingdom" },
    { city: "Cardiff", region: "Wales", country: "United Kingdom" },
    { city: "Belfast", region: "Northern Ireland", country: "United Kingdom" },
    { city: "Toronto", region: "Ontario", country: "Canada" },
    { city: "Vancouver", region: "British Columbia", country: "Canada" },
    { city: "Montreal", region: "Quebec", country: "Canada" },
    { city: "Calgary", region: "Alberta", country: "Canada" },
    { city: "Ottawa", region: "Ontario", country: "Canada" },
    { city: "Delhi", region: "Delhi", country: "India" },
    { city: "Mumbai", region: "Maharashtra", country: "India" },
    { city: "Bangalore", region: "Karnataka", country: "India" },
    { city: "Chennai", region: "Tamil Nadu", country: "India" },
    { city: "Kolkata", region: "West Bengal", country: "India" },
    { city: "Hyderabad", region: "Telangana", country: "India" },
    { city: "Ahmedabad", region: "Gujarat", country: "India" },
    { city: "Pune", region: "Maharashtra", country: "India" },
    { city: "Jaipur", region: "Rajasthan", country: "India" },
    { city: "Surat", region: "Gujarat", country: "India" },
    { city: "Sydney", region: "New South Wales", country: "Australia" },
    { city: "Melbourne", region: "Victoria", country: "Australia" },
    { city: "Brisbane", region: "Queensland", country: "Australia" },
    { city: "Perth", region: "Western Australia", country: "Australia" },
    { city: "Adelaide", region: "South Australia", country: "Australia" },
    { city: "Tokyo", region: "Tokyo", country: "Japan" },
    { city: "Osaka", region: "Osaka", country: "Japan" },
    { city: "Nagoya", region: "Aichi", country: "Japan" },
    { city: "Yokohama", region: "Kanagawa", country: "Japan" },
    { city: "Kyoto", region: "Kyoto", country: "Japan" },
    { city: "Paris", region: "Île-de-France", country: "France" },
    { city: "Lyon", region: "Auvergne-Rhône-Alpes", country: "France" },
    { city: "Marseille", region: "Provence-Alpes-Côte d'Azur", country: "France" },
    { city: "Toulouse", region: "Occitanie", country: "France" },
    { city: "Nice", region: "Provence-Alpes-Côte d'Azur", country: "France" },
    { city: "Berlin", region: "Berlin", country: "Germany" },
    { city: "Munich", region: "Bavaria", country: "Germany" },
    { city: "Frankfurt", region: "Hesse", country: "Germany" },
    { city: "Hamburg", region: "Hamburg", country: "Germany" },
    { city: "Cologne", region: "North Rhine-Westphalia", country: "Germany" },
    { city: "Dubai", region: "Dubai", country: "United Arab Emirates" },
    { city: "Abu Dhabi", region: "Abu Dhabi", country: "United Arab Emirates" },
    { city: "Sharjah", region: "Sharjah", country: "United Arab Emirates" },
    { city: "Doha", region: "Doha", country: "Qatar" },
    { city: "Riyadh", region: "Riyadh", country: "Saudi Arabia" },
    { city: "Beijing", region: "Beijing", country: "China" },
    { city: "Shanghai", region: "Shanghai", country: "China" },
    { city: "Guangzhou", region: "Guangdong", country: "China" },
    { city: "Shenzhen", region: "Guangdong", country: "China" },
    { city: "Chengdu", region: "Sichuan", country: "China" },
    { city: "Moscow", region: "Moscow", country: "Russia" },
    { city: "Saint Petersburg", region: "Saint Petersburg", country: "Russia" },
    { city: "Novosibirsk", region: "Novosibirsk Oblast", country: "Russia" },
    { city: "Yekaterinburg", region: "Sverdlovsk Oblast", country: "Russia" },
    { city: "Nizhny Novgorod", region: "Nizhny Novgorod Oblast", country: "Russia" },
    { city: "Mexico City", region: "Mexico City", country: "Mexico" },
    { city: "Guadalajara", region: "Jalisco", country: "Mexico" },
    { city: "Monterrey", region: "Nuevo León", country: "Mexico" },
    { city: "Cancún", region: "Quintana Roo", country: "Mexico" },
    { city: "Tijuana", region: "Baja California", country: "Mexico" },
    { city: "Buenos Aires", region: "Buenos Aires", country: "Argentina" },
    { city: "Córdoba", region: "Córdoba", country: "Argentina" },
    { city: "Rosario", region: "Santa Fe", country: "Argentina" },
    { city: "Mendoza", region: "Mendoza", country: "Argentina" },
    { city: "La Plata", region: "Buenos Aires", country: "Argentina" },
    { city: "São Paulo", region: "São Paulo", country: "Brazil" },
    { city: "Rio de Janeiro", region: "Rio de Janeiro", country: "Brazil" },
    { city: "Brasília", region: "Federal District", country: "Brazil" },
    { city: "Salvador", region: "Bahia", country: "Brazil" },
    { city: "Fortaleza", region: "Ceará", country: "Brazil" },
    { city: "Lagos", region: "Lagos", country: "Nigeria" },
    { city: "Abuja", region: "Federal Capital Territory", country: "Nigeria" },
    { city: "Kano", region: "Kano", country: "Nigeria" },
    { city: "Ibadan", region: "Oyo", country: "Nigeria" },
    { city: "Port Harcourt", region: "Rivers", country: "Nigeria" },
    { city: "Cairo", region: "Cairo", country: "Egypt" },
    { city: "Alexandria", region: "Alexandria", country: "Egypt" },
    { city: "Giza", region: "Giza", country: "Egypt" },
    { city: "Shubra El Kheima", region: "Qalyubia", country: "Egypt" },
    { city: "Port Said", region: "Port Said", country: "Egypt" },
    { city: "Johannesburg", region: "Gauteng", country: "South Africa" },
    { city: "Cape Town", region: "Western Cape", country: "South Africa" },
    { city: "Durban", region: "KwaZulu-Natal", country: "South Africa" },
    { city: "Pretoria", region: "Gauteng", country: "South Africa" },
    { city: "Port Elizabeth", region: "Eastern Cape", country: "South Africa" }
  ];
  

const populateDatabase = async () => {
  try {
    await City.insertMany(cities);
    console.log("Database populated with cities.");
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    mongoose.connection.close();
  }
};

populateDatabase();
