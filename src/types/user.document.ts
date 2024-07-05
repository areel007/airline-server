import { Document } from "mongoose";

interface UserDocument extends Document {
  email: string;
  password: string;
  name: string;
  bookings: string[]; // Adjust this based on your schema
  createdAt: Date;
  updatedAt: Date;
  phoneNumber?: string | null;
  address?: {
    // Define your address schema
  } | null;
  dateOfBirth?: Date | null;
  passportNumber?: string | null;

  // Additional custom properties
  resetPasswordToken?: string | undefined;
  resetPasswordExpires?: Date | undefined;
}

export default UserDocument;
