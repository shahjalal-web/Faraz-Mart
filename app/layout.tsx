import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import Script from "next/script";
import { Providers } from "@/context/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollToTopButton } from "@/components/layout/scroll-to-top-button";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Fajar Mart — Shop Everything You Love",
    template: "%s | Fajar Mart",
  },
  description:
    "Fajar Mart is a modern multi-category marketplace — electronics, fashion, home, beauty and more, all in one trusted place.",
};

// Runs before hydration to apply the saved theme and avoid a light/dark flash.
const themeInitScript = `(function(){try{var k="${"fajarmart-theme"}";var t=localStorage.getItem(k);if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ScrollToTopButton />
        </Providers>
      </body>
    </html>
  );
}
