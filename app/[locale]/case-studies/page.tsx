import CaseStudiesHero from "@/components/pages/case-studies/Hero";
import CaseStudiesGrid from "@/components/pages/case-studies/Grid";
import CTASection from "@/components/sections/CTASection";
import { getCaseStudyCMS, getHomeCMS, getCaseStudies } from "@/lib/cms";
import type { Metadata } from "next";
import { getSEOMetadata, getStructuredData } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return getSEOMetadata("case-studies", locale, {
    title: "Case Studies & Success Stories | BZNX",
    description: "Discover how BZNX has helped leading global companies successfully set up, expand, and scale their businesses in Saudi Arabia.",
  });
}

export default async function CaseStudiesPage({ params }: Props) {
  const { locale } = await params;
  const [cmsData, homeCMS, studies, jsonLd] = await Promise.all([
    getCaseStudyCMS(),
    getHomeCMS(),
    getCaseStudies(locale),
    getStructuredData("case-studies")
  ]);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CaseStudiesHero 
        data={cmsData.hero} 
        locale={locale} 
      />
      <CaseStudiesGrid locale={locale} studies={studies} />
      <CTASection 
        data={cmsData.cta || homeCMS.ctaSection} 
      />
    </>
  );
}
