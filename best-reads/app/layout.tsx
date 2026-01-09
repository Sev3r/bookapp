import { Poppins } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navigation from "./components/NavigationBottom";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Best Reads",
  description: "Find your next best read",
  keywords: [
    "books",
    "reading",
    "recommendations",
  ],
  authors: [{ name: "Sjoerd Evers" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Best Reads",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Best Reads",
    title: "Best Reads",
    description: "Find your next best read",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Reads",
    description: "Find your next best read",
  },
};

export const viewport: Viewport = {
  themeColor: "#5da453ff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 3,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`antialiased ${poppins.className}`}>
        {children}
        <Navigation />
      </body>
    </html>
  );
}
