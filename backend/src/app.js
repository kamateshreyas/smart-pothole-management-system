import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
import { config } from "./config.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import trafficRoutes from "./routes/trafficRoutes.js";

export const app = express();

app.use(cors({ origin: config.clientUrl }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.resolve(config.uploadDir)));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Smart road API is healthy" });
});

app.use("/api/reports", reportRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/traffic-alerts", trafficRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use(notFound);
app.use(errorHandler);
