import type { Metadata } from "next";
import { siteUrl } from "./site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Festyle | 2026・2027 日本音樂祭與專場指南",
  description:
    "整理 2026、2027 年日本音樂祭與專場日期、地點、演出陣容與官方售票資訊。依年份和地區探索演出。",
  applicationName: "Festyle",
  alternates: { canonical: `${siteUrl}/` },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: "/",
    siteName: "Festyle",
    title: "Festyle | 2026・2027 日本音樂祭與專場指南",
    description:
      "查找日本音樂祭與專場日期、地點、演出陣容與官方售票資訊。",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "Festyle 日本音樂祭指南" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Festyle | 2026・2027 日本音樂祭與專場指南",
    description: "探索日本音樂祭與專場日期、演出陣容及售票資訊。",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
