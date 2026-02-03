import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BackButton from "../components/BackButton";

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);

  const hasRedirected = useRef(false); // ✅ ADD THIS

  // 🔹 Fetch Internship
 useEffect(() => {
  if (!token) {
    if (!hasRedirected.current) {
      hasRedirected.current = true;
      toast.warning("Please login to view internship details");
      navigate("/login");
    }
    return;
  }

  const fetchInternship = async () => {
    try {
      const res = await axios.get(
        `https://smart-internship-backend.onrender.com/api/intership/userside/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInternship(res.data.intership);
    } catch (err) {
      if (err.response?.status === 401) {
        if (!hasRedirected.current) {
          hasRedirected.current = true;
          toast.error("Session expired. Please login again.");
          navigate("/login");
        }
      } else {
        toast.error("Failed to load internship");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchInternship();
}, [id, token, navigate]);


  // 🔹 Apply Handler
  const handleApply = async () => {
    if (!token) {
      toast.warning("Please login to apply for this internship");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `https://smart-internship-backend.onrender.com/api/intership/apply/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Applied Successfully!");
      navigate("/my-applications");
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error("Application failed");
      }
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-slate-500">Loading...</p>;
  }

  if (!internship) {
    return <p className="text-center mt-10 text-slate-500">Internship not found</p>;
  }

  return (
    <div className="premium-page">
      <div className="premium-container">
        <div className="premium-card">
          <BackButton/>
          {/* HEADER */}
          <div className="mt-4">
            <p className="premium-subtitle uppercase tracking-[0.2em]">
              Internship Details
            </p>
            <h2 className="premium-title mt-2">{internship.title}</h2>
            <p className="text-sm text-slate-500 mt-1">
              {internship.companyName}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <span className="text-slate-500 text-sm">📍 Location</span>
              <p className="font-semibold text-slate-900">{internship.city}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <span className="text-slate-500 text-sm">💰 Stipend</span>
              <p className="font-semibold text-slate-900">
                ₹ {internship.stipend}
              </p>
            </div>
          </div>

          {/* SKILLS */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-700">
              Skills Required
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {internship.skillsRequired.map((skill, i) => (
                <span
                  key={i}
                  className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-700">
              Description
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              {internship.description}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={handleApply} className="premium-button">
              Apply Now
            </button>

            <button
              onClick={() => navigate(-1)}
              className="premium-button-secondary"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetails;
