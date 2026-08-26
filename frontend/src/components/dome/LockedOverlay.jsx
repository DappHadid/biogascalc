/* ── LockedOverlay — blurred content + auth CTA overlay ───────*/

function LockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export default function LockedOverlay({ locked, onLogin, onRegister, message, children }) {
  if (!locked) return children;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ filter: "blur(6px)", pointerEvents: "none", userSelect: "none" }} aria-hidden="true">
        {children}
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          textAlign: "center",
          padding: "1.5rem 1rem",
          backgroundColor: "rgba(0,30,43,0.55)",
          backdropFilter: "blur(6px)",
          borderRadius: 12,
        }}
      >
        <div style={{ color: "#ffffff" }}>
          <LockIcon />
        </div>
        <p style={{ color: "#ffffff", fontWeight: 600, fontSize: "0.9375rem", maxWidth: 320, margin: 0 }}>
          {message}
        </p>
        <div className="flex items-center gap-2" style={{ marginTop: 4 }}>
          <button
            onClick={onLogin}
            style={{
              padding: "8px 18px",
              borderRadius: 9999,
              fontSize: "0.875rem",
              fontWeight: 600,
              border: "none",
              backgroundColor: "#2DA44E",
              color: "#ffffff",
              cursor: "pointer",
              transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#218838"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#2DA44E"; }}
          >
            Masuk
          </button>
          <button
            onClick={onRegister}
            style={{
              padding: "8px 18px",
              borderRadius: 9999,
              fontSize: "0.875rem",
              fontWeight: 600,
              border: "1px solid #ffffff",
              backgroundColor: "transparent",
              color: "#ffffff",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            Daftar
          </button>
        </div>
      </div>
    </div>
  );
}
