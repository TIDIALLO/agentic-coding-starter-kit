import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { I18nProvider } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ImmoBoost - Real Estate Management Platform",
  description:
    "Modern SaaS application for real estate agencies and agents. Manage properties, schedule visits, track prospects, and enhance images with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)
{
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
