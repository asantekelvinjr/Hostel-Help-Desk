const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const seedAdmin = require("./config/seedAdmin");
const seedCategories = require("./config/seedCategories");

dotenv.config();

const app = express();

// Connect to MongoDB then seed
connectDB().then(async () => {
  await seedAdmin();
  await seedCategories();
});

// Middleware
// CORS setup
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173").split(',');

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/admin/categories", require("./routes/categoryRoutes"));

// Health check
app.get("/", (req, res) => res.json({ message: "Hostel Help Desk API running" }));

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
