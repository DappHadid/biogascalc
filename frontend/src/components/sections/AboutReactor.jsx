import { Cpu, ArrowRightLeft, Wind, ShieldCheck, Flame } from "lucide-react";
import Reveal from "./Reveal";

const COMPONENTS = [
  {
    icon: Cpu,
    title: "Kubah Digester (Dome)",
    desc: "Ruang kedap udara tempat bakteri anaerob menguraikan limbah organik menjadi biogas.",
  },
  {
    icon: ArrowRightLeft,
    title: "Inlet & Outlet",
    desc: "Saluran masuk limbah segar dan saluran keluar residu (slurry) yang siap jadi pupuk.",
  },
  {
    icon: Wind,
    title: "Pipa Penyalur Gas",
    desc: "Mengalirkan gas metana hasil fermentasi menuju titik pemakaian (kompor/genset).",
  },
  {
    icon: ShieldCheck,
    title: "Katup Pengaman",
    desc: "Menjaga tekanan gas dalam dome tetap stabil dan aman dari risiko kebocoran.",
  },
];

export default function AboutReactor() {
  return (
    <section
      className="relative overflow-hidden py-24 max-[850px]:py-16"
      style={{ background: "radial-gradient(120% 100% at 100% 0%, #064e3b 0%, #022c22 55%, #00120f 100%)" }}
    >
      {/* glow accents */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none w-120 h-120 -top-30 -left-30 rounded-full blur-[20px]"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)" }}
      />

      <div className="w-full max-w-7xl mx-auto px-8 max-[767px]:px-4 relative">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-semibold mb-6 text-emerald-300 border border-emerald-400/25 bg-emerald-500/12">
            <Flame size={15} strokeWidth={2.25} />
            Teknologi Reaktor
          </span>

          <h2 className="font-semibold text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.12] tracking-tight text-white">
            Mengenal Reaktor Biogas Dome
          </h2>
          <p className="mt-6 text-[1.0625rem] leading-relaxed text-slate-300 max-w-160">
            Reaktor dome dirancang sederhana namun efektif — memanfaatkan proses
            fermentasi anaerob untuk mengubah limbah organik menjadi biogas siap
            pakai, tanpa membutuhkan energi listrik tambahan.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-14">
          {COMPONENTS.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={0.08 * (i + 1)}>
                <div
                  className="h-full group p-7 rounded-[22px] border border-white/10 backdrop-blur-md transition-[border-color,transform] duration-200"
                  style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))" }}
                >
                  <div
                    className="flex items-center justify-center mb-5 w-12 h-12 rounded-[14px] text-emerald-300"
                    style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.22), rgba(16,185,129,0.06))" }}
                  >
                    <Icon size={22} strokeWidth={2} />
                  </div>
                  <h3 className="font-semibold text-xl text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-slate-300">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
