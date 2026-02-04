import User from "../model/user.js";
import intership from "../model/intership.js";
import { sentsmtpemail } from "../config/Smpt.js";
import redis from "../config/redis.js";

/* ================= CREATE ================= */

const creatintership = async (req, res) => {
  try {
    const UserId = req.user._id;
    const { title, description, skills, city, stipend } = req.body;

    if (!title || !skills) {
      return res.status(400).json({ message: "Title and skills are required!!" });
    }

    const user = await User.findById(UserId).select("username role");
    if (!user) return res.status(404).json({ message: "User not Found!!" });

    if (user.role !== "company") {
      return res.status(403).json({ message: "Only companies can create internships" });
    }

    const skillsArray = skills.split(",").map(s => s.trim()).filter(Boolean);

    const newintership = new intership({
      title,
      description,
      skillsRequired: skillsArray,
      city,
      stipend,
      companyId: UserId,
      companyName: user.username,
    });

    await newintership.save();

    
    await redis.del("all_interships");

    res.json({ message: "Internship Launched", newintership });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ALL (CACHED) ================= */

const allintership = async (req, res) => {
  try {
    const cached = await redis.get("all_interships");

    if (cached) {
     
      return res.json({ intershipdata: JSON.parse(cached) });
    }

    const intershipdata = await intership
      .find()
      .populate("companyName", "username companyName email")
      .select("-createdAt -updatedAt -__v")
      .sort({ createdAt: -1 });

    await redis.setEx("all_interships", 300, JSON.stringify(intershipdata));

    
    res.json({ intershipdata });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/* ================= UPDATE ================= */

const updateIntership = async (req, res) => {
  const { intershipID } = req.params;
  const updateintership = await intership.findByIdAndUpdate(intershipID, req.body, { new: true });

  await redis.del("all_interships");
  res.json({ message: "Update Intership", updateintership });
};

/* ================= DELETE ================= */

const removeintership = async (req, res) => {
  const { intershipID } = req.params;
  const deleteintership = await intership.findByIdAndDelete(intershipID);

  await redis.del("all_interships");
  res.json({ message: "Delete Intership", deleteintership });
};

/* ================= APPLY ================= */

const applyintership = async (req, res) => {
  const { intershipID } = req.params;
  const studentID = req.user._id;

  const internship = await intership.findById(intershipID);
  if (!internship) return res.json({ message: "Internship not found!" });

  const student = await User.findById(studentID).select("username email resume");
  if (!student.resume) return res.json({ message: "Upload resume first!" });

  if (internship.apply?.some(a => a.user.toString() === studentID.toString())) {
    return res.json({ message: "Already applied!" });
  }

  internship.apply.push({
    user: student._id,
    username: student.username,
    email: student.email,
    resume: student.resume,
  });

  await internship.save();
  res.json({ message: "Applied successfully!" });
};

/* ================= ACCEPT ================= */

const accptsintership = async (req, res) => {
  const { intershipID, applyID } = req.params;
  const internship = await intership.findById(intershipID);

  const applicant = internship.apply.id(applyID);
  applicant.status = "accepted";

  const subject = "Application Accepted";
  const text = `Congratulations! You are selected for ${internship.title}.`;

  await sentsmtpemail(applicant.email, subject, text);
  await internship.save();

  res.json({ message: "Student accepted & email sent" });
};

/* ================= REJECT ================= */

const rejectintership = async (req, res) => {
  const { intershipID, applyID } = req.params;
  const internship = await intership.findById(intershipID);

  const applicant = internship.apply.id(applyID);
  applicant.status = "rejected";

  await internship.save();
  res.json({ message: "Student rejected" });
};

/* ================= VIEW ================= */

const view = async (req, res) => {
  const intershipcheck = await intership.findById(req.params.intershipID);
  res.json({ application: intershipcheck.apply });
};

/* ================= SEARCH ================= */

const search = async (req, res) => {
  const { q } = req.query;

  const results = await intership.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { companyName: { $regex: q, $options: "i" } },
      { city: { $regex: q, $options: "i" } },
    ],
  });

  res.json({ internships: results });
};

export {
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
