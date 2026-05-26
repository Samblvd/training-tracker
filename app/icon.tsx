import { ImageResponse } from "next/og";
import { BearFace } from "@/lib/bear-face";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<BearFace size={512} />, size);
}
