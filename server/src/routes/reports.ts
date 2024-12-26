// src/routes/reports.ts
import express from "express";
import { isAuthenticated } from "../middleware/auth";
import {
  analyzeReport,
  detectAndConfirmReportType,
  getReportByID,
  getUserReports,
  uploadMiddleware,
} from "../controllers/report.controller";
import { handleErrors } from "../middleware/errors";

const router = express.Router();

router.post(
  "/detect-type",
  isAuthenticated,
  uploadMiddleware,
  handleErrors(detectAndConfirmReportType)
);

router.post(
  "/analyze",
  isAuthenticated,
  uploadMiddleware,
  handleErrors(analyzeReport)
);

router.get("/user-reports", isAuthenticated, handleErrors(getUserReports));
router.get("/report/:id", isAuthenticated, handleErrors(getReportByID));

export default router;
