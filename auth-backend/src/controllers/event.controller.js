import EventRegistration from "../models/eventRegistration.model.js";
import asyncHandler from "../utils/asyncHandler.js";

// POST /api/events/register — authenticated user registers for an event
export const registerForEvent = asyncHandler(async (req, res) => {
  const {
    eventId,
    eventTitle,
    fullName,
    email,
    phone,
    collegeName,
    usn,
    teamSize,
    teamMembers,
    notes
  } = req.body;

  // Basic validation
  if (!eventId || !eventTitle || !fullName || !email || !phone || !collegeName || !usn || !teamSize) {
    return res.status(400).json({
      success: false,
      message: "All required fields must be provided"
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

  // Duplicate check
  const existing = await EventRegistration.findOne({
    email: email.toLowerCase(),
    eventId
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
    email: email.toLowerCase(),
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
    filter.eventId = eventId;
  }

  if (search) {
    const regex = new RegExp(search, "i");
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
