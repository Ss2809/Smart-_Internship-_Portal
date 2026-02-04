import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

import db from "./config/db.js";
import user from "./router/user.js";
import intership from "./router/intership.js";

const app = express();

app.set("trust proxy", 1);

// Connect DB
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

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: "Something went wrong",
  });
});

app.use("/api/user", user);
app.use("/api/intership", intership);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
