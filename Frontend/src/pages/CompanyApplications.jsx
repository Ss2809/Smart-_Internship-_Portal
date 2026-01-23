import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CBackButton from "../components/CBackButton";
const CompanyApplications = () => {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          "https://smart-internship-backend.onrender.com/api/intership/view-applications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setInternships(res.data.internships || []);
      } catch (err) {
        toast.info("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this internship?"))
      return;

    try {
      await axios.delete(
        `https://smart-internship-backend.onrender.com/api/intership/remove/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setInternships((prev) => prev.filter((i) => i._id !== id));
      toast.success("Internship deleted");

    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <CBackButton/>
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Internship Hub 🚀
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Manage internships and applicants in one cool workspace.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : internships.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-2xl shadow text-center text-gray-600 border">
            No students have applied yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {internships.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-200 p-5 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition"
              >

                {/* TOP BAR */}
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {item.title}
                  </h3>

                  <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {item.apply.length} Applicants
                  </span>
                </div>

                {/* ACTION BAR */}
                <div className="mt-4 flex gap-3">

                  <button
                    className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700"
                    onClick={() =>
                      navigate(`/company/applications/${item._id}`)
                    }
                  >
                    View
                  </button>

                  <button
                    className="flex-1 bg-yellow-500 text-black px-3 py-2 rounded-lg hover:bg-yellow-600"
                    onClick={() =>
                      navigate(`/company/edit/${item._id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyApplications;
