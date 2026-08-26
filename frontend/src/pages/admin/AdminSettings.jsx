import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import api from "../../api/axios";
import { toast } from "sonner";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [limits, setLimits] = useState({
    guest: 5,
    user: 40,
  });

  const [materialsLoading, setMaterialsLoading] = useState(true);
  const [materialsSaving, setMaterialsSaving] = useState(false);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetchSettings();
    fetchMaterials();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/settings/volume-limits");
      if (data.success) {
        setLimits({
          guest: data.data.guest,
          user: data.data.user,
        });
      }
    } catch (err) {
      toast.error("Gagal memuat pengaturan");
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      setMaterialsLoading(true);
      const { data } = await api.get("/settings/dome-materials");
      if (data.success) {
        setMaterials(data.data);
      }
    } catch (err) {
      toast.error("Gagal memuat data bahan baku");
    } finally {
      setMaterialsLoading(false);
    }
  };

  const handleSave = async () => {
    if (limits.guest <= 0 || limits.user <= 0) {
      toast.error("Batas volume harus lebih dari 0");
      return;
    }

    try {
      setSaving(true);
      await api.put("/settings/volume-limits", limits);
      toast.success("Pengaturan berhasil disimpan");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan pengaturan");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLimits(prev => ({
      ...prev,
      [name]: value === "" ? "" : Number(value)
    }));
  };

  const handleMaterialChange = (index, field, value) => {
    setMaterials(prev => prev.map((m, i) => {
      if (i !== index) return m;
      if (field === "coefficientPerM2") {
        return { ...m, [field]: value === "" ? "" : Number(value) };
      }
      return { ...m, [field]: value };
    }));
  };

  const handleAddMaterial = () => {
    setMaterials(prev => [...prev, { name: "", coefficientPerM2: 0, unit: "" }]);
  };

  const handleRemoveMaterial = (index) => {
    setMaterials(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveMaterials = async () => {
    for (let i = 0; i < materials.length; i++) {
      const m = materials[i];
      if (!m.name || m.name.trim() === "") {
        toast.error(`Baris ke-${i + 1}: nama bahan wajib diisi`);
        return;
      }
      if (m.coefficientPerM2 === "" || m.coefficientPerM2 < 0) {
        toast.error(`Baris ke-${i + 1} (${m.name}): koefisien harus >= 0`);
        return;
      }
      if (!m.unit || m.unit.trim() === "") {
        toast.error(`Baris ke-${i + 1} (${m.name}): satuan wajib diisi`);
        return;
      }
    }

    try {
      setMaterialsSaving(true);
      const { data } = await api.put("/settings/dome-materials", { materials });
      if (data.success) {
        toast.success("Data bahan baku berhasil disimpan");
        if (data.data) setMaterials(data.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan data bahan baku");
    } finally {
      setMaterialsSaving(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <div>
          <h1 className="admin-dashboard__title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            Pengaturan
          </h1>
          <p className="admin-dashboard__subtitle">Konfigurasi pengaturan utama platform BioGasCalc</p>
        </div>
      </div>

      <div className="ahp-section" style={{ maxWidth: 600 }}>
        <div className="ahp-section__header" style={{ marginBottom: "20px" }}>
          <div>
            <h2 className="ahp-section__title">Batas Volume Total Dome</h2>
            <p className="ahp-section__desc">
              Atur batas maksimal volume total dome yang dapat dirancang oleh pengguna. 
              Maksimal yang direkomendasikan untuk guest adalah 5 m³.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="ahp-loading">
            <Loader2 size={24} className="ahp-spin" /> Memuat data...
          </div>
        ) : (
          <div className="ahp-cards">
            <div className="ahp-step-card__body">
              <div className="ahp-field">
                <label className="ahp-label">Batas Volume untuk Guest (Belum Login) — m³</label>
                <input
                  type="number"
                  name="guest"
                  value={limits.guest}
                  onChange={handleChange}
                  className="ahp-input"
                  min="1"
                  step="0.5"
                  placeholder="Contoh: 5"
                />
              </div>

              <div className="ahp-field" style={{ marginTop: "16px" }}>
                <label className="ahp-label">Batas Volume untuk User (Sudah Login) — m³</label>
                <input
                  type="number"
                  name="user"
                  value={limits.user}
                  onChange={handleChange}
                  className="ahp-input"
                  min="1"
                  step="0.5"
                  placeholder="Contoh: 40"
                />
              </div>
            </div>
          </div>
        )}

        <div className="ahp-actions" style={{ marginTop: "24px" }}>
          <button 
            onClick={handleSave} 
            disabled={loading || saving} 
            className="ahp-btn ahp-btn--save"
          >
            {saving ? <Loader2 size={16} className="ahp-spin" /> : <Save size={16} />}
            Simpan Pengaturan
          </button>
        </div>
      </div>

      <div className="ahp-section" style={{ marginTop: "32px" }}>
        <div className="ahp-section__header" style={{ marginBottom: "20px" }}>
          <div>
            <h2 className="ahp-section__title">Estimasi Bahan Baku Dome</h2>
            <p className="ahp-section__desc">
              Kelola daftar bahan baku dan koefisien estimasi per m² luas permukaan dome. 
              Data ini ditampilkan kepada user di halaman Rancang Dome dan dokumen PDF.
            </p>
          </div>
        </div>

        {materialsLoading ? (
          <div className="ahp-loading">
            <Loader2 size={24} className="ahp-spin" /> Memuat data bahan baku...
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
                <thead>
                  <tr>
                    {["No", "Nama Bahan", "Koefisien per m²", "Satuan", ""].map((h, i) => (
                      <th
                        key={h || "actions"}
                        style={{
                          textAlign: i === 2 ? "right" : "left",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          color: "#5c6c7a",
                          padding: "10px 12px",
                          borderBottom: "2px solid #e1e5e8",
                          whiteSpace: "nowrap",
                          width: i === 0 ? 50 : i === 4 ? 50 : undefined,
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
                      <td colSpan={5} style={{ textAlign: "center", padding: "24px 12px", color: "#a8b3bc", fontSize: "0.875rem" }}>
                        Belum ada data bahan baku. Klik "Tambah Bahan" untuk menambahkan.
                      </td>
                    </tr>
                  ) : (
                    materials.map((m, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #f0f3f2" }}>
                        <td style={{ padding: "8px 12px", fontSize: "0.875rem", color: "#7c8c9a", fontWeight: 500 }}>
                          {idx + 1}
                        </td>
                        <td style={{ padding: "8px 12px" }}>
                          <input
                            type="text"
                            value={m.name}
                            onChange={(e) => handleMaterialChange(idx, "name", e.target.value)}
                            className="ahp-input"
                            placeholder="Nama bahan"
                            style={{ margin: 0, minWidth: 160 }}
                          />
                        </td>
                        <td style={{ padding: "8px 12px" }}>
                          <input
                            type="number"
                            value={m.coefficientPerM2}
                            onChange={(e) => handleMaterialChange(idx, "coefficientPerM2", e.target.value)}
                            className="ahp-input"
                            placeholder="0"
                            min="0"
                            step="0.01"
                            style={{ margin: 0, textAlign: "right", width: 120 }}
                          />
                        </td>
                        <td style={{ padding: "8px 12px" }}>
                          <input
                            type="text"
                            value={m.unit}
                            onChange={(e) => handleMaterialChange(idx, "unit", e.target.value)}
                            className="ahp-input"
                            placeholder="Satuan"
                            style={{ margin: 0, width: 100 }}
                          />
                        </td>
                        <td style={{ padding: "8px 12px", textAlign: "center" }}>
                          <button
                            onClick={() => handleRemoveMaterial(idx)}
                            title="Hapus bahan"
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#e8534d",
                              padding: 4,
                              borderRadius: 6,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "background-color 0.15s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fef2f2"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="ahp-actions" style={{ marginTop: "16px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={handleAddMaterial}
                className="ahp-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: 8,
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  border: "1px solid #c1ccd6",
                  backgroundColor: "#ffffff",
                  color: "#3d4f5b",
                  cursor: "pointer",
                }}
              >
                <Plus size={16} />
                Tambah Bahan
              </button>

              <button
                onClick={handleSaveMaterials}
                disabled={materialsLoading || materialsSaving}
                className="ahp-btn ahp-btn--save"
              >
                {materialsSaving ? <Loader2 size={16} className="ahp-spin" /> : <Save size={16} />}
                Simpan Bahan Baku
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
