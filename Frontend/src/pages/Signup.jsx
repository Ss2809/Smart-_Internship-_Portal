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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold text-center">
          {step === 1 ? "Create Account" : "Verify OTP"}
        </h2>

        {step === 1 ? (
          // ---------- SIGNUP FORM ----------
          <form onSubmit={sendOTP} className="space-y-4 mt-4">

              <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />

          

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          // ---------- OTP FORM ----------
          <form onSubmit={verifyOTP} className="space-y-4 mt-4">
            <p className="text-sm text-gray-600 text-center">
              Enter the 6-digit OTP sent to <b>{form.email}</b>
            </p>

            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg text-center tracking-widest"
            />

            <button
              type="submit"
              disabled={loading}
              
              className="w-full bg-green-600 text-white py-2 rounded-lg"
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-indigo-600 text-sm"
            >
              ← Back to Signup
            </button>
          </form>
        )}
        <p className="text-center text-sm mt-4">
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
