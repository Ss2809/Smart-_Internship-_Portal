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
        toast.error("Failed to load applicants");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [intershipID]);

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
      toast.error("Error rejecting applicant");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <CBackButton />
      <h1 className="text-2xl font-bold mb-4">Applicant List</h1>

      {loading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <p>No students have applied yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white p-4 rounded-lg shadow border"
            >
              <h3 className="font-bold">{app.username}</h3>
              <p>Email: {app.email}</p>
              <p>
                Resume:{" "}
                <a
                  href={app.resume}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  View Resume
                </a>
              </p>

              <p className="mt-2">
                Status:{" "}
                <span className="font-semibold capitalize">
                  {app.status}
                </span>
              </p>

              {/* Show buttons only if pending */}
              {app.status === "pending" && (
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleAccept(app._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleReject(app._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded"
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
  );
};

export default CompanyApplicantView;
