const User = require("../model/user");
const intership = require("../model/intership");
const {sentsmtpemail} = require("../config/Smpt");
const creatintership =  async (req, res) => {
  try {
    const UserId = req.user._id;
    const { title, description, skills, city, stipend } = req.body;

    if (!title || !skills) {
      return res.status(400).json({
        message: "Title and skills are required!!",
      });
    }

    const user = await User.findById(UserId).select("username role");
    if (!user) {
      return res.status(404).json({ message: "User not Found!!" });
    }

    // ❌ Prevent students from creating internships
    if (user.role !== "company") {
      return res.status(403).json({
        message: "Only companies can create internships",
      });
    }

    // ✅ Convert skills string → array
    const skillsArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const newintership = new intership({
      title,
      description,
      skillsRequired: skillsArray,
      city,
      stipend,
      companyId: UserId,        // relation
      companyName: user.username, // display name
    });

    await newintership.save();

    res.json({
      message: "Internship Launched",
      newintership,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const allintership = async (req, res) => {
  const intershipdata = await intership
    .find()
    .populate("companyName", "username companyName email")
    .select("-createdAt -updatedAt -__v")
    .sort({ createdAt: -1 });

  res.json({ intershipdata });
};


const updateIntership = async (req, res) => {
  const { intershipID } = req.params;
  const userID = req.user._id;
  if (!intershipID) {
    return res.json({ message: "Not Any Select Intership to Edit" });
  }
  const intershipowner = await intership.findById(intershipID);
  const owner = await User.findById(userID);
  // if (intershipowner.companyName.toString() !== owner._id.toString()) {
  //   return res.json({ message: "You not update this intership!!" });
  // }

  const updateintership = await intership.findByIdAndUpdate(
    intershipID,
    req.body,
    { new: true },
  );
  res.json({ message: "Update Intership ", updateintership });
};

const removeintership = async (req, res) => {
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
};
const applyintership = async (req, res) => {
  const { intershipID } = req.params;
  const studentID = req.user._id;

  const internship = await intership.findById(intershipID);
  if (!internship) return res.json({ message: "Internship not found!" });

  if (internship.companyName.toString() === studentID.toString()) {
    return res.json({ message: "You cannot apply to your own internship!" });
  }

  if (!internship.apply) internship.apply = [];

  const student = await User.findById(studentID).select(
    "username email resume",
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
};
const accptsintership = async (req, res) => {
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

  // ✅ FIX — get email from applicant, NOT internship.apply
  const to = applicant.email;
  console.log("Sending email to:", applicant.email);

  const subject = "Application Accepted – Next Steps";
  const text = `Dear Candidate,

Congratulations! Your application for ${internship.title} has been accepted.

You have been shortlisted for the interview round. We will share the interview details (date, time, and mode) with you shortly.

Please check your email regularly for further updates.

Best regards,
${process.env.COMPANY_NAME || "SP_Demo"}`;

  await sentsmtpemail(to, subject, text);

  await internship.save();

  res.json({ message: "Student accepted successfully & email sent!" });
};
const rejectintership = async (req, res) => {
  try {
    const { intershipID, applyID } = req.params;
    const companyID = req.user._id;

    const internship = await intership.findById(intershipID);
    if (!internship) {
      return res.json({ message: "Internship not found!" });
    }

    if (internship.companyName.toString() !== companyID.toString()) {
      return res.json({ message: "Not your internship!" });
    }

    const applicant = internship.apply.id(applyID);
    if (!applicant) {
      return res.json({ message: "Apply request not found!" });
    }

    // ✅ FIXED STATUS
    applicant.status = "rejected";

    await internship.save();
    const to = applicant.email;

const subject = "Application Status Update";
const text = `Dear Candidate,

Thank you for your interest in ${internship.title}.

After careful review, we regret to inform you that your application has not been selected for the next round.

We encourage you to apply again in the future.

Best regards,
${process.env.COMPANY_NAME || "SP_Demo"}`;

await sentsmtpemail(to, subject, text);


    res.json({ message: "Student rejected successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


const view = async (req, res) => {
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
};


const search = async (req, res) => {
  try {
    const { q } = req.query; 
      console.log({q});
    if (!q) {
      return res.json({ internships: [] });
    }

    const results = await intership.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { companyName: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
      ],
    });
    console.log({results})
    res.json({ internships: results });
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
};


module.exports = {
  creatintership,
  allintership,
  updateIntership,
  removeintership,
  applyintership,
  accptsintership,
  rejectintership,
  view,
  search,
};
