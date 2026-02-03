import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CBackButton from "../components/CBackButton";
import { toast } from "react-toastify";
const CompanyApplicantView = () => {
  const { intershipID } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(
          `https://smart-internship-backend.onrender.com/api/intership/view/${intershipID}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setApplications(res.data.application || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load applicants");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [intershipID, token]);

  // ✅ Accept Applicant
  const handleAccept = async (applyID) => {
    try {
      const res = await axios.post(
        `https://smart-internship-backend.onrender.com/api/intership/accept/${intershipID}/${applyID}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.info(res.data.message);

      // Update UI instantly
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applyID ? { ...app, status: "accepted" } : app
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Error accepting applicant");
    }
  };

  // ✅ Reject Applicant
  const handleReject = async (applyID) => {
    try {
      const res = await axios.post(
        `https://smart-internship-backend.onrender.com/api/intership/reject/${intershipID}/${applyID}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.error(res.data.message);

      // Update UI instantly
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applyID ? { ...app, status: "rejected" } : app
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Error rejecting applicant");
    }
  };

  return (
    <div className="premium-page">
      <div className="premium-container">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="premium-subtitle uppercase tracking-[0.2em]">
              Company Workspace
            </p>
            <h1 className="premium-title mt-2">Applicant List</h1>
          </div>
          <CBackButton />
        </div>

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : applications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-slate-600">
            No students have applied yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {applications.map((app) => (
              <div
                key={app._id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {app.username}
                </h3>
                <p className="text-sm text-slate-600">Email: {app.email}</p>
                <p className="text-sm text-slate-600">
                  Resume:{" "}
                  <a
                    href={app.resume}
                    target="_blank"
                    className="text-indigo-600 font-semibold"
                  >
                    View Resume
                  </a>
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  Status:{" "}
                  <span className="font-semibold capitalize text-slate-900">
                    {app.status}
                  </span>
                </p>

                {/* Show buttons only if pending */}
                {app.status === "pending" && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleAccept(app._id)}
                      className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleReject(app._id)}
                      className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyApplicantView;
