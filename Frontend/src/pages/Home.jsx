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

  const displayName = username ? `Welcome, ${username} 👋` : "Welcome 👋";
 
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
    <div className="premium-page">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Smart Internship Portal
            </p>
            <h1 className="text-lg font-semibold text-slate-900">
              Discover internships built for your career goals
            </h1>
          </div>

          <div className="flex gap-4 items-center">
            {isLoggedIn() ? (
              <>
                <button
                  className="text-slate-600 hover:text-slate-900 transition"
                  onClick={() => navigate("/my-applications")}
                >
                  My Applications
                </button>

                <button
                  className="text-slate-600 hover:text-slate-900 transition"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </button>

                <Logout />
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Welcome */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 px-8 py-10 text-white shadow-lg md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-200">
              Your next opportunity
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight">
              {displayName}
            </h2>
            <p className="mt-3 text-slate-200">
              Find curated internships, track your applications, and apply in one
              place. Stay ahead with smart filters and personalized roles.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-full bg-white/10 px-4 py-2 text-sm">
                {internships.length} internships live
              </div>
              <div className="rounded-full bg-white/10 px-4 py-2 text-sm">
                {appliedIds.length} applied roles
              </div>
            </div>
          </div>
          <div className="space-y-3 rounded-2xl bg-white/10 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-200">
              Tips
            </p>
            <ul className="space-y-3 text-sm text-slate-100">
              <li className="flex gap-2">
                <span>✅</span>
                Save roles to revisit with filters below.
              </li>
              <li className="flex gap-2">
                <span>⚡</span>
                Apply quickly using your stored profile.
              </li>
              <li className="flex gap-2">
                <span>💡</span>
                Ask the Career Bot for tailored guidance.
              </li>
            </ul>
          </div>
        </div>
      </div>



      {/* Search + Filters */}
      <div className="mx-auto mt-2 max-w-6xl space-y-4 px-6">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <span className="text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search internships..."
            className="w-full text-sm text-slate-900 outline-none"
            value={query}
            onChange={handleSearch}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
            <input
              type="text"
              placeholder="📍 Location"
              className="w-[110px] bg-transparent outline-none"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>

          <div className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
            <input
              type="number"
              placeholder="💰 Stipend"
              className="w-[90px] bg-transparent outline-none"
              value={minStipend}
              onChange={(e) => setMinStipend(e.target.value)}
            />
          </div>

          <div className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
            <select
              className="bg-transparent text-xs outline-none"
              value={appliedFilter}
              onChange={(e) => setAppliedFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="applied">Applied</option>
              <option value="notApplied">Not Applied</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setLocationFilter("");
              setMinStipend("");
              setAppliedFilter("all");
              setQuery("");
              setSearchResults([]);
            }}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm hover:text-slate-900"
          >
            Clear filters
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-10 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-slate-500">Loading internships...</p>
        ) : filteredList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-slate-600">
            <p className="font-semibold">No internships found.</p>
            <p className="text-sm text-slate-500">
              Try adjusting your filters or check back later.
            </p>
          </div>
        ) : (
          filteredList.map((item, index) => (
            <div
              key={item._id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className="h-32 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${cardImages[index % cardImages.length]})`,
                }}
              >
                <div className="h-full w-full bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent" />
              </div>

              <div className="space-y-3 p-5">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {item.companyName?.companyName ||
                      item.companyName?.username ||
                      "Unknown"}
                  </p>
                </div>

                <div className="space-y-1 text-sm text-slate-600">
                  <p>📍 {item.city || "Not specified"}</p>
                  <p>
                    🧠 {item.skillsRequired?.join(", ") || "Not specified"}
                  </p>
                  <p>
                    💰 {item.stipend ? `₹${item.stipend}` : "Not specified"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => navigate(`/student/internship/${item._id}`)}
                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400"
                  >
                    View details
                  </button>

                  <button
                    onClick={() => handleApply(item._id)}
                    disabled={appliedIds.includes(item._id)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition
                  ${
                    appliedIds.includes(item._id)
                      ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                  >
                    {appliedIds.includes(item._id) ? "Applied ✅" : "Apply"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => navigate("/career-bot")}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 text-white shadow-lg transition hover:scale-105"
      >
        <span className="text-lg">🤖</span>
        <span className="text-xs font-medium">Ask Bot</span>
      </button>
    </div>
  );
};

export default Home;
