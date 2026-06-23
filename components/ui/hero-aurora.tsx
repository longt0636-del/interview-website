"use client";
import type { CSSProperties } from "react";

// Brand-teal aurora — navy palette only, no amber, stays far right
const GRADIENT = `repeating-linear-gradient(
  100deg,
  #073d54 10%,
  #1D9E75 18%,
  #5DCAA5 24%,
  #0e7490 30%,
  #073d54 38%
)`;

// Tight mask: only the right 40% shows, fades aggressively left
const MASK = "radial-gradient(ellipse at 100% 50%, black 0%, black 20%, transparent 65%)";

export function HeroAurora() {
  const base: CSSProperties = {
    position: "absolute",
    inset: "-10px",
    backgroundImage: GRADIENT,
    backgroundSize: "400% 300%",
    backgroundPosition: "50% 50%",
    maskImage: MASK,
    WebkitMaskImage: MASK,
    willChange: "backgroundPosition",
    animation: "auroraMove 12s linear infinite",
  };

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: "45%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {/* Soft base glow */}
      <div style={{ ...base, filter: "blur(22px)", opacity: 0.22 }} />
      {/* Sharper moving layer */}
      <div style={{
        ...base,
        filter: "blur(10px)",
        opacity: 0.14,
        animation: "auroraMove 12s linear infinite reverse",
      }} />
    </div>
  );
}
