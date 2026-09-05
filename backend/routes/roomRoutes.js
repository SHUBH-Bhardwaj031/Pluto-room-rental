import express from "express";
import multer from "multer";

import {
  createRoom,
  getRooms,
  getRoomById,
  getMyRooms,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   MULTER CONFIG
========================================================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
});

/* =========================================================
   PUBLIC ROUTES
========================================================= */

// Get all available rooms
router.get("/", getRooms);

/* =========================================================
   PROTECTED SPECIAL ROUTES
   IMPORTANT:
   /my-posts MUST COME BEFORE /:id
========================================================= */

// Get rooms posted by logged-in user
router.get(
  "/my-posts",
  authMiddleware,
  getMyRooms
);

/* =========================================================
   CREATE ROOM
========================================================= */

router.post(
  "/",
  authMiddleware,
  upload.array("images", 5),
  createRoom
);

/* =========================================================
   SINGLE ROOM
   Keep this AFTER /my-posts
========================================================= */

router.get(
  "/:id",
  getRoomById
);

/* =========================================================
   UPDATE ROOM
========================================================= */

router.put(
  "/:id",
  authMiddleware,
  upload.array("images", 5),
  updateRoom
);

/* =========================================================
   DELETE ROOM
========================================================= */

router.delete(
  "/:id",
  authMiddleware,
  deleteRoom
);

export default router;