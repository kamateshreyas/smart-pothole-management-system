import { Complaint } from "../models/Complaint.js";
import { httpError } from "../utils/httpError.js";
import { emitRealtime } from "../utils/realtime.js";

export async function listComplaints(_req, res) {
  const complaints = await Complaint.find().sort({ createdAt: -1 });
  res.json(complaints);
}

export async function createComplaint(req, res) {
  const { citizenName, category, message, location, priority } = req.body;
  if (!citizenName || !category || !message || !location || !priority) {
    throw httpError(400, "Please complete all complaint fields.");
  }

  const complaint = await Complaint.create({
    citizenName,
    category,
    message,
    location,
    priority,
    status: "Open"
  });

  emitRealtime(req, "complaint:created", complaint);
  res.status(201).json(complaint);
}

export async function updateComplaintStatus(req, res) {
  const { status } = req.body;
  const allowed = ["Open", "Reviewing", "Resolved"];
  if (!allowed.includes(status)) throw httpError(400, "Invalid complaint status.");

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) throw httpError(404, "Complaint not found.");

  complaint.status = status;
  await complaint.save();
  emitRealtime(req, "complaint:updated", complaint);
  res.json(complaint);
}
