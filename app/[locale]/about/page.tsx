import AboutHero from "@/components/pages/about/Hero";
import AboutWhoWeAre from "@/components/pages/about/WhoWeAre";
import AboutMissionValues from "@/components/pages/about/MissionValues";
import AboutTeam from "@/components/pages/about/Team";
import AboutClients from "@/components/pages/about/Clients";
import CTASection from "@/components/sections/CTASection";
import { getAboutCMS, getHomeCMS } from "@/lib/cms";
import type { Metadata } from "next";
import { getSEOMetadata, getStructuredData } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return getSEOMetadata("about", locale, {
    title: "About Us | BZNX",
    description: "Learn more about BZNX, our mission, vision, and team of experts helping global companies establish their presence in Saudi Arabia.",
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;

  // Fetch CMS data
  const [aboutData, homeData, jsonLd] = await Promise.all([
    getAboutCMS(),
    getHomeCMS(),
    getStructuredData("about")
  ]);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <AboutHero 
        locale={locale} 
        data={aboutData.heroSection} 
      />
      <AboutWhoWeAre 
        locale={locale}
        data={aboutData.aboutSection}
        stats={aboutData.aboutStats}
      />
      <AboutMissionValues 
        locale={locale}
        mission={aboutData.aboutMission}
        vision={aboutData.aboutVision}
        valuesHeader={aboutData.aboutValuesHeader}
        values={aboutData.aboutValues}
      />
      <AboutTeam 
        locale={locale}
        header={aboutData.aboutTeamHeader}
        team={aboutData.aboutTeam}
      />
      <AboutClients 
        locale={locale}
        header={aboutData.aboutClientsHeader}
        logos={homeData.trustedBy?.logos}
        testimonial={homeData.testimonials?.items?.[0]}
      />
      <CTASection 
        data={aboutData.aboutCta}
      />
    </>
  );
}
