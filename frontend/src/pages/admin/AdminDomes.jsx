import { useState, useEffect, useRef, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  MapPin,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../../api/axios";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const makeIcon = (active = false) =>
  L.divIcon({
    className: "",
    html: `<svg width="28" height="40" viewBox="0 0 28 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26S28 24.5 28 14C28 6.268 21.732 0 14 0z"
        fill="${active ? "#3b82f6" : "#1e293b"}" />
      <circle cx="14" cy="14" r="6"
        fill="${active ? "#ffffff" : "#3b82f6"}" />
    </svg>`,
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -42],
  });

const TYPE_OPTIONS = ["Peternakan", "Perkebunan", "Industri", "Komunitas"];
const STATUS_OPTIONS = ["Aktif", "Potensi"];

const TYPE_COLOR = {
  Peternakan: { bg: "#ecfdf5", text: "#059669" },
  Perkebunan: { bg: "#f0fdf4", text: "#15803d" },
  Industri: { bg: "#fff7ed", text: "#c2410c" },
  Komunitas: { bg: "#f5f3ff", text: "#6d28d9" },
};

const EMPTY_FORM = {
  name: "",
  city: "",
  lat: "",
  lng: "",
  type: "Peternakan",
  limbahPerHari: "",
  potensiGas: "",
  diameter: "",
  tinggi: "",
  status: "Potensi",
};

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

function FlyTo({ target }) {
  const map = useMap();
  if (target) {
    map.flyTo([target.lat, target.lng], 13, { duration: 1 });
  }
  return null;
}

export default function AdminDomes() {
  const [domes, setDomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const { isSuperAdmin } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [activeDome, setActiveDome] = useState(null);
  const [flyTarget, setFlyTarget] = useState(null);
  const markersRef = useRef({});

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchDomes = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/domes/managed");
      setDomes(data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data dome.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDomes();
  }, [fetchDomes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (dome) => {
    setEditId(dome._id);
    setForm({
      name: dome.name,
      city: dome.city,
      lat: dome.lat,
      lng: dome.lng,
      type: dome.type,
      limbahPerHari: dome.limbahPerHari || "",
      potensiGas: dome.potensiGas || "",
      diameter: dome.diameter || "",
      tinggi: dome.tinggi || "",
      status: dome.status,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const handleMapClickInModal = (latlng) => {
    setForm((prev) => ({
      ...prev,
      lat: latlng.lat.toFixed(6),
      lng: latlng.lng.toFixed(6),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        limbahPerHari: parseFloat(form.limbahPerHari) || 0,
        potensiGas: parseFloat(form.potensiGas) || 0,
        diameter: parseFloat(form.diameter) || 0,
        tinggi: parseFloat(form.tinggi) || 0,
      };
      if (editId) {
        await api.put(`/domes/${editId}`, payload);
      } else {
        await api.post("/domes", payload);
      }
      toast.success(editId ? "Dome berhasil diperbarui" : "Dome berhasil ditambahkan");
      closeModal();
      fetchDomes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/domes/${deleteTarget._id}`);
      toast.success("Dome berhasil dihapus");
      setDeleteTarget(null);
      fetchDomes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus data.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSelectDome = useCallback((dome) => {
    setActiveDome(dome._id);
    setFlyTarget(dome);
    setTimeout(() => {
      markersRef.current[dome._id]?.openPopup();
    }, 1100);
  }, []);

  return (
    <div className="admin-dome">
      <div className="admin-dome__header">
        <div>
          <h1 className="admin-dome__title">Manajemen Dome</h1>
          <p className="admin-dome__subtitle">
            Kelola data dome biogas — data ini tampil di halaman Lokasi
          </p>
        </div>
        {isSuperAdmin && (
          <button className="admin-btn admin-btn--primary" onClick={openCreateModal}>
            <Plus size={18} strokeWidth={2} />
            Tambah Dome
          </button>
        )}
      </div>

      <div className="admin-dome__map-wrapper">
        <MapContainer
          center={[-2.5, 117.5]}
          zoom={5}
          style={{ width: "100%", height: "100%" }}
          scrollWheelZoom
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={19}
          />
          <FlyTo target={flyTarget} />
          {domes.map((dome) => (
            <Marker
              key={dome._id}
              position={[dome.lat, dome.lng]}
              icon={makeIcon(activeDome === dome._id)}
              ref={(ref) => {
                if (ref) markersRef.current[dome._id] = ref;
              }}
              eventHandlers={{ click: () => handleSelectDome(dome) }}
            >
              <Popup closeButton={false}>
                <div style={{ minWidth: 200, padding: "4px 2px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <span
                      style={{
                        width: 7, height: 7, borderRadius: "50%",
                        backgroundColor: dome.status === "Aktif" ? "#059669" : "#d97706",
                      }}
                    />
                    <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: dome.status === "Aktif" ? "#059669" : "#d97706", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {dome.status}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b", marginBottom: 2 }}>{dome.name}</p>
                  <p style={{ fontSize: "0.8125rem", color: "#94a3b8", marginBottom: 10 }}>{dome.city}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: 10, backgroundColor: "#f8fafc", borderRadius: 8, border: "1px solid #e5e7eb" }}>
                    <div>
                      <p style={{ fontSize: "0.6875rem", color: "#94a3b8", marginBottom: 1 }}>Limbah/hari</p>
                      <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#1e293b" }}>{(dome.limbahPerHari || 0).toLocaleString("id-ID")} kg</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.6875rem", color: "#94a3b8", marginBottom: 1 }}>Potensi gas</p>
                      <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#059669" }}>{(dome.potensiGas || 0).toLocaleString("id-ID")} m³</p>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="admin-dome__map-stat">
          <p style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Total Dome</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b", lineHeight: 1.1 }}>{domes.length}</p>
          <p style={{ fontSize: "0.8125rem", color: "#94a3b8", marginTop: 2 }}>
            {domes.filter((d) => d.status === "Aktif").length} aktif
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "3rem 0" }}>
          <div className="admin-spinner" />
        </div>
      ) : error ? (
        <div className="admin-dome__error">
          <AlertTriangle size={20} />
          <span>{error}</span>
          <button onClick={fetchDomes} className="admin-btn admin-btn--ghost" style={{ marginLeft: 8 }}>
            Coba lagi
          </button>
        </div>
      ) : domes.length === 0 ? (
        <div className="admin-dome__empty">
          <MapPin size={40} strokeWidth={1.5} style={{ color: "#94a3b8", marginBottom: 12 }} />
          <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#475569", marginBottom: 4 }}>Belum ada data dome</p>
          <p style={{ fontSize: "0.8125rem", color: "#94a3b8", marginBottom: 16 }}>Mulai dengan menambahkan dome pertama</p>
          {isSuperAdmin && (
            <button className="admin-btn admin-btn--primary" onClick={openCreateModal}>
              <Plus size={16} /> Tambah Dome
            </button>
          )}
        </div>
      ) : (
        <div className="admin-chart-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Kota</th>
                  <th>Tipe</th>
                  <th>Diameter</th>
                  <th>Tinggi</th>
                  <th>Limbah/hari</th>
                  <th>Potensi Gas</th>
                  <th>Status</th>
                  <th style={{ textAlign: "center" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {domes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((dome) => {
                  const typeColor = TYPE_COLOR[dome.type] || { bg: "#f1f5f9", text: "#475569" };
                  return (
                    <tr
                      key={dome._id}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSelectDome(dome)}
                    >
                      <td>
                        <span style={{ fontWeight: 600, color: "#1e293b" }}>{dome.name}</span>
                      </td>
                      <td className="admin-table__muted">{dome.city}</td>
                      <td>
                        <span
                          style={{
                            fontSize: "0.6875rem",
                            fontWeight: 600,
                            padding: "3px 10px",
                            borderRadius: 9999,
                            backgroundColor: typeColor.bg,
                            color: typeColor.text,
                          }}
                        >
                          {dome.type}
                        </span>
                      </td>
                      <td className="admin-table__muted">{dome.diameter ? `${dome.diameter} m` : "—"}</td>
                      <td className="admin-table__muted">{dome.tinggi ? `${dome.tinggi} m` : "—"}</td>
                      <td className="admin-table__muted">{(dome.limbahPerHari || 0).toLocaleString("id-ID")} kg</td>
                      <td style={{ fontWeight: 600, color: "#059669" }}>{(dome.potensiGas || 0).toLocaleString("id-ID")} m³</td>
                      <td>
                        <span className={`admin-table__status ${dome.status === "Aktif" ? "admin-table__status--active" : "admin-table__status--inactive"}`}>
                          {dome.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", justifyContent: "center", gap: 6 }} onClick={(e) => e.stopPropagation()}>
                          <button
                            className="admin-btn admin-btn--icon"
                            title="Edit"
                            onClick={() => openEditModal(dome)}
                          >
                            <Pencil size={15} />
                          </button>
                          {isSuperAdmin && (
                            <button
                              className="admin-btn admin-btn--icon admin-btn--icon-danger"
                              title="Hapus"
                              onClick={() => setDeleteTarget(dome)}
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderTop: "1px solid #e5e7eb" }}>
            <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
              Menampilkan {domes.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, domes.length)} dari {domes.length} data
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ padding: "6px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", backgroundColor: currentPage === 1 ? "#f1f5f9" : "white", color: currentPage === 1 ? "#94a3b8" : "#475569", cursor: currentPage === 1 ? "not-allowed" : "pointer", fontSize: "0.875rem", fontWeight: 500 }}
              >
                Sebelumnya
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(domes.length / itemsPerPage), p + 1))}
                disabled={currentPage === Math.ceil(domes.length / itemsPerPage) || domes.length === 0}
                style={{ padding: "6px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", backgroundColor: currentPage === Math.ceil(domes.length / itemsPerPage) || domes.length === 0 ? "#f1f5f9" : "white", color: currentPage === Math.ceil(domes.length / itemsPerPage) || domes.length === 0 ? "#94a3b8" : "#475569", cursor: currentPage === Math.ceil(domes.length / itemsPerPage) || domes.length === 0 ? "not-allowed" : "pointer", fontSize: "0.875rem", fontWeight: 500 }}
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <>
          <div className="admin-modal-overlay" onClick={closeModal} />
          <div className="admin-modal">
            <div className="admin-modal__header">
              <h2 className="admin-modal__title">
                {editId ? "Edit Dome" : "Tambah Dome Baru"}
              </h2>
              <button className="admin-btn admin-btn--icon" onClick={closeModal}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-modal__body">
              <div style={{ marginBottom: 16 }}>
                <label className="admin-form-label">
                  Pilih Lokasi di Peta <span style={{ color: "#94a3b8", fontWeight: 400 }}>(klik untuk set koordinat)</span>
                </label>
                <div className="admin-dome__modal-map">
                  <MapContainer
                    center={form.lat && form.lng ? [parseFloat(form.lat), parseFloat(form.lng)] : [-2.5, 117.5]}
                    zoom={form.lat && form.lng ? 10 : 5}
                    style={{ width: "100%", height: "100%" }}
                    scrollWheelZoom
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      maxZoom={19}
                    />
                    <MapClickHandler onMapClick={handleMapClickInModal} />
                    {form.lat && form.lng && (
                      <Marker position={[parseFloat(form.lat), parseFloat(form.lng)]} icon={makeIcon(true)} />
                    )}
                  </MapContainer>
                </div>
              </div>

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="dome-name">Nama Lokasi *</label>
                  <input className="admin-form-input" id="dome-name" name="name" value={form.name} onChange={handleChange} required placeholder="Contoh: Peternakan Sapi Gowa" />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="dome-city">Kota *</label>
                  <input className="admin-form-input" id="dome-city" name="city" value={form.city} onChange={handleChange} required placeholder="Contoh: Makassar, Sulawesi Selatan" />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="dome-lat">Latitude *</label>
                  <input className="admin-form-input" id="dome-lat" name="lat" type="number" step="any" value={form.lat} onChange={handleChange} required placeholder="-6.2088" />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="dome-lng">Longitude *</label>
                  <input className="admin-form-input" id="dome-lng" name="lng" type="number" step="any" value={form.lng} onChange={handleChange} required placeholder="106.8456" />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="dome-type">Tipe *</label>
                  <select className="admin-form-input" id="dome-type" name="type" value={form.type} onChange={handleChange}>
                    {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="dome-status">Status</label>
                  <select className="admin-form-input" id="dome-status" name="status" value={form.status} onChange={handleChange}>
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="dome-diameter">Diameter (m)</label>
                  <input className="admin-form-input" id="dome-diameter" name="diameter" type="number" step="any" min="0" value={form.diameter} onChange={handleChange} placeholder="0" />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="dome-tinggi">Tinggi (m)</label>
                  <input className="admin-form-input" id="dome-tinggi" name="tinggi" type="number" step="any" min="0" value={form.tinggi} onChange={handleChange} placeholder="0" />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="dome-limbah">Limbah/hari (kg)</label>
                  <input className="admin-form-input" id="dome-limbah" name="limbahPerHari" type="number" step="any" min="0" value={form.limbahPerHari} onChange={handleChange} placeholder="0" />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="dome-gas">Potensi Gas (m³/hari)</label>
                  <input className="admin-form-input" id="dome-gas" name="potensiGas" type="number" step="any" min="0" value={form.potensiGas} onChange={handleChange} placeholder="0" />
                </div>
              </div>

              <div className="admin-modal__footer">
                <button type="button" className="admin-btn admin-btn--ghost" onClick={closeModal}>
                  Batal
                </button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                  {saving && <Loader2 size={16} className="admin-spin" />}
                  {editId ? "Simpan Perubahan" : "Tambah Dome"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {deleteTarget && (
        <>
          <div className="admin-modal-overlay" onClick={() => setDeleteTarget(null)} />
          <div className="admin-modal admin-modal--sm">
            <div style={{ padding: 24, textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <AlertTriangle size={24} color="#dc2626" />
              </div>
              <h3 style={{ fontSize: "1.0625rem", fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>Hapus Dome?</h3>
              <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: 24 }}>
                Apakah Anda yakin ingin menghapus <strong>{deleteTarget.name}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button className="admin-btn admin-btn--ghost" onClick={() => setDeleteTarget(null)}>
                  Batal
                </button>
                <button className="admin-btn admin-btn--danger" onClick={handleDelete} disabled={deleting}>
                  {deleting && <Loader2 size={16} className="admin-spin" />}
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
