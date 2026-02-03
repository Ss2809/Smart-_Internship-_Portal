import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import axios from "axios";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const res = await axios.get(
          "https://smart-internship-backend.onrender.com/api/user/my-applications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

//console.log("My Applications API:", res.data);

        setApplications(res.data.myinternships || []);
        setUserId(res.data.userId); // store logged-in user id
      } catch (err) {
        console.error("Failed to fetch my applications", err.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchMyApplications();
  }, []);

  return (
    <div className="premium-page">
      <div className="premium-container">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="premium-subtitle uppercase tracking-[0.2em]">
              Student Workspace
            </p>
            <h1 className="premium-title mt-2">My Applications</h1>
          </div>
          <BackButton />
        </div>

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : applications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-slate-600">
            You have not applied to any internship yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {applications.map((intern) => {
              // Find THIS student's application inside apply[]
              const myApply = intern.apply.find(
                (a) => a.user === userId
              );

              return (
                <div
                  key={intern._id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-slate-900">
                    {intern.title}
                  </h3>

                  <p className="text-sm text-slate-600">
                    Company:{" "}
                    {intern.companyName?.username ||
                      intern.companyName?.companyName ||
                      "Unknown"}
                  </p>

                  <p className="text-sm text-slate-600">
                    City: {intern.city || "Not specified"}
                  </p>
                  <p className="text-sm text-slate-600">
                    Stipend: ₹{intern.stipend || "N/A"}
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    Status:{" "}
                    <span className="font-semibold capitalize text-slate-900">
                      {myApply?.status || "pending"}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
