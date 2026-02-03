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
const ratelimitvalid = require("../config/ratelimitar");
const OTP = require("../model/otp");
const axios = require("axios");
const sendOTP = require("../config/sendMail");
const { sentsmtpemail, sendEmail, forgetemail } = require("../config/Smpt");
const {
  signup,
  login,
  profilecomplete,
  myapplicationHistoey,
} = require("../controllers/user");


router.get("/profile-meter", auth, async(req,res)=>{
  const userID = req.user._id;
  const user = await User.findById(userID);
  if(!user){
    return res.status(400).json({message:"User not found!"});
  }
  let score = 0;
  if(user.username) score += 10
  if(user.email) score += 10
  if(user.password) score += 10
  if(user.role) score += 10
  if(user.skills) score += 10
  if(user.resume) score += 10
  if(user.college) score += 10
  if(user.graduationYear) score += 10
  if(user.linkedin) score += 10
  if(user.github) score += 10

  const percentage = score;
  res.json({ percentage });
  
})




router.post("/verify-otp", async (req, res, next) => {
  try {
    const { username, email, password, otp } = req.body;

    if (!username || !email || !password || !otp) {
      return res.status(400).json({ message: "Missing Fields" });
    }

    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // ---- YOUR OLD SIGNUP LOGIC STARTS HERE ----

    const hashpassword = await bcrypt.hash(password, 10);

    const newuser = new User({
      username,
      email,
      password: hashpassword,
    });

    const accestoken = jwt.sign(
      { _id: newuser._id, username },
      process.env.ACCESS_Tokan,
      { expiresIn: "5h" },
    );

    const refreshtoken = jwt.sign(
      { _id: newuser._id },
      process.env.Refresh_tokemn,
      { expiresIn: "2d" },
    );

    await newuser.save();

    // Delete OTP after success
    await OTP.deleteOne({ email });

    res.cookie("refreshyoken", refreshtoken, {
      httpOnly: true,
      secure: false,
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Account Created Successfully",
      newuser,
      accestoken,
    });

    // ---- YOUR OLD SIGNUP LOGIC ENDS HERE ----
  } catch (err) {
    next(err);
  }
});

//login
router.post("/login", ratelimitvalid, login);

//complte profile
router.post(
  "/profile",
  auth,
  upload.single("resume"),
  async (req, res, next) => {
    try {
      const {
        skills,
        city,
        companyName,
        graduationYear,
        linkedin,
        github,
        college,
      } = req.body;

      console.log({
        skills,
        city,
        companyName,
        graduationYear,
        linkedin,
        github,
        college,
      });

      // Skills compulsory ONLY for Student
      if (req.user.role === "Student" && !skills) {
        return res.status(400).json({ message: "Skills are required" });
      }

     let skillsArray = [];

if (skills) {
  skillsArray = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}


      let imageUrl;

      if (req.file) {
        const result = await uploadCloud(req.file.buffer);
        imageUrl = result.secure_url;
      }

      // Build update object dynamically
      const updateData = {
        skills: skillsArray,
        city,
        companyName,
        graduationYear,
        linkedin,
        github,
        college,
      };

      if (skillsArray.length > 0) {
  updateData.skills = skillsArray;
}

      // Only update resume if new file uploaded
      if (imageUrl) {
        updateData.resume = imageUrl;
      }

      const user = await User.findByIdAndUpdate(req.user._id, updateData, {
        new: true,
      });

      res.json({ success: true, user });
    } catch (err) {
      next(err);
    }
  },
);

//History
router.get("/my-applications", auth, myapplicationHistoey);




router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    // console.log({username, email, password})
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing Fields" });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    // Delete old OTP for same email (optional but good)
    await OTP.deleteMany({ email });

    // Store OTP
    await OTP.create({ email, otp, expiresAt });
   await sendOTP(email, otp);
    // // Send OTP email
    // await sendEmail(
    //   email,
    //   "Your Signup OTP",
    //   `Your verification OTP is: ${otp}. It is valid for 5 minutes.`,
    // );

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    next(err);
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "This email not Register " });
    }
    const resetTokenSecret =
      process.env.RESET_TOKEN_SECRET || process.env.ACCESS_Tokan || "demo";
    const resetoken = jwt.sign({ _id: user._id, email: email }, resetTokenSecret, {
      expiresIn: "1h",
    });
    user.resetoken = resetoken;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();
    const to = email;
    const subject = "forget password";
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const text = `reset password link= ${frontendUrl}/reset-password/${resetoken}`;

    await forgetemail(to, subject, text);
    res.json({ message: "email sent !" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to send reset email" });
  }
});

router.post("/resetpassword/:resetoken", async (req, res) => {
  const resetoken = req.params.resetoken.trim();
  const { password } = req.body;
  if (!password) {
    return res.json({ message: "Password Not provided!!" });
  }
  let decoderUser;
  try {
    const resetTokenSecret =
      process.env.RESET_TOKEN_SECRET || process.env.ACCESS_Tokan || "demo";
    decoderUser = jwt.verify(resetoken, resetTokenSecret);
  } catch (error) {
    return res.json({ message: "token invalid " });
  }

  const user = await User.findById(decoderUser._id);

  if (
    !user ||
    user.resetoken != resetoken ||
    user.resetTokenExpiry <= Date.now()
  ) {
    return res.json({ message: "token invalid or expire token" });
  }
  user.password = await bcrypt.hash(password, 10);
  user.resetoken = null;
  user.resetTokenExpiry = null;
  await user.save();
  res.json({ message: "You Password are Change" });
});

router.post("/logout", auth, async (req, res) => {
  const token = req.cookies.refreshtoken;
  console.log({ token });
  if (!token) {
    return res.json({ message: "token not found" });
  }
  try {
    jwt.verify(token, process.env.Refresh_tokemn);
    res.clearCookie("refreshtoken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });
    return res.json({ message: "Logout successful" });
  } catch (error) {
    return res.json({ message: "Token are invalid" });
  }
});

router.get("/me", auth, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select(
    "-password -companyName -resetoken -resetTokenExpiry",
  );
  if (!user) {
    return res.json({ message: "User not found!!" });
  }
  res.json({ user });
});

router.get("/mecompany", auth, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).select(
    "companyName city email skills linkedin",
  );
  if (!user) {
    return res.json({ message: "User not found!!" });
  }
  res.json({ user });
});

module.exports = router;
