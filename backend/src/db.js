import mongoose from "mongoose";
import { config } from "./config.js";

export async function connectDatabase() {
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(config.mongoUri);
    const databaseName = mongoose.connection.name;
    const host = mongoose.connection.host;
    console.log(`MongoDB connected: ${databaseName} @ ${host}`);
  } catch (error) {
    console.error("MongoDB connection failed.");
    console.error("Check MONGO_URI in backend/.env.");
    console.error("For MongoDB Atlas, make sure:");
    console.error("1. Database user and password are correct.");
    console.error("2. Network Access allows your current IP or 0.0.0.0/0 for demo.");
    console.error("3. The connection string includes the database name.");
    throw error;
  }
}
