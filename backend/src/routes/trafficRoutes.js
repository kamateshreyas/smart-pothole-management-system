import { Router } from "express";
import { createTrafficAlert, listTrafficAlerts } from "../controllers/trafficController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(listTrafficAlerts));
router.post("/", asyncHandler(createTrafficAlert));

export default router;
