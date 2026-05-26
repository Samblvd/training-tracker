// Shared bear icon component for next/og ImageResponse
// All coordinates are defined at 180px base; pass size to scale.

export function BearFace({ size }: { size: number }) {
  const s = size / 180;
  const p = (n: number) => Math.round(n * s);
  const b = (n: number) => `${Math.max(1, Math.round(n * s))}px`;
  const r = (n: number) => `${p(n)}px`;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(150deg, #FF7A3D 0%, #F15A22 55%, #C94A15 100%)",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Shine orb top-left */}
      <div
        style={{
          position: "absolute",
          top: p(-28),
          left: p(-28),
          width: p(140),
          height: p(140),
          borderRadius: "50%",
          background: "rgba(255,255,255,0.13)",
        }}
      />
      {/* Small shine bottom-right */}
      <div
        style={{
          position: "absolute",
          bottom: p(-20),
          right: p(-20),
          width: p(80),
          height: p(80),
          borderRadius: "50%",
          background: "rgba(255,255,255,0.07)",
        }}
      />

      {/* ── Left ear ── */}
      <div
        style={{
          position: "absolute",
          top: p(18),
          left: p(22),
          width: p(46),
          height: p(46),
          borderRadius: "50%",
          background: "#F2D9B8",
          border: `${b(5)} solid #2A1810`,
        }}
      />
      {/* left ear inner (pink) */}
      <div
        style={{
          position: "absolute",
          top: p(27),
          left: p(31),
          width: p(22),
          height: p(22),
          borderRadius: "50%",
          background: "#FFBCA0",
        }}
      />

      {/* ── Right ear ── */}
      <div
        style={{
          position: "absolute",
          top: p(18),
          right: p(22),
          width: p(46),
          height: p(46),
          borderRadius: "50%",
          background: "#F2D9B8",
          border: `${b(5)} solid #2A1810`,
        }}
      />
      {/* right ear inner */}
      <div
        style={{
          position: "absolute",
          top: p(27),
          right: p(31),
          width: p(22),
          height: p(22),
          borderRadius: "50%",
          background: "#FFBCA0",
        }}
      />

      {/* ── Head ── */}
      <div
        style={{
          position: "absolute",
          top: p(34),
          left: p(14),
          width: p(152),
          height: p(128),
          borderRadius: r(66),
          background: "#F2D9B8",
          border: `${b(5)} solid #2A1810`,
        }}
      />

      {/* ── Left eye (white) ── */}
      <div
        style={{
          position: "absolute",
          top: p(56),
          left: p(32),
          width: p(36),
          height: p(36),
          borderRadius: "50%",
          background: "white",
          border: `${b(4)} solid #2A1810`,
        }}
      />
      {/* left pupil */}
      <div
        style={{
          position: "absolute",
          top: p(65),
          left: p(40),
          width: p(16),
          height: p(16),
          borderRadius: "50%",
          background: "#2A1810",
        }}
      />
      {/* left sparkle */}
      <div
        style={{
          position: "absolute",
          top: p(63),
          left: p(49),
          width: p(6),
          height: p(6),
          borderRadius: "50%",
          background: "white",
        }}
      />

      {/* ── Right eye (white) ── */}
      <div
        style={{
          position: "absolute",
          top: p(56),
          right: p(32),
          width: p(36),
          height: p(36),
          borderRadius: "50%",
          background: "white",
          border: `${b(4)} solid #2A1810`,
        }}
      />
      {/* right pupil */}
      <div
        style={{
          position: "absolute",
          top: p(65),
          right: p(40),
          width: p(16),
          height: p(16),
          borderRadius: "50%",
          background: "#2A1810",
        }}
      />
      {/* right sparkle */}
      <div
        style={{
          position: "absolute",
          top: p(63),
          right: p(36),
          width: p(6),
          height: p(6),
          borderRadius: "50%",
          background: "white",
        }}
      />

      {/* ── Blush left ── */}
      <div
        style={{
          position: "absolute",
          top: p(88),
          left: p(20),
          width: p(30),
          height: p(16),
          borderRadius: r(10),
          background: "rgba(255,110,80,0.42)",
        }}
      />
      {/* ── Blush right ── */}
      <div
        style={{
          position: "absolute",
          top: p(88),
          right: p(20),
          width: p(30),
          height: p(16),
          borderRadius: r(10),
          background: "rgba(255,110,80,0.42)",
        }}
      />

      {/* ── Muzzle ── */}
      <div
        style={{
          position: "absolute",
          top: p(100),
          left: p(58),
          width: p(64),
          height: p(38),
          borderRadius: r(24),
          background: "#E8C8A0",
          border: `${b(3)} solid #2A1810`,
        }}
      />

      {/* ── Nose ── */}
      <div
        style={{
          position: "absolute",
          top: p(103),
          left: p(78),
          width: p(24),
          height: p(14),
          borderRadius: r(8),
          background: "#2A1810",
        }}
      />

      {/* ── Smile ── */}
      <div
        style={{
          position: "absolute",
          top: p(122),
          left: p(75),
          width: p(30),
          height: p(14),
          borderRadius: `0 0 ${r(14)} ${r(14)}`,
          border: `${b(3)} solid #2A1810`,
          borderTop: "none",
        }}
      />
    </div>
  );
}
