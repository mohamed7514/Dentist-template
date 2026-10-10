import type { Metadata, Viewport } from "next";
import { SiteProvider } from "@/components/site-provider";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import "./globals.css";
import "./site-pages.css";

export const metadata: Metadata = {
  title: { default: "Retrouvez le plaisir de sourire — Épure", template: "%s — Épure" },
  description: "Un parcours patient à votre rythme : implants, éclat et alignement du sourire.",
};
export const viewport: Viewport = { themeColor: "#282826" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SiteProvider>
          <a className="skip" href="#main">Aller au contenu</a>
          <SiteHeader />
          {children}
          <SiteFooter />
        </SiteProvider>
      </body>
    </html>
  );
}
