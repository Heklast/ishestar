const path = require("path");
const dotenvPath = path.join(__dirname, ".env");
require("dotenv").config({ path: dotenvPath });
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const fs = require("fs");
const getExcelData = require("./excel.js");
const { tripNameMap } = require('./tripNameMap');
const { fetchProductFromRezdy, fetchAvailFromRezdy, fetchAllProductsFromRezdy } = require("./rezdy.js");
const nodemailer=require('nodemailer');

const EMAIL_PASS= process.env.EMAIL_PASS;

const transporter =nodemailer.createTransport({
  service: 'gmail',
  auth:{
    user: 'heklast@gmail.com',
    pass: EMAIL_PASS
  }
});

function sendEmail(){
  const mail={
    from:'heklast@gmail.com',
    to: 'heklast@gmail.com',
    subject: 'Rezdy webhook!!!',
    text:'Rezdy webhook yayy!!!'
  };
  transporter.sendMail(mail, (error,info)=>{
    if (error){
      console.error("emial error:",error);
    } else{
      console.log("Email sent!! info:", info);
    }
  });
}
function sendEmailErr(){
  const mail={
    from:'heklast@gmail.com',
    to: 'heklast@gmail.com',
    subject: 'Nafn fannst ekki!!!',
    text:'Nafn fannst ekki í the db!!!'
  };
  transporter.sendMail(mail, (error,info)=>{
    if (error){
      console.error("emial error:",error);
    } else{
      console.log("Email sent!! info:", info);
    }
  });
}

function sendReport(subject, text){
  const mail={
    from:'heklast@gmail.com',
    to: 'heklast@gmail.com',
    subject,
    text
  };
  transporter.sendMail(mail, (error,info)=>{
    if (error){
      console.error("emial error:",error);
    } else{
      console.log("Email sent!! info:", info);
    }
  });
}

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

//initializeDatabase();


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

app.post('/rezdy-webhook', async (req, res) => { //þessi webhook er ekki live!!
  sendEmail();
  try {
    console.log("Webhook hit:", req.body);
  //sækjum það sem við fengum úr webhooknum
  const { productCode } = req.body;

   { //tengi bara produpd við webhookið þannig þetta þarf ekki að vera
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

app.post("/orderChange-rezdy-webhook", async (req, res) => {
  try {
    console.log("New order or delete webhook hit:", req.body);

    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "items must be an array" });
    }

    // If sendEmail is async, await it and keep it inside try so errors are caught.
    await sendEmail();

    for (const item of items) {
      const productCode = item?.productCode;
      console.log("Product code from order:", productCode);

      if (!productCode) {
        console.warn("Skipping item with missing productCode:", item);
        continue;
      }

      try {
        const availData = await fetchAvailFromRezdy(productCode);
        const productData = await fetchProductFromRezdy(productCode);
        await checkAvailandUpdateDB(availData, productData);
      } catch (err) {
        console.error(`Failed processing productCode=${productCode}`);
        // Log rich info for Axios/fetch-style errors
        console.error("err:", err);
        console.error("message:", err?.message);
        console.error("stack:", err?.stack);
        if (err?.response) {
          console.error("status:", err.response.status);
          console.error("data:", err.response.data);
          console.error("headers:", err.response.headers);
        }
        // Re-throw if you want webhook to fail when any item fails:
        throw err;
        // Or: continue;  // if you prefer partial success
      }
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error (top-level):", error);
    return res.status(500).send("Webhook handling failed");
  }
});


app.post('/new-product', async (req, res) => {
  sendEmail();
  try {
    console.log("New products:", req.body);

    const { items } = req.body;

    if (items && Array.isArray(items)) {
      for (const item of items) {
        const productCode = item.productCode;
        console.log("Product code from order:", productCode);

        const availData = await fetchAvailFromRezdy(productCode);
        const productData = await fetchProductFromRezdy(productCode);
        const avail = await checkAvailandUpdateDB(availData, productData);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(500).send("Webhook handling failed");
  }
});




async function checkAvailandUpdateDB(availData, productData) {
  const databaseTitles = tripNameMap[productData.name];

  if (!databaseTitles) {
    sendEmailErr();
    console.warn(`No matching DB title for Rezdy name: ${productData.name}`);
    return;
  }

  const titles = Array.isArray(databaseTitles) ? databaseTitles : [databaseTitles];

  for (const session of availData) {
    const sessionDate = session.startTimeLocal.split(' ')[0];
    const availableSeats = session.seatsAvailable <= 0 ? 0 : 1;
    const today = new Date().toISOString().split('T')[0];

      if (sessionDate < today) {
        console.log(`Skipping past session date: ${sessionDate}`);
        for (const title of titles) {
          await pool.query(
          `UPDATE trips SET availability = 0 WHERE title = $1 AND start_date = $2 RETURNING *`,
          [title, sessionDate]
          );
    console.log(`Past trip ${title} (${sessionDate}) marked as availability = 0`);
  }
  continue;
}

    for (const title of titles) {
      const result = await pool.query(
        `UPDATE trips SET availability = $1 WHERE title = $2 AND start_date = $3 RETURNING *`,
        [availableSeats, title, sessionDate]
      );

      if (result.rowCount > 0) {
        console.log(`Updated trip: ${title} on ${sessionDate} to availability = ${availableSeats}`);
      } else {
        console.warn(`No DB match for ${title} on ${sessionDate}`);
      }
    }
  }

  console.log("Database updated");
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







//árið sem sync sér um, breyta þegar næsta ár opnar á síðunni
const SYNC_YEAR = 2027;

//dagsferðir í rezdy sem eiga ekki heima á dagatalinu
const IGNORED_PRODUCT_CODES = [
  'P7PAZG', //Custom Countryside Ride
  'P4TLFJ', //Minnivellir
  'PVCHXR', //Volcano Ride Custom
  'PT9JSS', //Volcano Ride Special
  'PMCYWG', //Winter riding
];

//ber saman sessions í rezdy við trips í databaseinu (keyrt á 24 tíma fresti)
//nýjar sessions eru settar inn og sessions sem var eytt í rezdy eru teknar út
//allt er gert í einni transaction, dryRun=true gerir rollback í lokin svo engu er breytt
async function syncTripsWithRezdy({ dryRun = false } = {}) {
  //bara ferðir á SYNC_YEAR, og ekki ferðir sem eru búnar
  const today = new Date().toISOString().split('T')[0];
  const yearStart = `${SYNC_YEAR}-01-01`;
  const from = today > yearStart ? today : yearStart;
  const to = `${SYNC_YEAR}-12-31`;
  const added = [], deleted = [], coded = [], newProducts = [], errors = [];

  const products = (await fetchAllProductsFromRezdy())
    .filter(product => !IGNORED_PRODUCT_CODES.includes(product.productCode));
  if (products.length === 0) {
    throw new Error("Rezdy skilaði engum products, hætti við svo engu sé eytt");
  }
  const rezdyNames = {};
  for (const product of products) rezdyNames[product.productCode] = product.name;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    //ferðir sem voru settar inn handvirkt fá code út frá tripNameMap
    //bara ef nákvæmlega eitt rezdy product passar við titilinn
    const codesByTitle = {};
    for (const product of products) {
      const titles = tripNameMap[product.name];
      if (!titles) continue;
      for (const title of Array.isArray(titles) ? titles : [titles]) {
        (codesByTitle[title] ||= new Set()).add(product.productCode);
      }
    }
    for (const [title, codeSet] of Object.entries(codesByTitle)) {
      if (codeSet.size !== 1) continue;
      const [code] = codeSet;
      const result = await client.query(
        "UPDATE trips SET code = $1 WHERE code IS NULL AND title = $2", [code, title]);
      if (result.rowCount > 0) coded.push(`${title} -> ${code} (${result.rowCount})`);
    }

    //líka codes sem eru í databaseinu en ekki lengur í rezdy (product eytt)
    const dbCodes = await client.query("SELECT DISTINCT code FROM trips WHERE code IS NOT NULL");
    const codes = new Set([...Object.keys(rezdyNames), ...dbCodes.rows.map(r => r.code)]);

    for (const code of codes) {
      if (IGNORED_PRODUCT_CODES.includes(code)) continue;
      let sessions;
      try {
        sessions = await fetchAvailFromRezdy(code, from, to);
      } catch (err) {
        console.error(`Sync failed for ${code}:`, err.message);
        errors.push(`${code}: ${err.message}`);
        continue;
      }
      const sessionsByDate = new Map();
      for (const session of sessions) {
        const date = session.startTimeLocal.split(' ')[0];
        if (date >= from && date <= to) sessionsByDate.set(date, session);
      }

      //nýjasta ferðin með þessum code, notum link, riding_days og difficulty úr henni
      const template = await client.query(
        `SELECT title, link, riding_days, difficulty, (end_date - start_date) AS length
         FROM trips WHERE code = $1 ORDER BY start_date DESC LIMIT 1`,
        [code]
      );
      if (template.rowCount === 0) {
        //nýtt product, vitum ekki link/difficulty svo þarf að setja fyrstu ferðina inn handvirkt
        if (sessionsByDate.size > 0) {
          newProducts.push(`${rezdyNames[code] || '?'} (${code}): ${[...sessionsByDate.keys()].join(', ')}`);
        }
        continue;
      }
      const trip = template.rows[0];

      const existing = await client.query(
        `SELECT id, title, to_char(start_date, 'YYYY-MM-DD') AS start
         FROM trips WHERE code = $1 AND start_date BETWEEN $2 AND $3`,
        [code, from, to]
      );
      const existingDates = new Set(existing.rows.map(r => r.start));

      for (const [date, session] of sessionsByDate) {
        if (existingDates.has(date)) continue;
        const availability = session.seatsAvailable <= 0 ? 0 : 1;
        added.push(`${trip.title} ${date}`);
        await client.query(
          `INSERT INTO trips (title, start_date, end_date, link, riding_days, difficulty, availability, code)
           VALUES ($1, $2::date, $2::date + $3::int, $4, $5, $6, $7, $8)`,
          [trip.title, date, trip.length, trip.link, trip.riding_days, trip.difficulty, availability, code]
        );
      }

      for (const row of existing.rows) {
        if (sessionsByDate.has(row.start)) continue;
        deleted.push(`${row.title} ${row.start}`);
        await client.query("DELETE FROM trips WHERE id = $1", [row.id]);
      }
    }

    await client.query(dryRun ? 'ROLLBACK' : 'COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  //ferðir sem eru enn án code, sync sér þær ekki
  const uncoded = await pool.query(
    "SELECT DISTINCT title FROM trips WHERE code IS NULL AND start_date BETWEEN $1 AND $2 ORDER BY title", [from, to]);
  //í dry run er code ekki vistað, svo þær sem fengu code eru taldar hér líka
  const missingCode = uncoded.rows.map(r => r.title)
    .filter(title => dryRun ? !coded.some(c => c.startsWith(`${title} -> `)) : true);

  const report = [
    `Bætt við (${added.length}):`, ...added, '',
    `Eytt (${deleted.length}):`, ...deleted, '',
    `Fengu code (${coded.length}):`, ...coded, '',
    `Ný products í Rezdy, þarf að setja fyrstu ferð inn handvirkt (${newProducts.length}):`, ...newProducts, '',
    `Framtíðarferðir án code, þarf að bæta í tripNameMap (${missingCode.length}):`, ...missingCode, '',
    `Villur (${errors.length}):`, ...errors,
  ].join('\n');
  console.log(`${dryRun ? '[DRY RUN] ' : ''}Rezdy sync búið (${from} - ${to})\n${report}`);

  if (!dryRun && (added.length || deleted.length || newProducts.length || errors.length)) {
    sendReport('Rezdy sync', report);
  }
}

const SYNC_INTERVAL_MS = 24 * 60 * 60 * 1000;

async function runRezdySync() {
  try {
    await syncTripsWithRezdy();
  } catch (err) {
    console.error("Rezdy sync failed:", err);
    sendReport('Rezdy sync failed!!!', String(err?.stack || err));
  }
}


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


//node server.js --sync-dry-run: sýnir hvað sync myndi gera án þess að breyta databaseinu
if (process.argv.includes('--sync-dry-run')) {
  syncTripsWithRezdy({ dryRun: true })
    .catch(err => console.error("Dry run failed:", err))
    .finally(() => pool.end());
} else {
  //Starta server
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} or Render URL`);

    //bara á railway, svo að keyra serverinn locally breyti ekki databaseinu
    if (process.env.RAILWAY_ENVIRONMENT_NAME) {
      runRezdySync();
      setInterval(runRezdySync, SYNC_INTERVAL_MS);
    }
  });
}