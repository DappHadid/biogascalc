import { useAuth } from "../../contexts/AuthContext";
import { Search, Bell, Menu } from "lucide-react";

export default function AdminHeader({ onToggleSidebar }) {
  const { user, isSuperAdmin } = useAuth();

  const roleLabel = isSuperAdmin ? "Super Administrator" : "Administrator";

  return (
    <header className="admin-header">
      <div className="admin-header__left">
        <button
          className="admin-header__hamburger"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={22} strokeWidth={1.75} />
        </button>

        <div className="admin-header__search">
          <Search size={18} strokeWidth={1.75} className="admin-header__search-icon" />
          <input
            type="text"
            placeholder="Cari sesuatu..."
            className="admin-header__search-input"
            id="admin-search"
          />
        </div>
      </div>

      <div className="admin-header__right">
        <button className="admin-header__icon-btn" aria-label="Notifikasi">
          <Bell size={20} strokeWidth={1.75} />
          <span className="admin-header__badge">3</span>
        </button>

        <div className="admin-header__divider" />

        <div className="admin-header__user">
          <div className="admin-header__user-text">
            <span className="admin-header__user-name">{user?.name || "Admin"}</span>
            <span className="admin-header__user-role">{roleLabel}</span>
          </div>
          <div className="admin-header__avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
        </div>
      </div>
    </header>
  );
}

