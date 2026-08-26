import { useEffect, useRef } from "react";
import jsVectorMap from "jsvectormap";
import "jsvectormap/dist/jsvectormap.css";
import "./indonesia-map";

const REGION_DATA = [
  { name: "Jawa Barat", users: 312, pct: 32 },
  { name: "DKI Jakarta", users: 285, pct: 29 },
  { name: "Jawa Timur", users: 198, pct: 20 },
  { name: "Sulawesi Selatan", users: 87, pct: 9 },
  { name: "Sumatera Utara", users: 64, pct: 7 },
  { name: "Kalimantan Timur", users: 32, pct: 3 },
];

const MARKERS = [
  { name: "Jakarta",     coords: [-6.2088, 106.8456], users: 285 },
  { name: "Bandung",     coords: [-6.9175, 107.6191], users: 312 },
  { name: "Surabaya",    coords: [-7.2504, 112.7688], users: 198 },
  { name: "Medan",       coords: [3.5952, 98.6722],   users: 64 },
  { name: "Makassar",    coords: [-5.1477, 119.4327], users: 87 },
  { name: "Balikpapan",  coords: [-1.2379, 116.8529], users: 32 },
];

export default function MapDistribution() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current) {
      try {
        mapInstance.current.destroy();
      } catch (e) {
      }
    }
    
    if (mapRef.current) {
      mapRef.current.innerHTML = '';
    }

    mapInstance.current = new jsVectorMap({
      selector: "#mapDistribution",
      map: "indonesia",
      backgroundColor: "transparent",
      draggable: true,
      zoomButtons: false,
      zoomOnScroll: true,
      zoomOnScrollSpeed: 3,
      regionStyle: {
        initial: {
          fill: "#cbd5e1",
          stroke: "#ffffff",
          strokeWidth: 0.8,
          fillOpacity: 1,
        },
        hover: {
          fill: "#465fff",
          fillOpacity: 0.9,
          cursor: "pointer",
        },
      },
      markers: MARKERS.map((m) => ({
        name: m.name,
        coords: m.coords,
      })),
      markerStyle: {
        initial: {
          fill: "#465fff",
          stroke: "#ffffff",
          strokeWidth: 2,
          r: 5,
        },
        hover: {
          fill: "#3641d6",
          stroke: "#ffffff",
          strokeWidth: 3,
          r: 7,
        },
      },
      markerLabelStyle: {
        initial: {
          fontFamily: "inherit",
          fontSize: 12,
          fontWeight: 500,
          fill: "#1e293b",
        },
      },
      labels: {
        markers: {
          render: (marker) => marker.name,
        },
      },
      onMarkerTooltipShow: (e, tooltip, index) => {
        const m = MARKERS[index];
        tooltip.css({ backgroundColor: "#1e293b", color: "#fff" });
        tooltip.text(
          `<div style="padding:6px 10px;font-size:13px">
            <strong>${m.name}</strong><br/>
            <span style="color:#94a3b8">${m.users} pengguna aktif</span>
          </div>`,
          true
        );
      },
      onRegionTooltipShow: (e, tooltip) => {
        tooltip.css({ backgroundColor: "#1e293b", color: "#fff", fontSize: "13px", padding: "6px 10px" });
      },
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="map-distribution">
      <div className="map-distribution__header">
        <div>
          <h3 className="map-distribution__title">Distribusi Pengguna</h3>
          <p className="map-distribution__desc">
            Sebaran pengguna aktif di seluruh Indonesia
          </p>
        </div>
      </div>

      <div className="map-distribution__body">
        <div
          id="mapDistribution"
          ref={mapRef}
          className="map-distribution__canvas"
        />
      </div>

      <div className="map-distribution__regions">
        {REGION_DATA.map((region) => (
          <div key={region.name} className="map-distribution__region-row">
            <div className="map-distribution__region-info">
              <span className="map-distribution__region-name">
                {region.name}
              </span>
              <span className="map-distribution__region-users">
                {region.users.toLocaleString("id-ID")} Pengguna
              </span>
            </div>
            <div className="map-distribution__region-bar-wrap">
              <div className="map-distribution__region-bar">
                <div
                  className="map-distribution__region-bar-fill"
                  style={{ width: `${region.pct}%` }}
                />
              </div>
              <span className="map-distribution__region-pct">
                {region.pct}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
