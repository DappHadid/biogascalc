import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useDomeCalculations } from "../../hooks/useDomeCalculations";
import { clampParamsToVolume } from "../../utils/volumeCap";
import ParameterPanel, { DEFAULT_PARAMS } from "./ParameterPanel";
import DomeVisualizer   from "./DomeVisualizer";
import StatsPanel       from "./StatsPanel";
import MaterialsTable    from "./MaterialsTable";
import LockedOverlay     from "./LockedOverlay";
import LoginModal        from "../modals/LoginModal";
import RegisterModal     from "../modals/RegisterModal";

export default function DomeCalculator() {
  const { user } = useAuth();
  const maxVolume = user ? 40 : 5;

  const [draftParams, setDraftParams] = useState(DEFAULT_PARAMS);
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [modal, setModal] = useState(null); // 'login' | 'register' | null

  const rawCalc = useDomeCalculations(params);
  const isCapped = rawCalc.totalVolume > maxVolume;
  const cappedParams = isCapped ? clampParamsToVolume(params, rawCalc.totalVolume, maxVolume) : params;
  const cappedCalc = useDomeCalculations(cappedParams);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* ── Title row ── */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: "#00684a" }}>
          Rancang Dome
        </p>
        <h1 style={{ fontSize: "1.375rem", fontWeight: 500, color: "#001e2b" }}>
          3D Dome Visualizer
        </h1>
      </div>

      {/* ── Main layout: 3-col desktop / stack mobile ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-4 lg:gap-6 items-start">
        
        {/* ── LEFT: Parameter Panel (ordered second on mobile) ── */}
        <div 
          className="order-2 lg:order-1"
          style={{ position: "sticky", top: 106, maxHeight: "calc(100vh - 120px)", overflowY: "auto", borderRadius: 12 }}
        >
          <ParameterPanel params={draftParams} onChange={(newParams, apply) => {
            setDraftParams(newParams);
            if (apply) setParams(newParams);
          }} onApply={() => setParams(draftParams)} />
        </div>

        {/* ── CENTER: Visualizer (Main focus, ordered first on mobile) ── */}
        <div 
          className="order-1 lg:order-2"
          style={{ height: "clamp(400px, 65vh, 800px)", position: "sticky", top: 106 }}
        >
          <DomeVisualizer calc={cappedCalc} params={cappedParams} />
        </div>

        {/* ── RIGHT: Stats ── */}
        <div 
          className="order-3 lg:order-3"
          style={{ position: "sticky", top: 106, maxHeight: "calc(100vh - 120px)", overflowY: "auto", borderRadius: 12 }}
        >
          <StatsPanel
            calc={cappedCalc}
            params={params}
            isCapped={isCapped}
            maxVolume={maxVolume}
            user={user}
            onLoginClick={() => setModal("login")}
          />
        </div>
      </div>

      {/* ── Materials estimate table ── */}
      <LockedOverlay
        locked={!user}
        onLogin={() => setModal("login")}
        onRegister={() => setModal("register")}
        message="Buat akun atau masuk untuk melihat estimasi bahan baku"
      >
        <MaterialsTable calc={cappedCalc} params={cappedParams} />
      </LockedOverlay>

      {/* ── Auth modals ── */}
      <LoginModal open={modal === "login"} onClose={() => setModal(null)} onSwitchToRegister={() => setModal("register")} />
      <RegisterModal open={modal === "register"} onClose={() => setModal(null)} onSwitchToLogin={() => setModal("login")} />
    </div>
  );
}
