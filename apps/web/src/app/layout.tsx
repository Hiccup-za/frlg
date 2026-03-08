import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dex",
  description: "Track your Pokémon party, Pokédex progress, and gym badges across your games.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistMono.variable}>
      <body className={GeistMono.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
