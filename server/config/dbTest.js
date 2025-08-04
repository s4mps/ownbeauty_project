const mysql = require("mysql2");
const path = require("path");

// Load .env from the root directory
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

console.log("Environment variables check:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);

const { pool } = require("./database");

async function testConnection() {
  try {
    const [rows] = await pool.execute("SELECT 1 + 1 AS result");
    console.log("Database connection successful!");
    console.log("Test result:", rows[0].result);
  } catch (error) {
    console.error("Database connection failed:", error.message);
  } finally {
    process.exit();
  }
}

testConnection();