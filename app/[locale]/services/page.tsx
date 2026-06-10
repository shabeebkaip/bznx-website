import { getCMSData, getServices } from "@/lib/cms";
import ServiceCMS from "@/lib/models/ServiceCMS";
import ServicesHero from "@/components/pages/services/Hero";
import ServicesAll from "@/components/pages/services/All";
import ServicesMISA from "@/components/pages/services/MISA";
import CTASection from "@/components/sections/CTASection";
import type { Metadata } from "next";
import { getSEOMetadata, getStructuredData } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return getSEOMetadata("services", locale, {
    title: "Our Services | BZNX",
    description: "Explore our wide range of business services in Saudi Arabia, from MISA company licensing to PRO support and consulting services.",
  });
}

async function getServicesPageData() {
  const data = await getCMSData(ServiceCMS);
  const servicesList = await getServices();
  
  return {
    hero: data.hero || {},
    heading: data.servicesHeading || {},
    businessSetup: data.businessSetup || {},
    timelines: data.timelines || {},
    cta: data.cta || {},
    services: servicesList
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  const [data, jsonLd] = await Promise.all([
    getServicesPageData(),
    getStructuredData("services")
  ]);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ServicesHero locale={locale} data={data.hero} />
      <ServicesAll locale={locale} heading={data.heading} services={data.services} />
      <ServicesMISA locale={locale} data={data.businessSetup} timelines={data.timelines} />
      <CTASection data={data.cta} />
    </>
  );
}
