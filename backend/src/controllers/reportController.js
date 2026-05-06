import { Report } from "../models/Report.js";
import { detectPotholeWithAI } from "../services/aiClient.js";
import { calculatePriority } from "../services/priorityService.js";
import { httpError } from "../utils/httpError.js";
import { emitRealtime } from "../utils/realtime.js";

export async function listReports(_req, res) {
  const reports = await Report.find().sort({ priorityScore: -1, createdAt: -1 });
  res.json(reports);
}

export async function createReport(req, res) {
  const { title, reporterName, phone, description, latitude, longitude, address } = req.body;

  if (!title || !reporterName || !phone || !description || !latitude || !longitude || !address) {
    throw httpError(400, "Please fill all required report fields.");
  }

  const lat = Number(latitude);
  const lng = Number(longitude);
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    throw httpError(400, "Latitude and longitude must be valid numbers.");
  }

  const aiResult = await detectPotholeWithAI(req.file?.path);
  const priority = calculatePriority({ aiResult, description, address });

  const report = await Report.create({
    title,
    reporterName,
    phone,
    description,
    latitude: lat,
    longitude: lng,
    address,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
    annotatedImageUrl: aiResult.annotatedImageUrl,
    severity: priority.severity,
    priorityScore: priority.priorityScore,
    status: "Pending",
    ai: {
      model: aiResult.model,
      detected: aiResult.detected,
      confidence: aiResult.confidence,
      potholeCount: aiResult.potholeCount,
      source: aiResult.source
    }
  });

  emitRealtime(req, "report:created", report);
  res.status(201).json(report);
}

export async function updateReportStatus(req, res) {
  const { status } = req.body;
  const allowed = ["Pending", "Assigned", "In Progress", "Resolved"];
  if (!allowed.includes(status)) throw httpError(400, "Invalid status.");

  const report = await Report.findById(req.params.id);
  if (!report) throw httpError(404, "Report not found.");

  report.status = status;
  await report.save();
  emitRealtime(req, "report:updated", report);
  res.json(report);
}
