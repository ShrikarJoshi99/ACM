import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../models/user.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import sendEmail from "../utils/sendEmail.js";

import {
  registerService,
  loginService
} from "../services/auth.service.js";

console.log(sendEmail);
// REGISTER
export const register = asyncHandler(async (req, res) => {

  const existingUser = await User.findOne({
    email: req.body.email
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists"
    });
  }

const verificationCode =
  Math.floor(1000 + Math.random() * 9000).toString();

const user = await registerService({
  ...req.body,
  verificationCode,
  verificationCodeExpire:
    Date.now() + 10 * 60 * 1000
});

await sendEmail(
  user.email,
  "Verify Your Email",
  `
  <div style="
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    padding: 40px;
  ">

    <div style="
      max-width: 500px;
      background: white;
      margin: auto;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    ">

      <div style="
        background: #111827;
        padding: 20px;
        text-align: center;
      ">

        <img 
          src="https://your-logo-url.com/logo.png"
          alt="Logo"
          width="80"
        />

        <h1 style="
          color: white;
          margin-top: 10px;
        ">
          ACM Portal
        </h1>

      </div>

      <div style="padding: 30px; text-align:center;">

        <h2>Email Verification</h2>

        <p>
          Use the verification code below to verify your account.
        </p>

        <div style="
          font-size: 40px;
          font-weight: bold;
          letter-spacing: 8px;
          color: #2563eb;
          margin: 30px 0;
        ">
          ${verificationCode}
        </div>

        <p style="color: gray;">
          This code expires in 10 minutes.
        </p>

      </div>

      <div style="
        background: #f9fafb;
        padding: 15px;
        text-align: center;
        font-size: 12px;
        color: gray;
      ">
        © 2026 ACM Portal. All rights reserved.
      </div>

    </div>

  </div>
  `
);

console.log("Verification Code:");
console.log(verificationCode);

  res.status(201).json({
    success: true,
    message: "Registration successful"
  });

});


// LOGIN
export const login = asyncHandler(async (req, res) => {

  const { user, accessToken, refreshToken } =
    await loginService(
      req.body.email,
      req.body.password
    );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict"
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict"
  });

  res.status(200).json({
    success: true,
    user
  });

});


// LOGOUT
export const logout = asyncHandler(async (req, res) => {

  res.clearCookie("accessToken");

  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Logged out"
  });

});


// REFRESH TOKEN
export const refreshToken = asyncHandler(async (req, res) => {

  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No refresh token"
    });
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET
  );

  const user = await User.findById(decoded.id);

  const accessToken = jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE
    }
  );

  res.status(200).json({
    success: true,
    accessToken
  });

});


// FORGOT PASSWORD
export const forgotPassword = asyncHandler(async (req, res) => {

  const user = await User.findOne({
    email: req.body.email
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  const resetToken = crypto
    .randomBytes(32)
    .toString("hex");

  user.resetPasswordToken = resetToken;

  user.resetPasswordExpire =
    Date.now() + 10 * 60 * 1000;

  await user.save();

 await sendEmail(
  user.email,
  "Reset Password",
  `
    <h2>Password Reset</h2>

    <p>
      Use the token below to reset your password:
    </p>

    <h3>${resetToken}</h3>

    <p>
      This token expires in 10 minutes.
    </p>
  `
);

 

  res.status(200).json({
    success: true,
    message: "Reset email sent"
  });

});


// RESET PASSWORD
export const resetPassword = asyncHandler(async (req, res) => {

  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpire: {
      $gt: Date.now()
    }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired token"
    });
  }

  user.password = await bcrypt.hash(
    req.body.password,
    10
  );

  user.resetPasswordToken = undefined;

  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful"
  });

});


// VERIFY EMAIL
export const verifyEmail = asyncHandler(async (req, res) => {

  const { email, code } = req.body;

  const user = await User.findOne({
    email,
    verificationCode: code,
    verificationCodeExpire: {
      $gt: Date.now()
    }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired verification code"
    });
  }

  user.isVerified = true;

  user.verificationCode = undefined;

  user.verificationCodeExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Email verified successfully"
  });

});


// PROFILE
export const getProfile = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user.id)
    .select("-password");

  res.status(200).json({
    success: true,
    user
  });

});