const mongoose = require("mongoose");


const chatbotSchema = mongoose.Schema({
  user : {type:mongoose.Schema.Types.ObjectId, ref : "User"},
  role : {type: String, enum : ["bot", "user"]},
  message : {type : String},
  creatAt : {type : Date, default : Date.now}
})

module.exports = mongoose.model("Chatbot",chatbotSchema);