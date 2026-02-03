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
        console.error(err);
        toast.info("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token]);

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
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="premium-page">
      <div className="premium-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="premium-subtitle uppercase tracking-[0.2em]">
              Company Workspace
            </p>
            <h1 className="premium-title mt-2">Internship Hub 🚀</h1>
            <p className="premium-subtitle mt-2">
              Manage internships and applicants in one elegant workspace.
            </p>
          </div>
          <CBackButton/>
        </div>

        {loading ? (
          <div className="text-center text-slate-500">Loading...</div>
        ) : internships.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600 shadow-sm">
            No students have applied yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {internships.map((item) => (
              <div
                key={item._id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* TOP BAR */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>

                  <span className="premium-chip">
                    {item.apply.length} Applicants
                  </span>
                </div>

                {/* ACTION BAR */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    className="premium-button-secondary flex-1"
                    onClick={() =>
                      navigate(`/company/applications/${item._id}`)
                    }
                  >
                    View
                  </button>

                  <button
                    className="flex-1 rounded-full border border-amber-200 bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:border-amber-300"
                    onClick={() =>
                      navigate(`/company/edit/${item._id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="flex-1 rounded-full border border-rose-200 bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-300"
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
