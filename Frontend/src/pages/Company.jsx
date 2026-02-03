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
    <div className="premium-page">
      {/* ===== PREMIUM TOP NAV ===== */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="premium-subtitle uppercase tracking-[0.2em]">
              Smart Internship Portal
            </p>
            <h1 className="text-lg font-semibold text-slate-900">
              Company Workspace
            </h1>
          </div>

          <div className="flex gap-6 items-center">
            <button
              className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
              onClick={() => navigate("/company")}
            >
              Home
            </button>

            <button
              className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
              onClick={() => navigate("/company/applications")}
            >
              Applications
            </button>

            <button
              className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
              onClick={() => navigate("/company/profile")}
            >
              Profile
            </button>

            <Logout />
          </div>
        </div>
      </nav>

      {/* ===== HERO CONTENT ===== */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div
          className="overflow-hidden rounded-3xl shadow-xl"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="bg-slate-900/70 p-10 text-white md:p-12">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-200">
              Welcome back
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              Build the next cohort of interns
            </h2>

            <p className="mt-3 max-w-2xl text-sm text-slate-200">
              Create internships, review student applications, and manage your
              hiring process — all in one polished workspace.
            </p>

            {/* BIG PRIMARY ACTION */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/company/create")}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
              >
                + Create Internship
              </button>
              <button
                onClick={() => navigate("/company/applications")}
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Review Applications
              </button>
            </div>

            {/* QUICK LINKS */}
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <button
                className="rounded-2xl border border-white/20 bg-white/10 p-4 text-left transition hover:bg-white/20"
                onClick={() => navigate("/company/applications")}
              >
                <h3 className="font-semibold">View Applications →</h3>
                <p className="mt-1 text-sm text-slate-200">
                  Check student submissions and manage candidates.
                </p>
              </button>

              <button
                className="rounded-2xl border border-white/20 bg-white/10 p-4 text-left transition hover:bg-white/20"
                onClick={() => navigate("/company/profile")}
              >
                <h3 className="font-semibold">Company Profile →</h3>
                <p className="mt-1 text-sm text-slate-200">
                  Update your company details and preferences.
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-8 text-center text-xs text-slate-400">
        Smart Internship Portal • Company Workspace
      </div>
    </div>
  );
};

export default Company;
