const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS (allows frontend to request data from backend)
app.use(cors());

// PostgreSQL connection setup (Uses Render's `DATABASE_URL`)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Uses Render's database
  ssl: {
    rejectUnauthorized: false, // Required for connecting securely to Render
  },
});

// Function to initialize the database (Create table & insert data)
async function initializeDatabase() {
  try {
    console.log("🔄 Initializing database...");
    const initSQL = fs.readFileSync(path.join(__dirname, "init_db.sql"), "utf-8");
    await pool.query(initSQL);
    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  }
}

// Run database initialization when server starts
initializeDatabase();

app.use(express.static(path.join(__dirname, "../public")));

// Serve cal.html as the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/cal.html"));
});

// Route to get trips from the database
app.get("/trips", async (req, res) => {
  try {
    console.log("📡 Fetching trips...");
    const result = await pool.query(
      "SELECT id, title, start_date, end_date, link, riding_days, difficulty FROM trips"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Database query error:", error);
    res.status(500).json({ error: "Database query failed", details: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT} or Render URL`);
});