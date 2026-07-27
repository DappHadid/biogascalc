import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Aurora from "../bitspro/Aurora";

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

export default function Footer() {
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
      <div style={{ position: "relative", height: 0 }}>
        <div
          ref={cardRef}
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
          <div
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

              <form
                onSubmit={(e) => e.preventDefault()}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  width: "100%",
                  maxWidth: 448,
                  backgroundColor: "#ffffff",
                  borderRadius: 12,
                  padding: 6,
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  gap: 6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", flex: "1 1 180px", minWidth: 0 }}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: "#737373", marginLeft: 12, flexShrink: 0 }}
                    aria-hidden="true"
                  >
                    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                  </svg>
                  <input
                    type="email"
                    placeholder="Masukkan email Anda"
                    aria-label="Alamat email"
                    required
                    style={{
                      flex: 1,
                      width: "100%",
                      padding: "10px 12px",
                      fontSize: "0.875rem",
                      background: "transparent",
                      color: "#171717",
                      border: "none",
                      outline: "none",
                      minWidth: 0,
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "10px 20px",
                    backgroundColor: "#171717",
                    color: "#fafafa",
                    borderRadius: 8,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    border: "none",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    transition: "background-color 0.15s",
                    flex: "0 1 auto",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#262626";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#171717";
                  }}
                >
                  Gabung Waitlist
                  <svg
                    width="16"
                    height="16"
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
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer body — paddingTop = setengah tinggi card (terukur real) + jarak aman, supaya konten tidak ketimpa card ── */}
      <div
        style={{
          position: "relative",
          backgroundColor: "#ecfdf5",
          borderTopLeftRadius: 48,
          borderTopRightRadius: 48,
          paddingTop: halfCardHeight + 64,
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
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }} aria-label="BioGasCalc beranda">
              <img src="/Logo.png" alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
              <span style={{ fontSize: "1.25rem", fontWeight: 600, color: "#171717", lineHeight: 1 }}>BioGasCalc</span>
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
              © {year} BioGasCalc. Hak cipta dilindungi undang-undang.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
