const mongoose = require("mongoose")


const otpSchema = mongoose.Schema({
  otp : {type:String, required:true, minlength : 6},
  otpvalidtime : {type:Date},
  email : {type:String}
})

module.exports = mongoose.model("OTP", otpSchema);