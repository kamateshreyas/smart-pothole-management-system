import { Router } from "express";
import { createReport, listReports, updateReportStatus } from "../controllers/reportController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(listReports));
router.post("/", upload.single("image"), asyncHandler(createReport));
router.patch("/:id/status", asyncHandler(updateReportStatus));

export default router;
