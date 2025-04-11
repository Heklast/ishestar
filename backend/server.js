const path = require("path");
const dotenvPath = path.join(__dirname, ".env");
require("dotenv").config({ path: dotenvPath });
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const fs = require("fs");
const getExcelData = require("./excel.js");
const { tripNameMap } = require('./tripNameMap');
const { fetchProductFromRezdy, fetchAvailFromRezdy } = require("./rezdy.js");

console.log("DATABASE_URL:", process.env.DATABASE_URL);


const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

//CORS (frontend getur requestað data frá backend)
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false },
});

//Seeda databaseið
async function initializeDatabase() {
  try {
    const initSQL = fs.readFileSync(path.join(__dirname, "init_db.sql"), "utf-8");
    await pool.query(initSQL);
    console.log("Database init búið");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

initializeDatabase();


app.use(express.static(path.join(__dirname, "../frontend/public")));

//static cal.html sem homepage, þarf ekki að gera go live lengur
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/cal.html"));
});

//route til að sækja trips í gagnagrunn
//hmm þarf ég að setja webhook í railway kannski??
app.get("/trips", async (req, res) => {
  try {
   // await updateAvailability(); //þessi lætur taka smá tíma, 
    // væri hraðara að sleppa og gera frekar auto með /upd...
    const result = await pool.query(
      "SELECT id, title, start_date, end_date, link, riding_days, difficulty, availability FROM trips"
    ); //er líka með description núna í databse en hættum við að nota
    res.json(result.rows);
    //console.log(result);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Database query failed", details: error.message });
  }
});

app.post('/rezdy-webhook', async (req, res) => {
  try {
    console.log("Webhook hit:", req.body);
  //sækjum það sem við fengum úr webhooknum
  const { eventType, productCode } = req.body;

  if (eventType === 'ProductUpdated') {
    //sækjum allt data út frá productCode til að nota til að, productdata={sessions úr availability}
    const availData = await fetchAvailFromRezdy(productCode); //sessions
    const productData=await fetchProductFromRezdy(productCode); //products síðan frá rezdy, nafn

    const avail= await checkAvailandUpdateDB(availData,productData);

    //sama og updateavail, þe nota pool til að updatea databaseið
    //await updateDatabase(avail);
  }
  res.sendStatus(200);
} catch (error) {
  console.error("Webhook error:", error.message);
  res.status(500).send("Webhook handling failed");
}});

async function checkAvailandUpdateDB(availData,productData){
  const databaseTitle = tripNameMap[productData.name];

  if (!databaseTitle) {
    console.warn(`No matching DB title for Rezdy name: ${productData.name}`);
    return;
  }

  for (const session of availData) {
    const sessionDate = session.startTimeLocal.split(' ')[0];

    if (session.seatsAvailable <= 0) {
      const start_date=sessionDate;
      const availableSeats=0;
       const result = await pool.query(
      `UPDATE trips SET availability = $1 WHERE title=$2 AND start_date = $3 RETURNING *`,
      [availableSeats, databaseTitle, start_date]);

      if (result.rowCount > 0) {
        console.log(`Updated trip: ${databaseTitle} on ${sessionDate} to availability = 0`);
      } else {
        console.warn(`No DB match for ${databaseTitle} on ${sessionDate}`);
      }

    }

} return console.log("Database updated")
}

//async function updateDatabase(productData){
  //const availableSeats=productData.seatsAvailable;
  //const title=productData.title;
  //const start_date=productData.startDate;

  //const result = await pool.query(
    //`UPDATE trips SET availability = $1 WHERE TRIM(title) ILIKE TRIM($2) AND start_date = $3 RETURNING *`,
    //[availableSeats, title, start_date]
  //);
//}



async function updateAvailability() {
  try {
    console.log("Sækja frá Google Sheets...");
    const records = await getExcelData();

    if (!records || records.length === 0) {
      console.log("Ekkert data frá sheets");
      return;
    }

    for (const record of records) {
      let { Tour, "Available seats": availability, "Start date": start_date } = record;

      if (!Tour || !start_date) {
        console.log(`Skipping invalid record:`, record);
        continue;
      }

      Tour = Tour.trim();
      start_date = new Date(start_date).toISOString().split("T")[0]; // í YYYY-MM-DD

      const parsedAvailability = parseInt(availability);
      if (isNaN(parsedAvailability)) {
        console.warn(`Invalid availability for ${Tour}:`, availability);
        continue;
      }

      const result = await pool.query(
        `UPDATE trips SET availability = $1 WHERE TRIM(title) ILIKE TRIM($2) AND start_date = $3 RETURNING *`,
        [parsedAvailability, Tour, start_date]
      );

      if (result.rowCount === 0) {
        console.warn(`No matching trip found for ${Tour} (${start_date}). Check database.`);
      } else {
        console.log(`Updated ${result.rowCount} row(s) for ${Tour} (${start_date})`);
      }
    }

    console.log("Gagnagrunnur uppfærður.");
  } catch (error) {
    console.error("Error updating availability:", error);
  }
}

//nota þetta ekkert eins og er en ætlaði að gera auto update mögulega með þessu, 
// kannski seinna
app.get("/update-availability", async (req, res) => {
  await updateAvailability();
  res.send("Availability updated from Google Sheets.");
});


//Starta server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} or Render URL`);
});