/* ── MaterialsTable — estimated bill of materials ─────────────
   Rough construction estimates derived from the dome's surface
   area (shell) and total volume. Coefficients are general rules
   of thumb for masonry biogas domes (fixed-dome type) and should
   be refined against real project data.
   ------------------------------------------------------------ */

function estimateMaterials(surfaceArea, materialsConfig) {
  const SA = Math.max(0, surfaceArea);
  return materialsConfig.map(m => ({
    name: m.name,
    qty: m.unit === "buah" ? Math.ceil(SA * m.coefficientPerM2) : SA * m.coefficientPerM2,
    unit: m.unit,
  }));
}

export default function MaterialsTable({ calc, materialsConfig = [] }) {
  const materials = estimateMaterials(calc.surfaceArea, materialsConfig);

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e1e5e8",
        borderRadius: 12,
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: "#00684a" }}>
            Estimasi
          </p>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#001e2b" }}>
            Bahan Baku Pembuatan
          </h2>
        </div>
        <span style={{ fontSize: "0.75rem", color: "#a8b3bc" }}>
          Berdasarkan luas permukaan {calc.surfaceArea.toLocaleString("id-ID", { maximumFractionDigits: 2 })} m²
        </span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Bahan", "Estimasi Kebutuhan", "Satuan"].map((h, i) => (
                <th
                  key={h}
                  style={{
                    textAlign: i === 1 ? "right" : "left",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#7c8c9a",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    padding: "8px 12px",
                    borderBottom: "1px solid #e1e5e8",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {materials.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", padding: "20px 12px", color: "#a8b3bc", fontSize: "0.875rem" }}>
                  Data bahan baku belum tersedia.
                </td>
              </tr>
            ) : (
              materials.map((m) => (
                <tr key={m.name}>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "#001e2b",
                      borderBottom: "1px solid #f0f3f2",
                    }}
                  >
                    {m.name}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#00684a",
                      textAlign: "right",
                      fontVariantNumeric: "tabular-nums",
                      borderBottom: "1px solid #f0f3f2",
                    }}
                  >
                    {m.qty.toLocaleString("id-ID", { maximumFractionDigits: 1 })}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: "0.8125rem",
                      color: "#7c8c9a",
                      borderBottom: "1px solid #f0f3f2",
                    }}
                  >
                    {m.unit}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: "0.75rem", color: "#a8b3bc" }}>
        *Estimasi kasar untuk perencanaan awal, bukan hasil perhitungan RAB final.
      </p>
    </div>
  );
}

