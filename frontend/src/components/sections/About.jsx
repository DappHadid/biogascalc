import { Sparkles, Leaf, Users, Zap } from "lucide-react";
import Reveal from "./Reveal";

const STATS = [
  { icon: Leaf, value: "12+", label: "Golongan limbah organik dianalisis", accent: "#10b981" },
  { icon: Sparkles, value: "100%", label: "Gratis & berbasis data riset", accent: "#34d399" },
  { icon: Zap, value: "<1 mnt", label: "Estimasi biogas instan", accent: "#059669" },
];

export default function About() {
  return (
    <section className="relative overflow-hidden py-24 max-[850px]:py-16 bg-white">
      <div className="w-full max-w-7xl mx-auto px-8 max-[767px]:px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-14 items-start">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-semibold mb-6 text-emerald-700 border border-emerald-500/25 bg-linear-to-br from-emerald-500/16 to-emerald-600/8">
              <Users size={15} strokeWidth={2.25} />
              Tentang Program
            </span>

            <h2 className="font-semibold text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.12] tracking-tight text-slate-900">
              PKM Biogas: Solusi{" "}
              <span className="bg-linear-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
                Energi dari Limbah Organik
              </span>
            </h2>

            <p className="mt-6 text-[1.0625rem] leading-relaxed text-slate-700 max-w-136">
              Program Kreativitas Mahasiswa ini hadir untuk membantu masyarakat dan
              peneliti memanfaatkan limbah organik rumah tangga maupun peternakan
              menjadi sumber energi terbarukan melalui reaktor biogas dome yang
              efisien dan mudah dibangun.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-4">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Reveal key={stat.label} delay={0.1 * (i + 1)}>
                  <div
                    className="flex items-center gap-5 rounded-[20px] px-6.5 py-5.5 backdrop-blur-md"
                    style={{
                      background: "rgba(255,255,255,0.7)",
                      border: "1px solid rgba(5,150,105,0.10)",
                      boxShadow: "0 8px 24px -12px rgba(2,44,34,0.15)",
                    }}
                  >
                    <div
                      className="flex items-center justify-center shrink-0 w-13 h-13 rounded-2xl text-emerald-700"
                      style={{ background: `linear-gradient(135deg, ${stat.accent}33, ${stat.accent}11)` }}
                    >
                      <Icon size={24} strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-bold text-2xl text-slate-900 leading-[1.1]">
                        {stat.value}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
