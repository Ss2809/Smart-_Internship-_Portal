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
        }
      );
      setProgress(res.data.percentage);
    } catch (err) {
      console.error("Progress fetch failed");
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
      <div className="min-h-screen flex items-center justify-center">
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        <BackButton />


      
      <div className="flex items-center justify-between mb-4">
   <h2 className="text-2xl font-bold mb-4">Student Profile</h2>

  <svg width="70" height="70">
    <circle
      cx="35"
      cy="35"
      r="30"
      stroke="#e5e7eb"
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
          <p className="mb-3">
            Existing Resume:{" "}
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Resume
            </a>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Username *</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="username"
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-semibold">Skills *</label>
            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="React, Node, MongoDB"
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold">City (Optional)</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Pune"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold">College</label>
            <input
              type="text"
              name="college"
              value={form.college}
              onChange={handleChange}
              placeholder="Your college name"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold">Graduation Year</label>
            <input
              type="text"
              name="graduationYear"
              value={form.graduationYear}
              onChange={handleChange}
              placeholder="2025"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold">LinkedIn</label>
            <input
              type="url"
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/yourprofile"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold">GitHub</label>
            <input
              type="url"
              name="github"
              value={form.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold">
              Upload Resume (PDF) <span className="text-red-500">*</span>
            </label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-2">
              <input
                type="file"
                name="resume"
                accept="application/pdf, image/jpeg, image/png, image/jpg"
                onChange={handleFileChange}
                required
                className="w-full cursor-pointer"
              />

              {resume && (
                <p className="text-sm text-green-600 mt-2">
                  Selected: {resume.name}
                </p>
              )}

              {!resume && resumeUrl && (
                <p className="text-sm text-blue-600 mt-2">
                  Existing resume will be replaced if you upload a new one.
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
