import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const ASSET_URL = API_URL.replace("/api", "");

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000
});

export function getErrorMessage(error) {
  return error?.response?.data?.message || error.message || "Something went wrong";
}
