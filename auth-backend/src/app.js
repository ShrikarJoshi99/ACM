import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";



import errorMiddleware from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

export default app;