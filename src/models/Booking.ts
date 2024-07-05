import { Schema, model } from "mongoose";

const bookingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  flight: {
    type: Schema.Types.ObjectId,
    ref: "Flight",
    required: true,
  },
  passengers: [
    {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      dateOfBirth: { type: Date, required: true },
      passportNumber: { type: String },
      seatNumber: { type: String },
      specialRequests: { type: String },
    },
  ],
  bookingDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending",
    required: true,
  },
  paymentInfo: {
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Failed"],
      required: true,
    },
    transactionId: { type: String },
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  seatSelection: {
    type: Map,
    of: String,
  },
  baggageInfo: [
    {
      type: {
        type: String,
        enum: ["Carry-on", "Checked"],
        required: true,
      },
      weight: {
        type: Number,
        required: true,
      },
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

const Bookings = model("Booking", bookingSchema);
export default Bookings;
