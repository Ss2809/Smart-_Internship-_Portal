const express = require("express");
const auth = require("../middleware/auth");
const checkrole = require("../middleware/checkRole");
const User = require("../model/user");
const intership = require("../model/intership");
const { route } = require("./user");

const router = express.Router();

router.post("/creatintership", auth, checkrole("company"), async (req, res) => {
  const UserId = req.user._id;
  const { title, description, skills, city, stipend } = req.body;
  if (!title || !skills) {
    return res.json({ message: "title and skills fille this are required!!" });
  }
  const user = await User.findById(UserId).select("username role");
  if (!user) {
    return res.json({ message: "User not Found!!" });
  }

  const newintership = new intership({
    title,
    description,
    skillsRequired: skills,
    city,
    stipend,
    companyName: UserId,
  });
  await newintership.save();
  res.json({ message: "Intership Launch", newintership });
});

router.get("/all-intership", auth, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    return res.json({ message: "User not found!!" });
  }
  const intershipdata = await intership
    .find()
    .populate("companyName", "username")
    .select("-createdAt -updatedAt -__v")
    .sort({ createdAt: -1 });
  res.json({ intershipdata });
});

router.patch(
  "/update/:intershipID",
  auth,
  checkrole("company"),
  async (req, res) => {
    const { intershipID } = req.params;
    const userID = req.user._id;
    if (!intershipID) {
      return res.json({ message: "Not Any Select Intership to Edit" });
    }
    const intershipowner = await intership.findById(intershipID);
    const owner = await User.findById(userID);
    if (intershipowner.companyName.toString() !== owner._id.toString()) {
      return res.json({ message: "You not update this intership!!" });
    }

    const updateintership = await intership.findByIdAndUpdate(
      intershipID,
      req.body,
      { new: true }
    );
    res.json({ message: "Update Intership ", updateintership });
  }
);

router.delete(
  "/remove/:intershipID",
  auth,
  checkrole("company"),
  async (req, res) => {
    const { intershipID } = req.params;
    const userID = req.user._id;
    if (!intershipID) {
      return res.json({ message: "Not Any Select Intership to Edit" });
    }
    const intershipowner = await intership.findById(intershipID);
    if (!intershipowner) {
      return res.json({ message: "Intership not found!!" });
    }
    const owner = await User.findById(userID);
    if (intershipowner.companyName.toString() !== owner._id.toString()) {
      return res.json({ message: "You not update this intership!!" });
    }
    const deleteintership = await intership.findByIdAndDelete(intershipID, {
      new: true,
    });
    res.json({ message: "delete Intership ", deleteintership });
  }
);

//applay intership
router.post(
  "/apply/:intershipID",
  auth,
  checkrole("Student"),
  async (req, res) => {
    const { intershipID } = req.params;
    const studentID = req.user._id;

    const internship = await intership.findById(intershipID);
    if (!internship) return res.json({ message: "Internship not found!" });

    if (internship.companyName.toString() === studentID.toString()) {
      return res.json({ message: "You cannot apply to your own internship!" });
    }

    if (!internship.apply) internship.apply = [];

    const student = await User.findById(studentID).select(
      "username email resume"
    );
    if (!student.resume) {
      return res.json({
        message: "Please go to profile and upload your resume!",
      });
    }

    // Already applied check // no

    if (
      internship.apply.some((a) => a.user.toString() === studentID.toString())
    ) {
      return res.json({ message: "Already applied!" });
    }

    internship.apply.push({
      user: student._id,
      username: student.username,
      email: student.email,
      resume: student.resume,
    });

    await internship.save();
    res.json({ message: "Apply Done!", student });
  }
);

router.post(
  "/accept/:intershipID/:applyID",
  auth,
  checkrole("company"),
  async (req, res) => {
    const { intershipID, applyID } = req.params;
    const companyID = req.user._id;

    const internship = await intership.findById(intershipID);
    if (!internship) return res.json({ message: "Internship not found!" });

    if (internship.companyName.toString() !== companyID.toString()) {
      return res.json({ message: "Not your internship!" });
    }

    const applicant = internship.apply.id(applyID);
    if (!applicant) return res.json({ message: "Apply request not found!" });

    applicant.status = "accepted";
    await internship.save();

    res.json({ message: "Student accepted successfully!" });
  }
);

router.post(
  "/reject/:intershipID/:applyID",
  auth,
  checkrole("company"),
  async (req, res) => {
    const { intershipID, applyID } = req.params;
    const companyID = req.user._id;

    const internship = await intership.findById(intershipID);
    if (!internship) return res.json({ message: "Internship not found!" });

    if (internship.companyName.toString() !== companyID.toString()) {
      return res.json({ message: "Not your internship!" });
    }

    const applicant = internship.apply.id(applyID);
    if (!applicant) return res.json({ message: "Apply request not found!" });

    applicant.status = "reject";

    await internship.save();

    res.json({ message: "Student accepted successfully!" });
  }
);

//view apply intership only company
router.get(
  "/view/:intershipID",
  auth,
  checkrole("company"),
  async (req, res) => {
    const companyId = req.user._id;
    const intershipID = req.params.intershipID;
    const company = await User.findById(companyId);
    const intershipcheck = await intership.findById(intershipID);
    if (!company) {
      return res.json({ message: "Company Not Found!!" });
    }
    if (!intershipcheck) {
      return res.json({ message: "intership Not Found!!" });
    }
    if (companyId.toString() !== intershipcheck.companyName.toString()) {
      return res.json({ message: "You not Eligiable to see Application!!" });
    }
    const application = intershipcheck.apply;
    res.json({ message: "Application Data", application });
  }
);

router.get("/search", auth, async (req, res) => {
  const {query} = req.query;
  if (!query) {
    return res.json({ message: "Please provide search query" });
  }
  const result = await intership.find({
    $or: [
      { title: { $regex: query, $options: "i" } }
      
    ],
  }).select("-apply" );
  if (result.length === 0) {
    return res.json({ message: "No internships found" });
  }

  res.json({
    message: "Search Results",
    result,
  });
});

module.exports = router;
