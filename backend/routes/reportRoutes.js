import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
  createReport,
  getReports,
  updateReportStatus,
  takeDownRoom,
} from "../controllers/reportController.js";

const router = express.Router();

/* =========================================================
   USER
========================================================= */

router.post(
  "/",
  authMiddleware,
  createReport
);

/* =========================================================
   ADMIN
========================================================= */

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getReports
);

router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateReportStatus
);

router.patch(
  "/room/:roomId/takedown",
  authMiddleware,
  adminMiddleware,
  takeDownRoom
);

export default router;