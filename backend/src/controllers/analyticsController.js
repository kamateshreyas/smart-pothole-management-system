import { Complaint } from "../models/Complaint.js";
import { Report } from "../models/Report.js";
import { TrafficAlert } from "../models/TrafficAlert.js";

export async function getAnalytics(_req, res) {
  const [reports, openComplaints, liveAlerts] = await Promise.all([
    Report.find(),
    Complaint.countDocuments({ status: { $ne: "Resolved" } }),
    TrafficAlert.countDocuments()
  ]);

  const pendingReports = reports.filter((item) => item.status !== "Resolved").length;
  const highPriority = reports.filter((item) => item.severity === "High").length;
  const avgPriority = reports.length
    ? Math.round(reports.reduce((sum, item) => sum + item.priorityScore, 0) / reports.length)
    : 0;

  res.json({
    totalReports: reports.length,
    pendingReports,
    highPriority,
    avgPriority,
    openComplaints,
    liveAlerts
  });
}
