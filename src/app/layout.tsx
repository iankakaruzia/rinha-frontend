import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  preload: true,
});

export const metadata: Metadata = {
  title: "JSON Tree Viewer",
  description: "Simple JSON Tree Viewer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} min-h-screen bg-white font-sans text-base font-normal text-black antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
