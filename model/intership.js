const mongoose = require("mongoose");

const intershipSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    skillsRequired: [{ type: String, required: true }],
    city: String,
    stipend: Number,
    companyName: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    apply: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    username: String,
    email: String,
    resume: String,

    appliedAt: { type: Date, default: Date.now },
    status: { type: String, default: "pending" }

  }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Intership", intershipSchema);
