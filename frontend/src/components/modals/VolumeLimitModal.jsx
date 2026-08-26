import ModalBase from "./ModalBase";

const WarningIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#FFF8E0" stroke="#F5BC2F" strokeWidth="2" />
    <path
      d="M24 16V28"
      stroke="#946F3F"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="24" cy="33" r="1.5" fill="#946F3F" />
  </svg>
);

const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 6L2 7" />
  </svg>
);

export default function VolumeLimitModal({
  open,
  onClose,
  maxVolume,
  user,
  adminEmail,
  onLoginClick,
  onRegisterClick,
}) {
  const mailtoHref = adminEmail
    ? `mailto:${adminEmail}?subject=${encodeURIComponent("Permintaan Peningkatan Batas Volume — BioGasCalc")}&body=${encodeURIComponent(
        `Halo Admin,\n\nSaya ingin mengajukan permintaan untuk meningkatkan batas volume desain dome saya.\n\nInformasi akun:\n- Nama: ${user?.name || ""}\n- Email: ${user?.email || ""}\n\nBatas saat ini: ${maxVolume} m³\n\nTerima kasih.`
      )}`
    : "#";

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      id="volume-limit"
      title="Batas Volume Tercapai"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
          textAlign: "center",
        }}
      >
        <WarningIcon />

        <div
          style={{
            width: "100%",
            padding: "16px 20px",
            borderRadius: 12,
            backgroundColor: "#FFF8E0",
            border: "1px solid #F5BC2F",
          }}
        >
          <p
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#946F3F",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {maxVolume} m³
          </p>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "#946F3F",
              margin: "4px 0 0",
              lineHeight: 1.4,
            }}
          >
            Batas maksimum volume saat ini
          </p>
        </div>

        <p
          style={{
            fontSize: "0.9375rem",
            color: "#5c6c7a",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {user ? (
            <>
              Volume desain Anda melebihi batas <strong style={{ color: "#001e2b" }}>{maxVolume} m³</strong> yang ditetapkan.
              Hubungi administrator melalui email untuk mendapatkan akses kapasitas lebih besar.
            </>
          ) : (
            <>
              Sebagai tamu, Anda dibatasi hingga <strong style={{ color: "#001e2b" }}>{maxVolume} m³</strong>.
              Masuk atau buat akun untuk mengakses kapasitas yang lebih besar.
            </>
          )}
        </p>

        {user ? (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "0.625rem",
            }}
          >
            <a
              href={mailtoHref}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                width: "100%",
                height: 44,
                borderRadius: 9999,
                border: "none",
                backgroundColor: "#2DA44E",
                color: "#ffffff",
                fontSize: "0.9375rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background-color 0.15s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#218838";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#2DA44E";
              }}
            >
              <EmailIcon />
              Hubungi Admin via Email
            </a>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 9999,
                border: "1px solid #c1ccd6",
                backgroundColor: "transparent",
                color: "#001e2b",
                fontSize: "0.9375rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f9fbfa";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Mengerti
            </button>
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "0.625rem",
            }}
          >
            <button
              type="button"
              onClick={() => {
                onClose();
                onLoginClick?.();
              }}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 9999,
                border: "none",
                backgroundColor: "#2DA44E",
                color: "#ffffff",
                fontSize: "0.9375rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background-color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#218838";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#2DA44E";
              }}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onRegisterClick?.();
              }}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 9999,
                border: "1px solid #c1ccd6",
                backgroundColor: "transparent",
                color: "#001e2b",
                fontSize: "0.9375rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f9fbfa";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Buat Akun
            </button>
          </div>
        )}
      </div>
    </ModalBase>
  );
}
