import {
  Users,
  Calculator,
  Hexagon,
  Activity,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import MapDistribution from "../../components/admin/MapDistribution";

const STATS = [
  {
    label: "Total Pengguna",
    value: "1,248",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.1)",
  },
  {
    label: "Total Perhitungan",
    value: "5,420",
    change: "+8.2%",
    trend: "up",
    icon: Calculator,
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.1)",
  },
  {
    label: "Desain Dome",
    value: "892",
    change: "-2.1%",
    trend: "down",
    icon: Hexagon,
    color: "#8b5cf6",
    bgColor: "rgba(139, 92, 246, 0.1)",
  },
  {
    label: "Sesi Aktif",
    value: "48",
    change: "+4.3%",
    trend: "up",
    icon: Activity,
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.1)",
  },
];

const MONTHLY_VISITORS = [
  { name: "Jan", visitors: 4000, users: 2400 },
  { name: "Feb", visitors: 3000, users: 1398 },
  { name: "Mar", visitors: 5000, users: 3800 },
  { name: "Apr", visitors: 4780, users: 3908 },
  { name: "Mei", visitors: 5890, users: 4800 },
  { name: "Jun", visitors: 6390, users: 3800 },
  { name: "Jul", visitors: 7490, users: 4300 },
  { name: "Agu", visitors: 6000, users: 3400 },
  { name: "Sep", visitors: 7800, users: 5100 },
  { name: "Okt", visitors: 8200, users: 5600 },
  { name: "Nov", visitors: 7100, users: 4200 },
  { name: "Des", visitors: 9300, users: 6100 },
];

const WEEKLY_CALC = [
  { name: "Sen", biogas: 65, limbah: 45 },
  { name: "Sel", biogas: 59, limbah: 38 },
  { name: "Rab", biogas: 80, limbah: 55 },
  { name: "Kam", biogas: 81, limbah: 62 },
  { name: "Jum", biogas: 56, limbah: 40 },
  { name: "Sab", biogas: 55, limbah: 30 },
  { name: "Min", biogas: 40, limbah: 25 },
];

const DOME_TYPES = [
  { name: "Fixed Dome", value: 45, color: "#3b82f6" },
  { name: "Floating Drum", value: 30, color: "#10b981" },
  { name: "Balloon", value: 15, color: "#8b5cf6" },
  { name: "Lainnya", value: 10, color: "#f59e0b" },
];

const RECENT_USERS = [
  { name: "Budi Santoso", email: "budi@mail.com", date: "28 Jun 2026", status: "Aktif" },
  { name: "Siti Nurhaliza", email: "siti@mail.com", date: "27 Jun 2026", status: "Aktif" },
  { name: "Ahmad Rizki", email: "ahmad@mail.com", date: "27 Jun 2026", status: "Aktif" },
  { name: "Dewi Lestari", email: "dewi@mail.com", date: "26 Jun 2026", status: "Nonaktif" },
  { name: "Eko Prasetyo", email: "eko@mail.com", date: "25 Jun 2026", status: "Aktif" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="admin-chart-tooltip">
        <p className="admin-chart-tooltip__label">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, fontSize: "0.8125rem", margin: "2px 0" }}>
            {entry.name}: <strong>{entry.value.toLocaleString()}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <div>
          <h1 className="admin-dashboard__title">Dashboard Analytics</h1>
          <p className="admin-dashboard__subtitle">
            Ringkasan statistik dan aktivitas platform BioGasCalc
          </p>
        </div>
      </div>

      <div className="admin-stats-grid">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
          const ArrowIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
          return (
            <div key={stat.label} className="admin-stat-card">
              <div className="admin-stat-card__top">
                <div
                  className="admin-stat-card__icon"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <Icon size={22} color={stat.color} strokeWidth={1.75} />
                </div>
              </div>
              <div className="admin-stat-card__value">{stat.value}</div>
              <div className="admin-stat-card__bottom">
                <span className="admin-stat-card__label">{stat.label}</span>
                <span
                  className={`admin-stat-card__change ${
                    stat.trend === "up" ? "admin-stat-card__change--up" : "admin-stat-card__change--down"
                  }`}
                >
                  <ArrowIcon size={14} />
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="admin-charts-grid" style={{ gridTemplateColumns: "1fr", marginBottom: "24px" }}>
        <MapDistribution />
      </div>

      <div className="admin-charts-grid">
        <div className="admin-chart-card admin-chart-card--wide">
          <div className="admin-chart-card__header">
            <div>
              <h3 className="admin-chart-card__title">Statistik Pengunjung</h3>
              <p className="admin-chart-card__desc">Pengunjung & pengguna per bulan</p>
            </div>
            <div className="admin-chart-card__legend">
              <span className="admin-chart-legend-item">
                <span className="admin-chart-legend-dot" style={{ backgroundColor: "#3b82f6" }} />
                Pengunjung
              </span>
              <span className="admin-chart-legend-item">
                <span className="admin-chart-legend-dot" style={{ backgroundColor: "#10b981" }} />
                Pengguna
              </span>
            </div>
          </div>
          <div className="admin-chart-card__body">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={MONTHLY_VISITORS} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="Pengunjung"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#gradVisitors)"
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  name="Pengguna"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fill="url(#gradUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <div>
              <h3 className="admin-chart-card__title">Perhitungan Mingguan</h3>
              <p className="admin-chart-card__desc">Biogas & limbah per hari</p>
            </div>
          </div>
          <div className="admin-chart-card__body">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={WEEKLY_CALC} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="biogas" name="Biogas" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="limbah" name="Limbah" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="admin-bottom-grid">
        <div className="admin-chart-card">
          <div className="admin-chart-card__header">
            <div>
              <h3 className="admin-chart-card__title">Distribusi Tipe Dome</h3>
              <p className="admin-chart-card__desc">Persentase tipe dome yang dirancang</p>
            </div>
          </div>
          <div className="admin-chart-card__body" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={DOME_TYPES}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {DOME_TYPES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value}%`, name]}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    fontSize: "0.8125rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="admin-pie-legend">
            {DOME_TYPES.map((item) => (
              <div key={item.name} className="admin-pie-legend__item">
                <span className="admin-pie-legend__dot" style={{ backgroundColor: item.color }} />
                <span className="admin-pie-legend__label">{item.name}</span>
                <span className="admin-pie-legend__value">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-chart-card admin-chart-card--wide">
          <div className="admin-chart-card__header">
            <div>
              <h3 className="admin-chart-card__title">Pengguna Terbaru</h3>
              <p className="admin-chart-card__desc">Daftar pendaftaran terbaru</p>
            </div>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Tanggal Daftar</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_USERS.map((u, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="admin-table__avatar">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        {u.name}
                      </div>
                    </td>
                    <td className="admin-table__muted">{u.email}</td>
                    <td className="admin-table__muted">{u.date}</td>
                    <td>
                      <span
                        className={`admin-table__status ${
                          u.status === "Aktif"
                            ? "admin-table__status--active"
                            : "admin-table__status--inactive"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
