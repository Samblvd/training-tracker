import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
          color: "white",
          position: "relative",
          fontFamily: '"Noto Sans SC", sans-serif',
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 42,
            borderRadius: 96,
            background: "radial-gradient(circle at top right, rgba(241,90,34,0.32), transparent 35%), rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 172,
              height: 172,
              borderRadius: 999,
              background: "#f15a22",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 24px 56px rgba(241,90,34,0.28)",
              fontSize: 90,
              fontWeight: 800,
            }}
          >
            训
          </div>
          <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -4 }}>训练助手</div>
        </div>
      </div>
    ),
    size,
  );
}
