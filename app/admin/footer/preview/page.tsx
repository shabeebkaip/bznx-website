import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Footer from "@/lib/models/Footer";
import { getSession } from "@/lib/auth";
import { NextIntlClientProvider } from "next-intl";
import { BznxFooter } from "@/components/ui/footer-section";

import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

export default async function AdminFooterPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { locale = "ar" } = await searchParams;
  const l = locale as "en" | "ar";

  await connectToDatabase();
  const allFooterSections = await Footer.find().lean();
  const footerMap = allFooterSections.reduce((acc: any, curr: any) => {
    acc[curr.section] = curr.content;
    return acc;
  }, {} as Record<string, any>);

  return (
    <NextIntlClientProvider locale={l} messages={l === "ar" ? arMessages : enMessages}>
      <div dir={l === "ar" ? "rtl" : "ltr"} className="bg-slate-50 min-h-screen flex flex-col justify-between">
        <div className="flex-1 flex flex-col items-center justify-center py-40 text-center bg-radial from-slate-100 to-slate-50">
          <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tight mb-4">
            {l === "ar" ? "معاينة التذييل الكاملة" : "Full Footer Preview"}
          </h2>
          <p className="text-slate-500 text-sm max-w-md">
            {l === "ar" 
              ? "معاينة كاملة لتخطيط الموقع مع التذييل الجديد في مكانه." 
              : "Full layout preview with the new footer positioned at the bottom of the page."}
          </p>
        </div>

        <BznxFooter locale={l} data={footerMap} />
      </div>
    </NextIntlClientProvider>
  );
}
