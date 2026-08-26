import { useEffect, useRef } from "react";
import Lenis from "lenis";

/* ── useLenis — smooth-scroll bound to a custom scroll container,
   not window/body (SiteFrame's .site-frame-scroll owns the scrollbar) ── */
export default function useLenis(scrollRef) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const wrapper = scrollRef.current;
    if (!wrapper) return;

    const lenis = new Lenis({
      wrapper,
      content: wrapper.firstElementChild ?? wrapper,
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false, // keep native touch scroll on mobile
    });
    lenisRef.current = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [scrollRef]);

  return lenisRef;
}
