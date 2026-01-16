require("dotenv").config();
const express = require("express")
const db= require("./config/db");

const user = require("./router/user");
const intership = require("./router/intership");


const app = express();


db();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/api/user", user);
app.use("/api/intership", intership);

const PORT = process.env.PORT||3000
app.listen(PORT, ()=>console.log(`Server running on ${PORT}`))