import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { config } from "../config.js";

export async function detectPotholeWithAI(filePath) {
  if (!filePath) return fallbackAIResult("No image uploaded");

  try {
    const form = new FormData();
    form.append("image", fs.createReadStream(filePath));

    const { data } = await axios.post(`${config.aiServiceUrl}/detect`, form, {
      headers: form.getHeaders(),
      timeout: 25000
    });

    return {
      detected: Boolean(data.detected),
      confidence: Number(data.confidence || 0),
      potholeCount: Number(data.potholeCount || 0),
      annotatedImageUrl: data.annotatedImageUrl ? `${config.aiServiceUrl}${data.annotatedImageUrl}` : "",
      source: data.source || "yolov8",
      model: data.model || "YOLOv8"
    };
  } catch (error) {
    return fallbackAIResult(error.message);
  }
}

function fallbackAIResult(reason) {
  return {
    detected: false,
    confidence: 0,
    potholeCount: 0,
    annotatedImageUrl: "",
    source: `fallback: ${reason}`,
    model: "YOLOv8"
  };
}
