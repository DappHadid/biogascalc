import { useState, useEffect } from "react";
import { ShieldAlert, TrendingUp, Calculator, Cuboid, CheckSquare } from "lucide-react";
import api from "../../api/axios";
import { toast } from "sonner";

export default function AdminPromotions() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users/promotions");
      setUsers(data.data);
      setUsers(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengambil data promosi pengguna");
    } finally {
      setLoading(false);
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
          <h1 className="admin-dashboard__title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <TrendingUp size={28} />
            Manajemen Promosi
          </h1>
          <p className="admin-dashboard__subtitle">Pantau aktivitas perancangan dome dan penggunaan kalkulator oleh User</p>
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
                  <th colSpan="3" style={{ textAlign: "center", borderBottom: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                      <Cuboid size={16} /> Rancang Dome
                    </div>
                  </th>
                  <th rowSpan="2" style={{ verticalAlign: "middle", textAlign: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                      <Calculator size={16} /> Kalkulator Limbah
                    </div>
                  </th>
                </tr>
                <tr>
                  <th style={{ textAlign: "center", backgroundColor: "#f8fafc", fontSize: "0.75rem" }}>Hemisphere</th>
                  <th style={{ textAlign: "center", backgroundColor: "#f8fafc", fontSize: "0.75rem" }}>Semi-Ellipsoid</th>
                  <th style={{ textAlign: "center", backgroundColor: "#f8fafc", fontSize: "0.75rem" }}>Custom</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((u) => (
                  <tr key={u._id || u.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="admin-table__avatar">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500, color: "#1e293b" }}>{u.name}</span>
                      </div>
                    </td>
                    <td className="admin-table__muted">{u.email}</td>
                    
                    <td style={{ textAlign: "center", fontWeight: 600, color: "#3b82f6" }}>
                      {u.stats?.designHemisphere || 0}
                    </td>
                    <td style={{ textAlign: "center", fontWeight: 600, color: "#8b5cf6" }}>
                      {u.stats?.designSemiEllipsoid || 0}
                    </td>
                    <td style={{ textAlign: "center", fontWeight: 600, color: "#f59e0b" }}>
                      {u.stats?.designCustom || 0}
                    </td>
                    
                    <td style={{ textAlign: "center", fontWeight: 600, color: "#10b981" }}>
                      {u.stats?.wasteCalculator || 0}
                    </td>
                  </tr>
                ))}
                
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
    </div>
  );
}
