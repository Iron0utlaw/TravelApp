const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./mongoose");
const admin = require("./firebase");

module.exports = { connectDB, admin };
