import Report from "../models/Report.js";
import Room from "../models/Room.js";

const validReasons = [
  "Fake / Scam",
  "Wrong information",
  "Room no longer available",
  "Inappropriate content",
  "Duplicate listing",
  "Other",
];

export const createReport = async (req, res) => {
  try {
    const { roomId, reason, description } = req.body;

    if (!roomId || !reason) {
      return res.status(400).json({
        success: false,
        message: "Room and report reason are required",
      });
    }

    if (!validReasons.includes(reason)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report reason",
      });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Prevent the same user from reporting the same listing twice
    const existingReport = await Report.findOne({
      room: roomId,
      reportedBy: req.user.userId,
    });

    if (existingReport) {
      return res.status(409).json({
        success: false,
        message: "You have already reported this listing",
      });
    }

    const report = await Report.create({
      room: roomId,
      reportedBy: req.user.userId,
      reason,
      description: description?.trim() || "",
    });

    return res.status(201).json({
      success: true,
      message: "Listing reported successfully",
      report,
    });
  } catch (error) {
    console.error("Create report error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already reported this listing",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};