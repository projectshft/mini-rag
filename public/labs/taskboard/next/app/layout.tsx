import type { ReactNode } from "react";
import "./globals.css";

export const metadata = { title: "Task board" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <h1>Task board</h1>
        {children}
      </body>
    </html>
  );
}
