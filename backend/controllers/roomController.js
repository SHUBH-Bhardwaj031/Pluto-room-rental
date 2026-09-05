import Room from "../models/Room.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

/* =========================================================
   CLOUDINARY IMAGE DELETE HELPER
========================================================= */

const deleteCloudinaryImage = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    // Old local uploads - nothing to delete from Cloudinary
    if (!imageUrl.startsWith("http")) {
      return;
    }

    // Extract public_id from Cloudinary URL
    const uploadIndex = imageUrl.indexOf("/upload/");

    if (uploadIndex === -1) return;

    let publicId = imageUrl.substring(uploadIndex + 8);

    // Remove version e.g. v1234567890/
    publicId = publicId.replace(/^v\d+\//, "");

    // Remove file extension
    publicId = publicId.replace(/\.[^/.]+$/, "");

    await cloudinary.uploader.destroy(publicId);

    console.log(`Cloudinary image deleted: ${publicId}`);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
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

    // Cloudinary URLs
    const images = req.files
      ? req.files.map((file) => file.path)
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

      location:
        typeof location === "string"
          ? JSON.parse(location)
          : location,

      contact:
        typeof contact === "string"
          ? JSON.parse(contact)
          : contact,

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
       New images replace old images
    ----------------------------------------- */

    if (req.files && req.files.length > 0) {
      const oldImages = room.images || [];

      // Delete old Cloudinary images
      for (const image of oldImages) {
        await deleteCloudinaryImage(image);
      }

      // Save new Cloudinary URLs
      room.images = req.files.map(
        (file) => file.path
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
       DELETE CLOUDINARY IMAGES
    ----------------------------------------- */

    if (room.images?.length > 0) {
      for (const image of room.images) {
        await deleteCloudinaryImage(image);
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
/* =========================================================
   SAVE ROOM
========================================================= */

export const saveRoom = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Prevent duplicate saves
    const alreadySaved = user.savedRooms.some(
      (savedRoomId) =>
        savedRoomId.toString() === room._id.toString()
    );

    if (alreadySaved) {
      return res.status(400).json({
        success: false,
        message: "Room already saved",
      });
    }

    user.savedRooms.push(room._id);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Room saved successfully",
      saved: true,
    });
  } catch (error) {
    console.error("Save room error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* =========================================================
   UNSAVE ROOM
========================================================= */

export const unsaveRoom = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.savedRooms = user.savedRooms.filter(
      (roomId) =>
        roomId.toString() !== req.params.id
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Room removed from saved rooms",
      saved: false,
    });
  } catch (error) {
    console.error("Unsave room error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* =========================================================
   GET SAVED ROOMS
========================================================= */

export const getSavedRooms = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate({
        path: "savedRooms",
        populate: {
          path: "postedBy",
          select: "name email phone",
        },
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove deleted/non-existing rooms
    const rooms = user.savedRooms.filter(
      (room) => room !== null
    );

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("Get saved rooms error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};