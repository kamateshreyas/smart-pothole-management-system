import mongoose from "mongoose";

const trafficAlertSchema = new mongoose.Schema(
  {
    area: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    severity: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const TrafficAlert = mongoose.model("TrafficAlert", trafficAlertSchema);
