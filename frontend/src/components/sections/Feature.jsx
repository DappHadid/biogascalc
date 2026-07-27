import { Link } from "react-router-dom";
import { Box, RotateCw, Sparkles, Receipt, Calculator, Leaf, ArrowRight, ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";

const FEATURES = [
  {
    icon: Box,
    accent: "#10b981",
    title: "Visualisasi Dome 3D",
    desc: "Lihat bentuk dome Anda secara interaktif — sesuaikan diameter, tinggi, dan bentuk (lingkaran/persegi) secara langsung.",
    linkText: "Buka Visualizer",
    href: "/rancang-dome",
    mockup: "dome",
  },
  {
    icon: Receipt,
    accent: "#059669",
    title: "Estimasi Bahan & Biaya",
    desc: "Dapatkan rincian kebutuhan semen, pasir, batu bata, hingga besi tulangan otomatis dari ukuran dome yang Anda rancang.",
    linkText: "Lihat Estimasi",
    href: "/rancang-dome",
    mockup: "materials",
  },
  {
    icon: Calculator,
    accent: "#34d399",
    title: "Kalkulator Limbah ke Biogas",
    desc: "Masukkan jenis dan berat limbah harian, dapatkan estimasi volume biogas yang bisa dihasilkan per hari.",
    linkText: "Hitung Sekarang",
    href: "/kalkulator-limbah",
    mockup: "waste",
  },
];

function DomeMiniMockup() {
  return (
    <div className="relative flex flex-col items-center">
      <div
        className="w-20 h-10 rounded-t-full"
        style={{ background: "linear-gradient(180deg, #34d399 0%, #059669 100%)" }}
      />
      <div className="w-24 h-1.5 rounded-full mt-1" style={{ background: "rgba(5,150,105,0.15)" }} />
    </div>
  );
}

function MaterialsMiniMockup() {
  const rows = [
    { label: "Semen", qty: "482", unit: "kg" },
    { label: "Pasir", qty: "0.96", unit: "m³" },
    { label: "Batu Bata", qty: "1.930", unit: "buah" },
  ];
  return (
    <div className="w-11/12 rounded-xl bg-white p-2.5" style={{ boxShadow: "0 4px 14px -6px rgba(2,44,34,0.18)" }}>
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between py-1 text-[11px]">
          <span className="text-slate-500">{r.label}</span>
          <span className="font-semibold text-slate-900">
            {r.qty} <span className="font-normal text-slate-400">{r.unit}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function WasteMiniMockup() {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700"
        style={{ boxShadow: "0 4px 14px -6px rgba(2,44,34,0.18)" }}
      >
        50 kg limbah
      </span>
      <ArrowRight size={14} strokeWidth={2.25} className="text-emerald-500 shrink-0" />
      <span
        className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-white bg-emerald-500"
        style={{ boxShadow: "0 4px 14px -6px rgba(16,185,129,0.4)" }}
      >
        8.2 m³/hari
      </span>
    </div>
  );
}

function FeatureCard({ item }) {
  const Icon = item.icon;
  return (
    <div
      className="h-full group p-7 rounded-[22px] backdrop-blur-md transition-[border-color,transform] duration-200 hover:-translate-y-1 flex flex-col"
      style={{
        background: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(5,150,105,0.10)",
        boxShadow: "0 8px 24px -12px rgba(2,44,34,0.15)",
      }}
    >
      <div
        className="h-28 rounded-2xl mb-5 flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(160deg, rgba(16,185,129,0.06), rgba(5,150,105,0.02))" }}
      >
        {item.mockup === "dome" && <DomeMiniMockup />}
        {item.mockup === "materials" && <MaterialsMiniMockup />}
        {item.mockup === "waste" && <WasteMiniMockup />}
      </div>

      <div
        className="flex items-center justify-center mb-4 w-12 h-12 rounded-[14px] text-emerald-700"
        style={{ background: `linear-gradient(135deg, ${item.accent}33, ${item.accent}11)` }}
      >
        <Icon size={22} strokeWidth={2} />
      </div>

      <h3 className="font-semibold text-lg text-slate-900 tracking-tight">
        {item.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 flex-1">
        {item.desc}
      </p>

      <Link
        to={item.href}
        className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors group/link w-fit"
      >
        {item.linkText}
        <ArrowRight size={15} strokeWidth={2.25} className="transition-transform group-hover/link:translate-x-0.5" />
      </Link>
    </div>
  );
}

export default function Feature() {
  return (
    <section className="relative overflow-hidden py-24 max-[850px]:py-16 bg-white">
      <div className="w-full max-w-7xl mx-auto px-8 max-[767px]:px-4 relative">
        {/* intro text block */}
        <Reveal className="max-w-176">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-semibold mb-6 text-emerald-700 border border-emerald-500/25 bg-linear-to-br from-emerald-500/16 to-emerald-600/8">
            <Sparkles size={15} strokeWidth={2.25} />
            Fitur Utama
          </span>

          <h2 className="font-semibold text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.12] tracking-tight text-slate-900">
            Semua yang Anda Butuhkan{" "}
            <span className="bg-linear-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
              dalam Satu Platform
            </span>
          </h2>

          <p className="mt-6 text-[1.0625rem] leading-relaxed text-slate-700 max-w-160">
            Dari simulasi 3D, estimasi biaya bangun, hingga kalkulasi potensi
            biogas — BioGasCalc menyatukan tiga alat penting dalam satu alur
            kerja yang sederhana.
          </p>
        </Reveal>

        {/* top bento row: hero panel + text/CTA panel */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-6 mt-14">
          {/* Hero panel — 3D Dome Visualizer */}
          <Reveal>
            <div
              className="h-full min-h-100 flex flex-col justify-between p-8 rounded-3xl backdrop-blur-md overflow-hidden relative"
              style={{
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(5,150,105,0.10)",
                boxShadow: "0 8px 24px -12px rgba(2,44,34,0.15)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center shrink-0 w-13 h-13 rounded-2xl text-emerald-700"
                  style={{ background: "linear-gradient(135deg, #10b98133, #10b98111)" }}
                >
                  <Box size={24} strokeWidth={2} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Visualisasi 3D
                </span>
              </div>

              <div className="relative flex-1 flex items-center justify-center my-8 min-h-48">
                <div
                  aria-hidden="true"
                  className="absolute w-56 h-56 rounded-full blur-2xl"
                  style={{ background: "radial-gradient(circle, rgba(16,185,129,0.25) 0%, rgba(16,185,129,0) 70%)" }}
                />

                <div className="relative flex flex-col items-center">
                  <div
                    className="w-40 h-20 rounded-t-full"
                    style={{
                      background: "linear-gradient(180deg, #34d399 0%, #059669 70%, #047857 100%)",
                      boxShadow: "0 12px 28px -8px rgba(5,150,105,0.45)",
                    }}
                  />
                  <div className="w-44 h-3 rounded-full mt-1" style={{ background: "rgba(5,150,105,0.15)" }} />
                  <div
                    className="absolute -top-2 -right-8 flex items-center justify-center w-8 h-8 rounded-full bg-white text-emerald-600"
                    style={{ boxShadow: "0 4px 12px -4px rgba(2,44,34,0.25)" }}
                  >
                    <RotateCw size={15} strokeWidth={2.25} />
                  </div>
                </div>

                <div
                  className="absolute bottom-0 right-2 flex items-center gap-2 rounded-xl px-3.5 py-2 bg-white"
                  style={{ boxShadow: "0 8px 20px -8px rgba(2,44,34,0.25)", border: "1px solid rgba(5,150,105,0.12)" }}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-slate-900">
                    Volume: <span className="text-emerald-600">12.4 m³</span>
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-2xl text-slate-900 tracking-tight">
                  Rancang Dome dalam 3D
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-slate-600 max-w-96">
                  Atur parameter dome secara langsung dan lihat perubahan bentuk, volume,
                  serta luas permukaan secara real-time dalam tampilan 3D interaktif.
                </p>
                <Link
                  to="/rancang-dome"
                  className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors group"
                >
                  Coba Visualizer 3D
                  <ArrowRight size={16} strokeWidth={2.25} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Text/CTA panel */}
          <Reveal delay={0.08}>
            <div
              className="h-full flex flex-col justify-center p-8 rounded-3xl backdrop-blur-md"
              style={{
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(5,150,105,0.10)",
                boxShadow: "0 8px 24px -12px rgba(2,44,34,0.15)",
              }}
            >
              <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold mb-5 w-fit text-emerald-700 border border-emerald-500/25 bg-linear-to-br from-emerald-500/16 to-emerald-600/8">
                <Leaf size={13} strokeWidth={2.25} />
                Dari Ide ke Reaktor Nyata
              </span>

              <h3 className="font-semibold text-2xl leading-tight tracking-tight text-slate-900">
                Satu Alur, Tiga Alat yang Saling Terhubung
              </h3>

              <p className="mt-4 text-[0.9375rem] leading-relaxed text-slate-600">
                Hitung potensi biogas dari limbah Anda, rancang dome yang sesuai
                kebutuhan, lalu dapatkan estimasi biaya pembangunannya — semua
                dalam satu kunjungan.
              </p>

              <Link
                to="/kalkulator-limbah"
                className="inline-flex items-center gap-1.5 mt-6 text-xs font-semibold uppercase tracking-wide text-emerald-600 hover:text-emerald-700 transition-colors group w-fit"
              >
                Mulai dari Kalkulator
                <ArrowUpRight size={15} strokeWidth={2.25} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* bottom row: 3 feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
          {FEATURES.map((item, i) => (
            <Reveal key={item.title} delay={0.08 * (i + 1)}>
              <FeatureCard item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
