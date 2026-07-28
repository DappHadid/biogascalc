import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import LoginModal from "../modals/LoginModal";
import RegisterModal from "../modals/RegisterModal";
import { useAuth } from "../../contexts/AuthContext";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Lokasi", href: "/lokasi" },
  { label: "Dome", href: "/rancang-dome" },
  { label: "Kalkulator", href: "/kalkulator-limbah" },
  { label: "Kontak", href: "/contact" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modal, setModal] = useState(null); // 'login' | 'register' | null

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    document.body.style.overflow = "";
  }, [pathname]);

  const toggleMenu = () => {
    const next = !mobileOpen;
    setMobileOpen(next);
    document.body.style.overflow = next ? "hidden" : "";
  };

  return (
    <>
      {/* ── Navbar — pill hitam mengambang, max-width terbatas, full-width di mobile ── */}
      {/* Entrance: slide turun dari atas, sekali saat mount, slow & smooth ── */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-1/2 -translate-x-1/2 w-full max-w-5xl max-[850px]:max-w-none max-[850px]:left-0 max-[850px]:translate-x-0 transition-shadow duration-200"
        style={{
          top: 10,
          zIndex: 50,
          backgroundColor: "#0a0a0a",
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          boxShadow: scrolled ? "rgba(0,0,0,0.25) 0px 8px 20px 0px" : "rgba(0,0,0,0.2) 0px 25px 50px -12px",
        }}
      >
        {/* SVG kiri — quarter-circle notch, menempel di luar sisi kiri pill (desktop only) */}
        <svg
          aria-hidden="true"
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          className="hidden min-[851px]:block pointer-events-none"
          style={{ position: "absolute", left: -49, top: 0, transform: "rotate(180deg)", color: "#0a0a0a" }}
        >
          <path d="M5.50871e-06 0C-0.00788227 37.3001 8.99616 50.0116 50 50H5.50871e-06V0Z" fill="currentColor" />
        </svg>

        {/* SVG kanan — quarter-circle notch, menempel di luar sisi kanan pill (desktop only) */}
        <svg
          aria-hidden="true"
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          className="hidden min-[851px]:block pointer-events-none"
          style={{ position: "absolute", right: -49, top: 0, transform: "rotate(90deg)", color: "#0a0a0a" }}
        >
          <path d="M5.50871e-06 0C-0.00788227 37.3001 8.99616 50.0116 50 50H5.50871e-06V0Z" fill="currentColor" />
        </svg>

        <div
          className="max-[850px]:h-18"
          style={{
            display: "flex",
            height: 80,
            padding: "0 15.99px",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "stretch",
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        >
          <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* ── KIRI: Logo + Nama ── */}
            <Link to="/" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
              <img src="/Logo.png" alt="OWREN logo" className="w-8 h-8 rounded-full object-cover" style={{ border: "1px solid #2a2a2a" }} />
              <span className="block font-semibold tracking-tight" style={{ fontSize: "0.9375rem", color: "#ffffff", lineHeight: 1.2 }}>
                Owren.tech
              </span>
            </Link>

            {/* ── TENGAH: Nav links (desktop) ── */}
            <nav aria-label="Navigasi utama" className="hidden min-[851px]:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    aria-current={isActive ? "page" : undefined}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 8,
                      fontSize: "0.875rem",
                      fontWeight: isActive ? 600 : 500,
                      textDecoration: "none",
                      transition: "all 0.15s",
                      color: isActive ? "#ffffff" : "#a8b3bc",
                      backgroundColor: isActive ? "#1c1c1c" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "#ffffff";
                        e.currentTarget.style.backgroundColor = "#1c1c1c";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "#a8b3bc";
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* ── KANAN: Auth buttons (desktop) ── */}
            <div className="hidden min-[851px]:flex items-center gap-2">
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      style={{
                        padding: "8px 16px",
                        borderRadius: 9999,
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "#0a0a0a",
                        backgroundColor: "#2DA44E",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        lineHeight: 1.3,
                      }}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #2DA44E 0%, #218838 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8125rem",
                      fontWeight: 700,
                      color: "#001e2b",
                      flexShrink: 0,
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={logout}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 9999,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#ffffff",
                      border: "none",
                      backgroundColor: "transparent",
                      transition: "all 0.15s",
                      display: "inline-flex",
                      alignItems: "center",
                      lineHeight: 1.3,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#a8b3bc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  {/* Login — teks polos */}
                  <button
                    onClick={() => setModal("login")}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 9999,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#ffffff",
                      border: "none",
                      backgroundColor: "transparent",
                      transition: "all 0.15s",
                      display: "inline-flex",
                      alignItems: "center",
                      lineHeight: 1.3,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#a8b3bc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    Masuk
                  </button>

                  {/* Register — pill putih + tail hijau-lime dengan ikon */}
                  <button
                    onClick={() => setModal("register")}
                    className="register-split-btn"
                    style={{
                      padding: "4px",
                      paddingLeft: "20px",
                      borderRadius: 9999,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#0a0a0a",
                      backgroundColor: "#f4f7f6",
                      border: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 12,
                      lineHeight: 1.3,
                      transition: "all 0.15s",
                      cursor: "pointer",
                    }}
                  >
                    Daftar
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        backgroundColor: "#2DA44E",
                        flexShrink: 0,
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M3 9 9 3M9 3H4M9 3v5" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                </>
              )}
            </div>

            {/* ── Hamburger (mobile only) — 3 garis absolute-centered, jadi X presisi saat open ── */}
            <button
              onClick={toggleMenu}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
              className="max-[850px]:flex hidden relative items-center justify-center w-10 h-10 rounded-lg"
              style={{ border: "1px solid #2a2a2a", backgroundColor: "transparent" }}
            >
              <span
                className="absolute block w-5 rounded-full transition-all duration-200"
                style={{
                  height: 1.5,
                  backgroundColor: "#ffffff",
                  transform: mobileOpen ? "rotate(45deg)" : "translateY(-6.5px)",
                }}
              />
              <span
                className="absolute block w-5 rounded-full transition-all duration-200"
                style={{
                  height: 1.5,
                  backgroundColor: "#ffffff",
                  opacity: mobileOpen ? 0 : 1,
                  transform: mobileOpen ? "scaleX(0)" : "none",
                }}
              />
              <span
                className="absolute block w-5 rounded-full transition-all duration-200"
                style={{
                  height: 1.5,
                  backgroundColor: "#ffffff",
                  transform: mobileOpen ? "rotate(-45deg)" : "translateY(6.5px)",
                }}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 max-[850px]:block hidden"
            style={{ backgroundColor: "rgba(0,30,43,0.4)", backdropFilter: "blur(4px)" }}
            onClick={() => {
              setMobileOpen(false);
              document.body.style.overflow = "";
            }}
            aria-hidden="true"
          />
          <div
            id="mobile-menu"
            className="fixed left-0 right-0 z-50 max-[850px]:block hidden"
            style={{ top: 72, backgroundColor: "#ffffff", borderBottom: "1px solid #e1e5e8" }}
          >
            <div className="flex flex-col gap-1 p-4" style={{ maxWidth: 1280, margin: "0 auto" }}>
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 8,
                      fontSize: "0.9rem",
                      fontWeight: isActive ? 600 : 500,
                      textDecoration: "none",
                      color: isActive ? "#001e2b" : "#3d4f5b",
                      backgroundColor: isActive ? "#e3fcef" : "transparent",
                      border: isActive ? "1px solid #c3f0d2" : "1px solid transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: "#2DA44E",
                          display: "block",
                        }}
                      />
                    )}
                  </Link>
                );
              })}

              <div style={{ borderTop: "1px solid #e1e5e8", margin: "8px 0" }} />

              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      style={{
                        padding: "12px 16px",
                        borderRadius: 9999,
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        textAlign: "center",
                        color: "#0a0a0a",
                        backgroundColor: "#2DA44E",
                        textDecoration: "none",
                        display: "block",
                        width: "100%",
                      }}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px" }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #2DA44E 0%, #218838 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        color: "#001e2b",
                        flexShrink: 0,
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#001e2b" }}>{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                      document.body.style.overflow = "";
                    }}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 9999,
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      textAlign: "center",
                      color: "#d32f2f",
                      border: "1px solid #f5c6c6",
                      backgroundColor: "transparent",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setModal("login");
                      setMobileOpen(false);
                      document.body.style.overflow = "";
                    }}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 9999,
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      textAlign: "center",
                      color: "#001e2b",
                      border: "1px solid #c1ccd6",
                      backgroundColor: "transparent",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => {
                      setModal("register");
                      setMobileOpen(false);
                      document.body.style.overflow = "";
                    }}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 9999,
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      textAlign: "center",
                      color: "#001e2b",
                      backgroundColor: "#2DA44E",
                      border: "none",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Daftar →
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Auth modals ── */}
      <LoginModal open={modal === "login"} onClose={() => setModal(null)} onSwitchToRegister={() => setModal("register")} />
      <RegisterModal open={modal === "register"} onClose={() => setModal(null)} onSwitchToLogin={() => setModal("login")} />
    </>
  );
}
