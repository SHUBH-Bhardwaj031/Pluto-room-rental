import express from "express";

import multer from "multer";

import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary.js";

import {
  createRoom,
  getRooms,
  getRoomById,
  getMyRooms,
  updateRoom,
  deleteRoom,
  saveRoom,
  unsaveRoom,
  getSavedRooms,
} from "../controllers/roomController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   CLOUDINARY + MULTER CONFIG
========================================================= */

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "pluto-rooms",
    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

/* =========================================================
   PUBLIC ROUTES
========================================================= */

// Get all available rooms
router.get("/", getRooms);

/* =========================================================
   PROTECTED SPECIAL ROUTES
========================================================= */

// Get rooms posted by logged-in user
router.get(
  "/my-posts",
  authMiddleware,
  getMyRooms
);

// Get saved rooms
router.get(
  "/saved",
  authMiddleware,
  getSavedRooms
);

/* =========================================================
   SAVE / UNSAVE ROOM
========================================================= */

// Save room
router.post(
  "/:id/save",
  authMiddleware,
  saveRoom
);

// Remove saved room
router.delete(
  "/:id/save",
  authMiddleware,
  unsaveRoom
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