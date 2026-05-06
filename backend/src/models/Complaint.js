import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    citizenName: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    status: { type: String, enum: ["Open", "Reviewing", "Resolved"], default: "Open" }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export const Complaint = mongoose.model("Complaint", complaintSchema);
