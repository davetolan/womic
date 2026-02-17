import type { Metadata } from "next";
import { Geist_Mono, Patrick_Hand } from "next/font/google";
import "./globals.css";

const patrickHand = Patrick_Hand({
  weight: "400",
  variable: "--font-patrick-hand",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hell Versus You",
  description:
    "An accidental murder sends both victim and killer to a realm between life and death. Only one may return-they must compete against each other for a chance to win their life back.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${patrickHand.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
