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

// Mask sits on a still wrapper; the blurred strip inside slides with `transform`, so the
// browser blurs it once and just moves the texture (animating background-position re-blurred
// every frame — a steady battery drain on phones). Strip is 10× wide with a 40%-wide tile =
// the old 400% background, and auroraMove's -15% → -75% equals the old 50% → 250% pan.
function Layer({ blur, opacity, reverse }: { blur: number; opacity: number; reverse?: boolean }) {
  return (
    <div style={{ position: "absolute", inset: 0, opacity, maskImage: MASK, WebkitMaskImage: MASK }}>
      <div
        style={{
          position: "absolute",
          top: -10,
          bottom: -10,
          left: 0,
          width: "1000%",
          backgroundImage: GRADIENT,
          backgroundSize: "40% 300%",
          backgroundPosition: "0 50%",
          filter: `blur(${blur}px)`,
          willChange: "transform",
          animation: `auroraMove 12s linear infinite${reverse ? " reverse" : ""}`,
        }}
      />
    </div>
  );
}

export function HeroAurora() {
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
      <Layer blur={22} opacity={0.22} />
      {/* Sharper moving layer */}
      <Layer blur={10} opacity={0.14} reverse />
    </div>
  );
}
