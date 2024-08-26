const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const MONGO_URI = process.env.MONGO_URI;

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
});

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Firebase user ID
  tripsId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }], // Array of Trip IDs
});

const User = mongoose.model("User", userSchema);

// Trip schema (updated)
const tripSchema = new mongoose.Schema({
  tripData: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Trip = mongoose.model("Trip", tripSchema);

// Middleware to verify Firebase token
const verifyFirebaseToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

const touristPlaceImages = [
  "https://images.unsplash.com/photo-1653149108712-f174c6f3c631?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHwxfHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1707985770057-4a56edd69666?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHwyfHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1700063340685-819a487dcc5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHwzfHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1680641403794-9ceb3e5d00fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHw0fHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1677177947724-ab43f1a0ed12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHw1fHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1677177947814-03e7768d4e9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHw2fHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1640101902841-5794bf09c202?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHw3fHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1702546330003-5d4dec1563c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHw4fHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1677908286999-3975e989c0ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHw5fHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080",
  "https://images.unsplash.com/photo-1676983463766-db0e54be9da3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHwxMHx8dG91cmlzdCUyMHBsYWNlc3xlbnwwfHx8fDE3MjQ0OTc0MTl8MA&ixlib=rb-4.0.3&q=80&w=1080",
];

app.get("/", (req, res) => {
  res.send("Server is live");
});

app.post("/api/generate-trip", verifyFirebaseToken, async (req, res) => {
  const { place, budget, days, people, currency } = req.body;

  const prompt = `Generate Travel Plan for Location: ${place}, for ${days} Days for ${people} people with a ${budget} ${currency} budget. Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Time to travel each of the location for ${days} days with each day plan with best time to visit in JSON format. Do not include any other text in the response. Give Raw text. No backticks`;

  try {
    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: "Generate Travel Plan for Location: Delhi, for 3 Days for 2 people with a 10000 INR budget ,Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Time to travel each of the location for 3 days with each day plan with best time to visit in JSON format. Do not include any other text in the response. Give Raw text. No backticks",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: '{"HotelOptions": [{"HotelName": "The Leela Palace New Delhi", "Hotel address": "Diplomatic Enclave, Chanakyapuri, New Delhi, Delhi 110021", "Price": "₹10,000+", "hotel image url": "https://www.theleela.com/images/hotel-images/new-delhi/exterior-1.jpg", "geo coordinates": {"latitude": 28.5825, "longitude": 77.1979}, "rating": 4.5, "descriptions": "A luxurious 5-star hotel with elegant rooms, multiple dining options, and a spa. It offers a rooftop pool and a fitness center."}, {"HotelName": "The Oberoi, New Delhi", "Hotel address": "Dr. Zakir Hussain Marg, Chanakyapuri, New Delhi, Delhi 110021", "Price": "₹8,000+", "hotel image url": "https://www.oberoihotels.com/media/images/hotels/new-delhi/oberoi-new-delhi-exterior.jpg", "geo coordinates": {"latitude": 28.5857, "longitude": 77.1975}, "rating": 4.6, "descriptions": "A sophisticated hotel known for its impeccable service, spacious rooms, and fine dining restaurants. It features an outdoor pool and a spa."}, {"HotelName": "The Imperial, New Delhi", "Hotel address": "Janpath, Connaught Place, New Delhi, Delhi 110001", "Price": "₹7,000+", "hotel image url": "https://www.theimperialindia.com/media/images/hero-images/hero-image-2.jpg", "geo coordinates": {"latitude": 28.6326, "longitude": 77.2195}, "rating": 4.7, "descriptions": "A historic landmark hotel with opulent rooms, a colonial ambiance, and a renowned restaurant. It offers a rooftop terrace and a business center."}, {"HotelName": "The Taj Mahal Hotel, New Delhi", "Hotel address": "Man Singh Road, New Delhi, Delhi 110001", "Price": "₹6,000+", "hotel image url": "https://www.tajhotels.com/content/dam/luxury/hotels/india/new-delhi/taj-mahal-hotel-new-delhi/gallery/exterior.jpg", "geo coordinates": {"latitude": 28.6239, "longitude": 77.2217}, "rating": 4.4, "descriptions": "A grand hotel with luxurious rooms, multiple dining options, and a spa. It features an outdoor pool and a fitness center."}, {"HotelName": "The Roseate New Delhi", "Hotel address": "S-2, Samalkha, NH-8, Delhi, Haryana 122001", "Price": "₹5,000+", "hotel image url": "https://www.theroseate.com/newdelhi/images/exterior/roseate-exterior-2.jpg", "geo coordinates": {"latitude": 28.5498, "longitude": 77.0892}, "rating": 4.3, "descriptions": "A stylish hotel with modern rooms, a rooftop pool, and a spa. It offers multiple dining options and a fitness center."}], "Itinerary": [{"Day": "Day 1", "Plan": [{"PlaceName": "Red Fort", "Place Details": "A UNESCO World Heritage Site, a historical fort built by Mughal emperor Shah Jahan in the 17th century.", "Place Image Url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Red_Fort_from_the_south.jpg/1200px-Red_Fort_from_the_south.jpg", "Geo Coordinates": {"latitude": 28.6560, "longitude": 77.2309}, "ticket Pricing": "₹10 per person", "Time to travel": "2-3 hours"}, {"PlaceName": "Jama Masjid", "Place Details": "The largest mosque in India, built by Mughal emperor Shah Jahan in the 17th century.", "Place Image Url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Jama_Masjid_Delhi.jpg/1200px-Jama_Masjid_Delhi.jpg", "Geo Coordinates": {"latitude": 28.6481, "longitude": 77.2335}, "ticket Pricing": "Free", "Time to travel": "1-2 hours"}, {"PlaceName": "Chandni Chowk", "Place Details": "A bustling market area known for its street food, shops, and historical buildings.", "Place Image Url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Chandni_Chowk_Night_View.jpg/1200px-Chandni_Chowk_Night_View.jpg", "Geo Coordinates": {"latitude": 28.6495, "longitude": 77.2309}, "ticket Pricing": "Free", "Time to travel": "3-4 hours"}], "Best Time to Visit": "Morning to evening"}, {"Day": "Day 2", "Plan": [{"PlaceName": "Humayun\'s Tomb", "Place Details": "A UNESCO World Heritage Site, a tomb built for Mughal emperor Humayun in the 16th century.", "Place Image Url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Humayun%27s_Tomb_2016-05-21.jpg/1200px-Humayun%27s_Tomb_2016-05-21.jpg", "Geo Coordinates": {"latitude": 28.6125, "longitude": 77.2285}, "ticket Pricing": "₹10 per person", "Time to travel": "2-3 hours"}, {"PlaceName": "Lotus Temple", "Place Details": "A unique architectural marvel, a Baha\'i House of Worship built in the shape of a lotus flower.", "Place Image Url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Lotus_Temple_%28cropped%29.jpg/1200px-Lotus_Temple_%28cropped%29.jpg", "Geo Coordinates": {"latitude": 28.5677, "longitude": 77.2422}, "ticket Pricing": "Free", "Time to travel": "1-2 hours"}, {"PlaceName": "India Gate", "Place Details": "A war memorial dedicated to the Indian soldiers who died in World War I.", "Place Image Url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/India_Gate_2017-03-29_1.jpg/1200px-India_Gate_2017-03-29_1.jpg", "Geo Coordinates": {"latitude": 28.6130, "longitude": 77.2295}, "ticket Pricing": "Free", "Time to travel": "1-2 hours"}], "Best Time to Visit": "Morning to evening"}, {"Day": "Day 3", "Plan": [{"PlaceName": "Qutub Minar", "Place Details": "A UNESCO World Heritage Site, a towering minaret built by Qutub-ud-din Aibak in the 12th century.", "Place Image Url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Qutub_Minar_2019.jpg/1200px-Qutub_Minar_2019.jpg", "Geo Coordinates": {"latitude": 28.5839, "longitude": 77.1739}, "ticket Pricing": "₹10 per person", "Time to travel": "2-3 hours"}, {"PlaceName": "Purana Qila", "Place Details": "An ancient fort built by the legendary Hindu king, Dhilu, in the 6th century BCE, which was later used by Mughal emperor Humayun in the 16th century.", "Place Image Url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Purana_Qila_Delhi_India_2019-02-18_0004.jpg/1200px-Purana_Qila_Delhi_India_2019-02-18_0004.jpg", "Geo Coordinates": {"latitude": 28.6163, "longitude": 77.2477}, "ticket Pricing": "₹10 per person", "Time to travel": "2-3 hours"}, {"PlaceName": "National Museum", "Place Details": "A renowned museum housing a vast collection of artifacts from India\'s rich history and culture.", "Place Image Url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/National_Museum_India.jpg/1200px-National_Museum_India.jpg", "Geo Coordinates": {"latitude": 28.6206, "longitude": 77.2276}, "ticket Pricing": "₹20 per person", "Time to travel": "2-3 hours"}], "Best Time to Visit": "Morning to afternoon"}]}\n\n',
            },
          ],
        },
      ],
    });

    function getRandomImageUrl() {
      const randomIndex = Math.floor(Math.random() * touristPlaceImages.length);
      return touristPlaceImages[randomIndex];
    }

    const result = await chatSession.sendMessage(prompt);
    const generatedTripData = JSON.parse(result.response.text());

    // Assign random images for hotels and places
    for (let hotel of generatedTripData.HotelOptions) {
      const imageUrl = getRandomImageUrl();
      hotel["hotel image url"] = imageUrl; // Update with a random image URL
    }

    for (let dayPlan of generatedTripData.Itinerary) {
      for (let place of dayPlan.Plan) {
        const imageUrl = getRandomImageUrl();
        place["Place Image Url"] = imageUrl; // Update with a random image URL
      }
    }

    const tripData = {
      ...generatedTripData,
      place,
      budget,
      days,
      people,
      currency,
    };

    // Save the trip data into the Trip collection
    const newTrip = new Trip({
      tripData: tripData,
      createdAt: new Date(),
    });
    const savedTrip = await newTrip.save();

    // Find the user by Firebase UID or create a new one if it doesn't exist
    let user = await User.findOne({ userId: req.user.uid });
    if (!user) {
      user = new User({
        userId: req.user.uid,
        tripsId: [savedTrip._id],
      });
    } else {
      user.tripsId.push(savedTrip._id);
    }
    await user.save();

    // Send the response
    res
      .status(201)
      .json({ message: "Trip saved successfully", tripData: savedTrip });
  } catch (error) {
    console.error("Error generating trip:", error.message);
    res.status(500).json({ error: "Failed to generate trip plan" });
  }
});

app.get("/api/user-trips", verifyFirebaseToken, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.uid }).populate(
      "tripsId"
    );

    if (!user) {
      return res.status(404).json({ error: "No trips found for this user" });
    }

    res.status(200).json({ trips: user.tripsId });
  } catch (error) {
    console.error("Error fetching user trips:", error.message);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
});

app.get("/api/user-trips/:tripId", verifyFirebaseToken, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.status(200).json({ trip });
  } catch (error) {
    console.error("Error fetching trip details:", error.message);
    res.status(500).json({ error: "Failed to fetch trip details" });
  }
});

const CitySchema = new mongoose.Schema({
  city: String,
  region: String,
  country: String,
});

const City = mongoose.model("City", CitySchema);

// New API endpoint for fetching location suggestions
app.get("/api/locations", async (req, res) => {
  const { namePrefix } = req.query;
  try {
    const cities = await City.find({
      $or: [
        { city: { $regex: new RegExp(namePrefix, "i") } },
        { region: { $regex: new RegExp(namePrefix, "i") } },
        { country: { $regex: new RegExp(namePrefix, "i") } },
      ],
    }).limit(10);

    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cities" });
  }
});

app.get("/api/random-trips", async (req, res) => {
  try {
    // Fetch 5 random trips directly from the Trips collection
    const randomTrips = await Trip.aggregate([
      { $sample: { size: 5 } }, // Randomly sample 5 trips
    ]);

    if (randomTrips.length === 0) {
      return res.status(404).json({ error: "No trips found" });
    }

    // Return the sampled trips
    res.status(200).json({ trips: randomTrips });
  } catch (error) {
    console.error("Error fetching random trips:", error.message);
    res.status(500).json({ error: "Failed to fetch random trips" });
  }
});

app.post("/api/generate-questions", verifyFirebaseToken, async (req, res) => {
  const { trip } = req.body;
  const tripData = JSON.stringify(trip);
  const prompt = `Generate 2 mcq personality based questions to understand user preference related to trip return in JSON format. No other text. Only Raw text. No backticks ${tripData}`;
  console.log(prompt,trip);
  try {
    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "Generate 2 mcq personality based questions to understand user preference related to trip return in JSON format. No other text. Only Raw text. No backticks. No Quotation marks\n{\n    \"HotelOptions\": [\n        {\n            \"HotelName\": \"Imperial Hotel\",\n            \"Hotel address\": \"1-1, Uchisaiwaicho 1-chome, Chiyoda-ku, Tokyo 100-8558, Japan\",\n            \"Price\": \"₹30,000+\",\n            \"hotel image url\": \"https://images.unsplash.com/photo-1700063340685-819a487dcc5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHwzfHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n            \"geo coordinates\": {\n                \"latitude\": 35.6695,\n                \"longitude\": 139.7651\n            },\n            \"rating\": 4.8,\n            \"descriptions\": \"A historic and luxurious hotel in the heart of Tokyo. It offers elegant rooms, multiple dining options, and a spa. It also features a rooftop garden and a swimming pool.\"\n        },\n        {\n            \"HotelName\": \"Mandarin Oriental Tokyo\",\n            \"Hotel address\": \"2-1-1 Nihonbashi Muromachi, Chuo-ku, Tokyo 103-8285, Japan\",\n            \"Price\": \"₹25,000+\",\n            \"hotel image url\": \"https://images.unsplash.com/photo-1707985770057-4a56edd69666?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHwyfHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n            \"geo coordinates\": {\n                \"latitude\": 35.6843,\n                \"longitude\": 139.7754\n            },\n            \"rating\": 4.7,\n            \"descriptions\": \"A modern and sophisticated hotel in the Nihonbashi district. It offers stunning city views, elegant rooms, and multiple dining options. It also features a spa and a fitness center.\"\n        },\n        {\n            \"HotelName\": \"Park Hyatt Tokyo\",\n            \"Hotel address\": \"3-7-1-2, Nishi-Shinjuku, Shinjuku-ku, Tokyo 163-0853, Japan\",\n            \"Price\": \"₹20,000+\",\n            \"hotel image url\": \"https://images.unsplash.com/photo-1707985770057-4a56edd69666?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHwyfHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n            \"geo coordinates\": {\n                \"latitude\": 35.6895,\n                \"longitude\": 139.7036\n            },\n            \"rating\": 4.6,\n            \"descriptions\": \"A stylish and iconic hotel known for its stunning views from its rooftop bar and restaurant. It offers spacious rooms, multiple dining options, and a spa. It also features a fitness center and an outdoor pool.\"\n        },\n        {\n            \"HotelName\": \"The Peninsula Tokyo\",\n            \"Hotel address\": \"1-8-1, Yurakucho, Chiyoda-ku, Tokyo 100-0006, Japan\",\n            \"Price\": \"₹20,000+\",\n            \"hotel image url\": \"https://images.unsplash.com/photo-1700063340685-819a487dcc5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHwzfHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n            \"geo coordinates\": {\n                \"latitude\": 35.6732,\n                \"longitude\": 139.7653\n            },\n            \"rating\": 4.5,\n            \"descriptions\": \"A luxurious and stylish hotel in the heart of Tokyo. It offers elegant rooms, multiple dining options, and a spa. It also features a fitness center, a swimming pool, and a rooftop garden.\"\n        },\n        {\n            \"HotelName\": \"Four Seasons Hotel Tokyo at Marunouchi\",\n            \"Hotel address\": \"1-9-1 Marunouchi, Chiyoda-ku, Tokyo 100-0005, Japan\",\n            \"Price\": \"₹15,000+\",\n            \"hotel image url\": \"https://images.unsplash.com/photo-1680641403794-9ceb3e5d00fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHw0fHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n            \"geo coordinates\": {\n                \"latitude\": 35.6811,\n                \"longitude\": 139.7664\n            },\n            \"rating\": 4.4,\n            \"descriptions\": \"A sophisticated and modern hotel in the Marunouchi district. It offers spacious rooms, multiple dining options, and a spa. It also features a fitness center and a rooftop terrace.\"\n        }\n    ],\n    \"Itinerary\": [\n        {\n            \"Day\": \"Day 1\",\n            \"Plan\": [\n                {\n                    \"PlaceName\": \"Tokyo Skytree\",\n                    \"Place Details\": \"The tallest structure in Japan, offering panoramic views of the city.\",\n                    \"Place Image Url\": \"https://images.unsplash.com/photo-1700063340685-819a487dcc5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHwzfHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n                    \"Geo Coordinates\": {\n                        \"latitude\": 35.7101,\n                        \"longitude\": 139.8107\n                    },\n                    \"ticket Pricing\": \"₹3,000\",\n                    \"Time to travel\": \"3-4 hours\"\n                },\n                {\n                    \"PlaceName\": \"Senso-ji Temple\",\n                    \"Place Details\": \"Tokyo's oldest temple, known for its vibrant atmosphere and cultural significance.\",\n                    \"Place Image Url\": \"https://images.unsplash.com/photo-1653149108712-f174c6f3c631?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHwxfHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n                    \"Geo Coordinates\": {\n                        \"latitude\": 35.7087,\n                        \"longitude\": 139.8003\n                    },\n                    \"ticket Pricing\": \"Free\",\n                    \"Time to travel\": \"2-3 hours\"\n                },\n                {\n                    \"PlaceName\": \"Nakamise-dori\",\n                    \"Place Details\": \"A bustling shopping street leading to Senso-ji Temple, filled with traditional Japanese souvenirs and snacks.\",\n                    \"Place Image Url\": \"https://images.unsplash.com/photo-1677177947814-03e7768d4e9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHw2fHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n                    \"Geo Coordinates\": {\n                        \"latitude\": 35.7087,\n                        \"longitude\": 139.8003\n                    },\n                    \"ticket Pricing\": \"Free\",\n                    \"Time to travel\": \"1-2 hours\"\n                }\n            ],\n            \"Best Time to Visit\": \"Morning to evening\"\n        },\n        {\n            \"Day\": \"Day 2\",\n            \"Plan\": [\n                {\n                    \"PlaceName\": \"Shibuya Crossing\",\n                    \"Place Details\": \"The world's busiest pedestrian crossing, a symbol of Tokyo's energy and dynamism.\",\n                    \"Place Image Url\": \"https://images.unsplash.com/photo-1653149108712-f174c6f3c631?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHwxfHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n                    \"Geo Coordinates\": {\n                        \"latitude\": 35.6695,\n                        \"longitude\": 139.6988\n                    },\n                    \"ticket Pricing\": \"Free\",\n                    \"Time to travel\": \"1-2 hours\"\n                },\n                {\n                    \"PlaceName\": \"Harajuku\",\n                    \"Place Details\": \"A vibrant district known for its unique fashion, street food, and youthful energy.\",\n                    \"Place Image Url\": \"https://images.unsplash.com/photo-1677177947814-03e7768d4e9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHw2fHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n                    \"Geo Coordinates\": {\n                        \"latitude\": 35.6709,\n                        \"longitude\": 139.6978\n                    },\n                    \"ticket Pricing\": \"Free\",\n                    \"Time to travel\": \"3-4 hours\"\n                },\n                {\n                    \"PlaceName\": \"Meiji Jingu Shrine\",\n                    \"Place Details\": \"A serene Shinto shrine dedicated to Emperor Meiji and Empress Shoken, surrounded by lush forest.\",\n                    \"Place Image Url\": \"https://images.unsplash.com/photo-1676983463766-db0e54be9da3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHwxMHx8dG91cmlzdCUyMHBsYWNlc3xlbnwwfHx8fDE3MjQ0OTc0MTl8MA&ixlib=rb-4.0.3&q=80&w=1080\",\n                    \"Geo Coordinates\": {\n                        \"latitude\": 35.6732,\n                        \"longitude\": 139.7001\n                    },\n                    \"ticket Pricing\": \"Free\",\n                    \"Time to travel\": \"2-3 hours\"\n                }\n            ],\n            \"Best Time to Visit\": \"Morning to evening\"\n        },\n        {\n            \"Day\": \"Day 3\",\n            \"Plan\": [\n                {\n                    \"PlaceName\": \"Ghibli Museum\",\n                    \"Place Details\": \"A whimsical museum dedicated to the works of Studio Ghibli, the renowned animation studio.\",\n                    \"Place Image Url\": \"https://images.unsplash.com/photo-1677908286999-3975e989c0ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHw5fHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n                    \"Geo Coordinates\": {\n                        \"latitude\": 35.7009,\n                        \"longitude\": 139.6856\n                    },\n                    \"ticket Pricing\": \"₹3,000\",\n                    \"Time to travel\": \"3-4 hours\"\n                },\n                {\n                    \"PlaceName\": \"Ueno Park\",\n                    \"Place Details\": \"A sprawling park home to museums, temples, a zoo, and a pond.\",\n                    \"Place Image Url\": \"https://images.unsplash.com/photo-1676983463766-db0e54be9da3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHwxMHx8dG91cmlzdCUyMHBsYWNlc3xlbnwwfHx8fDE3MjQ0OTc0MTl8MA&ixlib=rb-4.0.3&q=80&w=1080\",\n                    \"Geo Coordinates\": {\n                        \"latitude\": 35.7128,\n                        \"longitude\": 139.7669\n                    },\n                    \"ticket Pricing\": \"Free\",\n                    \"Time to travel\": \"3-4 hours\"\n                },\n                {\n                    \"PlaceName\": \"Tsukiji Fish Market\",\n                    \"Place Details\": \"A famous market known for its lively tuna auctions and fresh seafood.\",\n                    \"Place Image Url\": \"https://images.unsplash.com/photo-1680641403794-9ceb3e5d00fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHw0fHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n                    \"Geo Coordinates\": {\n                        \"latitude\": 35.6666,\n                        \"longitude\": 139.7873\n                    },\n                    \"ticket Pricing\": \"Free\",\n                    \"Time to travel\": \"2-3 hours\"\n                }\n            ],\n            \"Best Time to Visit\": \"Morning to afternoon\"\n        }\n    ],\n    \"place\": \"Tokyo, Tokyo, Japan\",\n    \"budget\": \"200000\",\n    \"days\": \"3\",\n    \"people\": \"2\",\n    \"currency\": \"INR\"\n}"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "{\n    \"questions\": [\n        {\n            \"question\": \"What type of hotel do you prefer?\",\n            \"options\": [\n                \"Luxurious and historic\",\n                \"Modern and sophisticated\",\n                \"Stylish and iconic\",\n                \"Comfortable and affordable\"\n            ]\n        },\n        {\n            \"question\": \"What kind of activities do you enjoy during your travels?\",\n            \"options\": [\n                \"Exploring historical landmarks and cultural sites\",\n                \"Shopping and dining in trendy districts\",\n                \"Visiting museums and art galleries\",\n                \"Relaxing in nature and parks\"\n            ]\n        }\n    ]\n}"},
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(prompt);
    const questions = JSON.parse(result.response.text());

    // Send the response
    res
      .status(201)
      .json({ message: "Trip saved successfully", questions: questions });
  } catch (error) {
    console.error("Error generating trip:", error.message);
    res.status(500).json({ error: "Failed to generate trip plan" });
  }
});

app.post("/api/generate-ai-trip", verifyFirebaseToken, async (req, res) => {
  const { trip, questionsWithAnswers } = req.body;
  const tripData = JSON.stringify(trip);
  const questionsWithAnswersData = JSON.stringify(questionsWithAnswers);
  const prompt = `Given the recommended trip details and the questions with answer generate a trip plan ${tripData} ${questionsWithAnswersData}`;

  try {
    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "Given the recommended trip details and the questions with answer generate a trip plan {\n    \"HotelOptions\": [\n        {\n            \"HotelName\": \"Imperial Hotel\",\n            \"Hotel address\": \"1-1, Uchisaiwaicho 1-chome, Chiyoda-ku, Tokyo 100-8558, Japan\",\n            \"Price\": \"₹30,000+\",\n            \"hotel image url\": \"https://images.unsplash.com/photo-1700063340685-819a487dcc5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHwzfHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n            \"geo coordinates\": {\n                \"latitude\": 35.6695,\n                \"longitude\": 139.7651\n            },\n            \"rating\": 4.8,\n            \"descriptions\": \"A historic and luxurious hotel in the heart of Tokyo. It offers elegant rooms, multiple dining options, and a spa. It also features a rooftop garden and a swimming pool.\"\n        },\n        {\n            \"HotelName\": \"Mandarin Oriental Tokyo\",\n            \"Hotel address\": \"2-1-1 Nihonbashi Muromachi, Chuo-ku, Tokyo 103-8285, Japan\",\n            \"Price\": \"₹25,000+\",\n            \"hotel image url\": \"https://images.unsplash.com/photo-1707985770057-4a56edd69666?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHwyfHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n            \"geo coordinates\": {\n                \"latitude\": 35.6843,\n                \"longitude\": 139.7754\n            },\n            \"rating\": 4.7,\n            \"descriptions\": \"A modern and sophisticated hotel in the Nihonbashi district. It offers stunning city views, elegant rooms, and multiple dining options. It also features a spa and a fitness center.\"\n        },\n        {\n            \"HotelName\": \"Park Hyatt Tokyo\",\n            \"Hotel address\": \"3-7-1-2, Nishi-Shinjuku, Shinjuku-ku, Tokyo 163-0853, Japan\",\n            \"Price\": \"₹20,000+\",\n            \"hotel image url\": \"https://images.unsplash.com/photo-1707985770057-4a56edd69666?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHwyfHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n            \"geo coordinates\": {\n                \"latitude\": 35.6895,\n                \"longitude\": 139.7036\n            },\n            \"rating\": 4.6,\n            \"descriptions\": \"A stylish and iconic hotel known for its stunning views from its rooftop bar and restaurant. It offers spacious rooms, multiple dining options, and a spa. It also features a fitness center and an outdoor pool.\"\n        },\n        {\n            \"HotelName\": \"The Peninsula Tokyo\",\n            \"Hotel address\": \"1-8-1, Yurakucho, Chiyoda-ku, Tokyo 100-0006, Japan\",\n            \"Price\": \"₹20,000+\",\n            \"hotel image url\": \"https://images.unsplash.com/photo-1700063340685-819a487dcc5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHwzfHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n            \"geo coordinates\": {\n                \"latitude\": 35.6732,\n                \"longitude\": 139.7653\n            },\n            \"rating\": 4.5,\n            \"descriptions\": \"A luxurious and stylish hotel in the heart of Tokyo. It offers elegant rooms, multiple dining options, and a spa. It also features a fitness center, a swimming pool, and a rooftop garden.\"\n        },\n        {\n            \"HotelName\": \"Four Seasons Hotel Tokyo at Marunouchi\",\n            \"Hotel address\": \"1-9-1 Marunouchi, Chiyoda-ku, Tokyo 100-0005, Japan\",\n            \"Price\": \"₹15,000+\",\n            \"hotel image url\": \"https://images.unsplash.com/photo-1680641403794-9ceb3e5d00fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHw0fHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n            \"geo coordinates\": {\n                \"latitude\": 35.6811,\n                \"longitude\": 139.7664\n            },\n            \"rating\": 4.4,\n            \"descriptions\": \"A sophisticated and modern hotel in the Marunouchi district. It offers spacious rooms, multiple dining options, and a spa. It also features a fitness center and a rooftop terrace.\"\n        }\n    ],\n    \"Itinerary\": [\n        {\n            \"Day\": \"Day 1\",\n            \"Plan\": [\n                {\n                    \"PlaceName\": \"Tokyo Skytree\",\n                    \"Place Details\": \"The tallest structure in Japan, offering panoramic views of the city.\",\n                    \"Place Image Url\": \"https://images.unsplash.com/photo-1700063340685-819a487dcc5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHwzfHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n                    \"Geo Coordinates\": {\n                        \"latitude\": 35.7101,\n                        \"longitude\": 139.8107\n                    },\n                    \"ticket Pricing\": \"₹3,000\",\n                    \"Time to travel\": \"3-4 hours\"\n                },\n                {\n                    \"PlaceName\": \"Senso-ji Temple\",\n                    \"Place Details\": \"Tokyo's oldest temple, known for its vibrant atmosphere and cultural significance.\",\n                    \"Place Image Url\": \"https://images.unsplash.com/photo-1653149108712-f174c6f3c631?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHwxfHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n                    \"Geo Coordinates\": {\n                        \"latitude\": 35.7087,\n                        \"longitude\": 139.8003\n                    },\n                    \"ticket Pricing\": \"Free\",\n                    \"Time to travel\": \"2-3 hours\"\n                },\n                {\n                    \"PlaceName\": \"Nakamise-dori\",\n                    \"Place Details\": \"A bustling shopping street leading to Senso-ji Temple, filled with traditional Japanese souvenirs and snacks.\",\n                    \"Place Image Url\": \"https://images.unsplash.com/photo-1677177947814-03e7768d4e9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHw2fHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n                    \"Geo Coordinates\": {\n                        \"latitude\": 35.7087,\n                        \"longitude\": 139.8003\n                    },\n                    \"ticket Pricing\": \"Free\",\n                    \"Time to travel\": \"1-2 hours\"\n                }\n            ],\n            \"Best Time to Visit\": \"Morning to evening\"\n        },\n        {\n            \"Day\": \"Day 2\",\n            \"Plan\": [\n                {\n                    \"PlaceName\": \"Shibuya Crossing\",\n                    \"Place Details\": \"The world's busiest pedestrian crossing, a symbol of Tokyo's energy and dynamism.\",\n                    \"Place Image Url\": \"https://images.unsplash.com/photo-1653149108712-f174c6f3c631?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHwxfHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n                    \"Geo Coordinates\": {\n                        \"latitude\": 35.6695,\n                        \"longitude\": 139.6988\n                    },\n                    \"ticket Pricing\": \"Free\",\n                    \"Time to travel\": \"1-2 hours\"\n                },\n                {\n                    \"PlaceName\": \"Harajuku\",\n                    \"Place Details\": \"A vibrant district known for its unique fashion, street food, and youthful energy.\",\n                    \"Place Image Url\": \"https://images.unsplash.com/photo-1677177947814-03e7768d4e9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHw2fHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n                    \"Geo Coordinates\": {\n                        \"latitude\": 35.6709,\n                        \"longitude\": 139.6978\n                    },\n                    \"ticket Pricing\": \"Free\",\n                    \"Time to travel\": \"3-4 hours\"\n                },\n                {\n                    \"PlaceName\": \"Meiji Jingu Shrine\",\n                    \"Place Details\": \"A serene Shinto shrine dedicated to Emperor Meiji and Empress Shoken, surrounded by lush forest.\",\n                    \"Place Image Url\": \"https://images.unsplash.com/photo-1676983463766-db0e54be9da3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHwxMHx8dG91cmlzdCUyMHBsYWNlc3xlbnwwfHx8fDE3MjQ0OTc0MTl8MA&ixlib=rb-4.0.3&q=80&w=1080\",\n                    \"Geo Coordinates\": {\n                        \"latitude\": 35.6732,\n                        \"longitude\": 139.7001\n                    },\n                    \"ticket Pricing\": \"Free\",\n                    \"Time to travel\": \"2-3 hours\"\n                }\n            ],\n            \"Best Time to Visit\": \"Morning to evening\"\n        },\n        {\n            \"Day\": \"Day 3\",\n            \"Plan\": [\n                {\n                    \"PlaceName\": \"Ghibli Museum\",\n                    \"Place Details\": \"A whimsical museum dedicated to the works of Studio Ghibli, the renowned animation studio.\",\n                    \"Place Image Url\": \"https://images.unsplash.com/photo-1677908286999-3975e989c0ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHw5fHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n                    \"Geo Coordinates\": {\n                        \"latitude\": 35.7009,\n                        \"longitude\": 139.6856\n                    },\n                    \"ticket Pricing\": \"₹3,000\",\n                    \"Time to travel\": \"3-4 hours\"\n                },\n                {\n                    \"PlaceName\": \"Ueno Park\",\n                    \"Place Details\": \"A sprawling park home to museums, temples, a zoo, and a pond.\",\n                    \"Place Image Url\": \"https://images.unsplash.com/photo-1676983463766-db0e54be9da3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHwxMHx8dG91cmlzdCUyMHBsYWNlc3xlbnwwfHx8fDE3MjQ0OTc0MTl8MA&ixlib=rb-4.0.3&q=80&w=1080\",\n                    \"Geo Coordinates\": {\n                        \"latitude\": 35.7128,\n                        \"longitude\": 139.7669\n                    },\n                    \"ticket Pricing\": \"Free\",\n                    \"Time to travel\": \"3-4 hours\"\n                },\n                {\n                    \"PlaceName\": \"Tsukiji Fish Market\",\n                    \"Place Details\": \"A famous market known for its lively tuna auctions and fresh seafood.\",\n                    \"Place Image Url\": \"https://images.unsplash.com/photo-1680641403794-9ceb3e5d00fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDY2Nzh8MHwxfHNlYXJjaHw0fHx0b3VyaXN0JTIwcGxhY2VzfGVufDB8fHx8MTcyNDQ5NzQxOXww&ixlib=rb-4.0.3&q=80&w=1080\",\n                    \"Geo Coordinates\": {\n                        \"latitude\": 35.6666,\n                        \"longitude\": 139.7873\n                    },\n                    \"ticket Pricing\": \"Free\",\n                    \"Time to travel\": \"2-3 hours\"\n                }\n            ],\n            \"Best Time to Visit\": \"Morning to afternoon\"\n        }\n    ],\n    \"place\": \"Tokyo, Tokyo, Japan\",\n    \"budget\": \"200000\",\n    \"days\": \"3\",\n    \"people\": \"2\",\n    \"currency\": \"INR\"\n}\n[\n  {\n    \"question\": \"What is your preferred pace of travel?\",\n    \"selectedAnswer\": \"Fast-paced and action-packed\"\n  },\n  {\n    \"question\": \"Which type of experience are you most interested in?\",\n    \"selectedAnswer\": \"Immersive cultural experiences\"\n  }\n]"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "## Tokyo Trip Plan - Fast-Paced & Immersive Culture\n\n**This plan is tailored for a fast-paced trip with a focus on immersive cultural experiences, designed for 2 people for 3 days with a budget of INR 200,000. **\n\n**Day 1 - Exploring Tokyo's History and Culture:**\n\n**Morning (9:00 AM - 12:00 PM):**\n\n* **Tokyo Skytree:** Ascend to the top of this iconic tower for breathtaking panoramic views of the city (allow 2 hours).\n* **Senso-ji Temple:** Immerse yourself in the rich history of Tokyo's oldest temple, exploring its vibrant halls and tranquil gardens (allow 1 hour).\n\n**Afternoon (12:30 PM - 4:00 PM):**\n\n* **Lunch in Nakamise-dori:** Enjoy traditional Japanese snacks and souvenirs while exploring this bustling street leading to Senso-ji Temple (allow 1.5 hours).\n* **Imperial Palace East Garden:** Find peace and quiet amidst the beautifully landscaped gardens of the former Imperial Palace (allow 1.5 hours).\n\n**Evening (4:30 PM - 8:00 PM):**\n\n* **Ginza District:** Experience Tokyo's upscale shopping and dining scene in this iconic district (allow 2 hours).\n* **Dinner at a traditional Japanese restaurant:** Indulge in a delicious and authentic Japanese meal, experiencing the cultural atmosphere (allow 2 hours).\n\n**Day 2 - Fashion, Youthful Energy, and Serenity:**\n\n**Morning (9:00 AM - 12:00 PM):**\n\n* **Shibuya Crossing:** Witness the energetic chaos of the world's busiest pedestrian crossing, a symbol of Tokyo's dynamism (allow 1 hour).\n* **Harajuku:** Explore the unique fashion scene, colorful street food, and youthful energy of this vibrant district (allow 2 hours).\n\n**Afternoon (12:30 PM - 4:00 PM):**\n\n* **Lunch in Harajuku:** Enjoy a delicious and casual lunch in one of Harajuku's many trendy cafes or restaurants (allow 1 hour).\n* **Meiji Jingu Shrine:** Find serenity and tranquility amidst the lush forest surrounding this peaceful Shinto shrine dedicated to Emperor Meiji and Empress Shoken (allow 2 hours).\n\n**Evening (4:30 PM - 8:00 PM):**\n\n* **Shinjuku Gyoen National Garden:** Take a relaxing walk through this beautifully landscaped park, enjoying its diverse plant life and peaceful atmosphere (allow 2 hours).\n* **Dinner at a modern Japanese restaurant:** Enjoy a delicious and contemporary Japanese meal in one of Shinjuku's many trendy restaurants (allow 2 hours).\n\n**Day 3 - Animation, Culture, and Fresh Seafood:**\n\n**Morning (9:00 AM - 12:00 PM):**\n\n* **Ghibli Museum:** Immerse yourself in the world of Studio Ghibli, exploring its whimsical exhibits and interactive experiences (allow 2 hours).\n* **Ueno Park:** Explore the diverse attractions of this sprawling park, including museums, temples, a zoo, and a pond (allow 1 hour).\n\n**Afternoon (12:30 PM - 4:00 PM):**\n\n* **Lunch at a traditional ramen shop:** Experience the authentic flavors of Japanese ramen in a bustling local restaurant (allow 1 hour).\n* **Tsukiji Fish Market:** Witness the energetic tuna auctions and enjoy the freshest seafood at this iconic market (allow 2 hours).\n\n**Evening (4:30 PM - 8:00 PM):**\n\n* **Akihabara:** Explore this vibrant district known for its electronics, anime, and manga culture (allow 2 hours).\n* **Dinner at a local Izakaya:** Enjoy a relaxed and social dining experience in this type of Japanese pub, sampling a variety of small dishes and drinks (allow 2 hours).\n\n**Hotel Recommendations:**\n\n* For luxury and elegance: **Imperial Hotel, Mandarin Oriental Tokyo**\n* For stylish and iconic views: **Park Hyatt Tokyo**\n* For a sophisticated and modern experience: **Four Seasons Hotel Tokyo at Marunouchi**\n\n**This itinerary is just a suggestion, feel free to adjust it based on your interests and preferences. Enjoy your exciting and immersive cultural journey through Tokyo!** \n"},
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(prompt);
    const markdown = result.response.text();

    // Send the response
    res
      .status(201)
      .json({ message: "Trip saved successfully", markdown: markdown });
  } catch (error) {
    console.error("Error generating trip:", error.message);
    res.status(500).json({ error: "Failed to generate trip plan" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
