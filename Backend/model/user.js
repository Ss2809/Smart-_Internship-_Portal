import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, minlength: 3, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Student", "company"],
    default: "Student",
    required: true,
  },
  skills: [{ type: String }],
  city: { type: String },
  resume: { type: String },
  companyName: { type: String },
  college: { type: String },
  graduationYear: { type: String },
  linkedin: { type: String },
  github: { type: String },
  resetoken: {
    type: String,
    default: null,
  },
  resetTokenExpiry: {
    type: Date,
    default: null,
  },
});

export default mongoose.model("User", userSchema);
