import { useRef } from "react";
import useLenis from "../../hooks/useLenis";

const FRAME_THICKNESS = 10;
const CORNER_RADIUS = 28;

/* ── SiteFrame — bezel hitam tipis mengelilingi viewport, konten
   di-clip melengkung di 4 pojok dalam (device-frame ala Linear/Vercel) ── */
export default function SiteFrame({ children }) {
  const scrollRef = useRef(null);
  useLenis(scrollRef);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        padding: FRAME_THICKNESS,
        backgroundColor: "#000000",
      }}
    >
      <div
        ref={scrollRef}
        className="site-frame-scroll"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: CORNER_RADIUS,
          overflow: "auto",
          backgroundColor: "#ffffff",
        }}
      >
        {children}
      </div>
    </div>
  );
}
