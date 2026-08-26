import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Hexagon,
  ChevronLeft,
  Flame,
  Settings,
  LogOut,
  TrendingUp,
  LayoutTemplate,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Manajemen Dome", href: "/admin/domes", icon: Hexagon },
  { label: "Manajemen User", href: "/admin/users", icon: Users },
  { label: "Manajemen Promosi", href: "/admin/promotions", icon: TrendingUp },
  { label: "Kelola Beranda", href: "/admin/homepage", icon: LayoutTemplate },
  { label: "Pengaturan", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ collapsed, onToggle }) {
  const { pathname } = useLocation();
  const { user, logout, isSuperAdmin } = useAuth();

  const roleLabel = isSuperAdmin ? "Super Administrator" : "Administrator";

  return (
    <>
      {!collapsed && (
        <div
          className="admin-sidebar-overlay"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      <aside
        className={`admin-sidebar ${collapsed ? "admin-sidebar--collapsed" : ""}`}
        aria-label="Admin navigation"
      >
        <div className="admin-sidebar__brand">
          <Link to="/admin" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <div className="admin-sidebar__logo-icon">
              <Flame size={20} color="#00ed64" />
            </div>
            <span className="admin-sidebar__logo-text">BioGasCalc</span>
          </Link>
        </div>

        <div className="admin-sidebar__label">MENU</div>

        <nav className="admin-sidebar__nav">
          {NAV_ITEMS.map((item) => {
            const isSuperAdminOnly = ["Manajemen User", "Manajemen Promosi", "Kelola Beranda", "Pengaturan"].includes(item.label);
            if (isSuperAdminOnly && !isSuperAdmin) return null;

            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`admin-sidebar__link ${isActive ? "admin-sidebar__link--active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={20} strokeWidth={1.75} />
                <span className="admin-sidebar__link-text">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ flex: 1 }} />

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="admin-sidebar__user-info">
              <span className="admin-sidebar__user-name">{user?.name || "Admin"}</span>
              <span className="admin-sidebar__user-role">{roleLabel}</span>
            </div>
          </div>
          <button
            className="admin-sidebar__link"
            onClick={logout}
            style={{ width: "100%", border: "none", cursor: "pointer", background: "none" }}
          >
            <LogOut size={20} strokeWidth={1.75} />
            <span className="admin-sidebar__link-text">Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}
