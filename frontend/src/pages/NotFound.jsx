import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, LayoutDashboard } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">

      {/* ── Background decoration ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Large faint "404" watermark */}
        <p
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[22vw] font-black text-gray-100 leading-none tracking-tighter whitespace-nowrap"
          aria-hidden="true"
        >
          404
        </p>
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-50 opacity-60" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-blue-50 opacity-60" />
        <div className="absolute top-1/4 left-8 w-4 h-4 rounded-full bg-blue-200 opacity-50" />
        <div className="absolute bottom-1/3 right-12 w-3 h-3 rounded-full bg-orange-200 opacity-60" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-blue-300 opacity-40" />
      </div>

      {/* ── Illustration ── */}
      <div className="relative mb-8 animate-bounce-slow">
        <svg
          viewBox="0 0 220 180"
          className="w-48 sm:w-56 md:w-64"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Door frame */}
          <rect x="55" y="30" width="110" height="130" rx="6" fill="#e2e8f0" />
          {/* Door */}
          <rect x="65" y="40" width="90" height="120" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Door panels */}
          <rect x="75" y="52" width="32" height="38" rx="3" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
          <rect x="113" y="52" width="32" height="38" rx="3" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
          <rect x="75" y="98" width="70" height="48" rx="3" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
          {/* Door knob */}
          <circle cx="148" cy="124" r="5" fill="#94a3b8" />
          <circle cx="148" cy="124" r="3" fill="#64748b" />
          {/* House roof */}
          <polygon points="40,35 110,5 180,35" fill="#2563eb" />
          <polygon points="45,35 110,8 175,35" fill="#3b82f6" />
          {/* Chimney */}
          <rect x="130" y="10" width="14" height="20" rx="2" fill="#2563eb" />
          {/* Windows */}
          <rect x="20" y="70" width="28" height="24" rx="3" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1.5" />
          <line x1="34" y1="70" x2="34" y2="94" stroke="#93c5fd" strokeWidth="1" />
          <line x1="20" y1="82" x2="48" y2="82" stroke="#93c5fd" strokeWidth="1" />
          <rect x="172" y="70" width="28" height="24" rx="3" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="1.5" />
          <line x1="186" y1="70" x2="186" y2="94" stroke="#93c5fd" strokeWidth="1" />
          <line x1="172" y1="82" x2="200" y2="82" stroke="#93c5fd" strokeWidth="1" />
          {/* Question mark on door */}
          <text x="99" y="138" fontSize="32" fontWeight="800" fill="#2563eb" fontFamily="Georgia, serif">?</text>
          {/* Ground */}
          <rect x="0" y="158" width="220" height="22" rx="4" fill="#e2e8f0" />
          <rect x="0" y="158" width="220" height="6" rx="3" fill="#cbd5e1" />
          {/* Path */}
          <rect x="90" y="160" width="40" height="18" rx="2" fill="#d1d5db" />
        </svg>
      </div>

      {/* ── Text Content ── */}
      <div className="relative text-center max-w-md">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
          Error 404
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">
          Page Not Found
        </h1>

        <p className="text-sm sm:text-base text-gray-500 mb-8 leading-relaxed">
          Looks like this room doesn't exist. The page you're looking for may have been moved, deleted, or never checked in.
        </p>

        {/* ── Actions ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-lg transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <Link
  to="/"
  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition shadow-md hover:shadow-lg active:scale-[0.97]"
>
  <LayoutDashboard className="w-4 h-4" />
  Back to Home
</Link>
        </div>
      </div>

      {/* ── Branding footer ── */}
      <div className="relative mt-12 flex items-center gap-2 text-gray-300 text-xs">
        <Home className="w-3.5 h-3.5" />
        <span>Hostel Help Desk</span>
      </div>

      {/* ── CSS for gentle bounce animation ── */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
};

export default NotFound;
