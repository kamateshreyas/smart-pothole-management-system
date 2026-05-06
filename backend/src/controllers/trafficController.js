import { TrafficAlert } from "../models/TrafficAlert.js";
import { httpError } from "../utils/httpError.js";
import { emitRealtime } from "../utils/realtime.js";

export async function listTrafficAlerts(_req, res) {
  const alerts = await TrafficAlert.find().sort({ createdAt: -1 });
  res.json(alerts);
}

export async function createTrafficAlert(req, res) {
  const { area, type, message, severity } = req.body;
  if (!area || !type || !message || !severity) {
    throw httpError(400, "Please complete all traffic alert fields.");
  }

  const alert = await TrafficAlert.create({
    area,
    type,
    message,
    severity
  });

  emitRealtime(req, "traffic:created", alert);
  res.status(201).json(alert);
}
