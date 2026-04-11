import type { Metadata } from "next";
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
  title: "训练记录",
  description: "训练记录应用",
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
