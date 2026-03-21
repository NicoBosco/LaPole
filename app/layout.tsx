import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "LaPole — F1 Dashboard",
    template: "%s | LaPole",
  },
  description:
    "Seguimiento de la Fórmula 1 con clasificaciones, resultados, calendario y estadísticas actualizadas periódicamente.",
  keywords: [
    "Fórmula 1",
    "F1",
    "carreras",
    "pilotos",
    "standings",
    "dashboard",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className="h-full"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <Script id="lapole-theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('lapole-theme');if(t==='light')document.documentElement.dataset.theme='light';}catch(e){}})();`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
