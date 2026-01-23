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
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!internship) {
    return <p className="text-center mt-10">Internship not found</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <BackButton/>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow border border-gray-100">
        {/* HEADER */}
        <h2 className="text-2xl font-bold">{internship.title}</h2>
        <p className="text-gray-600 text-sm mt-1">
          {internship.companyName}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-500 text-sm">📍 Location</span>
            <p className="font-medium">{internship.city}</p>
          </div>

          <div>
            <span className="text-gray-500 text-sm">💰 Stipend</span>
            <p className="font-medium">₹ {internship.stipend}</p>
          </div>
        </div>

        {/* SKILLS */}
        <div className="mt-4">
          <h3 className="font-semibold">Skills Required</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {internship.skillsRequired.map((skill, i) => (
              <span
                key={i}
                className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="mt-4">
          <h3 className="font-semibold">Description</h3>
          <p className="text-gray-700 mt-1">{internship.description}</p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleApply}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-indigo-700"
          >
            Apply Now
          </button>

          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-black px-5 py-2.5 rounded-lg"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetails;
