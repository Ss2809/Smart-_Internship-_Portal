const mogoose = require("mongoose");

const connet = ()=>{
  mogoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("MongoDB Connetd Succfully")
  }).catch((err)=>{
console.log({err})
  })
    
  
}

module.exports = connet;