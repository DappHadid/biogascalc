import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import api from "../../api/axios";

export default function Faq() {
  const [openId, setOpenId] = useState(null);
  const [faqCategories, setFaqCategories] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api
      .get("/homepage/faq")
      .then(({ data }) => {
        setFaqCategories(data.data);
        setLoaded(true);
        if (data.data.length > 0 && data.data[0].items.length > 0) {
          setOpenId(`${data.data[0].category}-0`);
        }
      })
      .catch(() => {
        setLoaded(true);
      });
  }, []);

  if (!loaded || faqCategories.length === 0) return null;

  return (
    <section className="relative overflow-hidden pt-24 pb-[320px] max-[850px]:pt-16 max-[850px]:pb-[260px] bg-white">
      <div className="w-full max-w-7xl mx-auto px-8 max-[767px]:px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* KOLOM KIRI: Judul & Tombol */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 self-start">
            <h2 className="font-semibold tracking-tight text-5xl leading-tight text-slate-900 mb-6">Pertanyaan yang Sering Diajukan</h2>
          </div>

          {/* KOLOM KANAN: Daftar Kategori & FAQ */}
          <div className="lg:col-span-7 flex flex-col gap-12">
            {faqCategories.map((group) => (
              <div key={group.category}>
                <h3 className="font-semibold text-xl text-slate-900 mb-4 tracking-tight">{group.category}</h3>

                {/* Garis atas untuk kategori */}
                <div className="h-px bg-slate-300" />

                <div>
                  {group.items.map((item, i) => {
                    const id = `${group.category}-${i}`;
                    const isOpen = openId === id;

                    return (
                      <div key={id} className="border-b border-slate-200">
                        <button
                          onClick={() => setOpenId(isOpen ? null : id)}
                          aria-expanded={isOpen}
                          className="w-full flex items-center justify-between text-left py-6 bg-transparent border-none cursor-pointer"
                        >
                          <span className="font-medium pr-8 text-base text-slate-800 leading-normal">{item.q}</span>
                          <motion.span
                            animate={{ rotate: isOpen ? 45 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex-shrink-0 flex items-center justify-center text-slate-700"
                          >
                            <Plus size={20} strokeWidth={2} />
                          </motion.span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                              className="overflow-hidden"
                            >
                              <p className="pb-6 pr-8 text-sm leading-relaxed text-slate-600">{item.a}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
