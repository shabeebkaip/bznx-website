import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Contact from "@/lib/models/Contact";
import { getSession } from "@/lib/auth";
import { NextIntlClientProvider } from "next-intl";

import ContactHeroSection from "@/components/pages/contact/Hero";
import ContactMainSection from "@/components/pages/contact/Main";

import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

export default async function AdminContactPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { locale = "ar" } = await searchParams;
  const l = locale as "en" | "ar";

  await connectToDatabase();

  const allContactSections = await Contact.find().lean();

  const contactMap = allContactSections.reduce((acc: any, curr: any) => {
    acc[curr.section] = curr.content;
    return acc;
  }, {} as Record<string, any>);

  return (
    <NextIntlClientProvider locale={l} messages={l === "ar" ? arMessages : enMessages}>
      <div dir={l === "ar" ? "rtl" : "ltr"}>
        <main>
          <ContactHeroSection data={contactMap.heroSection} stats={contactMap.contactStats} />
          <ContactMainSection
            locale={l}
            header={contactMap.contactFormHeader}
            steps={contactMap.contactNextSteps}
            contactMethods={contactMap.contactMethods}
          />
        </main>
      </div>
    </NextIntlClientProvider>
  );
}
