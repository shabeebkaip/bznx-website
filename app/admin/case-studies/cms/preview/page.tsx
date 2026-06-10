import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import CaseStudy from "@/lib/models/CaseStudy";
import CaseStudyCMS from "@/lib/models/CaseStudyCMS";
import { getSession } from "@/lib/auth";
import { NextIntlClientProvider } from "next-intl";

import CaseStudiesHero from "@/components/pages/case-studies/Hero";
import CaseStudiesGrid from "@/components/pages/case-studies/Grid";
import CTASection from "@/components/sections/CTASection";

import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

export default async function AdminCaseStudiesPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { locale = "ar" } = await searchParams;
  const l = locale as "en" | "ar";

  await connectToDatabase();

  const [allCmsSections, allStudies] = await Promise.all([
    CaseStudyCMS.find().lean(),
    CaseStudy.find().sort({ createdAt: 1 }).lean(),
  ]);

  const cmsMap = allCmsSections.reduce((acc: any, curr: any) => {
    acc[curr.section] = curr.content;
    return acc;
  }, {} as Record<string, any>);

  const serializedStudies = JSON.parse(JSON.stringify(allStudies));

  const localizedStudies = serializedStudies.map((study: any) => {
    const imageUrl = study.image?.url || (typeof study.image === 'string' ? study.image : "");
    return {
      ...study,
      image: imageUrl,
      title: study.title?.[l] || study.title?.en || study.title || "",
      description: study.description?.[l] || study.description?.en || study.description || "",
      tag: study.tag?.[l] || study.tag?.en || study.tag || "",
      industry: study.industry?.[l] || study.industry?.en || study.industry || "",
      location: study.location?.[l] || study.location?.en || study.location || "",
      duration: study.duration?.[l] || study.duration?.en || study.duration || "",
      outcome: study.outcome?.[l] || study.outcome?.en || study.outcome || "",
      services: (study.services || []).map((s: any) => s?.[l] || s?.en || s || ""),
      resultsSection: study.resultsSection ? {
        ...study.resultsSection,
        badge: study.resultsSection.badge?.[l] || study.resultsSection.badge?.en || study.resultsSection.badge || "",
        title: study.resultsSection.title?.[l] || study.resultsSection.title?.en || study.resultsSection.title || "",
        items: (study.resultsSection.items || []).map((item: any) => ({
          value: item.value?.[l] || item.value?.en || item.value || "",
          label: item.label?.[l] || item.label?.en || item.label || ""
        }))
      } : undefined
    };
  });

  return (
    <NextIntlClientProvider locale={l} messages={l === "ar" ? arMessages : enMessages}>
      <div dir={l === "ar" ? "rtl" : "ltr"}>
        <main>
          <CaseStudiesHero locale={l} data={cmsMap.hero || {}} />
          <CaseStudiesGrid locale={l} studies={localizedStudies} />
          <CTASection data={cmsMap.cta || {}} />
        </main>
      </div>
    </NextIntlClientProvider>
  );
}
