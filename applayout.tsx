import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AASIP - Automotive Sales Intelligence",
  description: "Rescue lost car deals with AI-powered call analysis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
