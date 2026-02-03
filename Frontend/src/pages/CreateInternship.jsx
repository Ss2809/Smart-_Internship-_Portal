import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CBackButton from "../components/CBackButton";
const CreateInternship = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    skillsRequired: "",
    city: "",
    stipend: "",
  });

 const handleChange = (e) => {
  setForm(prev => ({
    ...prev,
    [e.target.name]: e.target.value || ""
  }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://smart-internship-backend.onrender.com/api/intership/creatintership",
        {
          title: form.title,
          description: form.description,
          skillsRequired: form.skillsRequired,      // matches your backend
          city: form.city,
          stipend: form.stipend,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.info(res.data.message || "Internship Created");
      navigate("/company"); // go back to dashboard
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create internship");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-page">
      <div className="premium-container">
        <div className="premium-card">
          <CBackButton/>
          <div className="mb-6">
            <p className="premium-subtitle uppercase tracking-[0.2em]">
              Company Workspace
            </p>
            <h2 className="premium-title mt-2">Create Internship</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Web Development Intern"
                required
                className="premium-input"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the internship..."
                className="premium-input min-h-[120px]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Required Skills * (comma separated)
              </label>
              <input
                type="text"
                name="skillsRequired"
                value={form.skillsRequired}
                onChange={handleChange}
                placeholder="React, Node, MongoDB"
                required
                className="premium-input"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                City
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
                Stipend
              </label>
              <input
                type="text"
                name="stipend"
                value={form.stipend}
                onChange={handleChange}
                placeholder="₹10,000 / month or Unpaid"
                className="premium-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="premium-button"
            >
              {loading ? "Creating..." : "Create Internship"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateInternship;
