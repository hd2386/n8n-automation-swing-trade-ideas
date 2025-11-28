import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://n8n-swing-trade.netlify.app"
  ),
  title: {
    default: "HD Signals - Daily AI Swing Trade Signals",
    template: "%s | HD Signals",
  },
  description:
    "Get daily technical analysis reports for US stocks. AI-powered swing trading signals delivered to your inbox.",
  keywords: [
    "swing trading",
    "stock signals",
    "AI trading",
    "technical analysis",
    "US stocks",
    "trading signals",
    "daily trading",
    "stock analysis",
    "trading automation",
    "swing trade signals",
  ],
  authors: [{ name: "HD Signals" }],
  creator: "HD Signals",
  publisher: "HD Signals",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "HD Signals",
    title: "HD Signals - Daily AI Swing Trade Signals",
    description:
      "Get daily technical analysis reports for US stocks. AI-powered swing trading signals delivered to your inbox.",
    images: [
      {
        url: "/trade-bild.jpeg",
        width: 1200,
        height: 630,
        alt: "HD Signals - Professional Trading Desk",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HD Signals - Daily AI Swing Trade Signals",
    description:
      "Get daily technical analysis reports for US stocks. AI-powered swing trading signals delivered to your inbox.",
    images: ["/trade-bild.jpeg"],
    creator: "@hdsignals",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "rgb(31, 63, 119)" },
    { media: "(prefers-color-scheme: dark)", color: "rgb(31, 63, 119)" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
