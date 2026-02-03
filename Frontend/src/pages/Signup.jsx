import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

const SignupWithOTP = () => {
  const [step, setStep] = useState(1); // 1 = signup, 2 = OTP
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    otp: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ---- STEP 1: Send OTP ----
  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("https://smart-internship-backend.onrender.com/api/user/signup", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
       
      toast.success(res.data.message);

      setStep(2); // move to OTP screen
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // ---- STEP 2: Verify OTP ----
  const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://smart-internship-backend.onrender.com/api/user/verify-otp",
        form,
      );

      toast.success(res.data.message);

      // Save access token
      localStorage.setItem("token", res.data.accestoken);
      navigate("/");
     
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
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
          <h2 className="premium-title mt-2">
            {step === 1 ? "Create Account" : "Verify OTP"}
          </h2>
        </div>

        {step === 1 ? (
          // ---------- SIGNUP FORM ----------
          <form onSubmit={sendOTP} className="space-y-4">

              <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="premium-input"
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              className="premium-input"
            />

          

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="premium-input"
            />

            <button
              type="submit"
              disabled={loading}
              className="premium-button w-full"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          // ---------- OTP FORM ----------
          <form onSubmit={verifyOTP} className="space-y-4">
            <p className="text-sm text-slate-600 text-center">
              Enter the 6-digit OTP sent to <b>{form.email}</b>
            </p>

            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange}
              required
              className="premium-input text-center tracking-widest"
            />

            <button
              type="submit"
              disabled={loading}
              
              className="premium-button w-full"
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-indigo-600 text-sm font-semibold"
            >
              ← Back to Signup
            </button>
          </form>
        )}
        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupWithOTP;
