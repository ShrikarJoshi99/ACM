import { body } from "express-validator";

export const registerValidator = [
  body("name").notEmpty().withMessage("Full name is required"),

  body("email").isEmail().withMessage("Please enter a valid email address"),

  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
];

export const loginValidator = [
  body("email").isEmail().withMessage("Please enter a valid email address"),

  body("password").notEmpty().withMessage("Password is required")
];