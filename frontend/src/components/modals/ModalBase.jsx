import { useEffect } from "react";
import { createPortal } from "react-dom";

/* ── Shared modal shell — overlay + card ─────────────────────
   Handles: Escape key, body scroll lock, backdrop click.
   ------------------------------------------------------------ */
export default function ModalBase({ open, onClose, title, subtitle, id, children }) {
  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-title`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,30,43,0.5)",
          backdropFilter: "blur(6px)",
        }}
      />

      {/* Card */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 440,
          backgroundColor: "#ffffff",
          borderRadius: 16,
          border: "1px solid #e1e5e8",
          boxShadow: "rgba(0,30,43,0.16) 0px 16px 48px -8px",
          padding: "2rem",
          animation: "modalIn 0.2s cubic-bezier(0,0,0.2,1) both",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Tutup"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: 9999,
            border: "1px solid #e1e5e8",
            backgroundColor: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#7c8c9a",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f9fbfa";
            e.currentTarget.style.color = "#001e2b";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#7c8c9a";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>

        {/* Logo mark */}
        <div className="flex items-center gap-2 mb-5">
          <img src="/Logo.png" alt="" aria-hidden="true" style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover" }} />
          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#001e2b" }}>BioGasCalc</span>
        </div>

        {/* Title */}
        <h2 id={`${id}-title`} style={{ fontSize: "1.375rem", fontWeight: 600, color: "#001e2b", marginBottom: 4 }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: "0.875rem", color: "#5c6c7a", marginBottom: "1.5rem", lineHeight: 1.5 }}>
            {subtitle}
          </p>
        )}

        {children}
      </div>

      {/* Modal entrance animation */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </div>,
    document.body
  );
}
