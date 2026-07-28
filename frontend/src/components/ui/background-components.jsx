import { useState } from "react";

export const BackgroundGlow = ({ children }) => {
  return (
    <div className="w-full relative bg-white overflow-hidden">
      {/* Soft Green Glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, #A7F3D0 0%, transparent 70%)
          `,
          opacity: 0.6,
          mixBlendMode: "multiply",
        }}
      />
      {/* Your Content/Components */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
