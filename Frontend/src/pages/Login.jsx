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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <p className="text-gray-500 text-center mb-6">
          Welcome back! Please sign in.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
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
