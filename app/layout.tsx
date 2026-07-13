import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Festyle | 日本音樂祭探索工具",
  description:
    "以音樂祭為入口，串起月份、城市、地區與食衣住行樂的日本音樂祭探索工具。",
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
