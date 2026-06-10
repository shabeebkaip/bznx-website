import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import About from "@/lib/models/aboutus";
import Home from "@/lib/models/Home";
import Footer from "@/lib/models/Footer";
import { getSession } from "@/lib/auth";
import { NextIntlClientProvider } from "next-intl";

import Navbar from "@/components/layout/Navbar";
import { BznxFooter } from "@/components/ui/footer-section";

import AboutHero from "@/components/pages/about/Hero";
import AboutWhoWeAre from "@/components/pages/about/WhoWeAre";
import AboutMissionValues from "@/components/pages/about/MissionValues";
import AboutTeam from "@/components/pages/about/Team";
import AboutClients from "@/components/pages/about/Clients";
import CTASection from "@/components/sections/CTASection";

import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

export default async function AdminAboutPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { locale = "ar" } = await searchParams;
  const l = locale as "en" | "ar";

  await connectToDatabase();
  
  const [allAboutSections, allHomeSections, allFooterSections] = await Promise.all([
    About.find().lean(),
    Home.find().lean(),
    Footer.find().lean(),
  ]);

  const aboutMap = allAboutSections.reduce((acc: any, curr: any) => {
    acc[curr.section] = curr.content;
    return acc;
  }, {} as Record<string, any>);

  const homeMap = allHomeSections.reduce((acc: any, curr: any) => {
    acc[curr.section] = curr.content;
    return acc;
  }, {} as Record<string, any>);

  const footerMap = allFooterSections.reduce((acc: any, curr: any) => {
    acc[curr.section] = curr.content;
    return acc;
  }, {} as Record<string, any>);

  return (
    <NextIntlClientProvider locale={l} messages={l === "ar" ? arMessages : enMessages}>
      <div dir={l === "ar" ? "rtl" : "ltr"}>
        <main>
          <AboutHero 
            locale={l} 
            data={aboutMap.heroSection} 
          />
          <AboutWhoWeAre 
            locale={l}
            data={aboutMap.aboutSection}
            stats={aboutMap.aboutStats}
          />
          <AboutMissionValues 
            locale={l}
            mission={aboutMap.aboutMission}
            vision={aboutMap.aboutVision}
            valuesHeader={aboutMap.aboutValuesHeader}
            values={aboutMap.aboutValues}
          />
          <AboutTeam 
            locale={l}
            header={aboutMap.aboutTeamHeader}
            team={aboutMap.aboutTeam}
          />
          <AboutClients 
            locale={l}
            header={aboutMap.aboutClientsHeader}
            logos={homeMap.trustedBy?.logos}
            testimonial={homeMap.testimonials?.items?.[0]}
          />
          <CTASection 
            data={aboutMap.aboutCta}
          />
        </main>
      </div>
    </NextIntlClientProvider>
  );
}
