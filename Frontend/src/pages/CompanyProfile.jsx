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

      await axios.post(
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
      <div className="premium-page flex items-center justify-center">
        <h2 className="text-slate-600">Loading Company Profile...</h2>
      </div>
    );
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
            <h2 className="premium-title mt-2">Company Profile</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Email (Read-only)
              </label>
              <input
                type="email"
                value={form.email}
                disabled
                className="premium-input bg-slate-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
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
                className="premium-input"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                LinkedIn (Optional)
              </label>
              <input
                type="url"
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/company/yourcompany"
                className="premium-input"
              />
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

export default CompanyProfile;
