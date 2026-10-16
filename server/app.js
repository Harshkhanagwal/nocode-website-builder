const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const authRoutes = require("./src/routes/authRoutes");
const colorThemeRoutes = require("./src/routes/colorThemeRoutes");
const typographyRoutes = require("./src/routes/typographyRoutes");
const websiteRoutes = require("./src/routes/websiteRoutes");
const heroRoutes = require("./src/routes/sections/heroRoutes");
const connectDB = require('./src/config/db')
const contactRoutes = require("./src/routes/sections/contactRoutes");
const aboutUsRoutes = require("./src/routes/sections/aboutUsRoutes");
const accordionRoutes = require("./src/routes/sections/accordionRoutes");
const columnsRoutes = require("./src/routes/sections/columnsRoutes");
const headerRoutes = require("./src/routes/sections/headerRoutes");


app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/color-themes", colorThemeRoutes);
app.use("/api/typographies", typographyRoutes);

app.use("/api/websites", websiteRoutes);
app.use("/api/websites", headerRoutes);
app.use("/api/websites", heroRoutes);
app.use("/api/websites", contactRoutes);
app.use("/api/websites", aboutUsRoutes);
app.use("/api/websites", accordionRoutes);
app.use("/api/websites", columnsRoutes);

app.use("/api/hero", heroRoutes);

/* -------------------- HEALTH CHECK -------------------- */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Harsh's Portfolio API is running",
  });
});



/* -------------------- 404 -------------------- */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* -------------------- ERROR HANDLER -------------------- */

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = app;

