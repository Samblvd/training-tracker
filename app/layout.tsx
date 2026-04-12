import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Noto_Sans_SC } from "next/font/google";

import { AppBootstrap } from "@/components/app-bootstrap";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

const notoSans = Noto_Sans_SC({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "训练助手",
  description: "聚焦训练进行中辅助、休息倒计时和训练记录的健身训练助手。",
  manifest: "/manifest.webmanifest",
  applicationName: "训练助手",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "训练助手",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon?size=192", sizes: "192x192", type: "image/png" },
      { url: "/icon?size=512", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${notoSans.variable} ${ibmPlexMono.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        <AppBootstrap />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
