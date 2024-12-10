const express = require("express");
const mainRouter = require("./routes/index.js");
const cors = require("cors");

const app = express(); // Initialize Express app

// Enable CORS with specific options
app.use(cors({
  origin: '*', // You can replace '*' with the specific frontend URL (e.g., 'http://192.168.49.2:30432')
  methods: 'GET,POST,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use(express.json());

// Mount the main router
app.use("/api/v1", mainRouter);

// Handle OPTIONS preflight requests explicitly
app.options('*', cors()); // Allows CORS preflight requests

// Export the app for testing
module.exports = app;

// Start the server only when running the app directly
if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Backend is running on port ${PORT}`);
  });
}
