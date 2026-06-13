import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talynk - Discover Amazing Talents",
  description: "AI-powered platform connecting creators with audiences and brands across Africa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-900">
        {children}
      </body>
    </html>
  );
}
