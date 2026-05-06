import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongoUri: process.env.MONGO_URI || "mongodb+srv://kamateshreyas_db_user:<Admin123>@cluster0.gqfnjxo.mongodb.net/?appName=Cluster0",
  aiServiceUrl: process.env.AI_SERVICE_URL || "http://localhost:8000",
  uploadDir: "uploads"
};
