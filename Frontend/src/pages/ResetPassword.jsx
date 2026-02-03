import { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `https://smart-internship-backend.onrender.com/api/user/resetpassword/${token}`,
        { password: form.password },
      );
      toast.success(res.data.message || "Password updated successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reset your password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-page flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-100">
      <div className="premium-card w-full max-w-md space-y-6">
        <div className="text-center">
          <p className="premium-subtitle uppercase tracking-[0.2em]">
            Smart Internship Portal
          </p>
          <h2 className="premium-title mt-2">Reset your password</h2>
          <p className="premium-subtitle mt-2">
            Set a new password to regain access to your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            name="password"
            placeholder="New password"
            value={form.password}
            onChange={handleChange}
            required
            className="premium-input"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="premium-input"
          />

          <button
            type="submit"
            disabled={loading}
            className="premium-button w-full"
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Changed your mind?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold">
            Return to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
