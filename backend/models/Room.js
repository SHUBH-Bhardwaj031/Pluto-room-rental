import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    images: [
      {
        type: String,
      },
    ],

    rent: {
      type: Number,
      required: true,
      min: 0,
    },

    roomType: {
      type: String,
      required: true,
      enum: ["Single", "Shared", "1 BHK", "2 BHK", "PG", "Other"],
    },

    amenities: [
      {
        type: String,
        trim: true,
      },
    ],

    location: {
      address: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      locality: {
        type: String,
        required: true,
        trim: true,
      },

      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },

        coordinates: {
          type: [Number],
          required: true,
        },
      },
    },

    contact: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      whatsapp: {
        type: String,
        trim: true,
      },
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Geospatial index
roomSchema.index({
  "location.coordinates": "2dsphere",
});

const Room = mongoose.model("Room", roomSchema);

export default Room;