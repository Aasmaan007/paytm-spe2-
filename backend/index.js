const express = require("express");
const mainRouter = require("./routes/index.js");
const cors = require("cors");

const app = express(); // Initialize Express app
app.use(cors());
app.use(express.json());

// Mount the main router
app.use("/api/v1", mainRouter);

// Export the app for testing
module.exports = app;

// Start the server only when running the app directly
if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Backend is running on port ${PORT}`);
  });
}
