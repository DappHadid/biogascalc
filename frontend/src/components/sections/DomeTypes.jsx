import { Layers, CheckCircle2, Info } from "lucide-react";
import Reveal from "./Reveal";

const DOME_TYPES = [
  {
    id: "floating",
    name: "Floating Dome",
    tagline: "Kubah Apung",
    accent: "#10b981",
    desc:
      "Jenis digester biogas dengan bentuk menyerupai kubah apung. Floating dome terdiri dari satu digester dan penampung gas terpisah yang bisa bergerak seperti pelampung. Penampung gas akan naik ketika gas bertambah, dan turun kembali ketika gas berkurang.",
    points: [
      "Tekanan gas relatif stabil karena mengikuti gerak naik-turun penampung apung",
      "Volume gas yang tersimpan mudah diperkirakan dari ketinggian drum",
      "Bagian penampung gas (biasanya logam) rentan korosi dan perlu perawatan berkala",
    ],
    bestFor: "Kebutuhan pasokan gas yang perlu terpantau, mis. dapur produksi/UMKM",
  },
  {
    id: "fixed",
    name: "Fixed Dome",
    tagline: "Kubah Tetap",
    accent: "#059669",
    desc:
      "Digester biogas yang umumnya bermaterial batu bata atau beton dan dipendam dalam tanah, berbentuk seperti kubah. Ruang digester dan penampung gas menyatu dalam satu struktur tetap yang tidak bergerak.",
    points: [
      "Konstruksi lebih sederhana dan biayanya cenderung lebih hemat",
      "Seluruhnya beton/batu bata sehingga tahan lama dan minim bagian logam berkarat",
      "Letaknya di dalam tanah membuat kebocoran sulit dideteksi sejak dini",
    ],
    bestFor: "Skala rumah tangga & komunitas dengan lahan terbatas",
  },
];

function DomeIllustration({ variant, accent }) {
  return (
    <div
      className="relative h-56 rounded-2xl mb-6 flex items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${accent}14, ${accent}04)` }}
    >
      <div
        aria-hidden="true"
        className="absolute w-64 h-64 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${accent}33 0%, transparent 70%)` }}
      />

      {variant === "fixed" ? (
        <svg viewBox="0 0 240 140" className="relative w-56 h-auto" fill="none">
          {/* ground line */}
          <line x1="10" y1="110" x2="230" y2="110" stroke={accent} strokeOpacity="0.2" strokeWidth="2" strokeDasharray="4 5" />
          {/* buried dome chamber */}
          <path d="M40 110 C40 60 90 30 130 30 C170 30 200 60 200 110 Z" fill={`${accent}22`} stroke={accent} strokeWidth="2.5" />
          {/* slurry fill level */}
          <path d="M52 108 C52 88 60 108 100 108 C140 108 150 88 188 108 L188 108 L52 108 Z" fill={`${accent}55`} />
          {/* compensation tank */}
          <path d="M188 110 L188 70 C188 65 205 65 205 70 L205 110 Z" fill={`${accent}18`} stroke={accent} strokeWidth="2" />
          {/* inlet pipe */}
          <line x1="40" y1="95" x2="18" y2="80" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
          {/* gas outlet */}
          <circle cx="130" cy="30" r="5" fill={accent} />
          <line x1="130" y1="30" x2="130" y2="16" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 240 140" className="relative w-56 h-auto" fill="none">
          {/* ground line */}
          <line x1="10" y1="118" x2="230" y2="118" stroke={accent} strokeOpacity="0.2" strokeWidth="2" strokeDasharray="4 5" />
          {/* digester pit (underground cylinder) */}
          <path d="M55 118 L55 70 C55 62 165 62 165 70 L165 118 Z" fill={`${accent}18`} stroke={accent} strokeWidth="2.5" />
          <ellipse cx="110" cy="70" rx="55" ry="10" fill={`${accent}22`} stroke={accent} strokeWidth="2" />
          {/* slurry level */}
          <path d="M60 105 C80 98 140 98 160 105 L160 116 L60 116 Z" fill={`${accent}55`} />
          {/* floating drum */}
          <path d="M65 60 C65 40 155 40 155 60 L155 78 C155 84 65 84 65 78 Z" fill={`${accent}33`} stroke={accent} strokeWidth="2.5" />
          <ellipse cx="110" cy="60" rx="45" ry="9" fill={`${accent}44`} stroke={accent} strokeWidth="2" />
          {/* up/down arrows indicating floating motion */}
          <path d="M180 55 L180 35 M174 41 L180 33 L186 41" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M180 90 L180 70 M174 84 L180 92 L186 84" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* gas outlet */}
          <circle cx="110" cy="51" r="4.5" fill={accent} />
          <line x1="110" y1="51" x2="110" y2="20" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

function DomeCard({ item, delay }) {
  return (
    <Reveal delay={delay}>
      <div
        className="h-full p-7 rounded-3xl backdrop-blur-md transition-transform duration-200 hover:-translate-y-1"
        style={{
          background: "rgba(255,255,255,0.7)",
          border: "1px solid rgba(5,150,105,0.10)",
          boxShadow: "0 8px 24px -12px rgba(2,44,34,0.15)",
        }}
      >
        <DomeIllustration variant={item.id} accent={item.accent} />

        <span
          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold mb-4 w-fit"
          style={{ color: item.accent, border: `1px solid ${item.accent}40`, background: `${item.accent}14` }}
        >
          {item.tagline}
        </span>

        <h3 className="font-semibold text-2xl text-slate-900 tracking-tight">
          {item.name}
        </h3>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-slate-600">
          {item.desc}
        </p>

        <ul className="mt-5 space-y-2.5">
          {item.points.map((point) => (
            <li key={point} className="flex items-start gap-2.5 text-sm text-slate-700">
              <CheckCircle2 size={17} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: item.accent }} />
              <span className="leading-snug">{point}</span>
            </li>
          ))}
        </ul>

        <div
          className="mt-6 flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm"
          style={{ background: `${item.accent}0d`, border: `1px solid ${item.accent}22` }}
        >
          <Info size={16} strokeWidth={2.25} className="shrink-0 mt-0.5" style={{ color: item.accent }} />
          <span className="text-slate-700">
            <span className="font-semibold text-slate-900">Cocok untuk: </span>
            {item.bestFor}
          </span>
        </div>
      </div>
    </Reveal>
  );
}

export default function DomeTypes() {
  return (
    <section className="relative overflow-hidden py-24 max-[850px]:py-16 bg-white">
      <div className="w-full max-w-7xl mx-auto px-8 max-[767px]:px-4 relative">
        <Reveal className="max-w-176">
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-semibold mb-6 text-emerald-700 border border-emerald-500/25 bg-linear-to-br from-emerald-500/16 to-emerald-600/8">
            <Layers size={15} strokeWidth={2.25} />
            Edukasi
          </span>

          <h2 className="font-semibold text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.12] tracking-tight text-slate-900">
            Kenali Jenis-Jenis{" "}
            <span className="bg-linear-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
              Dome Reaktor Biogas
            </span>
          </h2>

          <p className="mt-6 text-[1.0625rem] leading-relaxed text-slate-700 max-w-160">
            Sebelum merancang instalasi Anda, pahami dulu dua tipe kubah reaktor
            biogas yang paling umum digunakan — masing-masing punya karakteristik
            tekanan gas, biaya, dan perawatan yang berbeda.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-14">
          {DOME_TYPES.map((item, i) => (
            <DomeCard key={item.id} item={item} delay={0.08 * (i + 1)} />
          ))}
        </div>
      </div>
    </section>
  );
}
