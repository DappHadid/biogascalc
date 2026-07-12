import { useState } from "react";
import ModalBase from "./ModalBase";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";

function InputField({ label, id, type = "text", placeholder, value, onChange, rightSlot, hint }) {
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
          autoComplete={id.includes("confirm") ? "new-password" : type === "password" ? "new-password" : id.includes("email") ? "email" : "name"}
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
      {hint && <p style={{ fontSize: "0.75rem", color: "#a8b3bc", marginTop: 4 }}>{hint}</p>}
    </div>
  );
}

function PasswordStrength({ password }) {
  const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(password)).length;
  const labels = ["", "Lemah", "Cukup", "Kuat", "Sangat Kuat"];
  const colors = ["#e1e5e8", "#fa6e39", "#f5bc2f", "#00a35c", "#2DA44E"];
  if (!password) return null;
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 9999,
              backgroundColor: i <= score ? colors[score] : "#e1e5e8",
              transition: "background-color 0.2s",
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: "0.6875rem", color: colors[score], fontWeight: 500 }}>{labels[score]}</p>
    </div>
  );
}

export default function RegisterModal({ open, onClose, onSwitchToLogin }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleClose = () => {
    setForm({ name: "", email: "", password: "", confirm: "" });
    setShowPw(false);
    setShowCf(false);
    onClose();
  };

  const handleSwitch = () => {
    setForm({ name: "", email: "", password: "", confirm: "" });
    setShowPw(false);
    setShowCf(false);
    onSwitchToLogin();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      toast.error("Semua field wajib diisi.");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Password dan konfirmasi tidak cocok.");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password minimal 8 karakter.");
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      handleClose();
      toast.success("Registrasi berhasil!");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Pendaftaran gagal. Coba lagi.";
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

  const EyeToggle = ({ show, onToggle, label }) => (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      style={{ background: "none", border: "none", cursor: "pointer", color: "#7c8c9a", padding: 0, display: "flex" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#001e2b";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "#7c8c9a";
      }}
    >
      <EyeIcon show={show} />
    </button>
  );

  return (
    <ModalBase open={open} onClose={handleClose} id="register" title="Buat akun baru">
      <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        <InputField label="Nama Lengkap" id="reg-name" placeholder="Nama lengkap Anda" value={form.name} onChange={set("name")} />

        <InputField label="Alamat Email" id="reg-email" type="email" placeholder="nama@email.com" value={form.email} onChange={set("email")} />

        <div>
          <InputField
            label="Password"
            id="reg-password"
            type={showPw ? "text" : "password"}
            placeholder="Min. 8 karakter"
            value={form.password}
            onChange={set("password")}
            rightSlot={<EyeToggle show={showPw} onToggle={() => setShowPw((v) => !v)} label={showPw ? "Sembunyikan" : "Tampilkan"} />}
          />
          <PasswordStrength password={form.password} />
        </div>

        <InputField
          label="Konfirmasi Password"
          id="reg-confirm"
          type={showCf ? "text" : "password"}
          placeholder="Ulangi password"
          value={form.confirm}
          onChange={set("confirm")}
          rightSlot={<EyeToggle show={showCf} onToggle={() => setShowCf((v) => !v)} label={showCf ? "Sembunyikan" : "Tampilkan"} />}
          hint={form.confirm && form.password !== form.confirm ? "Password tidak cocok" : ""}
        />

        {/* Terms note */}
        {/* <p style={{ fontSize: "0.75rem", color: "#a8b3bc", lineHeight: 1.5 }}>
          Dengan mendaftar, Anda menyetujui{" "}
          <button
            type="button"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#00684a", fontWeight: 500, fontSize: "inherit" }}
          >
            Syarat Penggunaan
          </button>{" "}
          dan{" "}
          <button
            type="button"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#00684a", fontWeight: 500, fontSize: "inherit" }}
          >
            Kebijakan Privasi
          </button>
          .
        </p> */}

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
          {loading ? "Memproses…" : "Buat Akun"}
        </button>

        {/* Switch to login */}
        <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#5c6c7a" }}>
          Sudah punya akun?{" "}
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
            Masuk
          </button>
        </p>
      </form>
    </ModalBase>
  );
}
