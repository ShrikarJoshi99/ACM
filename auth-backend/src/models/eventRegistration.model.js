import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    usn: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

const eventRegistrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      trim: true
    },

    eventTitle: {
      type: String,
      required: true,
      trim: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    fullName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    collegeName: {
      type: String,
      required: true,
      trim: true
    },

    usn: {
      type: String,
      required: true,
      trim: true
    },

    teamSize: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },

    teamMembers: [teamMemberSchema],

    notes: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate registration (same email for same event)
eventRegistrationSchema.index(
  { email: 1, eventId: 1 },
  { unique: true }
);

export default mongoose.model(
  "EventRegistration",
  eventRegistrationSchema
);
