const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

async function setupDatabase() {
  console.log("🚀 Setting up OwnBeauty database...");

  let connection;

  try {
    // Create connection without specifying database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      port: process.env.DB_PORT || 3306,
      multipleStatements: true,
    });

    console.log("✅ Connected to MySQL server");

    // Read and execute schema file
    const schemaPath = path.join(__dirname, "../config/schema.sql");
    const schemaSQL = fs.readFileSync(schemaPath, "utf8");

    console.log("📋 Creating database and tables...");
    await connection.query(schemaSQL);
    console.log("✅ Database schema created successfully");

    // Read and execute seeds file
    const seedsPath = path.join(__dirname, "../config/seeds.sql");
    const seedsSQL = fs.readFileSync(seedsPath, "utf8");

    console.log("🌱 Inserting sample data...");
    await connection.query(seedsSQL);
    console.log("✅ Sample data inserted successfully");

    console.log("🎉 Database setup completed!");
    console.log("\nYou can now:");
    console.log("1. Start the server: npm run dev");
    console.log("2. Login with: demo@example.com / password123");
  } catch (error) {
    console.error("❌ Database setup failed:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };

