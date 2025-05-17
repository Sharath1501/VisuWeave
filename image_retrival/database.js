const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const pool = new Pool({
  user: '********',
  host: '********',
  database: '********',
  password: '********',
  port: 5432,
});

async function getImageFromDatabase(imageName) {
  try {
    imageName = imageName.toLowerCase();
    console.log(`🔍 Searching database for: ${imageName}`);

    const query = 'SELECT image FROM "Find_image" WHERE LOWER(name) = $1';
    const result = await pool.query(query, [imageName]);

    if (result.rows.length === 0) {
      console.log("❌ Image not found in database.");
      return null;
    }

    const imagePath = result.rows[0].image;
    console.log(`📂 Found image at: ${imagePath}`);

    if (!fs.existsSync(imagePath)) {
      console.log("❌ File does not exist on disk.");
      return null;
    }

    return imagePath;
  } catch (error) {
    console.error('❌ Database error:', error);
    return null;
  }
}

module.exports = getImageFromDatabase;
