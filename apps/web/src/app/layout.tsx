import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
