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
        { headers: { Authorization: `Bearer ${token}` } }
      );

     // console.log("Fetched data:", res.data); // DEBUG LINE

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
}, [intershipID]);


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
      toast.error("Update failed");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <CBackButton/>
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow border border-gray-100">

        <h2 className="text-2xl font-bold mb-4">Edit Internship</h2>
        <p className="text-gray-600 text-sm mb-6">
          Update internship details below.
        </p>

        <div className="space-y-4">

          {/* TITLE */}
          <div>
            <label className="text-sm font-medium text-gray-700">Role</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* CITY */}
          <div>
            <label className="text-sm font-medium text-gray-700">City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* STIPEND */}
          <div>
            <label className="text-sm font-medium text-gray-700">Stipend (₹)</label>
            <input
              type="text"
              name="stipend"
              value={form.stipend}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* SKILLS REQUIRED (TAG STYLE) */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Skills Required
            </label>

            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill (e.g. React)"
                className="flex-1 px-3 py-2 border rounded-lg outline-none"
              />
              <button
                type="button"
                onClick={addSkill}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {form.skillsRequired.map((skill, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-red-600"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows="4"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => navigate("/company/applications")}
              className="bg-gray-300 text-black px-5 py-2.5 rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-indigo-700"
            >
              Update Internship
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInternship;
