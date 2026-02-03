import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CBackButton from "../components/CBackButton";
const EditInternship = () => {
  const { intershipID } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    description: "",
    skillsRequired: [],
    city: "",
    stipend: "",
    companyName: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const res = await axios.get(
          `https://smart-internship-backend.onrender.com/api/intership/${intershipID}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const data = res.data.intership;

        setForm({
          title: data.title || "",
          description: data.description || "",
          skillsRequired: data.skillsRequired || [],
          city: data.city || "",
          stipend: data.stipend || "",
          companyName: data.companyName || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load internship");
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [intershipID, token]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setForm({
        ...form,
        skillsRequired: [...form.skillsRequired, skillInput],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setForm({
      ...form,
      skillsRequired: form.skillsRequired.filter((s) => s !== skill),
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(
        `https://smart-internship-backend.onrender.com/api/intership/update/${intershipID}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Internship updated successfully");
      navigate("/company/applications");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-slate-500">Loading...</p>;
  }

  return (
    <div className="premium-page">
      <div className="premium-container">
        <div className="premium-card">
          <CBackButton/>

          <div className="mb-6">
            <p className="premium-subtitle uppercase tracking-[0.2em]">
              Company Workspace
            </p>
            <h2 className="premium-title mt-2">Edit Internship</h2>
            <p className="premium-subtitle mt-2">
              Update internship details below.
            </p>
          </div>

          <div className="space-y-4">
            {/* TITLE */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Role
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="premium-input mt-1"
              />
            </div>

            {/* CITY */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                City
              </label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className="premium-input mt-1"
              />
            </div>

            {/* STIPEND */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Stipend (₹)
              </label>
              <input
                type="text"
                name="stipend"
                value={form.stipend}
                onChange={handleChange}
                className="premium-input mt-1"
              />
            </div>

            {/* SKILLS REQUIRED (TAG STYLE) */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Skills Required
              </label>

              <div className="mt-2 flex flex-wrap gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a skill (e.g. React)"
                  className="premium-input flex-1"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="premium-button"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {form.skillsRequired.map((skill, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="text-rose-600"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Description
              </label>
              <textarea
                rows="4"
                name="description"
                value={form.description}
                onChange={handleChange}
                className="premium-input mt-1 min-h-[120px]"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex flex-wrap justify-end gap-3 mt-4">
              <button
                onClick={() => navigate("/company/applications")}
                className="premium-button-secondary"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="premium-button"
              >
                Update Internship
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInternship;
