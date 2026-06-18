import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    date: {
      type: Date,
      required: true
      // Note: Changed from String to Date for better storage and querying.
      // Existing string dates (if any) must be migrated to Date objects.
      // Ensure all date values are stored as ISO 8601 strings (or valid Date) before this change.
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    status: {
      type: String,
      trim: true,
      default: "",
      maxlength: 50
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
    },
    registrationOpenDate: {
      type: Date,
      default: null
    },
    registrationCloseDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Add indexes for better query performance
eventSchema.index({ type: 1 });
eventSchema.index({ registrationOpenDate: 1 });
eventSchema.index({ registrationCloseDate: 1 });
// Index on date for sorting and range queries
eventSchema.index({ date: 1 });

export default mongoose.model("Event", eventSchema);
