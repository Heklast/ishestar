const path = require("path");
const dotenvPath = path.join(__dirname, ".env");
require("dotenv").config({ path: dotenvPath });

console.log("🧪 Loading .env from:", dotenvPath);
console.log("✅ DATABASE_URL loaded:", process.env.DATABASE_URL);

const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const fs = require("fs");
const getExcelData = require("../frontend/public/scripts/excel.js");

console.log("✅ DATABASE_URL loaded:", process.env.DATABASE_URL);


const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS (allows frontend to request data from backend)
app.use(cors());

// PostgreSQL connection setup (Uses Render's `DATABASE_URL`)
/*const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Uses Render's database
  ssl: {
    rejectUnauthorized: false, // Required for connecting securely to Render
  },
});*/
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false },
});

// Function to initialize the database (Create table & insert data)
async function initializeDatabase() {
  try {
    console.log("🔄 Initializing database...");
    const initSQL = fs.readFileSync(path.join(__dirname, "init_db.sql"), "utf-8");
    await pool.query(initSQL);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

initializeDatabase();


app.use(express.static(path.join(__dirname, "../frontend/public")));

// Serve cal.html as the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/cal.html"));
});

// Route to get trips from the database
app.get("/trips", async (req, res) => {
  try {
    await updateAvailability();
    console.log("Fetching trips...");
    const result = await pool.query(
      "SELECT id, title, start_date, end_date, link, riding_days, difficulty, availability FROM trips"
    );
    res.json(result.rows);
    console.log(result);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Database query failed", details: error.message });
  }
});


async function updateAvailability() {
  try {
    console.log("Fetching data from Google Sheets...");
    const records = await getExcelData();

    if (!records || records.length === 0) {
      console.log("No data to update.");
      return;
    }

    for (const record of records) {
      let { Tour, "Available seats": availability, "Start date": start_date } = record;

      if (!Tour || !availability || !start_date) {
        console.log(`Skipping invalid record:`, record);
        continue;
      }

      // Trim spaces and format title & date
      Tour = Tour.trim();
      start_date = new Date(start_date).toISOString().split("T")[0]; // Convert date to YYYY-MM-DD

      console.log(`Updating: ${Tour} (${start_date}) → Seats: ${availability}`);

      const result = await pool.query(
        `UPDATE trips SET availability = $1 WHERE TRIM(title) ILIKE TRIM($2) AND start_date = $3 RETURNING *`,
        [parseInt(availability), Tour, start_date]
      );

      if (result.rowCount === 0) {
        console.warn(`No matching trip found for ${Tour} (${start_date}). Check database.`);
      } else {
        console.log(`Updated ${result.rowCount} row(s) for ${Tour} (${start_date})`);
      }
    }

    console.log("Database availability updated successfully.");
  } catch (error) {
    console.error("Error updating availability:", error);
  }
}

app.get("/update-availability", async (req, res) => {
  await updateAvailability();
  res.send("Availability updated from Google Sheets.");
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} or Render URL`);
});