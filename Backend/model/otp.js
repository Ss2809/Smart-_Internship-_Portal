import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  otp: { type: String, required: true, minlength: 6 },
  email: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export default mongoose.model("OTP", otpSchema);
