import { Users } from "lucide-react";
import Reveal from "./Reveal";

const LOGOS = [
  { src: "/589180084_17869033776483190_1218862795343478522_n.webp", alt: "Kampus Merdeka" },
  { src: "/diktisaintek.webp", alt: "Diktisaintek" },
  { src: "/itenas.webp", alt: "Itenas" },
  { src: "/lppmitenas.webp", alt: "LPPM Itenas" },
];

export default function About() {
  return (
    <section className="relative overflow-hidden py-24 max-[850px]:py-16 bg-white">
      <div className="w-full max-w-5xl mx-auto px-8 max-[767px]:px-4 relative flex flex-col items-center text-center">
        <Reveal>
          <span className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-semibold mb-6 text-emerald-700 border border-emerald-500/25 bg-linear-to-br from-emerald-500/16 to-emerald-600/8">
            <Users size={15} strokeWidth={2.25} />
            Tentang OWREN
          </span>

          <h2 className="font-semibold text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.12] tracking-tight text-slate-900 mb-6">
            Mengenal{" "}
            <span className="bg-linear-to-r from-emerald-600 via-emerald-500 to-emerald-400 bg-clip-text text-transparent">
              OWREN
            </span>
          </h2>

          <p className="text-lg leading-relaxed text-slate-700 max-w-3xl mx-auto">
            <strong>OWREN</strong> (Organic Waste to Renewable Energy & Nutrient) adalah 
            inisiatif inovatif yang hadir untuk membantu masyarakat dan peneliti 
            memanfaatkan limbah organik rumah tangga maupun peternakan. Kami mengubah 
            limbah menjadi sumber energi terbarukan melalui reaktor biogas dome yang 
            efisien, presisi, dan mudah dibangun.
          </p>
        </Reveal>

        {/* Didukung Oleh Section */}
        <Reveal delay={0.2}>
          <div className="mt-16 pt-10 border-t border-slate-100 w-full flex flex-col items-center">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">
              Didukung Oleh
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
              {LOGOS.map((logo, idx) => (
                <img 
                  key={idx} 
                  src={logo.src} 
                  alt={logo.alt} 
                  className="h-16 md:h-20 w-auto object-contain drop-shadow-sm" 
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
