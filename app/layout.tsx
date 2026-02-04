import type { Metadata } from "next";
import { Prompt, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
  subsets: ["latin", "thai"],
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reconnect",
  description: "A digital gallery of games and ideas designed to bring people closer together.",
};

import { NavigationFooter } from "@/components/NavigationFooter";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${prompt.variable} ${mono.variable}`}>
      <body
        className="antialiased"
      >
        {children}
        <NavigationFooter />
      </body>
    </html>
  );
}
