import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import ServiceCMS from "@/lib/models/ServiceCMS";
import Service from "@/lib/models/Service";
import { getSession } from "@/lib/auth";
import { NextIntlClientProvider } from "next-intl";

import ServicesHero from "@/components/pages/services/Hero";
import ServicesAll from "@/components/pages/services/All";
import ServicesMISA from "@/components/pages/services/MISA";
import CTASection from "@/components/sections/CTASection";

import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

export default async function AdminServicesPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { locale = "ar" } = await searchParams;
  const l = locale as "en" | "ar";

  await connectToDatabase();

  const [allCmsSections, allServices] = await Promise.all([
    ServiceCMS.find().lean(),
    Service.find().sort({ createdAt: 1 }).lean(),
  ]);

  const cmsMap = allCmsSections.reduce((acc: any, curr: any) => {
    acc[curr.section] = curr.content;
    return acc;
  }, {} as Record<string, any>);

  const serializedServices = JSON.parse(JSON.stringify(allServices));

  return (
    <NextIntlClientProvider locale={l} messages={l === "ar" ? arMessages : enMessages}>
      <div dir={l === "ar" ? "rtl" : "ltr"}>
        <main>
          <ServicesHero locale={l} data={cmsMap.hero || {}} />
          <ServicesAll locale={l} heading={cmsMap.servicesHeading || {}} services={serializedServices} />
          <ServicesMISA locale={l} data={cmsMap.businessSetup || {}} timelines={cmsMap.timelines || {}} />
          <CTASection data={cmsMap.cta || {}} />
        </main>
      </div>
    </NextIntlClientProvider>
  );
}
