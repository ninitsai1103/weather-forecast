import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/authContext";

export const metadata: Metadata = {
  title: "Weather 不淋雨",
  description: "天氣預報查詢",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="zh-TW" suppressHydrationWarning={true}>
        <body>{children}</body>
      </html>
    </AuthProvider>
  );
}
