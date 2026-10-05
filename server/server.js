const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

PORT = 3001

const app = require("./app");
const connectDB = require("./src/config/db");

  const startServer = async () => {
    try {
      await connectDB();

      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log("CLIENT_URL:", process.env.CLIENT_URL);
      });
    } catch (error) {
      console.error("Failed to start server:", error.message);
      process.exit(1);
    }
  };

  startServer();
