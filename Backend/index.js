require("dotenv").config();
const cors = require("cors");
const express = require("express");
const db = require("./config/db");
const cookieparser = require("cookie-parser")

const user = require("./router/user");
const intership = require("./router/intership");

const app = express();

app.set("trust proxy", 1);

db();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://smart-internship-portal-delta.vercel.app",
      "https://smart-internship-portal-c41ucr8x4-sushils-projects-b955e5e6.vercel.app"
    ],
    credentials: true,
  })
);


app.use(cookieparser());

app.use(express.urlencoded({ extended: false }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: "Something went wrong",
  });
});
app.use("/api/user", user);
app.use("/api/intership", intership);



const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
