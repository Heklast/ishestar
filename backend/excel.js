const fetch = require("node-fetch");
const { parse } = require("csv-parse/sync");

async function getExcelData() {
  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vS4gRAhjXFva3yWOSNs_JoDzBn609NZzMwijPMOYwgAOqTSpz1gPDCP_hbVB4kL_WjDJewx_qnrvSxH/pub?gid=0&single=true&output=csv";

  try {
    const response = await fetch(sheetUrl);
    const csv = await response.text();

    const records = parse(csv, {
      columns: true,
      skip_empty_lines: true,
      trim: true, // trims leading/trailing spaces
    });

    // Convert availability to integer for consistency
    records.forEach(record => {
      if (record["Available seats"]) {
        record["Available seats"] = parseInt(record["Available seats"], 10) || 0;
      }
    });

    return records;
  } catch (error) {
    console.error("❌ Error fetching Google Sheets data:", error);
    return [];
  }
}

module.exports = getExcelData;