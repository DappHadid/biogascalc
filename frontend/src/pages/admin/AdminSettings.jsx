import { useState, useEffect } from "react";
import { Settings, Save, Loader2 } from "lucide-react";
import api from "../../api/axios";
import { toast } from "sonner";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [limits, setLimits] = useState({
    guest: 5,
    user: 40,
  });

  useEffect(() => {
    fetchSettings();
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
    </div>
  );
}
