"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/reports.ts
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const report_controller_1 = require("../controllers/report.controller");
const errors_1 = require("../middleware/errors");
const router = express_1.default.Router();
router.post("/detect-type", auth_1.isAuthenticated, report_controller_1.uploadMiddleware, (0, errors_1.handleErrors)(report_controller_1.detectAndConfirmReportType));
router.post("/analyze", auth_1.isAuthenticated, report_controller_1.uploadMiddleware, (0, errors_1.handleErrors)(report_controller_1.analyzeReport));
router.get("/user-reports", auth_1.isAuthenticated, (0, errors_1.handleErrors)(report_controller_1.getUserReports));
router.get("/report/:id", auth_1.isAuthenticated, (0, errors_1.handleErrors)(report_controller_1.getReportByID));
exports.default = router;
