import { useState, useEffect } from "react";
import { TrendingUp, Cuboid, Mail, History, X, Save, Loader2 } from "lucide-react";
import api from "../../api/axios";
import { toast } from "sonner";

export default function AdminPromotions() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(5);
  const [savingThreshold, setSavingThreshold] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [activeModal, setActiveModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [emailHistory, setEmailHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendShape, setSendShape] = useState("circular");

  useEffect(() => {
    fetchPromotions();
    fetchThreshold();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users/promotions");
      setUsers(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengambil data promosi pengguna");
    } finally {
      setLoading(false);
    }
  };

  const fetchThreshold = async () => {
    try {
      const { data } = await api.get("/settings/promo-threshold");
      if (data.success) {
        setThreshold(data.data.threshold);
      }
    } catch (err) {
    }
  };

  const handleSaveThreshold = async () => {
    if (threshold <= 0) return toast.error("Threshold harus lebih dari 0");
    try {
      setSavingThreshold(true);
      await api.put("/settings/promo-threshold", { threshold });
      toast.success("Batas otomatis email berhasil disimpan");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menyimpan threshold");
    } finally {
      setSavingThreshold(false);
    }
  };

  const openHistory = async (user) => {
    setSelectedUser(user);
    setActiveModal("history");
    setLoadingHistory(true);
    try {
      const { data } = await api.get(`/promotions/${user.id}/history`);
      setEmailHistory(data.data);
    } catch (err) {
      toast.error("Gagal mengambil riwayat email");
      setActiveModal(null);
    } finally {
      setLoadingHistory(false);
    }
  };

  const openSendEmail = (user) => {
    setSelectedUser(user);
    setSendShape("circular");
    setActiveModal("send");
  };

  const handleSendEmail = async () => {
    if (!selectedUser) return;
    try {
      setSendingEmail(true);
      const { data } = await api.post(`/promotions/${selectedUser.id}/send`, { shape: sendShape });
      toast.success(data.message);
      setActiveModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengirim email");
    } finally {
      setSendingEmail(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <div>
          <h1 className="admin-dashboard__title">Manajemen Promosi</h1>
          <p className="admin-dashboard__subtitle">Pantau aktivitas perancangan dome dan otomatisasi email promosi</p>
        </div>
      </div>

      <div className="ahp-section" style={{ maxWidth: 600, marginBottom: 24 }}>
        <div className="ahp-section__header" style={{ marginBottom: 16 }}>
          <div>
            <h2 className="ahp-section__title">Batas Otomatisasi Email (Threshold)</h2>
            <p className="ahp-section__desc">
              Email promosi otomatis akan dikirim ke User setiap kali jumlah klik visualisasi mereka mencapai kelipatan angka ini.
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="ahp-input"
            style={{ width: 120 }}
            min="1"
          />
          <button 
            onClick={handleSaveThreshold}
            disabled={savingThreshold}
            className="ahp-btn ahp-btn--save"
            style={{ margin: 0, height: 40 }}
          >
            {savingThreshold ? <Loader2 size={16} className="ahp-spin" /> : <Save size={16} />}
            Simpan
          </button>
        </div>
      </div>

      <div className="admin-chart-card admin-chart-card--wide">
        <div className="admin-table-wrap">
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Memuat data...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th rowSpan="2" style={{ verticalAlign: "middle" }}>Nama User</th>
                  <th rowSpan="2" style={{ verticalAlign: "middle" }}>Email</th>
                  <th colSpan="2" style={{ textAlign: "center", borderBottom: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                      <Cuboid size={16} /> Visualisasi Dome
                    </div>
                  </th>
                  <th rowSpan="2" style={{ verticalAlign: "middle", textAlign: "center" }}>Total</th>
                  <th rowSpan="2" style={{ verticalAlign: "middle", textAlign: "right" }}>Aksi</th>
                </tr>
                <tr>
                  <th style={{ textAlign: "center", backgroundColor: "#f8fafc", fontSize: "0.75rem" }}>Circular</th>
                  <th style={{ textAlign: "center", backgroundColor: "#f8fafc", fontSize: "0.75rem" }}>Rectangle</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((u) => {
                  const circular = u.stats?.designCircular || 0;
                  const rectangle = u.stats?.designRectangle || 0;
                  const total = circular + rectangle;
                  return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="admin-table__avatar">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 500, color: "#1e293b" }}>{u.name}</span>
                        </div>
                      </td>
                      <td className="admin-table__muted">{u.email}</td>
                      <td style={{ textAlign: "center", fontWeight: 600, color: "#3b82f6" }}>{circular}</td>
                      <td style={{ textAlign: "center", fontWeight: 600, color: "#8b5cf6" }}>{rectangle}</td>
                      <td style={{ textAlign: "center", fontWeight: 700, color: "#1e293b" }}>{total}</td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                          <button
                            onClick={() => openHistory(u)}
                            style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", backgroundColor: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", fontWeight: 500, color: "#475569" }}
                          >
                            <History size={14} /> Riwayat
                          </button>
                          <button
                            onClick={() => openSendEmail(u)}
                            style={{ padding: "6px 10px", borderRadius: 6, border: "none", backgroundColor: "#00684a", color: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", fontWeight: 500 }}
                          >
                            <Mail size={14} /> Kirim
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                      Belum ada data aktivitas pengguna
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {!loading && users.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderTop: "1px solid #e5e7eb" }}>
            <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
              Menampilkan {users.length === 0 ? 0 : indexOfFirstItem + 1} - {Math.min(indexOfLastItem, users.length)} dari {users.length} data
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
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || users.length === 0}
                style={{ padding: "6px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", backgroundColor: currentPage === totalPages || users.length === 0 ? "#f1f5f9" : "white", color: currentPage === totalPages || users.length === 0 ? "#94a3b8" : "#475569", cursor: currentPage === totalPages || users.length === 0 ? "not-allowed" : "pointer", fontSize: "0.875rem", fontWeight: 500 }}
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {activeModal === "history" && selectedUser && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ backgroundColor: "white", borderRadius: 12, width: "100%", maxWidth: 600, maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ padding: 20, borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#0f172a" }}>Riwayat Email Promosi</h2>
              <button onClick={() => setActiveModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: 20, overflowY: "auto", backgroundColor: "#f8fafc" }}>
              <p style={{ fontSize: "0.875rem", color: "#475569", marginBottom: 16 }}>
                Riwayat email untuk <strong>{selectedUser.name}</strong> ({selectedUser.email})
              </p>
              
              {loadingHistory ? (
                <div style={{ textAlign: "center", padding: 30, color: "#64748b" }}>Memuat riwayat...</div>
              ) : emailHistory.length === 0 ? (
                <div style={{ textAlign: "center", padding: 30, backgroundColor: "white", borderRadius: 8, border: "1px solid #e2e8f0", color: "#64748b" }}>
                  Belum ada email yang dikirim ke user ini.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {emailHistory.map(log => (
                    <div key={log.id} style={{ backgroundColor: "white", padding: 16, borderRadius: 8, border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "2px 8px", borderRadius: 999, backgroundColor: log.type === 'auto' ? '#dbeafe' : '#fef3c7', color: log.type === 'auto' ? '#1e40af' : '#b45309', textTransform: 'uppercase' }}>
                            {log.type === 'auto' ? 'Otomatis' : 'Manual'}
                          </span>
                          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0f172a", textTransform: 'capitalize' }}>
                            {log.shape} Dome
                          </span>
                        </div>
                        {log.type === 'manual' && log.sender && (
                          <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "4px 0 0" }}>
                            Dikirim oleh: {log.sender.name}
                          </p>
                        )}
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                        {new Date(log.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: 16, borderTop: "1px solid #e2e8f0", backgroundColor: "white", display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setActiveModal(null)} className="ahp-btn" style={{ backgroundColor: "#e2e8f0", color: "#475569" }}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === "send" && selectedUser && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ backgroundColor: "white", borderRadius: 12, width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ padding: 20, borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#0f172a" }}>Kirim Email Promosi</h2>
              <button onClick={() => setActiveModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: 20 }}>
              <p style={{ fontSize: "0.875rem", color: "#475569", marginBottom: 16 }}>
                Kirim email rekomendasi desain secara manual kepada <strong>{selectedUser.name}</strong>.
              </p>
              
              <div className="ahp-field">
                <label className="ahp-label">Jenis Dome yang Dipromosikan</label>
                <select 
                  value={sendShape}
                  onChange={(e) => setSendShape(e.target.value)}
                  className="ahp-input"
                >
                  <option value="circular">Circular</option>
                  <option value="rectangle">Rectangle</option>
                </select>
              </div>
            </div>
            <div style={{ padding: "16px 20px", borderTop: "1px solid #e2e8f0", backgroundColor: "#f8fafc", display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button onClick={() => setActiveModal(null)} disabled={sendingEmail} className="ahp-btn" style={{ backgroundColor: "white", border: "1px solid #cbd5e1", color: "#475569" }}>Batal</button>
              <button onClick={handleSendEmail} disabled={sendingEmail} className="ahp-btn ahp-btn--save" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {sendingEmail ? <Loader2 size={16} className="ahp-spin" /> : <Mail size={16} />}
                {sendingEmail ? "Mengirim..." : "Kirim Sekarang"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
