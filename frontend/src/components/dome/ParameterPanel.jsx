/* ── ParameterPanel — input form for dome parameters ────────── */

const CircularIcon = ({ color }) => (
  <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 26V36C14 37.1046 14.8954 38 16 38H32C33.1046 38 34 37.1046 34 36V26" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 26C14 20.4772 18.4772 16 24 16C29.5228 16 34 20.4772 34 26" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 26H36" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RectangleIcon = ({ color }) => (
  <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 18H36V36C36 37.1046 35.1046 38 34 38H14C12.8954 38 12 37.1046 12 36V18Z" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 18H38" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 28H36" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" opacity="0.6"/>
  </svg>
);

const SHAPE_OPTIONS = [
  { value: "circular",  label: "Circular", icon: CircularIcon },
  { value: "rectangle", label: "Rectangle", icon: RectangleIcon },
];

const DEFAULT_PARAMS = {
  diameter:   600,
  height:     400,
  length:     600,
  width:      400,
  wallHeight: 200,
  shapeType:  "circular",
  showPerson: true,
};

function Field({ label, unit, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#3d4f5b" }}>
          {label}
        </label>
        {unit && (
          <span style={{ fontSize: "0.75rem", color: "#a8b3bc" }}>{unit}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function RangeInput({ value, min, max, step = 1, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="flex-1"
        style={{ accentColor: "#00ed64" }}
      />
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        style={{
          width: 72,
          height: 36,
          textAlign: "center",
          borderRadius: 8,
          border: "1px solid #c1ccd6",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#001e2b",
          background: "#ffffff",
          outline: "none",
        }}
        onFocus={(e) => { e.target.style.borderColor = "#00684a"; e.target.style.borderWidth = "2px"; }}
        onBlur={(e)  => { e.target.style.borderColor = "#c1ccd6"; e.target.style.borderWidth = "1px"; }}
      />
    </div>
  );
}

export default function ParameterPanel({ params, onChange, onApply }) {
  const set = (key, apply = false) => (val) => onChange({ ...params, [key]: val }, apply);
  const isRectangle = params.shapeType === "rectangle";

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e1e5e8",
        borderRadius: 12,
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
      }}
    >
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: "#00684a" }}>
          Parameter
        </p>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#001e2b" }}>
          Konfigurasi Dome
        </h2>
      </div>

      <hr style={{ borderColor: "#e1e5e8", margin: 0 }} />

      {/* Shape type */}
      <Field label="Bentuk Dome">
        <div className="grid grid-cols-2 gap-2">
          {SHAPE_OPTIONS.map((opt) => {
            const active = params.shapeType === opt.value;
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                onClick={() => set("shapeType", true)(opt.value)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 4px",
                  borderRadius: 10,
                  fontSize: "0.8125rem",
                  fontWeight: active ? 600 : 500,
                  border: active ? "1.5px solid #00ed64" : "1px solid #e1e5e8",
                  backgroundColor: active ? "#e3fcef" : "#f9fbfa",
                  color: active ? "#00684a" : "#5c6c7a",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <Icon color={active ? "#00684a" : "#a8b3bc"} />
                {opt.label}
              </button>
            );
          })}
        </div>
      </Field>

      {isRectangle ? (
        <>
          {/* Panjang */}
          <Field label="Panjang (P)" unit="10 – 2000 cm">
            <RangeInput
              value={params.length}
              min={10} max={2000} step={5}
              onChange={set("length")}
            />
          </Field>

          {/* Lebar */}
          <Field label="Lebar (L)" unit="10 – 1500 cm">
            <RangeInput
              value={params.width}
              min={10} max={1500} step={5}
              onChange={set("width")}
            />
          </Field>

          {/* Tinggi dinding */}
          <Field label="Tinggi (T)" unit="10 – 1000 cm">
            <RangeInput
              value={params.wallHeight}
              min={10} max={1000} step={5}
              onChange={set("wallHeight")}
            />
          </Field>
        </>
      ) : (
        <>
          {/* Diameter */}
          <Field label="Diameter" unit="50 – 2000 cm">
            <RangeInput
              value={params.diameter}
              min={50} max={2000} step={5}
              onChange={set("diameter")}
            />
          </Field>

          {/* Height */}
          <Field label="Tinggi Dome" unit="50 – 1500 cm">
            <RangeInput
              value={params.height}
              min={50} max={1500} step={5}
              onChange={set("height")}
            />
          </Field>
        </>
      )}

      {/* Buttons & Toggles */}
      <div className="flex flex-col gap-4 mt-auto">
        {/* Toggle Figur */}
        <div className="flex items-center justify-between">
          <label
            style={{ fontSize: "0.875rem", fontWeight: 600, color: "#3d4f5b", cursor: "pointer", margin: 0 }}
            onClick={() => set("showPerson", true)(!params.showPerson)}
          >
            Tampilkan Figur Manusia
          </label>
          <button
            type="button"
            onClick={() => set("showPerson", true)(!params.showPerson)}
            style={{
              width: 44,
              height: 24,
              borderRadius: 9999,
              backgroundColor: params.showPerson ? "#00ed64" : "#c1ccd6",
              border: "none",
              position: "relative",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 2,
                left: params.showPerson ? 22 : 2,
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                transition: "left 0.2s ease-in-out",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }}
            />
          </button>
        </div>

        {/* Visualisasikan Button */}
        <button
          onClick={onApply}
          style={{
            width: "100%",
            padding: "9px 0",
            borderRadius: 9999,
            fontSize: "0.875rem",
            fontWeight: 600,
            border: "none",
            backgroundColor: "#00ed64",
            color: "#001e2b",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#00d85a"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#00ed64"; }}
        >
          Visualisasikan
        </button>
      </div>
    </div>
  );
}

export { DEFAULT_PARAMS };
