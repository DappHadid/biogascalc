import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar";
import AdminHeader from "../admin/AdminHeader";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  return (
    <div className="admin-layout">
      <AdminSidebar collapsed={collapsed} onToggle={toggleSidebar} />
      <div className={`admin-layout__main ${collapsed ? "admin-layout__main--expanded" : ""}`}>
        <AdminHeader onToggleSidebar={toggleSidebar} />
        <div className="admin-layout__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
