import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      trim: true,
      default: ""
    },
    teamSize: {
      type: Number,
      required: true,
      default: 1,
      min: 1
    },
    type: {
      type: String,
      required: true,
      enum: ["upcoming", "past"]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Event", eventSchema);
