import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

//Import Sonner's Toaster
import { Toaster } from "sonner";

// Load Inter font with Latin subset for optimal performance
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "G-Client",
  description: "Learning Management System",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="white">
      <body className={inter.className}>
        {/* Main content area */}
        {children}

        {/* Sonner's Toaster: will render toast notifications */}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
