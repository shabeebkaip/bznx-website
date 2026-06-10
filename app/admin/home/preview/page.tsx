import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import { getServices, getCaseStudies, getHomeCMS } from "@/lib/cms";
import { getSession } from "@/lib/auth";
import { NextIntlClientProvider } from "next-intl";

import Hero from "@/components/sections/Hero";
import AboutWithStats from "@/components/sections/AboutWithStats";
import TrustedBy from "@/components/sections/TrustedBy";
import ServicesGrid from "@/components/sections/ServicesGrid";
import WhySaudiGrid from "@/components/sections/WhySaudiGrid";
import SaudiOpportunity from "@/components/sections/SaudiOpportunity";
import HowWeWork from "@/components/sections/HowWeWork";
import BenefitsSection from "@/components/sections/BenefitsSection";
import CaseStudies from "@/components/sections/CaseStudies";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";

import SmoothScroll from "@/components/ui/SmoothScroll";

import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

export default async function AdminHomePreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { locale = "ar" } = await searchParams;
  const l = locale as "en" | "ar";

  await connectToDatabase();
  const sectionsMap = await getHomeCMS();
  const services = await getServices();
  const caseStudiesList = await getCaseStudies(l);

  return (
    <NextIntlClientProvider locale={l} messages={l === "ar" ? arMessages : enMessages}>
      <div dir={l === "ar" ? "rtl" : "ltr"}>
      <SmoothScroll>
        <main>
          <Hero
            locale={l}
            data={sectionsMap.hero}
            stats={sectionsMap.heroStats}
            badges={sectionsMap.heroBadges}
          />
          <AboutWithStats
            locale={l}
            data={sectionsMap.aboutMain}
            features={sectionsMap.aboutMain?.features || sectionsMap.aboutFeatures}
            stats={sectionsMap.aboutStats}
          />
          <TrustedBy data={sectionsMap.trustedBy} />
          <ServicesGrid data={sectionsMap.services} services={services} />
          <WhySaudiGrid data={sectionsMap.whySaudi} />
          <SaudiOpportunity data={sectionsMap.opportunity} />
          <HowWeWork data={sectionsMap.howWeWork} />
          <BenefitsSection data={sectionsMap.benefits} />
          <CaseStudies data={sectionsMap.caseStudies} studies={caseStudiesList} />
          <TestimonialsSection data={sectionsMap.testimonials} />
          <CTASection data={sectionsMap.cta} />
        </main>
      </SmoothScroll>
      </div>
    </NextIntlClientProvider>
  );
}
