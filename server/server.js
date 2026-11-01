const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = require("./app");
const connectDB = require("./src/config/db");
const PORT = Number(process.env.PORT) || 3001;

let dbConnectionPromise = null;

const ensureDBConnection = async () => {
  if (mongoose.connection.readyState === 1) return;

  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDB().catch((error) => {
      dbConnectionPromise = null;
      throw error;
    });
  }

  await dbConnectionPromise;
};

// Vercel invokes this handler for each request. Reuse the connection promise
// across warm invocations so simultaneous requests share one connection.
const handler = async (req, res) => {
  try {
    await ensureDBConnection();
    return app(req, res);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
};

if (require.main === module) {
  const startServer = async () => {
    try {
      await ensureDBConnection();
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error.message);
      process.exit(1);
    }
  };

  startServer();
}

module.exports = handler;
