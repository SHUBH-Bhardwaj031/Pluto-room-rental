import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createReport } from "../controllers/reportController.js";

const router = express.Router();

router.post("/", authMiddleware, createReport);

export default router;