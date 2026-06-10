import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/ui/SmoothScroll";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "ar")) {
    notFound();
  }

  // Makes getLocale() work in the root layout (and all server components)
  setRequestLocale(locale);

  const messages = await getMessages();

  const isRTL = locale === "ar";

  return (
    <NextIntlClientProvider messages={messages}>
      {/* Explicit dir wrapper — ensures RTL layout even if <html dir> is stale */}
      <div dir={isRTL ? "rtl" : "ltr"}>
        <SmoothScroll>
          <Navbar locale={locale} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} />
        </SmoothScroll>
      </div>
    </NextIntlClientProvider>
  );
}
