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
    <div className="min-h-screen bg-gray-100 p-6">
      <CBackButton/>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Create Internship</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Web Development Intern"
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the internship..."
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold">
              Required Skills * (comma separated)
            </label>
            <input
              type="text"
              name="skillsRequired"
              value={form.skillsRequired}
              onChange={handleChange}
              placeholder="React, Node, MongoDB"
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold">City</label>
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
            <label className="block font-semibold">Stipend</label>
            <input
              type="text"
              name="stipend"
              value={form.stipend}
              onChange={handleChange}
              placeholder="₹10,000 / month or Unpaid"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Creating..." : "Create Internship"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateInternship;
