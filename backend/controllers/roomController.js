import Room from "../models/Room.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

/* =========================================================
   HELPER
========================================================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteImageFile = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    const filePath = path.join(
      __dirname,
      "..",
      imageUrl.replace(/^\/+/, "")
    );

    await fs.unlink(filePath);
  } catch (error) {
    // File already missing - ignore
  }
};

/* =========================================================
   CREATE ROOM
========================================================= */

export const createRoom = async (req, res) => {
  try {
    const {
      title,
      description,
      rent,
      roomType,
      amenities,
      location,
      contact,
    } = req.body;

    if (
      !title ||
      !description ||
      rent === undefined ||
      !roomType ||
      !location ||
      !contact
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required room details",
      });
    }

    const images = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const room = await Room.create({
      title,
      description,
      images,
      rent: Number(rent),
      roomType,

      amenities: amenities
        ? JSON.parse(amenities)
        : [],

      location: JSON.parse(location),

      contact: JSON.parse(contact),

      postedBy: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Room posted successfully",
      room,
    });
  } catch (error) {
    console.error("Create room error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================================
   GET ALL AVAILABLE ROOMS
========================================================= */

export const getRooms = async (req, res) => {
  try {
    const {
      city,
      locality,
      roomType,
      minRent,
      maxRent,
    } = req.query;

    const filter = {
      status: "available",
    };

    if (city) {
      filter["location.city"] = {
        $regex: city,
        $options: "i",
      };
    }

    if (locality) {
      filter["location.locality"] = {
        $regex: locality,
        $options: "i",
      };
    }

    if (roomType) {
      filter.roomType = roomType;
    }

    if (minRent || maxRent) {
      filter.rent = {};

      if (minRent) {
        filter.rent.$gte = Number(minRent);
      }

      if (maxRent) {
        filter.rent.$lte = Number(maxRent);
      }
    }

    const rooms = await Room.find(filter)
      .populate("postedBy", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("Get rooms error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================================
   GET SINGLE ROOM
========================================================= */

export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate("postedBy", "name email phone");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    console.error("Get room by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================================
   GET MY POSTS
========================================================= */

export const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      postedBy: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("Get my rooms error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================================
   UPDATE MY ROOM
========================================================= */

export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    /* -----------------------------------------
       OWNERSHIP CHECK
    ----------------------------------------- */

    if (room.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to edit this room",
      });
    }

    const {
      title,
      description,
      rent,
      roomType,
      amenities,
      location,
      contact,
      status,
    } = req.body;

    /* -----------------------------------------
       UPDATE BASIC DETAILS
    ----------------------------------------- */

    if (title !== undefined) {
      room.title = title;
    }

    if (description !== undefined) {
      room.description = description;
    }

    if (rent !== undefined) {
      room.rent = Number(rent);
    }

    if (roomType !== undefined) {
      room.roomType = roomType;
    }

    if (status !== undefined) {
      room.status = status;
    }

    /* -----------------------------------------
       UPDATE AMENITIES
    ----------------------------------------- */

    if (amenities !== undefined) {
      room.amenities =
        typeof amenities === "string"
          ? JSON.parse(amenities)
          : amenities;
    }

    /* -----------------------------------------
       UPDATE LOCATION
    ----------------------------------------- */

    if (location !== undefined) {
      room.location =
        typeof location === "string"
          ? JSON.parse(location)
          : location;
    }

    /* -----------------------------------------
       UPDATE CONTACT
    ----------------------------------------- */

    if (contact !== undefined) {
      room.contact =
        typeof contact === "string"
          ? JSON.parse(contact)
          : contact;
    }

    /* -----------------------------------------
       UPDATE IMAGES
       If new images are uploaded,
       old images will be removed.
    ----------------------------------------- */

    if (req.files && req.files.length > 0) {
      const oldImages = room.images || [];

      for (const image of oldImages) {
        await deleteImageFile(image);
      }

      room.images = req.files.map(
        (file) => `/uploads/${file.filename}`
      );
    }

    const updatedRoom = await room.save();

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      room: updatedRoom,
    });
  } catch (error) {
    console.error("Update room error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================================
   DELETE MY ROOM
========================================================= */

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    /* -----------------------------------------
       OWNERSHIP CHECK
    ----------------------------------------- */

    if (room.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this room",
      });
    }

    /* -----------------------------------------
       DELETE IMAGES
    ----------------------------------------- */

    if (room.images?.length > 0) {
      for (const image of room.images) {
        await deleteImageFile(image);
      }
    }

    /* -----------------------------------------
       DELETE ROOM
    ----------------------------------------- */

    await Room.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Delete room error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};