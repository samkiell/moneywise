import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Money Wise | The Official Magazine of OAU Cowrywise Community",
    template: "%s | Money Wise",
  },
  description:
    "We write to inform. We create to inspire. We publish to empower. The official publication of the Writing Team of the OAU Cowrywise Community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body className="min-h-screen font-sans bg-page text-neutral-main flex flex-col">
        {children}
      </body>
    </html>
  );
}
