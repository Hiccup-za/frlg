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
      <head>
        <script
          src="https://cdn.databuddy.cc/databuddy.js"
          data-client-id="7dc83a82-ee26-483a-ab17-88e9da816371"
          crossOrigin="anonymous"
          async
        />
      </head>
      <body className={GeistMono.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
