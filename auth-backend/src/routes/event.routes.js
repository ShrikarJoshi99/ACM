import express from "express";

import {
  registerForEvent,
  getRegistrations,
  deleteRegistration
} from "../controllers/event.controller.js";

import {
  protect,
  authorize
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// User registers for an event (must be logged in)
router.post(
  "/register",
  protect,
  registerForEvent
);

// Admin gets all registrations (with optional filters)
router.get(
  "/registrations",
  protect,
  authorize("admin"),
  getRegistrations
);

// Admin deletes a registration
router.delete(
  "/registrations/:id",
  protect,
  authorize("admin"),
  deleteRegistration
);

export default router;
