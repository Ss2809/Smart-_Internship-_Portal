import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import { toast } from "react-toastify";
import axios from "axios";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState({
    username: "",
    skills: "",
    city: "",
    college: "",
    graduationYear: "",
    linkedin: "",
    github: "",
  });

  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(
          "https://smart-internship-backend.onrender.com/api/user/profile-meter",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setProgress(res.data.percentage);
      } catch (err) {
        console.error("Progress fetch failed", err);
      }
    };

    fetchProgress();
  }, []);

  // ---------- FETCH PROFILE ----------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("https://smart-internship-backend.onrender.com/api/user/me", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const user = res.data.user;

        setForm({
          username: user.username || "",
          skills: user.skills?.join(", ") || "",
          city: user.city || "",
          college: user.college || "",
          graduationYear: user.graduationYear || "",
          linkedin: user.linkedin || "",
          github: user.github || "",
        });

        setResumeUrl(user.resume || null);
      } catch (error) {
        console.error("Profile fetch failed:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  // ---------- UPDATE PROFILE ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("skills", form.skills);
      if (form.city) formData.append("city", form.city);
      if (form.college) formData.append("college", form.college);
      if (form.graduationYear)
        formData.append("graduationYear", form.graduationYear);
      if (form.linkedin) formData.append("linkedin", form.linkedin);
      if (form.github) formData.append("github", form.github);

      if (resume) {
        formData.append("resume", resume);
      } else if (!resumeUrl) {
        toast.warning("Please upload your resume");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        "https://smart-internship-backend.onrender.com/api/user/profile",
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success("Profile Updated Successfully");
      setResumeUrl(res.data.user.resume);
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="premium-page flex items-center justify-center">
        <h2 className="text-slate-600">Loading Profile...</h2>
      </div>
    );
  }

  return (
    <div className="premium-page">
      <div className="premium-container">
        <div className="premium-card">
        <BackButton />

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="premium-subtitle uppercase tracking-[0.2em]">
            Student Workspace
          </p>
          <h2 className="premium-title mt-2">Student Profile</h2>
        </div>

  <svg width="70" height="70">
    <circle
      cx="35"
      cy="35"
      r="30"
      stroke="#e2e8f0"
      strokeWidth="6"
      fill="none"
    />
    <circle
      cx="35"
      cy="35"
      r="30"
      stroke="#4f46e5"
      strokeWidth="6"
      fill="none"
      strokeDasharray={2 * Math.PI * 30}
      strokeDashoffset={
        2 * Math.PI * 30 -
        (progress / 100) * (2 * Math.PI * 30)
      }
      strokeLinecap="round"
    />
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dy=".3em"
      fontSize="12"
      fontWeight="bold"
    >
      {progress}%
    </text>
  </svg>
</div>


        {resumeUrl && (
          <p className="mb-4 text-sm text-slate-600">
            Existing Resume:{" "}
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 font-semibold"
            >
              View Resume
            </a>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="username"
              required
              className="premium-input"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Skills *
            </label>
            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="React, Node, MongoDB"
              required
              className="premium-input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              City (Optional)
            </label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Pune"
              className="premium-input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              College
            </label>
            <input
              type="text"
              name="college"
              value={form.college}
              onChange={handleChange}
              placeholder="Your college name"
              className="premium-input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Graduation Year
            </label>
            <input
              type="text"
              name="graduationYear"
              value={form.graduationYear}
              onChange={handleChange}
              placeholder="2025"
              className="premium-input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              LinkedIn
            </label>
            <input
              type="url"
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/yourprofile"
              className="premium-input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              GitHub
            </label>
            <input
              type="url"
              name="github"
              value={form.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
              className="premium-input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Upload Resume (PDF) <span className="text-red-500">*</span>
            </label>

            <div className="mt-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4 text-center">
              <input
                type="file"
                name="resume"
                accept="application/pdf, image/jpeg, image/png, image/jpg"
                onChange={handleFileChange}
                required
                className="w-full cursor-pointer text-sm text-slate-600"
              />

              {resume && (
                <p className="text-sm text-emerald-600 mt-2">
                  Selected: {resume.name}
                </p>
              )}

              {!resume && resumeUrl && (
                <p className="text-sm text-indigo-600 mt-2">
                  Existing resume will be replaced if you upload a new one.
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="premium-button"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
