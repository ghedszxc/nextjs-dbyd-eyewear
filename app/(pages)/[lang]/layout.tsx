import "../../globals.css";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { SearchProvider } from "@/context/SearchContext";
import { FooterProvider } from "@/lib/FooterContext";

const matterLight = localFont({
  src: "../../../public/fonts/Matter-Light.woff2",
  variable: "--font-matter-light",
  display: "swap",
  weight: "100",
  style: "normal",
  preload: false,
  adjustFontFallback: false,
  fallback: ["sans-serif"],
});

const matterRegular = localFont({
  src: "../../../public/fonts/Matter-Regular.woff2",
  variable: "--font-matter-regular",
  display: "swap",
  weight: "400",
  style: "normal",
  preload: true,
  adjustFontFallback: false,
  fallback: ["sans-serif"],
});

const matterBold = localFont({
  src: "../../../public/fonts/Matter-Bold.woff2",
  variable: "--font-matter-bold",
  display: "swap",
  weight: "700",
  style: "normal",
  preload: false,
  adjustFontFallback: false,
  fallback: ["sans-serif"],
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  return (
    <html lang={lang} className="scroll-smooth">
      <body className={cn("antialiased", matterLight.variable, matterRegular.variable, matterBold.variable)}>
        
          <FooterProvider>
            <SearchProvider lang={lang}>{children}</SearchProvider>
          </FooterProvider>
      </body>
    </html>
  );
}
