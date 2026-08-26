import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ShieldAlert, Eye, X } from "lucide-react";
import api from "../../api/axios";
import { toast } from "sonner";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [allDomes, setAllDomes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "admin", assignedDomes: [] });
  const [formLoading, setFormLoading] = useState(false);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailUser, setDetailUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, domesRes] = await Promise.all([
        api.get("/users"),
        api.get("/domes")
      ]);
      setUsers(usersRes.data.data);
      setAllDomes(domesRes.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengambil data pengguna");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
        assignedDomes: user.assignedDomes ? user.assignedDomes.map(d => typeof d === 'string' ? d : (d._id || d.id)) : []
      });
    } else {
      setEditingUser(null);
      setFormData({ name: "", email: "", password: "", role: "admin", assignedDomes: [] });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleOpenDetailModal = (user) => {
    setDetailUser(user);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setDetailUser(null);
  };

  const handleDomeToggle = (domeId) => {
    setFormData((prev) => {
      const isSelected = prev.assignedDomes.includes(domeId);
      if (isSelected) {
        return { ...prev, assignedDomes: prev.assignedDomes.filter(id => id !== domeId) };
      } else {
        return { ...prev, assignedDomes: [...prev.assignedDomes, domeId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (editingUser) {
        await api.put(`/users/${editingUser._id || editingUser.id}`, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          assignedDomes: formData.assignedDomes
        });
        toast.success("Admin berhasil diperbarui");
      } else {
        await api.post("/users", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          assignedDomes: formData.assignedDomes
        });
        toast.success("Admin berhasil ditambahkan");
      }
      
      const { data } = await api.get("/users");
      setUsers(data.data);
      
      handleCloseModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Terjadi kesalahan saat menyimpan data");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) return;
    try {
      await api.delete(`/users/${id}`);
      const { data } = await api.get("/users");
      setUsers(data.data);
      toast.success("Pengguna berhasil dihapus");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus pengguna");
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 className="admin-dashboard__title">Manajemen User</h1>
          <p className="admin-dashboard__subtitle">Kelola akun Admin dan Super Admin</p>
        </div>
        <button
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition"
          style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#10b981", color: "white", border: "none", cursor: "pointer", borderRadius: "8px", padding: "10px 16px" }}
          onClick={() => handleOpenModal()}
        >
          <Plus size={18} />
          Tambah Admin
        </button>
      </div>

      <div className="admin-chart-card admin-chart-card--wide">
        <div className="admin-table-wrap">
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Memuat data...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Dome Dikelola</th>
                  <th style={{ textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((u) => {
                  const assignedCount = u.assignedDomes ? u.assignedDomes.length : 0;
                  return (
                    <tr key={u._id || u.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div className="admin-table__avatar">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          {u.name}
                        </div>
                      </td>
                      <td className="admin-table__muted">{u.email}</td>
                      <td>
                        <span
                          className={`admin-table__status ${
                            u.role === "superadmin"
                              ? "admin-table__status--active"
                              : "admin-table__status--inactive"
                          }`}
                          style={{
                            backgroundColor: u.role === "superadmin" ? "rgba(139, 92, 246, 0.1)" : "rgba(16, 185, 129, 0.1)",
                            color: u.role === "superadmin" ? "#8b5cf6" : "#10b981"
                          }}
                        >
                          {u.role === "superadmin" ? "Super Admin" : u.role === "admin" ? "Admin" : "User"}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontWeight: 500, color: "#334155" }}>{assignedCount} Dome</span>
                          {assignedCount > 0 && (
                            <button
                              onClick={() => handleOpenDetailModal(u)}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", display: "flex", alignItems: "center", padding: "4px" }}
                              title="Lihat Detail"
                            >
                              <Eye size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          onClick={() => handleOpenModal(u)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", marginRight: "12px", padding: "4px" }}
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(u._id || u.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "4px" }}
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                      Belum ada data pengguna
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
              Menampilkan {users.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, users.length)} dari {users.length} data
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
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(users.length / itemsPerPage), p + 1))}
                disabled={currentPage === Math.ceil(users.length / itemsPerPage) || users.length === 0}
                style={{ padding: "6px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", backgroundColor: currentPage === Math.ceil(users.length / itemsPerPage) || users.length === 0 ? "#f1f5f9" : "white", color: currentPage === Math.ceil(users.length / itemsPerPage) || users.length === 0 ? "#94a3b8" : "#475569", cursor: currentPage === Math.ceil(users.length / itemsPerPage) || users.length === 0 ? "not-allowed" : "pointer", fontSize: "0.875rem", fontWeight: 500 }}
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white", padding: "30px", borderRadius: "12px", width: "100%", maxWidth: "550px",
            maxHeight: "90vh", overflowY: "auto", boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ margin: "0 0 20px 0", fontSize: "1.25rem", color: "#1e293b" }}>
              {editingUser ? "Edit Pengguna" : "Tambah Admin"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "0.875rem", color: "#475569", fontWeight: 500 }}>Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", boxSizing: "border-box" }}
                  placeholder="Masukkan nama"
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "0.875rem", color: "#475569", fontWeight: 500 }}>Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", boxSizing: "border-box" }}
                  placeholder="admin@example.com"
                />
              </div>

              {!editingUser && (
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "0.875rem", color: "#475569", fontWeight: 500 }}>Password</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", boxSizing: "border-box" }}
                    placeholder="Minimal 8 karakter"
                    minLength={8}
                  />
                </div>
              )}

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "0.875rem", color: "#475569", fontWeight: 500 }}>Role</label>
                <select
                  value="admin"
                  disabled
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", outline: "none", boxSizing: "border-box", backgroundColor: "#f8fafc", color: "#64748b", appearance: "none", WebkitAppearance: "none", MozAppearance: "none" }}
                >
                  <option value="admin">Admin</option>
                </select>
                <p style={{ margin: "6px 0 0 0", fontSize: "0.75rem", color: "#64748b" }}>
                  Akun yang dibuat secara otomatis akan memiliki role Admin biasa.
                </p>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", marginBottom: "10px", fontSize: "0.875rem", color: "#475569", fontWeight: 500 }}>
                  Penugasan Dome <span style={{ fontWeight: "normal", color: "#94a3b8" }}>({formData.assignedDomes.length} dipilih)</span>
                </label>
                <div style={{
                  border: "1px solid #cbd5e1", borderRadius: "6px", maxHeight: "200px", overflowY: "auto", padding: "10px"
                }}>
                  {allDomes.length === 0 ? (
                    <p style={{ margin: 0, fontSize: "0.875rem", color: "#94a3b8" }}>Tidak ada dome yang tersedia.</p>
                  ) : (
                    allDomes.map((dome) => (
                      <label key={dome._id || dome.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px", borderBottom: "1px solid #f1f5f9", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={formData.assignedDomes.includes(dome._id || dome.id)}
                          onChange={() => handleDomeToggle(dome._id || dome.id)}
                          style={{ cursor: "pointer", width: "16px", height: "16px" }}
                        />
                        <div>
                          <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "#334155" }}>{dome.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{dome.city} • {dome.type}</div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{ padding: "10px 16px", backgroundColor: "#f1f5f9", color: "#475569", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 500 }}
                  disabled={formLoading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ padding: "10px 16px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 500 }}
                  disabled={formLoading}
                >
                  {formLoading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailModal && detailUser && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white", padding: "30px", borderRadius: "12px", width: "100%", maxWidth: "400px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#1e293b" }}>
                Dome Dikelola
              </h2>
              <button onClick={handleCloseDetailModal} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                <X size={20} />
              </button>
            </div>
            
            <p style={{ margin: "0 0 16px 0", fontSize: "0.875rem", color: "#64748b" }}>
              Admin: <strong>{detailUser.name}</strong>
            </p>

            <div style={{ maxHeight: "300px", overflowY: "auto", borderTop: "1px solid #e2e8f0" }}>
              {(!detailUser.assignedDomes || detailUser.assignedDomes.length === 0) ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#94a3b8", fontSize: "0.875rem" }}>
                  Belum ada dome yang ditugaskan.
                </div>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {detailUser.assignedDomes.map((dome) => (
                    <li key={dome._id || dome.id || dome} style={{ padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
                      <div style={{ fontWeight: 500, color: "#334155", fontSize: "0.875rem" }}>
                        {typeof dome === "object" ? dome.name : "Unknown Dome"}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px" }}>
                        {typeof dome === "object" ? `${dome.city} • ${dome.type}` : ""}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleCloseDetailModal}
                style={{ padding: "8px 16px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", cursor: "pointer", fontWeight: 500, color: "#475569", fontSize: "0.875rem" }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
