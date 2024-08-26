import json2md from "json2md";

export const blobStyles = {
  position: "fixed",
  zIndex: -1, // Ensure the blob stays behind other content
  opacity: 0.5,
};

export const formatBudget = (value) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const generateMarkdown = (trip) => {
  if (trip) {
    const markdownContent = json2md([
      { h1: `Trip to ${trip.place}` },
      { p: `Budget: ${trip.currency} ${trip.budget}` },
      { p: `Days: ${trip.days}` },
      { p: `People: ${trip.people}` },
      { h2: "Hotels" },
      {
        ul: trip.HotelOptions.map((hotel) => {
          return `${hotel.HotelName} - ${hotel["Hotel address"]} (Price: ${hotel.Price}, Rating: ${hotel.rating}/5)\n\nDescription: ${hotel.descriptions}`;
        }),
      },
      { h2: "Itinerary" },
      ...trip.Itinerary.map((day) => ({
        h3: day.Day,
        ul: day.Plan.map((place) => {
          return `${place.PlaceName}\n\nDetails: ${place["Place Details"]}\n\nTicket Pricing: ${place["ticket Pricing"]}\n\nTime to Travel: ${place["Time to travel"]}`;
        }),
        p: `Best Time to Visit: ${day["Best Time to Visit"]}`,
      })),
    ]);

    // Here you can download the markdown file
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "trip-details.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};