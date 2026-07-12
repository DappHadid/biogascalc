import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import SiteFrame from "./components/layouts/SiteFrame";
import Navbar from "./components/layouts/Navbar";
import AdminLayout from "./components/layouts/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import Home from "./pages/Home";
import Location from "./pages/Location";
import Dome from "./pages/Dome";
import Calculator from "./pages/Calculator";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDomes from "./pages/admin/AdminDomes";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPromotions from "./pages/admin/AdminPromotions";
import SuperAdminRoute from "./components/auth/SuperAdminRoute";

function App() {
  return (
    <Router>
      <Toaster position="top-center" richColors />
      <AuthProvider>
        <Routes>
          <Route
            path="/*"
            element={
              <SiteFrame>
                <div className="flex flex-col min-h-full" style={{ backgroundColor: "#ffffff", overflowX: "hidden" }}>
                  <Navbar />
                  <main id="main-content" className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/lokasi" element={<Location />} />
                      <Route path="/rancang-dome" element={<Dome />} />
                      <Route path="/kalkulator-limbah" element={<Calculator />} />
                    </Routes>
                  </main>
                </div>
              </SiteFrame>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="domes" element={<AdminDomes />} />
            
            <Route path="users" element={
              <SuperAdminRoute>
                <AdminUsers />
              </SuperAdminRoute>
            } />
            <Route path="promotions" element={
              <SuperAdminRoute>
                <AdminPromotions />
              </SuperAdminRoute>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
