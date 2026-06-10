import type { Metadata } from "next";
import { Sofia_Sans, Noto_Sans_Arabic } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

const sofiaSans = Sofia_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sofia-pro",
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BZNX – Business Gateway to Saudi Arabia",
  description:
    "BZNX helps global businesses establish, grow, and thrive in the Kingdom of Saudi Arabia through expert consulting, legal setup, and strategic investment guidance.",
  keywords: ["Saudi Arabia business setup", "MISA license", "company formation KSA", "Vision 2030 investment"],
  icons: {
    apple: "/bznxlogo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const isArabic = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isArabic ? "rtl" : "ltr"}
      className={`${sofiaSans.variable} ${notoSansArabic.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,300,400&display=swap"
          rel="stylesheet"
        />
        {/* Adaptive favicon: white logo for dark mode, colored logo for light mode */}
        <link rel="icon" type="image/png" href="/bznxlogo.png" media="(prefers-color-scheme: light)" />
        <link rel="icon" type="image/png" href="/bznx.png" media="(prefers-color-scheme: dark)" />
      </head>
      <body
        className={`min-h-screen flex flex-col antialiased ${
          isArabic ? "font-[var(--font-noto-arabic),sans-serif]" : "font-['Satoshi',sans-serif]"
        }`}
      >
        <div className={isArabic ? "" : "font-['Satoshi']"}>
          {children}
        </div>
      </body>
    </html>
  );
}
