import 'dotenv/config';
import app from "./app.js";

import connectDB from "./config/db.js";
import { startCleanupJob } from "./jobs/cleanupEvents.js";

connectDB().then(() => {
  startCleanupJob();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});