import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    reporterName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: "" },
    annotatedImageUrl: { type: String, default: "" },
    severity: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    priorityScore: { type: Number, default: 50 },
    status: {
      type: String,
      enum: ["Pending", "Assigned", "In Progress", "Resolved"],
      default: "Pending"
    },
    ai: {
      model: { type: String, default: "YOLOv8" },
      detected: { type: Boolean, default: false },
      confidence: { type: Number, default: 0 },
      potholeCount: { type: Number, default: 0 },
      source: { type: String, default: "fallback" }
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reportSchema.index({ priorityScore: -1, createdAt: -1 });
reportSchema.index({ status: 1 });

export const Report = mongoose.model("Report", reportSchema);
