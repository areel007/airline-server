"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = exports.validatePassword = exports.validateEmail = exports.validateLogin = exports.validateUser = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.validateUser = [
    (0, express_validator_1.body)("name")
        .isString()
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters long"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Please provide a valid email"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];
exports.validateLogin = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Please provide a valid email"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
];
exports.validateEmail = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Please provide a valid email"),
];
exports.validatePassword = [
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.sendStatus(401);
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }
    jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = decoded;
        next();
    });
};
exports.authenticateToken = authenticateToken;
