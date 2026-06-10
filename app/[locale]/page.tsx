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
import { getCMSData, getServices, getCaseStudies } from "@/lib/cms";
import Home from "@/lib/models/Home";
import { getSEOMetadata, getStructuredData } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return getSEOMetadata("home", locale, {
    title: "BZNX – Business Gateway to Saudi Arabia",
    description: "BZNX helps global businesses establish, grow, and thrive in the Kingdom of Saudi Arabia through expert consulting, legal setup, and strategic investment guidance.",
  });
}

async function getHomeData(locale: string) {
  const data = await getCMSData(Home);
  const servicesList = await getServices();
  const caseStudiesList = await getCaseStudies(locale);
  return { ...data, servicesList, caseStudiesList };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const data = await getHomeData(locale);
  const jsonLd = await getStructuredData("home");

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {/* 1. Hook — value proposition + hero visual */}
      <Hero locale={locale} 
        data={data.hero} 
        stats={data.heroStats}
        badges={data.heroBadges}
      />

      {/* 2. Who we are + key stats */}
      <AboutWithStats 
        locale={locale} 
        data={data.aboutMain}
        features={data.aboutMain?.features}
        stats={data.aboutStats}
      />

      {/* 3. Social proof — client logos marquee */}
      <TrustedBy data={data.trustedBy} />

      {/* 4. What we offer */}
      <ServicesGrid data={data.services} services={data.servicesList} />

      {/* 5. Why Saudi Arabia — opportunity */}
      <WhySaudiGrid data={data.whySaudi} />

      {/* 6. Market data & Vision 2030 */}
      <SaudiOpportunity data={data.opportunity} />

      {/* 7. Our process */}
      <HowWeWork data={data.howWeWork} />

      {/* 8. Why choose BZNX */}
      <BenefitsSection data={data.benefits} />

      {/* 9. Proof of results */}
      <CaseStudies data={data.caseStudies} studies={data.caseStudiesList} />

      {/* 10. Client testimonials */}
      <TestimonialsSection data={data.testimonials} />

      {/* 11. Convert */}
      <CTASection data={data.cta} />
    </>
  );
}
