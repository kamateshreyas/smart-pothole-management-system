import { Router } from "express";
import { createComplaint, listComplaints, updateComplaintStatus } from "../controllers/complaintController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(listComplaints));
router.post("/", asyncHandler(createComplaint));
router.patch("/:id/status", asyncHandler(updateComplaintStatus));

export default router;
