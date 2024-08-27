const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config");
const tripRoutes = require("./routes/tripRoutes");
const userRoutes = require("./routes/userRoutes");
const openRoutes = require("./routes/openRoutes");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/trips", tripRoutes);
app.use("/api/user", userRoutes);
app.use("/api", openRoutes);

app.get("/", (req, res) => {
  res.send("Server is live");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
