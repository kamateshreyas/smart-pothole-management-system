// backend/src/utils/corsOptions.js
import { config } from "../config.js";

export function isOriginAllowed(origin) {
  if (!origin) return true;
  if (config.clientUrls.includes("*")) return true;
  if (config.clientUrls.includes(origin)) return true;

  try {
    const { hostname } = new URL(origin);
    return hostname === "vercel.app" || hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

export function corsOriginCallback(origin, callback) {
  if (isOriginAllowed(origin)) {
    callback(null, true);
    return;
  }

  callback(new Error(`CORS blocked origin: ${origin}`));
}