import React from "react";
import Aurora from "../bitspro/Aurora";

export default function CtaSection({ forwardedRef }) {
  return (
    <div
      ref={forwardedRef}
      style={{
        position: "relative",
        width: "100%",
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundColor: "#000000" }}>
        <Aurora
          colorStops={["#7cff67", "#B497CF", "#5227FF"]}
          blend={0.5}
          amplitude={1.0}
          speed={1}
        />
      </div>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "clamp(40px, 10vw, 96px) clamp(20px, 6vw, 48px)",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.75rem, 6vw, 3.75rem)",
            color: "#ffffff",
            fontWeight: 500,
            letterSpacing: "-0.025em",
            lineHeight: 1.15,
            maxWidth: 672,
            marginBottom: "clamp(24px, 5vw, 56px)",
          }}
        >
          Mulai Hitung Potensi Biogas Anda Hari Ini
        </h2>

        <button
          onClick={() => {
            window.location.href = "/rancang-dome";
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: "16px 32px",
            backgroundColor: "#171717",
            color: "#fafafa",
            borderRadius: 12,
            fontSize: "1.125rem",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#262626";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#171717";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Coba Fitur Rancang Dome
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
