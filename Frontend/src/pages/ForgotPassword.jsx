import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://smart-internship-backend.onrender.com/api/user/reset-password",
        { email },
      );
      toast.success(res.data.message || "Reset email sent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset email");
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
          <h2 className="premium-title mt-2">Forgot your password?</h2>
          <p className="premium-subtitle mt-2">
            Enter your email and we will send a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="premium-input"
          />

          <button
            type="submit"
            disabled={loading}
            className="premium-button w-full"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Remembered your password?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
