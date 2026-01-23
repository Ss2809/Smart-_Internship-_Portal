import { useEffect, useState } from "react";
import axios from "axios";
import Logout from "../components/Logout";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [appliedIds, setAppliedIds] = useState([]);
  const userId = localStorage.getItem("userId");
  2;
  const cardImages = [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=60",
  ];

  // Search
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Filters
  const [locationFilter, setLocationFilter] = useState("");
  const [minStipend, setMinStipend] = useState("");
  const [appliedFilter, setAppliedFilter] = useState("all");
 
  // 🔐 Apply (redirect if not logged in)
  const handleApply = async (intershipID) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.info("Please login to apply!");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        `https://smart-internship-backend.onrender.com/api/intership/apply/${intershipID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.info(res.data.message);
      setAppliedIds((prev) => [...prev, intershipID]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  // Fetch user (only if logged in)
  useEffect(() => {
    if (!isLoggedIn()) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get("https://smart-internship-backend.onrender.com/api/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setUsername(res.data.user.username);
        localStorage.setItem("userId", res.data.user._id);
      } catch (error) {
        console.error("User fetch failed");
      }
    };

    fetchUser();
  }, []);

  // Fetch internships (PUBLIC)
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await axios.get(
          "https://smart-internship-backend.onrender.com/api/intership/all-intership",
        );

        const data = res.data.intershipdata || [];
        setInternships(data);

        if (userId) {
          const alreadyApplied = data
            .filter((intern) =>
              intern.apply?.some((app) => app.user === userId),
            )
            .map((intern) => intern._id);

          setAppliedIds(alreadyApplied);
        }
      } catch (error) {
        console.error("Failed to fetch internships");
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  // Search handler
  const handleSearch = async (e) => {
    const q = e.target.value;
    setQuery(q);

    if (!q) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await axios.get(
        `https://smart-internship-backend.onrender.com/api/intership/search?q=${q}`,
      );

      setSearchResults(res.data.internships || []);
    } catch (error) {
      setSearchResults([]);
    }
  };

  // Filters
  const filteredList = (query ? searchResults : internships).filter((item) => {
    const matchLocation =
      !locationFilter ||
      item.city?.toLowerCase().includes(locationFilter.toLowerCase());

    const matchStipend =
      !minStipend || (item.stipend && item.stipend >= Number(minStipend));

    const isApplied = appliedIds.includes(item._id);

    const matchAppliedFilter =
      appliedFilter === "all"
        ? true
        : appliedFilter === "applied"
          ? isApplied
          : !isApplied;

    return matchLocation && matchStipend && matchAppliedFilter;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">Smart Internship Portal</h1>

        <div className="flex gap-4 items-center">
          {isLoggedIn() ? (
            <>
              <button
                className="text-blue-600"
                onClick={() => navigate("/my-applications")}
              >
                My Applications
              </button>

              <button
                className="text-blue-600"
                onClick={() => navigate("/profile")}
              >
                Profile
              </button>

              <Logout />
            </>
          ) : (
            <>
              <Link to="/login" className="text-blue-600">
                Login
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Welcome */}
      <div className="p-6">
        <h2 className="text-2xl font-bold">Welcome, {username} 👋</h2>
        <p className="text-gray-600">
          Find and apply for the best internships below.
        </p>
      </div>
      



      {/* Search + Filters */}
      <div className="px-4 mt-4 space-y-2">
        <div className="flex items-center gap-2 bg-white shadow rounded-lg px-3 py-2">
          <span className="text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search internships..."
            className="w-full outline-none text-sm"
            value={query}
            onChange={handleSearch}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <div className="bg-gray-100 border rounded-full px-3 py-1 text-xs">
            <input
              type="text"
              placeholder="📍 Location"
              className="bg-transparent outline-none w-[90px]"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>

          <div className="bg-gray-100 border rounded-full px-3 py-1 text-xs">
            <input
              type="number"
              placeholder="💰 Stipend"
              className="bg-transparent outline-none w-[80px]"
              value={minStipend}
              onChange={(e) => setMinStipend(e.target.value)}
            />
          </div>

          <div className="bg-gray-100 border rounded-full px-3 py-1 text-xs">
            <select
              className="bg-transparent outline-none text-xs"
              value={appliedFilter}
              onChange={(e) => setAppliedFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="applied">Applied</option>
              <option value="notApplied">Not Applied</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {loading ? (
          <p>Loading internships...</p>
        ) : filteredList.length === 0 ? (
          <p>No internships available right now.</p>
        ) : (
          filteredList.map((item, index) => (
            <div
              key={item._id}
              className="p-4 rounded-lg shadow hover:shadow-lg transition  relative overflow-hidden"
            >
              <div
                className="absolute inset-0"
                style={{
                 // backgroundImage: `url(${cardImages[index % cardImages.length]})`,

                  backgroundSize: "cover",
                  backgroundPosition: "center",
                 filter: "blur(2px) brightness(0.6)", // ~25% blur
                  transform: "scale(1.1)",
                }}
              ></div>

              <div className="relative p-3 rounded-lg">
                <h3 className="font-bold">{item.title}</h3>
                <p>
                  Company:{" "}
                  {item.companyName?.companyName ||
                    item.companyName?.username ||
                    "Unknown"}
                </p>

                <p>Location: {item.city || "Not specified"}</p>
                <p>
                  Skills: {item.skillsRequired?.join(", ") || "Not specified"}
                </p>
                <p>
                  Stipend: {item.stipend ? `₹${item.stipend}` : "Not specified"}
                </p>

                <button
                  onClick={() => navigate(`/student/internship/${item._id}`)}
                  className="bg-gray-800 text-white px-4 py-2 rounded mt-3 mr-2"
                >
                  View Details
                </button>

                <button
                  onClick={() => handleApply(item._id)}
                  disabled={appliedIds.includes(item._id)}
                  className={`px-4 py-2 rounded mt-3 font-semibold transition
                  ${
                    appliedIds.includes(item._id)
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {appliedIds.includes(item._id) ? "Applied ✅" : "Apply"}
                </button>
              </div>
            </div>
            
          ))
        )}
         
      </div>
   <button
  onClick={() => navigate("/career-bot")}
  className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-3 py-2 rounded-full 
             bg-gradient-to-r from-indigo-600 to-purple-600 
             text-white shadow-lg hover:scale-105 transition transform"
>
  <span className="text-lg">🤖</span>
  <span className="text-xs font-medium">
    Ask Bot
  </span>
</button>





    </div>
  );
};

export default Home;
