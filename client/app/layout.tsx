import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DEVLOG | Log your coding journey",
  description: "Milin Sharma",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
