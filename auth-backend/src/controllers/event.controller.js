import EventRegistration from "../models/eventRegistration.model.js";
import Event from "../models/event.model.js";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { normalizeEmail, normalizeString } from "../utils/stringUtils.js";

// POST /api/events/register — authenticated user registers for an event
export const registerForEvent = asyncHandler(async (req, res) => {
  const eventId = normalizeString(req.body.eventId);
  const eventTitle = normalizeString(req.body.eventTitle);
  const fullName = normalizeString(req.body.fullName);
  const email = normalizeEmail(req.body.email);
  const phone = normalizeString(req.body.phone);
  const collegeName = normalizeString(req.body.collegeName);
  const usn = normalizeString(req.body.usn);
  const teamSize = req.body.teamSize;
  const teamMembers = req.body.teamMembers;
  const notes = req.body.notes;

  // Basic validation
  if (!eventId || !eventTitle || !fullName || !email || !phone || !collegeName || !usn || !teamSize) {
    return res.status(400).json({
      success: false,
      message: "All required fields must be provided"
    });
  }

  // Check if the registration window is still open
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Event not found"
    });
  }

  const now = new Date();
  if (event.registrationOpenDate && now < new Date(event.registrationOpenDate)) {
    return res.status(400).json({
      success: false,
      message: "Registration for this event has not opened yet"
    });
  }
  if (event.registrationCloseDate && now > new Date(event.registrationCloseDate)) {
    return res.status(400).json({
      success: false,
      message: "Registration for this event has closed"
    });
  }

  // Team members validation
  const size = Number(teamSize);
  if (size > 1) {
    if (!Array.isArray(teamMembers) || teamMembers.length !== size - 1) {
      return res.status(400).json({
        success: false,
        message: `Please provide details for ${size - 1} team member(s)`
      });
    }

    for (let i = 0; i < teamMembers.length; i++) {
      if (!teamMembers[i].name || !teamMembers[i].usn) {
        return res.status(400).json({
          success: false,
          message: `Name and USN required for team member ${i + 1}`
        });
      }
    }
  }

  // Duplicate check — by userId OR by email
  const existing = await EventRegistration.findOne({
    eventId,
    $or: [
      { userId: req.user?.id },
      { email: email }
    ]
  });

  if (existing) {
    return res.status(400).json({
      success: false,
      message: "You have already registered for this event"
    });
  }

  const registration = await EventRegistration.create({
    eventId,
    eventTitle,
    userId: req.user?.id || undefined,
    fullName,
    email: email,
    phone,
    collegeName,
    usn,
    teamSize: size,
    teamMembers: size > 1 ? teamMembers : [],
    notes: notes || ""
  });

  res.status(201).json({
    success: true,
    message: "Registration successful",
    registration
  });
});

// GET /api/events/registrations — admin gets all registrations
export const getRegistrations = asyncHandler(async (req, res) => {
  const { eventId, search } = req.query;

  const filter = {};

  if (eventId) {
    filter.eventId = String(eventId);
  }

  if (search) {
    // Escape special regex characters to prevent ReDoS
    const escaped = String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, "i");
    filter.$or = [
      { fullName: regex },
      { email: regex },
      { collegeName: regex },
      { usn: regex },
      { eventTitle: regex }
    ];
  }

  const registrations = await EventRegistration.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    count: registrations.length,
    registrations
  });
});

// DELETE /api/events/registrations/:id — admin deletes a registration
export const deleteRegistration = asyncHandler(async (req, res) => {
  const registration = await EventRegistration.findById(req.params.id);

  if (!registration) {
    return res.status(404).json({
      success: false,
      message: "Registration not found"
    });
  }

  await EventRegistration.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Registration deleted"
  });
});

// GET /api/events/my-registrations — logged in user gets their own registrations
export const getMyRegistrations = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  const email = normalizeEmail(user.email);

  // Find registrations matching this user's email or userId
  const registrations = await EventRegistration.find({
    $or: [
      { userId: req.user.id },
      { email: email }
    ]
  }).sort({ createdAt: -1 }).lean();

  // Optimization: Fetch all events in a single query to avoid N+1 problem
  const eventIds = [...new Set(registrations.map(reg => reg.eventId))];
  const eventsMap = {};
  if (eventIds.length > 0) {
    const events = await Event.find({ _id: { $in: eventIds }}).lean();
    events.forEach(event => {
      eventsMap[event._id.toString()] = event;
    });
  }

  // Filter out registrations for events that are closed or past
  const activeRegistrations = [];
  for (const reg of registrations) {
    const event = eventsMap[reg.eventId];
    // Keep only if event still exists AND is not past/closed
    if (event && event.type !== "past") {
      const status = (event.status || "").toLowerCase();
      if (!status.includes("closed")) {
        activeRegistrations.push(reg);
      }
    }
  }

  res.status(200).json({
    success: true,
    count: activeRegistrations.length,
    registrations: activeRegistrations
  });
});
