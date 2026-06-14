import express from "express";

import rateLimit from "express-rate-limit";

import {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  verifyEmail,
  getProfile
} from "../controllers/auth.controller.js";



import validate from "../middlewares/validate.middleware.js";

import {
  registerValidator,
  loginValidator
} from "../validators/auth.validator.js";

import {
  protect,
  authorize
} from "../middlewares/auth.middleware.js";

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10
});

router.post(
  "/register",
  limiter,
  registerValidator,
  validate,
  register
);

router.post("/test", (req, res) => {
  res.json({
    success: true,
    message: "Route works"
  });
});

router.post(
  "/login",
  limiter,
  loginValidator,
  validate,
  login
);

router.post("/logout", logout);

router.post("/refresh-token", refreshToken);

router.post("/forgot-password", forgotPassword);

router.post("/verify-reset-token/:token", verifyResetToken);

router.post("/reset-password/:token", resetPassword);

router.post(
  "/verify-email",
  verifyEmail
);

router.get(
  "/profile",
  protect,
  getProfile
);

router.get(
  "/admin",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({
      message: "Admin Route"
    });
  }
);



export default router;