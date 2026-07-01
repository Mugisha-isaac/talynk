import type { Metadata } from "next";
import "./globals.css";
import { MlServiceBootstrapper } from '@/components/MlServiceBootstrapper';

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
        <MlServiceBootstrapper />
        {children}
      </body>
    </html>
  );
}
