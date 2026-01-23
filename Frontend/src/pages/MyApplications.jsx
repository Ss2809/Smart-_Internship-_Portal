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
    <div className="min-h-screen bg-gray-100 p-6">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>

      {loading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <p>You have not applied to any internship yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applications.map((intern) => {
            // Find THIS student's application inside apply[]
            const myApply = intern.apply.find(
              (a) => a.user === userId
            );

            return (
              <div
                key={intern._id}
                className="bg-white p-4 rounded-lg shadow"
              >
                <h3 className="font-bold">{intern.title}</h3>

                <p>
                  Company:{" "}
                  {intern.companyName?.username ||
                    intern.companyName?.companyName ||
                    "Unknown"}
                </p>

                <p>City: {intern.city || "Not specified"}</p>
                <p>Stipend: ₹{intern.stipend || "N/A"}</p>

                <p className="mt-2">
                  Status:{" "}
                  <span className="font-semibold capitalize">
                    {myApply?.status || "pending"}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
