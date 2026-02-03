import { useState } from "react";
import BackButton from "../components/BackButton";

const CareerBot = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="premium-page flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-100 p-6">
      <div className="w-full max-w-5xl rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl backdrop-blur">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <BackButton />
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <span className="text-2xl">🤖</span> Career Guide Bot
          </h2>
          <div></div>
        </div>

        {/* Loader */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-[550px]">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-slate-600">Loading AI Assistant...</p>
          </div>
        )}

        {/* Bot Frame */}
        <div
          className={`${loading ? "hidden" : "block"} relative rounded-2xl overflow-hidden shadow-lg border border-slate-200`}
        >
          <iframe
            onLoad={() => setLoading(false)}
            src="https://cdn.botpress.cloud/webchat/v3.5/shareable.html?configUrl=https://files.bpcontent.cloud/2026/01/23/16/20260123165901-GTTXF7AG.json"
            width="100%"
            height="550"
            style={{ border: "none" }}
            title="Career Bot"
          ></iframe>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-4">
          Your smart AI assistant for career & internship guidance 🚀
        </p>
      </div>
    </div>
  );
};

export default CareerBot;
