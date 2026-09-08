import Report from "../models/Report.js";
import Room from "../models/Room.js";
import Notification from "../models/Notification.js";

/* =========================================================
   VALID REPORT REASONS
========================================================= */

const validReasons = [
  "Fake / Scam",
  "Wrong information",
  "Room no longer available",
  "Inappropriate content",
  "Duplicate listing",
  "Other",
];

/* =========================================================
   CREATE REPORT
========================================================= */

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

/* =========================================================
   GET ALL REPORTS - ADMIN
========================================================= */

export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate({
        path: "room",
        select:
          "title rent roomType location images status views postedBy createdAt",
        populate: {
          path: "postedBy",
          select: "name email phone",
        },
      })
      .populate(
        "reportedBy",
        "name email phone"
      )
      .sort({
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Get reports error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================================
   UPDATE REPORT STATUS - ADMIN
========================================================= */

export const updateReportStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "reviewed",
      "resolved",
      "dismissed",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report status",
      });
    }

    const report = await Report.findById(
      req.params.id
    ).populate("room", "title");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const previousStatus = report.status;

    report.status = status;

    await report.save();

    /*
     * Notify reporter only when the report
     * is actually resolved or dismissed.
     */

    if (
      previousStatus !== status &&
      (status === "resolved" ||
        status === "dismissed")
    ) {
      const isResolved =
        status === "resolved";

      await Notification.create({
        user: report.reportedBy,
        type: isResolved
          ? "report_resolved"
          : "report_dismissed",

        title: isResolved
          ? "Report resolved"
          : "Report reviewed",

        message: isResolved
          ? `Your report about "${report.room?.title || "this listing"}" has been resolved by the Pluto team.`
          : `Your report about "${report.room?.title || "this listing"}" was reviewed and dismissed by the Pluto team.`,

        room: report.room?._id || null,
        report: report._id,
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Report status updated successfully",
      report,
    });
  } catch (error) {
    console.error(
      "Update report status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================================
   TAKE DOWN ROOM - ADMIN
========================================================= */

export const takeDownRoom = async (
  req,
  res
) => {
  try {
    const room = await Room.findById(
      req.params.roomId
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    room.status = "unavailable";

    await room.save();

    await Notification.create({
      user: room.postedBy,
      type: "listing_takedown",
      title: "Listing taken down",
      message: `Your listing "${room.title}" has been taken down by the Pluto moderation team after a report was reviewed.`,
      room: room._id,
    });

    return res.status(200).json({
      success: true,
      message:
        "Listing taken down successfully",
      room,
    });
  } catch (error) {
    console.error(
      "Take down room error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};