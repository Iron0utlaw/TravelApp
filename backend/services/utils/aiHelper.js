const { GoogleGenerativeAI } = require("@google/generative-ai");
const { touristPlaceImages } = require("./unsplash");

const generateAIResponse = async (prompt, history, markdown) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const chatSession = model.startChat({
    generationConfig,
    history: history,
  });

  const result = await chatSession.sendMessage(prompt);
  if(!markdown) return JSON.parse(result.response.text());
  else return result.response.text();
};

const assignRandomImages = (tripData) => {
  const getRandomImageUrl = () => {
    const randomIndex = Math.floor(Math.random() * touristPlaceImages.length);
    return touristPlaceImages[randomIndex];
  };

  tripData.HotelOptions.forEach((hotel) => {
    hotel["hotel image url"] = getRandomImageUrl();
  });

  tripData.Itinerary.forEach((dayPlan) => {
    dayPlan.Plan.forEach((place) => {
      place["Place Image Url"] = getRandomImageUrl();
    });
  });
};

module.exports = { generateAIResponse, assignRandomImages };
