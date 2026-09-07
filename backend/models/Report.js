import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reason: {
      type: String,
      required: true,
      enum: [
        "Fake / Scam",
        "Wrong information",
        "Room no longer available",
        "Inappropriate content",
        "Duplicate listing",
        "Other",
      ],
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "dismissed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Same user cannot report the same room more than once
reportSchema.index(
  { room: 1, reportedBy: 1 },
  { unique: true }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;