import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";

const Company = () => {
  const navigate = useNavigate();

 const bgImages = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=60",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=60",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=60",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=60",
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=60",
];


  const heroBg = bgImages[Math.floor(Math.random() * bgImages.length)];

  return (
    <div className="min-h-screen bg-white">
      {/* ===== SIMPLE TOP NAV ===== */}
      <nav className="border-b px-8 py-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">Smart Internship Portal</h1>

        <div className="flex gap-6 items-center">
          <button
            className="text-gray-700 hover:underline"
            onClick={() => navigate("/company")}
          >
            Home
          </button>

          <button
            className="text-gray-700 hover:underline"
            onClick={() => navigate("/company/applications")}
          >
            Applications
          </button>

          <button
            className="text-gray-700 hover:underline"
            onClick={() => navigate("/company/profile")}
          >
            Profile
          </button>

          <Logout />
        </div>
      </nav>

      {/* ===== HERO CONTENT ===== */}
      <div
        className="max-w-5xl mx-auto px-8 mt-12 rounded-2xl shadow-lg"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-black/60 p-10 rounded-2xl text-white">
          <h2 className="text-3xl font-bold">Welcome back, Company 👋</h2>

          <p className="text-gray-200 mt-2 max-w-2xl">
            Create internships, review student applications, and manage your
            hiring process — all in one simple workspace.
          </p>

          {/* BIG PRIMARY ACTION */}
          <div className="mt-8">
            <button
              onClick={() => navigate("/company/create")}
              className="bg-white text-black px-7 py-3.5 rounded-lg text-lg font-medium hover:bg-gray-200"
            >
              + Create Internship
            </button>
          </div>

          {/* SIMPLE LINKS */}
          <div className="mt-10 space-y-4">
            <div
              className="border-b border-white/30 pb-4 cursor-pointer hover:text-indigo-300"
              onClick={() => navigate("/company/applications")}
            >
              <h3 className="font-semibold text-lg">View Applications →</h3>
              <p className="text-sm text-gray-300">
                Check student submissions and manage candidates.
              </p>
            </div>

            <div
              className="border-b border-white/30 pb-4 cursor-pointer hover:text-indigo-300"
              onClick={() => navigate("/company/profile")}
            >
              <h3 className="font-semibold text-lg">Company Profile →</h3>
              <p className="text-sm text-gray-300">
                Update your company details and preferences.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center text-gray-400 text-sm pb-6">
        Smart Internship Portal • Company Workspace
      </div>
    </div>
  );
};

export default Company;
