import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalBase from "./ModalBase";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";

function InputField({ label, id, type = "text", placeholder, value, onChange, rightSlot }) {
  return (
    <div>
      <label htmlFor={id} style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "#3d4f5b", marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={type === "password" ? "current-password" : "email"}
          style={{
            width: "100%",
            height: 44,
            padding: rightSlot ? "0 44px 0 14px" : "0 14px",
            borderRadius: 8,
            border: "1px solid #c1ccd6",
            backgroundColor: "#ffffff",
            fontSize: "0.9375rem",
            color: "#001e2b",
            outline: "none",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#00684a";
            e.target.style.borderWidth = "2px";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#c1ccd6";
            e.target.style.borderWidth = "1px";
          }}
        />
        {rightSlot && (
          <div style={{ position: "absolute", right: 0, top: 0, height: "100%", display: "flex", alignItems: "center", paddingRight: 12 }}>
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginModal({ open, onClose, onSwitchToRegister }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setShowPw(false);
    onClose();
  };

  const handleSwitch = () => {
    setEmail("");
    setPassword("");
    setShowPw(false);
    onSwitchToRegister();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email dan password wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const data = await login(email, password);
      handleClose();
      toast.success("Login berhasil!");
      if (data.user?.role === 'admin') {
        navigate('/admin');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Login gagal. Periksa kembali email dan password.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ show }) => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {show ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );

  return (
    <ModalBase
      open={open}
      onClose={handleClose}
      id="login"
      title="Selamat datang kembali"
      // subtitle="Masuk ke akun BioGasCalc Anda untuk melanjutkan."
    >
      <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <InputField
          label="Alamat Email"
          id="login-email"
          type="email"
          placeholder="nama@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputField
          label="Password"
          id="login-password"
          type={showPw ? "text" : "password"}
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? "Sembunyikan password" : "Tampilkan password"}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#7c8c9a", padding: 0, display: "flex" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#001e2b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#7c8c9a";
              }}
            >
              <EyeIcon show={showPw} />
            </button>
          }
        />

        {/* Forgot password */}
        <div style={{ textAlign: "right", marginTop: -8 }}>
          <button
            type="button"
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8125rem", color: "#00684a", fontWeight: 500 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            Lupa password?
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            height: 44,
            borderRadius: 9999,
            border: "none",
            backgroundColor: loading ? "#c1ccd6" : "#2DA44E",
            color: loading ? "#7c8c9a" : "#ffffff",
            fontSize: "0.9375rem",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.15s",
            marginTop: 4,
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = "#218838";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = "#2DA44E";
          }}
        >
          {loading ? "Memproses…" : "Masuk"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3" style={{ margin: "4px 0" }}>
          <div style={{ flex: 1, height: 1, backgroundColor: "#e1e5e8" }} />
          <span style={{ fontSize: "0.75rem", color: "#a8b3bc" }}>atau</span>
          <div style={{ flex: 1, height: 1, backgroundColor: "#e1e5e8" }} />
        </div>

        {/* Switch to register */}
        <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#5c6c7a" }}>
          Belum punya akun?{" "}
          <button
            type="button"
            onClick={handleSwitch}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#00684a", fontWeight: 600, fontSize: "inherit" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            Daftar sekarang
          </button>
        </p>
      </form>
    </ModalBase>
  );
}
