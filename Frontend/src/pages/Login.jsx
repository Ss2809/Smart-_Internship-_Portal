import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://smart-internship-backend.onrender.com/api/user/login",
        form,
      );
      navigate("/");
     toast.success("Login successful! 🎉");

      // Store access token
      localStorage.setItem("token", res.data.accestoken);
      localStorage.setItem("role", res.data.user.role); // 🔥 store role

      if (res.data.user.role === "company") {
        navigate("/company");
      } else {
        navigate("/");
      }
      console.log("User:", res.data.user);
    } catch (error) {
      if (error.response?.status === 429) {
       toast.error(error.response?.data?.message );

// 👉 "Too many login attempts..."
      } else {
      toast.error(error.response?.data?.message || "Login failed");


      }
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
          <h2 className="premium-title mt-2">Welcome back</h2>
          <p className="premium-subtitle mt-2">
          Welcome back! Please sign in.
        </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
            className="premium-input"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          <Link to="/forgot-password" className="text-indigo-600 font-semibold">
            Forgot your password?
          </Link>
        </p>

        <p className="text-center text-sm text-slate-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-600 font-semibold">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
