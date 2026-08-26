import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

// Tinggi gambar headline tetap (mengikuti tinggi teks) — hanya lebar (aspect ratio)
// yang berganti antara 16:9 dan 4:3, dibolak-balik antar kedua gambar tiap siklus.
// Lebar dihitung dari tinggi tetap agar transisi width murni (tanpa scale transform
// dari layout animation) sehingga gambar tidak "berenang"/distorsi saat aspect ratio berubah.
function HeadlineImage({ src, alt, wide }) {
  const ratio = wide ? 16 / 9 : 4 / 3;

  return (
    <motion.img
      src={src}
      alt={alt}
      animate={{ aspectRatio: ratio }}
      transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
      style={{ objectFit: "cover" }}
      className="inline-block h-20 max-[1024px]:h-16! max-[600px]:h-11! rounded-lg align-middle"
    />
  );
}

export default function Hero() {
  // false: gambar pertama 16:9, gambar kedua 4:3 — true: dibalik
  const [swapped, setSwapped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSwapped((prev) => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-start bg-[#022c22] overflow-hidden">
      {/* Video background, auto-play looping */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/biogas_video.mp4"
        autoPlay
        loop
        muted
        playsInline
        poster="/hero-background.webp"
      />

      {/* Efek gelap tipis hanya di bawah navbar, tidak menutupi seluruh foto */}
      <div className="absolute inset-x-0 top-0 h-72 bg-linear-to-b from-black/65 via-black/20 to-transparent pointer-events-none" />

      {/* Overlay gelap tipis di atas foto agar zigzag putih tetap kontras */}
      <div className="absolute inset-x-0 bottom-0 h-32 max-[850px]:h-24 bg-linear-to-b from-transparent to-black/50 pointer-events-none" />

      {/* Divider bentuk Layered Fluid Wave (Inovasi organik 3 lapis) */}
      <div className="absolute inset-x-0 bottom-0 w-full overflow-hidden leading-[0] pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="relative block w-full h-[80px] md:h-[120px] lg:h-[180px] -mb-[1px]"
        >
          {/* Layer 1 (Paling belakang, opasitas 30%) */}
          <path fill="rgba(255,255,255,0.3)" d="M0,96L80,112C160,128,320,160,480,154.7C640,149,800,107,960,101.3C1120,96,1280,128,1360,144L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          {/* Layer 2 (Tengah, opasitas 60%) */}
          <path fill="rgba(255,255,255,0.6)" d="M0,192L80,181.3C160,171,320,149,480,165.3C640,181,800,235,960,234.7C1120,235,1280,181,1360,154.7L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          {/* Layer 3 (Utama, solid putih) */}
          <path fill="#ffffff" d="M0,256L80,240C160,224,320,192,480,197.3C640,203,800,245,960,245.3C1120,245,1280,203,1360,181.3L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-8 max-[767px]:px-4 pt-52 max-[850px]:pt-40 text-center">
        {/* ── Headline dengan gambar disisipkan di tengah teks ── */}
        <motion.h1
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="font-semibold leading-[1.12] tracking-tight text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.55)]"
        >
          <motion.span layout className="flex flex-wrap items-center justify-center gap-3 max-[600px]:gap-2 text-6xl max-[1024px]:text-5xl max-[600px]:text-3xl">
            HITUNG POTENSI
            <HeadlineImage
              src="/hero-card.png"
              alt="Instalasi dome biogas rumah tangga"
              wide={!swapped}
            />
            BIOGAS
          </motion.span>
          <motion.span layout className="flex flex-wrap items-center justify-center gap-3 max-[600px]:gap-2 text-6xl max-[1024px]:text-5xl max-[600px]:text-3xl mt-2">
            ANDA
            <HeadlineImage
              src="/hero-bg.png"
              alt="Instalasi biogas dan peternakan"
              wide={swapped}
            />
            SECARA INSTAN
          </motion.span>
        </motion.h1>

        <motion.p
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg leading-relaxed mt-8 text-white/90 max-w-xl mx-auto [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]"
        >
          Estimasi produksi biogas dari limbah organik dalam hitungan detik — berbasis data riset, gratis, dan mudah digunakan.
        </motion.p>

        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4 mt-10"
        >
          <Link
            to="/kalkulator-limbah"
            className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            Mulai Hitung
          </Link>
          <Link
            to="/rancang-dome"
            className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold border border-white/70 bg-black/20 text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
          >
            Pelajari Lebih Lanjut
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
