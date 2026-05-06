import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 5000),

  clientUrl:
    process.env.CLIENT_URL || "http://localhost:5173",

  mongoUri:
    process.env.MONGO_URI ||
    "mongodb+srv://kamateshreyas_db_user:Admin123@cluster0.gqfnjxo.mongodb.net/potholeDB?retryWrites=true&w=majority&appName=Cluster0",

  aiServiceUrl:
    process.env.AI_SERVICE_URL || "https://smart-pothole-management-system-1.onrender.com",

  uploadDir: "uploads"
};