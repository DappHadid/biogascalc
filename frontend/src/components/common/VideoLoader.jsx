import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "heroVideoLoaded";
const VIDEO_SRC = "/biogas_video.mp4";
const MAX_WAIT_MS = 6000;

export default function VideoLoader() {
  const [visible, setVisible] = useState(() => sessionStorage.getItem(SESSION_KEY) !== "true");
  const [fadingOut, setFadingOut] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!visible) return;

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      sessionStorage.setItem(SESSION_KEY, "true");
      setFadingOut(true);
      setTimeout(() => setVisible(false), 400);
    };

    const video = document.createElement("video");
    video.src = VIDEO_SRC;
    video.muted = true;
    video.preload = "auto";
    video.addEventListener("canplaythrough", finish);
    video.addEventListener("error", finish);
    video.load();

    const timeout = setTimeout(finish, MAX_WAIT_MS);

    return () => {
      clearTimeout(timeout);
      video.removeEventListener("canplaythrough", finish);
      video.removeEventListener("error", finish);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#022c22] transition-opacity duration-400 ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="h-12 w-12 rounded-full border-4 border-white/20 border-t-emerald-400 animate-spin" />
    </div>
  );
}
