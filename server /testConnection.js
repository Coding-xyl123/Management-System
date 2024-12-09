const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.DB_URL; // Make sure this is set correctly in your environment variables

const client = new MongoClient(uri);

async function testConnection() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB.");
  } catch (error) {
    console.error("Connection failed:", error.message);
  } finally {
    await client.close();
  }
}

testConnection();
