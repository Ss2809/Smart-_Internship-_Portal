import mongoose from "mongoose";

const intershipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    skillsRequired: [{ type: String, required: true }],
    city: String,
    stipend: { type: String },
    companyName: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    apply: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: String,
        email: String,
        resume: String,
        appliedAt: { type: Date, default: Date.now },
        status: { type: String, default: "pending" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Intership", intershipSchema);
