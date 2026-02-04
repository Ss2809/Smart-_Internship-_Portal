import User from "../model/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import intership from "../model/intership.js";
import uploadCloud from "../utils/uploadCloud.js";

/* ================= SIGNUP ================= */

const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.json({ message: "Missing fields" });
    }

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (user) {
      return res.json({
        message: "Username or Email already exists!",
      });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const newuser = new User({
      username,
      email,
      password: hashpassword,
    });

    const accestoken = jwt.sign(
      { _id: newuser._id, username },
      process.env.ACCESS_Tokan,
      { expiresIn: "5h" }
    );

    const refreshtoken = jwt.sign(
      { _id: newuser._id },
      process.env.Refresh_tokemn,
      { expiresIn: "2d" }
    );

    await newuser.save();

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      secure: false,
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Account created successfully",
      newuser,
      accestoken,
    });
  } catch (err) {
    next(err);
  }
};

/* ================= LOGIN ================= */

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not registered" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const accestoken = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.ACCESS_Tokan,
      { expiresIn: "5h" }
    );

    const refreshtoken = jwt.sign(
      { _id: user._id },
      process.env.Refresh_tokemn,
      { expiresIn: "2d" }
    );

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      secure: true,          // required for Vercel + Render
      sameSite: "none",      // required for cross-domain
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    });

    res.status(200).json({
      message: "Login successful",
      accestoken,
      user: {
        _id: user._id,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ================= PROFILE COMPLETE ================= */

const profilecomplete = async (req, res, next) => {
  try {
    const { skills, city, companyName } = req.body;

    if (!skills || !city) {
      return res.json({ message: "Skills and city are required" });
    }

    let imageUrl = null;

    if (req.file) {
      const result = await uploadCloud(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        skills,
        city,
        companyName,
        resume: imageUrl,
      },
      { new: true }
    );

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

/* ================= MY APPLICATION HISTORY ================= */

const myapplicationHistoey = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const myinternships = await intership
      .find({ "apply.user": userId })
      .populate("companyName", "username companyName email")
      .select("title city stipend companyName apply");

    if (myinternships.length === 0) {
      return res.json({
        message: "You have not applied to any internship",
        myinternships: [],
      });
    }

    res.json({
      message: "My Application History",
      myinternships,
      userId,
    });
  } catch (error) {
    next(error);
  }
};

export { signup, login, profilecomplete, myapplicationHistoey };
