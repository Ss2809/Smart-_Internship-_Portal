const mongoose = require("mongoose")


const userSchema = mongoose.Schema({
  username : {type:String, unique : true, minlength : 3, required : true},
  email : {type:String, unique: true, required : true},
  password : {type:String, required:true},
  role : {type:String, enum : ["Student", "company"], default : "Student", required : true},
  skills :[{type:String}],
  city : {type:String},
  resume: {type : String},
  companyName : {type:String}

})

module.exports = mongoose.model("User", userSchema)