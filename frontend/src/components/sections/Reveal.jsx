import { motion } from "framer-motion";

/* ── Reveal — fade + slide-up on scroll-into-view, staggered via `delay` ── */
export default function Reveal({ children, delay = 0, y = 24, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
