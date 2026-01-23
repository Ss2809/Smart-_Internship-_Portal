import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CBackButton from "../components/CBackButton";
const CompanyProfile = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState({
    email: "",
    companyName: "",
    city: "",
    linkedin: "",
  });

  // ---------- FETCH COMPANY PROFILE ----------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "https://smart-internship-backend.onrender.com/api/user/mecompany",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const user = res.data.user;

        setForm({
          email: user.email || "",
          companyName: user.companyName || "",
          city: user.city || "",
          linkedin: user.linkedin || "",
        });
      } catch (error) {
        console.error("Profile fetch failed:", error.response?.data);
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---------- UPDATE COMPANY PROFILE ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("companyName", form.companyName);

      if (form.city) formData.append("city", form.city);
      if (form.linkedin) formData.append("linkedin", form.linkedin);

      const res = await axios.post(
        "http://localhost:3000/api/user/profile",
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Company Profile Updated Successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2>Loading Company Profile...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <CBackButton/>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Company Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Email (Read-only)</label>
            <input
              type="email"
              value={form.email}
              disabled
              className="w-full px-3 py-2 border rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-semibold">Company Name *</label>
            <input
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
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
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold">LinkedIn (Optional)</label>
            <input
              type="url"
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/company/yourcompany"
              className="w-full px-3 py-2 border rounded-lg"
            />
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

export default CompanyProfile;
