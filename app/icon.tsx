import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
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
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,193,77,0.0) 0%, rgba(237,144,36,0.18) 100%)",
        }}
      />
      <div style={{ position: "absolute", top: 46, right: 70, fontSize: 92, color: "#5B2E18", fontWeight: 900 }}>?</div>
      <div
        style={{
          position: "absolute",
          top: 164,
          left: 98,
          width: 320,
          height: 238,
          borderRadius: 160,
          background: "#F4E5CC",
          border: "14px solid #222",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 134,
          left: 124,
          width: 110,
          height: 110,
          borderRadius: 999,
          background: "white",
          border: "14px solid #222",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 132,
          left: 246,
          width: 118,
          height: 118,
          borderRadius: 999,
          background: "white",
          border: "14px solid #222",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 182,
          left: 184,
          width: 22,
          height: 22,
          borderRadius: 999,
          background: "#222",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 192,
          left: 280,
          width: 22,
          height: 22,
          borderRadius: 999,
          background: "#222",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 264,
          left: 172,
          width: 182,
          height: 96,
          borderRadius: 80,
          background: "#B89A7A",
          border: "12px solid #222",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 82,
          left: 58,
          width: 138,
          height: 138,
          borderRadius: 999,
          background: "#F4E5CC",
          border: "14px solid #222",
          transform: "rotate(-26deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 126,
          left: 136,
          width: 88,
          height: 30,
          background: "#222",
          transform: "rotate(-20deg)",
          borderRadius: 999,
        }}
      />
    </div>
  );
}

export default function Icon() {
  return new ImageResponse(<DuckIcon />, size);
}
