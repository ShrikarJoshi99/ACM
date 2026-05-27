import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/event.routes.js";



import errorMiddleware from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      const isLocalhost =
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin === "http://localhost" ||
        origin === "http://127.0.0.1";
      if (isLocalhost) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

app.use(errorMiddleware);

export default app;