const express = require("express");
const User = require("../model/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const multer = require("multer");
const upload = require("../config/multer");
const uploadCloud = require("../utils/uploadCloud");
const Internship = require("../model/intership");
//signup
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.json({ message: "Missing Filed" });
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (user) {
    return res.json({ message: "Username Or Email Already Use Diffrent Use!" });
  }
  const hashpassword = await bcrypt.hash(password, 10);
  const newuser = new User({
    username,
    email,
    password: hashpassword,
  });
  const accestoken = jwt.sign(
    { _id: newuser._id, username: username },
    process.env.ACCESS_Tokan,
    { expiresIn: "5h" }
  );
  const refreshtoken = jwt.sign(
    { _id: newuser._id },
    process.env.Refresh_tokemn,
    { expiresIn: "2d" }
  );
  await newuser.save();
  res.cookie("refreshyoken", refreshtoken, {
    httpOnly: true,
    secure: false,
    maxAge: 2 * 24 * 60 * 60 * 1000,
  });
  res
    .status(201)
    .json({ message: "Account Create Succfully", newuser, accestoken });
});

//login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ message: "email and password not provided!!" });
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ message: "email not registerd!!" });
  }
  const checkpass = bcrypt.compare(password, user.password);
  if (!checkpass) {
    return res.json({ message: "Password are invalid!!" });
  }
  const accestoken = jwt.sign(
    { _id: user._id, username: user.username },
    process.env.ACCESS_Tokan,
    { expiresIn: "5h" }
  );
  const refreshtoken = jwt.sign({ _id: user._id }, process.env.Refresh_tokemn, {
    expiresIn: "2d",
  });

  res.cookie("refreshyoken", refreshtoken, {
    httpOnly: true,
    secure: false,
    maxAge: 2 * 24 * 60 * 60 * 60,
  });
  res.json({ message: "Login User", accestoken });
});

//complte profile

router.post("/profile", auth, upload.single("resume"), async (req, res) => {
  try {
    const { skills, city, companyName } = req.body;

    if (!skills || !city) {
      return res.json({ message: "Skills and City are required" });
    }

    let imageUrl = null;

    if (req.file) {
      const result = await uploadCloud(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        skills: skills, // "html,css,js"
        city,
        companyName,
        resume: imageUrl,
      },
      { new: true }
    );

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/myApplyintership", auth, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    return res.json({ message: "User not found!!" });
  }
  const myintership = await Internship.find({
    "apply.user": userId,
  }).select("title companyName apply");

  if (myintership.length === 0) {
    return res.json({ message: "You have not applied to any internship" });
  }

  res.json({
    message: " my History:",
    myintership,
  });
});

module.exports = router;
