const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const heroRoutes = require("./src/routes/heroRoutes");
const authRoutes = require("./src/routes/authRoutes");
const colorThemeRoutes = require("./src/routes/colorThemeRoutes");
const typographyRoutes = require("./src/routes/typographyRoutes");
const websiteRoutes = require("./src/routes/websiteRoutes");


app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/hero", heroRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/color-themes", colorThemeRoutes);
app.use("/api/typographies", typographyRoutes); 
app.use("/api/websites", websiteRoutes);


/* -------------------- HEALTH CHECK -------------------- */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Harsh's Portfolio API is running",
  });
});

app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
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

