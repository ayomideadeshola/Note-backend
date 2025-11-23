const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reportRoutes = require("./routes/reportRoutes");
const limiter = require("./middleware/rateLimiter");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use(limiter);

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => res.send("Welcome to Notes API"));

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
