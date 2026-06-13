import Event from "../models/event.model.js";
import EventRegistration from "../models/eventRegistration.model.js";

const cleanupOldEvents = async () => {
  try {
    const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);

    // Find events where registrationCloseDate is less than or equal to 20 mins ago
    const oldEvents = await Event.find({
      registrationCloseDate: { $lte: twentyMinutesAgo }
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
  }
};

// Run the job every 5 minutes (300000 ms) to minimize server load
export const startCleanupJob = () => {
  setInterval(cleanupOldEvents, 300000);

  // Also run immediately on startup
  cleanupOldEvents();
};
