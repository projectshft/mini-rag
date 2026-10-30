import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Docs Q&A",
  description: "Ask questions about a few documents.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
