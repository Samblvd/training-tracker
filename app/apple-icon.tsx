import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

function DuckIcon() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FFB238",
        position: "relative",
        overflow: "hidden",
        borderRadius: 44,
      }}
    >
      <div style={{ position: "absolute", top: 18, right: 24, fontSize: 36, color: "#5B2E18", fontWeight: 900 }}>?</div>
      <div
        style={{
          position: "absolute",
          top: 58,
          left: 34,
          width: 112,
          height: 84,
          borderRadius: 72,
          background: "#F4E5CC",
          border: "6px solid #222",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 46,
          left: 46,
          width: 36,
          height: 36,
          borderRadius: 999,
          background: "white",
          border: "6px solid #222",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 46,
          left: 92,
          width: 38,
          height: 38,
          borderRadius: 999,
          background: "white",
          border: "6px solid #222",
        }}
      />
      <div style={{ position: "absolute", top: 64, left: 64, width: 8, height: 8, borderRadius: 999, background: "#222" }} />
      <div style={{ position: "absolute", top: 70, left: 106, width: 8, height: 8, borderRadius: 999, background: "#222" }} />
      <div
        style={{
          position: "absolute",
          top: 92,
          left: 56,
          width: 64,
          height: 32,
          borderRadius: 40,
          background: "#B89A7A",
          border: "5px solid #222",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 10,
          width: 58,
          height: 58,
          borderRadius: 999,
          background: "#F4E5CC",
          border: "6px solid #222",
          transform: "rotate(-26deg)",
        }}
      />
    </div>
  );
}

export default function AppleIcon() {
  return new ImageResponse(<DuckIcon />, size);
}
