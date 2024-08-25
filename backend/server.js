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

// Define Mongoose schema and model
const tripSchema = new mongoose.Schema({
  uid: { type: String, required: true }, // Firebase user ID
  trips: [
    {
      tripData: { type: Object, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
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

app.get('/', (req, res) => {
  res.send('Server is live');
});


app.post("/api/generate-trip", verifyFirebaseToken, async (req, res) => {
  const { place, budget, days, people, currency } = req.body;

  const prompt = `Generate Travel Plan for Location: ${place}, for ${days} Days for ${people} people with a ${budget} ${currency} budget. Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Time to travel each of the location for ${days} days with each day plan with best time to visit in JSON format. Do not include any other text in the response.`;

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
              text: "Generate Travel Plan for Location: Delhi, for 3 Days for 2 people with a 10000 INR budget ,Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Time to travel each of the location for 3 days with each day plan with best time to visit in JSON format. Do not include any other text in the response.",
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

    // Check if the user already has trips saved
    const userTrips = await Trip.findOne({ uid: req.user.uid });

    if (userTrips) {
      // User already has trips, so add the new trip
      userTrips.trips.push({ tripData });
      await userTrips.save();
    } else {
      // No trips found for the user, create a new document
      const newTrip = new Trip({
        uid: req.user.uid,
        trips: [{ tripData }],
      });
      await newTrip.save();
    }

    res.status(201).json({ message: "Trip saved successfully", tripData });
  } catch (error) {
    console.error("Error generating trip:", error.message);
    res.status(500).json({ error: "Failed to generate trip plan" });
  }
});

app.get("/api/user-trips", verifyFirebaseToken, async (req, res) => {
  try {
    // Find the user's trips by their UID
    const userTrips = await Trip.findOne({ uid: req.user.uid });

    if (!userTrips) {
      return res.status(404).json({ error: "No trips found for this user" });
    }

    res.status(200).json({ trips: userTrips.trips });
  } catch (error) {
    console.error("Error fetching user trips:", error.message);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
});

app.get("/api/user-trips/:tripId", verifyFirebaseToken, async (req, res) => {
  try {
    // Find the user's trips by their UID
    const userTrips = await Trip.findOne({ uid: req.user.uid });

    if (!userTrips) {
      return res.status(404).json({ error: "No trips found for this user" });
    }

    // Find the specific trip by ID
    const trip = userTrips.trips.id(req.params.tripId);

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
