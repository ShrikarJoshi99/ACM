import Event from "../models/event.model.js";
import EventRegistration from "../models/eventRegistration.model.js";

const cleanupOldEvents = async () => {
  try {
    const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);
    const twoYearsAgo = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000);

    // Find events to clean up:
    // 1. Events where registrationCloseDate is set and is older than 20 minutes (temporary events)
    // 2. Past events (type: "past") where the event date is older than 2 years
    const oldEvents = await Event.find({
      $or: [
        { registrationCloseDate: { $lte: twentyMinutesAgo } },
        {
          type: "past",
          date: { $lte: twoYearsAgo }
        }
      ]
    });

    if (oldEvents.length === 0) return;

    const eventIds = oldEvents.map(event => event._id.toString());

    // Delete associated registrations first
    const regResult = await EventRegistration.deleteMany({
      eventId: { $in: eventIds }
    });

    // Delete the events
    const eventResult = await Event.deleteMany({
      _id: { $in: oldEvents.map(e => e._id) }
    });
  } catch (error) {
    // Log error in production
    console.error("Error in cleanupOldEvents:", error);
  }
};

// Run the job every 5 minutes (300000 ms) to minimize server load
export const startCleanupJob = () => {
  setInterval(cleanupOldEvents, 300000);

  // Also run immediately on startup
  cleanupOldEvents();
};
