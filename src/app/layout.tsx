import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thần số học Pytago - Cố Vấn Đặt Tên",
  description: "Hệ thống cố vấn đặt tên cân bằng theo Thần số học Pytago",
};

import SecurityProvider from "@/components/providers/SecurityProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="light">
      <body className="bg-surface font-body text-on-surface selection:bg-primary-fixed min-h-screen flex flex-col overflow-x-hidden">
        <SecurityProvider>{children}</SecurityProvider>
      </body>
    </html>
  );
}
