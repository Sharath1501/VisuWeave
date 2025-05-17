const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const port = 3000;

// Enable CORS for frontend requests
app.use(cors());
app.use(express.static("public")); // Serve static files (like index.html)

// PostgreSQL Database Setup
const pool = new Pool({
  user: "********",
  host: "********",
  database: "********",
  password: "********",
  port: 5432,
});

// Serve images from directories
app.use(express.static("downloaded_images"));
app.use(express.static("generated_images"));
app.use(express.static("manim_images"));

/**
 * Retrieves an image based on priority:
 * 1️⃣ Database → 2️⃣ Web Scraping → 3️⃣ AI Generation → 4️⃣ Manim
 */
app.get("/image/:name", async (req, res) => {
  const imageName = req.params.name.toLowerCase().trim(); // Normalize input
  console.log(`🔍 Searching for: ${imageName}`);

  try {
    // Step 1️⃣: Try to fetch from Database
    const dbImage = await getImageFromDatabase(imageName);
    if (dbImage) return res.sendFile(dbImage);

    // Step 2️⃣: Try Web Scraping (Python Script)
    try {
      const timeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Timeout")), 5000)
      );
  
      const webScrapedImage = await Promise.race([
          runPythonScript("webscraper.py", imageName),
          timeout
      ]);
  
      if (webScrapedImage) {
          return res.sendFile(webScrapedImage);
      }
  } catch (error) {
      console.warn("Image scrape failed or timed out:", error.message);
  }

    // Step 3️⃣: Try AI Image Generation (Stable Diffusion)
    const aiGeneratedImage = await runPythonScript("ai_generator.py", imageName);
    if (aiGeneratedImage) return res.sendFile(aiGeneratedImage);

    // Step 4️⃣: Try Manim (Math Shapes)
    // const manimImage = await runPythonScript("manim_generator.py", imageName);
    // if (manimImage) return res.sendFile(manimImage);

    // If nothing works, return 404
    console.log("❌ No image found.");
    res.status(404).json({ error: "Image not found" });
  } catch (error) {
    console.error("❌ Error retrieving image:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Database Image Retrieval (Priority 1)
async function getImageFromDatabase(imageName) {
  try {
    const query = 'SELECT image FROM "Find_image" WHERE LOWER(name) = $1';
    const result = await pool.query(query, [imageName]);

    if (result.rows.length > 0) {
      const imagePath = result.rows[0].image;
      if (fs.existsSync(imagePath)) {
        console.log(`✅ Found in Database: ${imagePath}`);
        return path.resolve(imagePath);
      }
    }
  } catch (error) {
    console.error("❌ Database error:", error);
  }
  return null;
}

// Run Python Scripts for Web Scraping, AI Generation, and Manim
function runPythonScript(scriptName, imageName) {
  return new Promise((resolve) => {
    const scriptPath = path.join(__dirname, scriptName);
    const command = `python "${scriptPath}" "${imageName}"`;

    exec(command, (error, stdout) => {
      if (error) {
        console.error(`❌ Error running ${scriptName}:`, error);
        return resolve(null);
      }

      const imagePath = stdout.trim();
      if (imagePath !== "None" && fs.existsSync(imagePath)) {
        console.log(`✅ Retrieved via ${scriptName}: ${imagePath}`);
        return resolve(path.resolve(imagePath));
      }

      resolve(null);
    });
  });
}

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}/`);
});
