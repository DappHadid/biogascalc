import { useState } from "react";
import jsPDF from "jspdf";

function estimateMaterials(surfaceArea, materialsConfig) {
  const SA = Math.max(0, surfaceArea);
  return materialsConfig.map(m => ({
    name: m.name,
    qty: m.unit === "buah" ? Math.ceil(SA * m.coefficientPerM2) : SA * m.coefficientPerM2,
    unit: m.unit,
  }));
}

function fmtNum(n, digits = 2) {
  return n.toLocaleString("id-ID", { maximumFractionDigits: digits });
}

function fmtDate(date) {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = months[date.getMonth()];
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${dd} ${mm} ${yyyy}, ${hh}:${min} WIB`;
}

function captureVisualization(canvasRef) {
  if (!canvasRef?.current) return null;
  const container = canvasRef.current;
  const canvas = container.querySelector?.("canvas") || container;
  try {
    return canvas.toDataURL("image/png", 0.92);
  } catch {
    return null;
  }
}

async function loadLogoBase64() {
  try {
    const response = await fetch("/Logo.png");
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

const C = {
  primary: [0, 104, 74],
  accent: [0, 237, 100],
  dark: [0, 30, 43],
  muted: [124, 140, 154],
  light: [168, 179, 188],
  border: [225, 229, 232],
  bg: [249, 251, 250],
  accentBg: [227, 252, 239],
  white: [255, 255, 255],
};

export async function generateDomePdf({ user, params, calc, canvasRef, materialsConfig = [] }) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const drawHR = (yPos, color = C.border) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    return yPos + 4;
  };

  const sectionTitle = (label, yPos) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...C.dark);
    doc.text(label, margin, yPos);
    return yPos + 7;
  };

  const checkPageBreak = (neededHeight) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = margin;
    }
  };

  const logoBase64 = await loadLogoBase64();

  doc.setFillColor(...C.primary);
  doc.rect(0, 0, pageWidth, 4, "F");

  y = 12;

  if (logoBase64) {
    try {
      doc.addImage(logoBase64, "PNG", margin, y, 10, 10);
    } catch {}
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...C.dark);
  doc.text("Owren.tech", margin + 13, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...C.muted);
  doc.text("Laporan Konfigurasi Dome Biogas", margin + 13, y + 12);

  y += 20;

  const now = new Date();
  const metaInfo = [
    { label: "Dicetak oleh", value: user?.name || "User" },
    { label: "Tanggal Dicetak", value: fmtDate(now) },
  ];

  doc.setFillColor(...C.bg);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, "F");
  doc.setDrawColor(...C.border);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, "S");

  let infoY = y + 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);

  doc.setTextColor(...C.muted);
  doc.text("Dibuat oleh:", margin + 5, infoY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...C.primary);
  doc.text("Owren.tech", margin + 30, infoY);

  metaInfo.forEach((item, idx) => {
    const xStart = margin + contentWidth / 2 + (idx * contentWidth / 4);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...C.muted);
    doc.text(item.label + ":", xStart, infoY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...C.dark);
    doc.text(item.value, xStart, infoY + 5);
  });

  y += 28;

  y = sectionTitle("Parameter Konfigurasi Dome", y);

  const isRect = params.shapeType === "rectangle";
  const shapeLabel = isRect ? "Rectangle (Persegi Panjang)" : "Circular (Lingkaran)";

  doc.setFillColor(...C.accentBg);
  const badgeWidth = doc.getTextWidth(shapeLabel) + 10;
  doc.roundedRect(margin, y - 4, badgeWidth, 7, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...C.primary);
  doc.text(shapeLabel, margin + 5, y);
  y += 8;

  const paramItems = isRect
    ? [
        { label: "Panjang (P)", value: `${fmtNum(params.length, 0)} cm` },
        { label: "Lebar (L)", value: `${fmtNum(params.width, 0)} cm` },
        { label: "Tinggi (T)", value: `${fmtNum(params.wallHeight, 0)} cm` },
      ]
    : [
        { label: "Diameter", value: `${fmtNum(params.diameter, 0)} cm` },
        { label: "Tinggi Dome", value: `${fmtNum(params.height, 0)} cm` },
      ];

  const cardWidth = (contentWidth - (paramItems.length - 1) * 4) / paramItems.length;
  paramItems.forEach((item, idx) => {
    const cx = margin + idx * (cardWidth + 4);
    doc.setFillColor(...C.bg);
    doc.roundedRect(cx, y, cardWidth, 16, 2, 2, "F");
    doc.setDrawColor(...C.border);
    doc.roundedRect(cx, y, cardWidth, 16, 2, 2, "S");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...C.muted);
    doc.text(item.label, cx + 4, y + 5.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...C.dark);
    doc.text(item.value, cx + 4, y + 12.5);
  });

  y += 24;

  y = drawHR(y);
  y = sectionTitle("Visualisasi 3D Dome", y);

  const vizImage = captureVisualization(canvasRef);
  if (vizImage) {
    checkPageBreak(85);
    const vizWidth = contentWidth;
    const vizHeight = vizWidth * 0.56;

    doc.setDrawColor(...C.border);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, y, vizWidth, vizHeight, 2, 2, "S");

    doc.addImage(vizImage, "PNG", margin + 0.5, y + 0.5, vizWidth - 1, vizHeight - 1);
    y += vizHeight + 6;
  } else {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...C.light);
    doc.text("(Visualisasi 3D tidak tersedia)", margin, y);
    y += 8;
  }

  checkPageBreak(40);
  y = drawHR(y);
  y = sectionTitle("Hasil Kalkulasi Statistik Dome", y);

  const statsItems = [
    { label: "Volume Total Dome", value: fmtNum(calc.totalVolume), unit: "m³", accent: true },
    { label: "Luas Permukaan", value: fmtNum(calc.surfaceArea), unit: "m²", accent: false },
  ];

  const statsCardWidth = (contentWidth - 4) / 2;
  statsItems.forEach((item, idx) => {
    const cx = margin + idx * (statsCardWidth + 4);
    const bgColor = item.accent ? C.accentBg : C.bg;
    const borderColor = item.accent ? [195, 240, 210] : C.border;

    doc.setFillColor(...bgColor);
    doc.roundedRect(cx, y, statsCardWidth, 20, 2, 2, "F");
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.3);
    doc.roundedRect(cx, y, statsCardWidth, 20, 2, 2, "S");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...C.muted);
    doc.text(item.label, cx + 5, y + 7);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...(item.accent ? C.primary : C.dark));
    doc.text(item.value, cx + 5, y + 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...C.light);
    doc.text(item.unit, cx + 5 + doc.getTextWidth(item.value) + 2, y + 15);
  });

  y += 28;

  checkPageBreak(60);
  y = drawHR(y);
  y = sectionTitle("Estimasi Bahan Baku Pembuatan", y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.light);
  doc.text(`Berdasarkan luas permukaan ${fmtNum(calc.surfaceArea)} m²`, margin, y);
  y += 6;

  const colWidths = [contentWidth * 0.45, contentWidth * 0.3, contentWidth * 0.25];
  const headers = ["Bahan", "Estimasi Kebutuhan", "Satuan"];

  doc.setFillColor(...C.primary);
  doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, "F");

  headers.forEach((h, i) => {
    const cx = margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...C.white);
    doc.text(h, cx + 4, y + 5.5, { align: i === 1 ? "left" : "left" });
  });

  y += 9;

  const materials = estimateMaterials(calc.surfaceArea, materialsConfig);
  materials.forEach((m, rowIdx) => {
    checkPageBreak(9);
    const rowBg = rowIdx % 2 === 0 ? C.white : C.bg;
    doc.setFillColor(...rowBg);
    doc.rect(margin, y, contentWidth, 8, "F");

    doc.setDrawColor(...C.border);
    doc.setLineWidth(0.15);
    doc.line(margin, y + 8, margin + contentWidth, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...C.dark);
    doc.text(m.name, margin + 4, y + 5.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...C.primary);
    const qtyText = fmtNum(m.qty, 1);
    doc.text(qtyText, margin + colWidths[0] + 4, y + 5.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...C.muted);
    doc.text(m.unit, margin + colWidths[0] + colWidths[1] + 4, y + 5.5);

    y += 8;
  });

  y += 6;

  checkPageBreak(16);
  doc.setFillColor(255, 248, 236);
  doc.roundedRect(margin, y, contentWidth, 12, 2, 2, "F");
  doc.setDrawColor(232, 163, 61);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 12, 2, 2, "S");

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(180, 83, 9);
  doc.text("⚠  Estimasi kasar untuk perencanaan awal, bukan hasil perhitungan RAB final.", margin + 4, y + 7);

  doc.setFillColor(...C.primary);
  doc.rect(0, pageHeight - 4, pageWidth, 4, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...C.light);
  doc.text("Owren.tech — Biogas Dome Calculator", pageWidth / 2, pageHeight - 7, { align: "center" });

  const fileName = `Konfigurasi_Dome_${params.shapeType}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}

export default function DomePdfExport({ user, params, calc, canvasRef, materialsConfig }) {
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handlePrint = async () => {
    setLoading(true);
    try {
      await generateDomePdf({ user, params, calc, canvasRef, materialsConfig });
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePrint}
      disabled={loading}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 16px",
        borderRadius: 9999,
        fontSize: "0.8125rem",
        fontWeight: 600,
        border: "1.5px solid #00684a",
        backgroundColor: loading ? "#e1e5e8" : "#ffffff",
        color: loading ? "#7c8c9a" : "#00684a",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.backgroundColor = "#e3fcef";
        }
      }}
      onMouseLeave={(e) => {
        if (!loading) {
          e.currentTarget.style.backgroundColor = "#ffffff";
        }
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
      {loading ? "Menyiapkan PDF..." : "Cetak PDF"}
    </button>
  );
}
