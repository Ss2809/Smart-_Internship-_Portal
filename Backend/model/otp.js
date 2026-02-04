import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  otp: { type: String, required: true, minlength: 6 },
  otpvalidtime: { type: Date },
  email: { type: String },
});

export default mongoose.model("OTP", otpSchema);
