"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
    },
    dateOfBirth: {
        type: Date,
    },
    passportNumber: {
        type: String,
    },
    bookings: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Booking",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
