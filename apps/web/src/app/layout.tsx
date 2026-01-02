import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "VITA Protocol | Human Capital Stock Exchange",
  description:
    "Valorized Intangible Token Assets - Tokenize your future productivity as compliant, yield-bearing RWAs on Mantle Network.",
  keywords: [
    "VITA",
    "RWA",
    "Mantle",
    "ERC-3643",
    "Human Capital",
    "Tokenization",
    "DeFi",
  ],
  openGraph: {
    title: "VITA Protocol",
    description: "The Human Capital Stock Exchange on Mantle",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans bg-background text-foreground antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
