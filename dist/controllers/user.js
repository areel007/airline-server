"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// Register user
// Validation middleware
const validateUser = [
    (0, express_validator_1.body)("name")
        .isString()
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters long"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Please provide a valid email"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];
exports.registerUser = [
    ...validateUser,
    async (req, res) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password, phoneNumber, address, dateOfBirth, passportNumber, bookings, } = req.body;
        try {
            // Check if user already exists
            const existingUser = await user_1.default.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: "User already exists" });
            }
            // Hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
            // Create new user
            const newUser = new user_1.default({
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
        }
        catch (error) {
            console.error("Error registering user:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
];
// User login handler
// Validation middleware
const validateLogin = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Please provide a valid email"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
];
exports.loginUser = [
    ...validateLogin,
    async (req, res) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
            // Check if the user exists
            const user = await user_1.default.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            // Check if the password is correct
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            // Generate a JWT token
            const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, // Ensure JWT_SECRET is set in your environment variables
            { expiresIn: "1h" } // Token expiration time
            );
            // Send the token in the response
            res
                .status(200)
                .json({ token, user: { id: user._id, email: user.email } });
        }
        catch (error) {
            console.error("Error logging in:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
];
// Forgot password
// Validation middleware
const validateEmail = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Please provide a valid email"),
];
exports.requestPasswordReset = [
    ...validateEmail,
    async (req, res) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email } = req.body;
        try {
            // Find the user by email
            const user = await user_1.default.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            // Generate a reset token
            const resetToken = crypto_1.default.randomBytes(32).toString("hex");
            const resetTokenExpiry = new Date(Date.now() + 3600000); // Token valid for 1 hour
            // Save the token and its expiry to the user's record
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = resetTokenExpiry;
            await user.save();
            // Create a transport for sending email
            const transporter = nodemailer_1.default.createTransport({
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
        }
        catch (error) {
            console.error("Error during password reset request:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
];
// Validation middleware
const validatePassword = [
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];
exports.resetPassword = [
    ...validatePassword,
    async (req, res) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { token, email } = req.query; // Get token and email from query parameters
        const { password } = req.body; // Get the new password from the request body
        try {
            // Find the user by email and reset token, ensuring the token is not expired
            const user = await user_1.default.findOne({
                email,
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }, // Ensure the token is not expired
            });
            if (!user) {
                return res.status(400).json({ message: "Invalid or expired token" });
            }
            console.log("User found for password reset:", user.email);
            // Hash the new password
            const saltRounds = 10;
            user.password = await bcrypt_1.default.hash(password, saltRounds);
            // Clear the reset token fields
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            // Save the updated user record
            await user.save();
            res.status(200).json({ message: "Password has been reset successfully" });
        }
        catch (error) {
            console.error("Error during password reset:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
];
