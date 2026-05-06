import { config } from "../config.js";

function getAllowedClientUrls() {
  if (Array.isArray(config.clientUrls) && config.clientUrls.length > 0) {
    return config.clientUrls;
  }

  if (config.clientUrl) {
    return [config.clientUrl];
  }

  return ["http://localhost:5173", "http://127.0.0.1:5173"];
}

export function isOriginAllowed(origin) {
  const allowedClientUrls = getAllowedClientUrls();

  if (!origin) return true;
  if (allowedClientUrls.includes("*")) return true;
  if (allowedClientUrls.includes(origin)) return true;

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