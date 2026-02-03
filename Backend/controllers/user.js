const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const intership = require("../model/intership");
const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.json({ message: "Missing Filed" });
    }
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (user) {
      return res.json({
        message: "Username Or Email Already Use Diffrent Use!",
      });
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
      { expiresIn: "5h" },
    );
    const refreshtoken = jwt.sign(
      { _id: newuser._id },
      process.env.Refresh_tokemn,
      { expiresIn: "2d" },
    );
    await newuser.save();
    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      secure: false,
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });
    res
      .status(201)
      .json({ message: "Account Create Succfully", newuser, accestoken });
  } catch (err) {
    next(err);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "email and password not provided!!" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "email not registerd!!" });
    }
    const checkpass = await bcrypt.compare(password, user.password);
    if (!checkpass) {
      return res.json({ message: "Password are invalid!!" });
    }
    const accestoken = jwt.sign(
      { _id: user._id, username: user.username },
      process.env.ACCESS_Tokan,
      { expiresIn: "5h" },
    );
    const refreshtoken = jwt.sign(
      { _id: user._id },
      process.env.Refresh_tokemn,
      {
        expiresIn: "2d",
      },
    );

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      secure: false,
      maxAge: 2 * 24 * 60 * 60 * 60,
    });
    res.json({
      message: "Login User",
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

const profilecomplete = async (req, res, next) => {
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
      { new: true },
    );

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};
const myapplicationHistoey = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!!" });
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
    console.error(error);
    next(error);
  }
};

module.exports = { signup, login, profilecomplete, myapplicationHistoey };
