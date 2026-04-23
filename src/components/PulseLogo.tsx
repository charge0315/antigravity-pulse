import React from "react";

const PulseLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-5 h-5 flex items-center justify-center">
        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-pulse"></div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </div>
      <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">
        Antigravity Pulse
      </span>
    </div>
  );
};

export default PulseLogo;
