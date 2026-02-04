import mongoose from "mongoose";

const chatbotSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  role: { type: String, enum: ["bot", "user"] },
  message: { type: String },
  creatAt: { type: Date, default: Date.now },
});

export default mongoose.model("Chatbot", chatbotSchema);
