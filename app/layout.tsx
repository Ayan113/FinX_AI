import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { AppShell } from "@/frontend/components/app-shell";
import { ThemeProvider } from "@/frontend/components/theme-provider";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope"
});

export const metadata: Metadata = {
  title: "FinInsight AI",
  description: "Financial Market Intelligence & Portfolio Advisor"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={`${manrope.variable} font-sans`}>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
