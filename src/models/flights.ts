import { Schema, model } from "mongoose";

const flightsSchema = new Schema({
  flightNumber: {
    type: String,
    required: true,
    unique: true,
  },
  airline: {
    type: String,
    required: true,
  },
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  departureTime: {
    type: Date,
    required: true,
  },
  arrivalTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // Duration in minutes
  },
  aircraft: {
    type: String,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  seatMap: {
    type: Map, // For seat availability and assignments
    of: String,
  },
  fareDetails: {
    economy: {
      price: { type: Number, required: true },
      baggageAllowance: { type: Number, default: 20 }, // kg
    },
    business: {
      price: { type: Number },
      baggageAllowance: { type: Number, default: 30 }, // kg
    },
    firstClass: {
      price: { type: Number },
      baggageAllowance: { type: Number, default: 40 }, // kg
    },
  },
  status: {
    type: String,
    enum: ["Scheduled", "On Time", "Delayed", "Cancelled", "Completed"],
    default: "Scheduled",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Flights = model("Flight", flightsSchema);
export default Flights;
