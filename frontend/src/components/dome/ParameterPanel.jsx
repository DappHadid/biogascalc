/* ── ParameterPanel — input form for dome parameters ────────── */
import { useEffect } from "react";
import { useDomeCalculations } from "../../hooks/useDomeCalculations";
import {
  maxDiameterCm,
  maxHeightCm,
  maxLengthCm,
  maxWallHeightCm,
  maxWidthCm,
} from "../../utils/dynamicRanges";

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

function Field({ label, unit, capped, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#3d4f5b" }}>
          {label}
        </label>
        {unit && (
          <span
            title={capped ? "Dibatasi oleh sisa kuota volume — kecilkan dimensi lain untuk menambah ruang" : undefined}
            style={{ fontSize: "0.75rem", color: capped ? "#b45309" : "#a8b3bc", fontWeight: capped ? 600 : 400, cursor: capped ? "help" : "default" }}
          >
            {unit}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/* ── Volume quota bar — single, always-visible summary of how much of
   the plan's volume cap the current dimensions use up. Replaces
   per-field warning text with one glanceable indicator. ────────── */
function VolumeQuotaBar({ usedVolume, maxVolume }) {
  const pct = Math.min(100, (usedVolume / maxVolume) * 100);
  const color = pct >= 92 ? "#e8534d" : pct >= 70 ? "#e8a33d" : "#00ed64";

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "#5c6c7a" }}>
          Kuota Volume
        </span>
        <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#001e2b" }}>
          {usedVolume.toFixed(2)} / {maxVolume} m³
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 9999, backgroundColor: "#eef1f3", overflow: "hidden" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 9999,
            backgroundColor: color,
            transition: "width 0.2s ease-out, background-color 0.2s ease-out",
          }}
        />
      </div>
    </div>
  );
}

// Round a dynamic (fractional) max down to the nearest step, so the
// displayed/selectable value always lands on a step the user can type too.
function flooredMax(min, max, step) {
  const steps = Math.floor((max - min) / step);
  return min + Math.max(0, steps) * step;
}

function RangeInput({ value, min, max, step = 1, onChange, limited }) {
  const cappedMax = flooredMax(min, max, step);
  const displayValue = Math.min(value, cappedMax);

  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={cappedMax}
        step={step}
        value={displayValue}
        onChange={(e) => onChange(+e.target.value)}
        className="flex-1"
        style={{ accentColor: limited ? "#e8a33d" : "#00ed64" }}
      />
      <input
        type="number"
        min={min}
        max={cappedMax}
        step={step}
        value={displayValue}
        onChange={(e) => onChange(Math.min(+e.target.value, cappedMax))}
        style={{
          width: 72,
          height: 36,
          textAlign: "center",
          borderRadius: 8,
          border: limited ? "1px solid #e8a33d" : "1px solid #c1ccd6",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#001e2b",
          background: limited ? "#fff8ec" : "#ffffff",
          outline: "none",
        }}
        onFocus={(e) => { e.target.style.borderColor = "#00684a"; e.target.style.borderWidth = "2px"; }}
        onBlur={(e)  => { e.target.style.borderColor = limited ? "#e8a33d" : "#c1ccd6"; e.target.style.borderWidth = "1px"; }}
      />
    </div>
  );
}

const HARD_LIMITS = {
  diameter:   { min: 50, max: 2000 },
  height:     { min: 50, max: 1500 },
  length:     { min: 10, max: 2000 },
  width:      { min: 10, max: 1500 },
  wallHeight: { min: 10, max: 1000 },
};

export default function ParameterPanel({ params, onChange, onApply, user, onTrack, isCapped, onCapExceeded, maxVolume }) {
  const set = (key, apply = false) => (val) => onChange({ ...params, [key]: val }, apply);
  const isRectangle = params.shapeType === "rectangle";
  const { totalVolume: usedVolume } = useDomeCalculations(params);

  // Dynamic ceilings: how far each slider can go without pushing
  // totalVolume past maxVolume, given the other dimensions as-is.
  const dynDiameterMax = maxDiameterCm(params.height, maxVolume, HARD_LIMITS.diameter.max);
  const dynHeightMax   = maxHeightCm(params.diameter, maxVolume, HARD_LIMITS.height.max);
  const dynLengthMax     = maxLengthCm(params.width, params.wallHeight, maxVolume, HARD_LIMITS.length.max);
  const dynWidthMax      = maxWidthCm(params.length, params.wallHeight, maxVolume, HARD_LIMITS.width.max);
  const dynWallHeightMax = maxWallHeightCm(params.length, params.width, maxVolume, HARD_LIMITS.wallHeight.max);

  // Keep the stored value in sync with what the slider displays: once a
  // field's dynamic ceiling drops below its current value (because a
  // sibling field grew), clamp it for real instead of just visually —
  // otherwise "Visualisasikan" would apply a number the user never saw.
  useEffect(() => {
    if (isRectangle) {
      if (params.length > dynLengthMax) { set("length")(flooredMax(HARD_LIMITS.length.min, dynLengthMax, 5)); return; }
      if (params.width > dynWidthMax) { set("width")(flooredMax(HARD_LIMITS.width.min, dynWidthMax, 5)); return; }
      if (params.wallHeight > dynWallHeightMax) { set("wallHeight")(flooredMax(HARD_LIMITS.wallHeight.min, dynWallHeightMax, 5)); return; }
    } else {
      if (params.diameter > dynDiameterMax) { set("diameter")(flooredMax(HARD_LIMITS.diameter.min, dynDiameterMax, 5)); return; }
      if (params.height > dynHeightMax) { set("height")(flooredMax(HARD_LIMITS.height.min, dynHeightMax, 5)); return; }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRectangle, dynDiameterMax, dynHeightMax, dynLengthMax, dynWidthMax, dynWallHeightMax]);

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

      <VolumeQuotaBar usedVolume={usedVolume} maxVolume={maxVolume} />

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
          <Field
            label="Panjang (P)"
            unit={`${HARD_LIMITS.length.min} – ${flooredMax(HARD_LIMITS.length.min, dynLengthMax, 5)} cm`}
            capped={dynLengthMax < HARD_LIMITS.length.max}
          >
            <RangeInput
              value={params.length}
              min={HARD_LIMITS.length.min} max={dynLengthMax} step={5}
              onChange={set("length")}
              limited={dynLengthMax < HARD_LIMITS.length.max}
            />
          </Field>

          {/* Lebar */}
          <Field
            label="Lebar (L)"
            unit={`${HARD_LIMITS.width.min} – ${flooredMax(HARD_LIMITS.width.min, dynWidthMax, 5)} cm`}
            capped={dynWidthMax < HARD_LIMITS.width.max}
          >
            <RangeInput
              value={params.width}
              min={HARD_LIMITS.width.min} max={dynWidthMax} step={5}
              onChange={set("width")}
              limited={dynWidthMax < HARD_LIMITS.width.max}
            />
          </Field>

          {/* Tinggi dinding */}
          <Field
            label="Tinggi (T)"
            unit={`${HARD_LIMITS.wallHeight.min} – ${flooredMax(HARD_LIMITS.wallHeight.min, dynWallHeightMax, 5)} cm`}
            capped={dynWallHeightMax < HARD_LIMITS.wallHeight.max}
          >
            <RangeInput
              value={params.wallHeight}
              min={HARD_LIMITS.wallHeight.min} max={dynWallHeightMax} step={5}
              onChange={set("wallHeight")}
              limited={dynWallHeightMax < HARD_LIMITS.wallHeight.max}
            />
          </Field>
        </>
      ) : (
        <>
          {/* Diameter */}
          <Field
            label="Diameter"
            unit={`${HARD_LIMITS.diameter.min} – ${flooredMax(HARD_LIMITS.diameter.min, dynDiameterMax, 5)} cm`}
            capped={dynDiameterMax < HARD_LIMITS.diameter.max}
          >
            <RangeInput
              value={params.diameter}
              min={HARD_LIMITS.diameter.min} max={dynDiameterMax} step={5}
              onChange={set("diameter")}
              limited={dynDiameterMax < HARD_LIMITS.diameter.max}
            />
          </Field>

          {/* Height */}
          <Field
            label="Tinggi Dome"
            unit={`${HARD_LIMITS.height.min} – ${flooredMax(HARD_LIMITS.height.min, dynHeightMax, 5)} cm`}
            capped={dynHeightMax < HARD_LIMITS.height.max}
          >
            <RangeInput
              value={params.height}
              min={HARD_LIMITS.height.min} max={dynHeightMax} step={5}
              onChange={set("height")}
              limited={dynHeightMax < HARD_LIMITS.height.max}
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
          onClick={() => {
            if (isCapped && onCapExceeded) {
              onCapExceeded();
              return;
            }
            onApply();
            if (user && onTrack) {
              onTrack(params.shapeType === "rectangle" ? "visualize_rectangle" : "visualize_circular");
            }
          }}
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
