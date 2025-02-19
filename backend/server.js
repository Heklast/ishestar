const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS (allows frontend to request data from backend)
app.use(cors());

// Connect to PostgreSQL
//const pool = new Pool({
  //user: "postgres",
  //host: "localhost",
  //database: "postgres",
  //password: "Hekla2890",
  //port: 5432, 
//});
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://postgres:Hekla2890@localhost:5432/postgres",
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false, // SSL only for Render
});

// Route to get trips from the database
app.get("/trips", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, title, start_date, end_date, link, riding_days, difficulty FROM trips");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database query failed" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});