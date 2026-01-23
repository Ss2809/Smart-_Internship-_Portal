import { useState } from "react";
import BackButton from "../components/BackButton";

const CareerBot = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white/70 backdrop-blur-lg shadow-2xl rounded-2xl p-6 border border-gray-200">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <BackButton />
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🤖</span> Career Guide Bot
          </h2>
          <div></div>
        </div>

        {/* Loader */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-[550px]">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-600">Loading AI Assistant...</p>
          </div>
        )}

        {/* Bot Frame */}
        <div className={`${loading ? "hidden" : "block"} relative rounded-xl overflow-hidden shadow-lg border`}>
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
        <p className="text-center text-sm text-gray-500 mt-4">
          Your smart AI assistant for career & internship guidance 🚀
        </p>
      </div>
    </div>
  );
};

export default CareerBot;
