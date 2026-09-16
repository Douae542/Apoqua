import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Capgemini Engineering - Plateforme APOQUA",
  description: "Plateforme de gestion des fiches APOQUA — Capgemini Engineering",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}