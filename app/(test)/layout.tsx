import "../globals.css";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";

const matterRegular = localFont({
  src: "../../public/fonts/Matter-Regular.woff2",
  variable: "--font-matter-regular",
  display: "swap",
  weight: "400",
  style: "normal",
  adjustFontFallback: false,
  fallback: ["sans-serif"],
});

const matterBold = localFont({
  src: "../../public/fonts/Matter-Bold.woff2",
  variable: "--font-matter-bold",
  display: "swap",
  weight: "700",
  style: "normal",
  adjustFontFallback: false,
  fallback: ["sans-serif"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "antialiased",
          matterRegular.variable,
          matterBold.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
