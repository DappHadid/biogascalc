import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CtaSection from "../sections/CtaSection";
/* ── Link columns ─────────────────────────────────────────── */
const COLUMNS = [
  {
    heading: "Menu",
    links: [
      { label: "Kalkulator Limbah", href: "/kalkulator-limbah" },
      { label: "Rancang Dome", href: "/rancang-dome" },
      { label: "Peta Lokasi", href: "/lokasi" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Bantuan", href: "#" },
      { label: "Syarat Penggunaan", href: "#" },
      { label: "Keamanan", href: "#" },
    ],
  },
  {
    heading: "Social",
    links: [
      { label: "X (Twitter)", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════ */

export default function Footer({ showCTA = true }) {
  const year = new Date().getFullYear();
  const cardRef = useRef(null);
  const [halfCardHeight, setHalfCardHeight] = useState(0);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const update = () => setHalfCardHeight(el.getBoundingClientRect().height / 2);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer style={{ position: "relative", backgroundColor: "transparent" }}>
      {/* ── CTA card — overlap 50/50 pas di garis hijau, tinggi card otomatis (absolute + translateY -50%) ── */}
      {showCTA && (
        <div style={{ position: "relative", height: 0 }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1,
              width: "100%",
              maxWidth: 1024,
            }}
          >
            <CtaSection forwardedRef={cardRef} />
          </div>
        </div>
      )}

      {/* ── Footer body — paddingTop = setengah tinggi card (terukur real) + jarak aman, supaya konten tidak ketimpa card ── */}
      <div
        style={{
          position: "relative",
          backgroundColor: "#ecfdf5",
          borderTopLeftRadius: 48,
          borderTopRightRadius: 48,
          paddingTop: showCTA ? halfCardHeight + 64 : 64,
          paddingBottom: 64,
        }}
      >
        <div style={{ maxWidth: 1024, margin: "0 auto", padding: "0 24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 48,
              flexWrap: "wrap",
            }}
          >
            {/* Brand */}
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }} aria-label="Owren beranda">
              <img src="/Logo.png" alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
              <span style={{ fontSize: "1.25rem", fontWeight: 600, color: "#171717", lineHeight: 1 }}>Owren</span>
            </Link>

            {/* Link columns */}
            <nav style={{ display: "flex", gap: 64, flexWrap: "wrap" }} aria-label="Navigasi footer">
              {COLUMNS.map((col) => (
                <div key={col.heading}>
                  <h3
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      color: "rgba(23,23,23,0.5)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: 16,
                    }}
                  >
                    {col.heading}
                  </h3>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, padding: 0, margin: 0 }}>
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.href}
                          style={{
                            fontSize: "0.875rem",
                            color: "#171717",
                            textDecoration: "none",
                            transition: "color 0.15s",
                            display: "inline-block",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "rgba(23,23,23,0.7)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "#171717";
                          }}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div style={{ marginTop: 64, paddingTop: 24 }}>
            <p style={{ fontSize: "0.875rem", color: "rgba(23,23,23,0.5)", textAlign: "center" }}>
              © {year} OWREN. Hak cipta dilindungi undang-undang.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
