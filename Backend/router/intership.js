import express from "express";

import auth from "../middleware/auth.js";
import checkrole from "../middleware/checkRole.js";

import User from "../model/user.js";
import intership from "../model/intership.js";

import sendEmail from "../config/SES.js";

import {
  creatintership,
  updateIntership,
  removeintership,
  applyintership,
  accptsintership,
  rejectintership,
  view,
  search,
  allintership
} from "../controllers/intership.js";

const router = express.Router();






router.post("/creatintership", auth, checkrole("company"), async (req, res) => {
  try {
    const UserId = req.user._id;
    const { title, description, skillsRequired, city, stipend } = req.body;

    if (!title || !skillsRequired || skillsRequired.length === 0) {
      return res.status(400).json({
        message: "Title and skills are required!!",
      });
    }

    const user = await User.findById(UserId).select("username role");
    if (!user) {
      return res.status(404).json({ message: "User not Found!!" });
    }

    let skillsArray;
    if (Array.isArray(skillsRequired)) {
      skillsArray = skillsRequired;
    } else {
      skillsArray = skillsRequired
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const newintership = new intership({
      title,
      description,
      skillsRequired: skillsArray,
      city,
      stipend,
      companyName: req.user._id,
    });

    await newintership.save();

    res.json({
      message: "Internship Launched",
      newintership,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/all-intership", allintership);

router.patch(
  "/update/:intershipID",
  auth,
  checkrole("company"),
  updateIntership,
);


router.delete(
  "/remove/:intershipID",
  auth,
  checkrole("company"),
  removeintership,
);

router.post("/apply/:intershipID", auth, checkrole("Student"), applyintership);

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
    const to = applicant.email;
    const subject = "Application Accepted – Next Steps";
    const text = `Dear Candidate,
  
  Congratulations! Your application for ${internship.title} has been accepted.
  
  You have been shortlisted for the interview round. We will share the interview details (date, time, and mode) with you shortly.
  
  Please check your email regularly for further updates.
  
  Best regards,
  ${process.env.COMPANY_NAME || "SP_Demo"}`;

    await sendEmail(to, subject, text);

    await internship.save();

    res.json({ message: "Student accepted successfully & email sent!" });
  },
);

router.post(
  "/reject/:intershipID/:applyID",
  auth,
  checkrole("company"),
  rejectintership,
);

router.get("/view/:intershipID", auth, checkrole("company"), view);
router.get(
  "/view-applications",
  auth,
  checkrole("company"),
  async (req, res) => {
    try {
      const companyId = req.user._id;

      const internships = await intership
        .find({ companyName: companyId })
        .select("title city stipend apply");

      if (!internships.length) {
        return res.json({ message: "No internships found", internships: [] });
      }

      res.json({
        message: "Applications fetched",
        internships: internships, // <-- NO FILTER HERE
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);


router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json({ internships: [] });
    }

    const results = await intership.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { city: { $regex: q, $options: "i" } },
        { skillsRequired: { $regex: q, $options: "i" } },
      ],
    });

    res.json({ internships: results });
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
});


router.get("/:intershipID", auth, checkrole("company"), async (req, res) => {
  try {
    const { intershipID } = req.params;
  
    const singleInternship = await intership.findById(intershipID);

    if (!singleInternship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    res.json({ intership: singleInternship });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/userside/:ID", async (req, res) => {
  try {
    const { ID } = req.params;
    const singleInternship = await intership.findById(ID);

    if (!singleInternship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    res.json({ intership: singleInternship });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});








export default router;
  