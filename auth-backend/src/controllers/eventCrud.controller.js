import Event from "../models/event.model.js";
import asyncHandler from "../utils/asyncHandler.js";

// GET /api/events — Public endpoint to get all events
export const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 }).lean();
  
  const upcoming = events.filter(e => e.type === "upcoming");
  const past = events.filter(e => e.type === "past");

  // We are returning `{ upcoming: [...], past: [...] }` to match the frontend expectations
  res.status(200).json({
    success: true,
    upcoming,
    past
  });
});

// POST /api/events — Admin creates a new event
export const createEvent = asyncHandler(async (req, res) => {
  const { title, date, description, status, type, teamSize } = req.body;

  if (!title || !date || !description || !type) {
    return res.status(400).json({
      success: false,
      message: "Please provide title, date, description, and type"
    });
  }

  const event = await Event.create({
    title,
    date,
    description,
    status: status || "",
    teamSize: teamSize || 1,
    type
  });

  res.status(201).json({
    success: true,
    message: "Event created successfully",
    event
  });
});

// DELETE /api/events/:id — Admin deletes an event
export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Event not found"
    });
  }

  await Event.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Event deleted successfully"
  });
});
