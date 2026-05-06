import { Complaint } from "../models/Complaint.js";
import { Report } from "../models/Report.js";
import { TrafficAlert } from "../models/TrafficAlert.js";

export async function seedDatabase() {
  const existingReports = await Report.countDocuments();
  if (existingReports > 0) return;

  await Report.create([
    {
      title: "Deep pothole near Tech Park signal",
      reporterName: "Aarav Mehta",
      phone: "9876543210",
      description: "Large deep pothole causing two-wheelers to slow down suddenly near signal traffic.",
      latitude: 12.9716,
      longitude: 77.5946,
      address: "MG Road, Bengaluru",
      severity: "High",
      priorityScore: 91,
      status: "Pending",
      ai: {
        model: "YOLOv8",
        detected: true,
        confidence: 0.86,
        potholeCount: 2,
        source: "seed"
      }
    },
    {
      title: "Broken patch after rain",
      reporterName: "Nisha Rao",
      phone: "9988776655",
      description: "Road surface damaged near the bus stop after heavy rain.",
      latitude: 12.9352,
      longitude: 77.6245,
      address: "Koramangala 5th Block",
      severity: "Medium",
      priorityScore: 63,
      status: "Assigned",
      ai: {
        model: "YOLOv8",
        detected: true,
        confidence: 0.58,
        potholeCount: 1,
        source: "seed"
      }
    }
  ]);

  await Complaint.create({
    citizenName: "Priya Sharma",
    category: "Road Damage",
    message: "Please repair the recurring pothole outside the metro station.",
    location: "Indiranagar Metro",
    priority: "High",
    status: "Open"
  });

  await TrafficAlert.create([
    {
      area: "Silk Board Junction",
      type: "Heavy Congestion",
      message: "Average delay is 18 minutes. Suggested diversion via HSR Layout.",
      severity: "High"
    },
    {
      area: "Outer Ring Road",
      type: "Road Work",
      message: "One lane blocked for maintenance until evening.",
      severity: "Medium"
    }
  ]);
}
