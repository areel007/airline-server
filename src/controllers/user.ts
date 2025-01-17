import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/user";
import crypto from "crypto";
import nodemailer from "nodemailer";
import {
  validateUser,
  validateLogin,
  validateEmail,
  validatePassword,
} from "../middlewares/auth";
import IRequestHandlers from "../types/handlers";

// Register user
export const registerUser = [
  ...validateUser,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      email,
      password,
      phoneNumber,
      address,
      dateOfBirth,
      passportNumber,
      bookings,
    } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        address,
        dateOfBirth,
        passportNumber,
        bookings,
      });

      // Save user to the database
      const user = await newUser.save();
      res.status(201).json(user);
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

// User login handler
export const loginUser = [
  ...validateLogin,
  async (req: IRequestHandlers, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      // Send the token in the response
      res.status(200).json({
        token,
        user: { id: user._id, email: user.email, role: user.role },
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

// Forgot password reser request
export const requestPasswordReset = [
  ...validateEmail,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate a reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 3600000); // Token valid for 1 hour

      // Save the token and its expiry to the user's record
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpiry;
      await user.save();

      // Create a transport for sending email
      const transporter = nodemailer.createTransport({
        service: "Gmail", // You can use any email service
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      // Send the reset email
      const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: "Password Reset Request",
        text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
      console.error("Error during password reset request:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

// Password reset handler
export const resetPassword = [
  ...validatePassword,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, email } = req.query; // Get token and email from query parameters
    const { password } = req.body; // Get the new password from the request body

    try {
      // Find the user by email and reset token, ensuring the token is not expired
      const user = await User.findOne({
        email,
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }, // Ensure the token is not expired
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Hash the new password
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds);

      // Clear the reset token fields
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      // Save the updated user record
      await user.save();

      res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Error during password reset:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(id, { role });
    res.status(200).json({ msg: "role successfully updated" });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
