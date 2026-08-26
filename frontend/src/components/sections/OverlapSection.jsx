import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ── OverlapSection — pins each section at the top of the viewport;
   the next section scrolls up and over it, revealing a subtle
   scale/dim "receding" effect on the one being covered.

   The outer wrapper needs its own scroll runway (min-height: 100dvh
   beyond the sticky child) or the sticky release happens almost
   immediately, causing every section to visually stack on top of
   each other instead of transitioning one at a time. ── */
export default function OverlapSection({ children, background = "#ffffff", zIndex = 1 }) {
  const wrapperRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0.6, 1], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0.6, 1], [1, 0.6]);

  return (
    <div ref={wrapperRef} style={{ position: "relative", zIndex }}>
      <div style={{ position: "sticky", top: 0 }}>
        <motion.div
          style={{
            scale,
            opacity,
            backgroundColor: background,
            borderRadius: 40,
            overflow: "hidden",
            transformOrigin: "top center",
            boxShadow: "0 30px 60px -20px rgba(0,20,15,0.35)",
          }}
        >
          {children}
        </motion.div>
      </div>
      {/* scroll runway — gives the sticky child room to sit pinned
          before the next section's wrapper begins covering it */}
      <div aria-hidden="true" style={{ height: "18vh" }} />
    </div>
  );
}
