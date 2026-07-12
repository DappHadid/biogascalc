import DomeCalculator from "../components/dome/DomeCalculator";

export default function Dome() {
  return (
    <div
      className="max-[850px]:pt-23"
      style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 64px)", paddingTop: 106 }}
    >
      {/* Page container */}
      <div style={{ flex: 1, maxWidth: 1600, margin: "0 auto", width: "100%", padding: "1.5rem 3rem" }}>
        <DomeCalculator />
      </div>
    </div>
  );
}
