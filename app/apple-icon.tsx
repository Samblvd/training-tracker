import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
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
          borderRadius: 42,
          fontFamily: '"Noto Sans SC", sans-serif',
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 999,
            background: "#f15a22",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            fontWeight: 800,
            boxShadow: "0 16px 30px rgba(241,90,34,0.28)",
          }}
        >
          训
        </div>
      </div>
    ),
    size,
  );
}
