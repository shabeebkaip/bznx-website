import ContactHeroSection from "@/components/pages/contact/Hero";
import ContactMainSection from "@/components/pages/contact/Main";
import { getContactCMS } from "@/lib/cms";
import type { Metadata } from "next";
import { getSEOMetadata, getStructuredData } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return getSEOMetadata("contact", locale, {
    title: "Contact Us | BZNX",
    description: "Get in touch with BZNX for a free consultation on company formation, PRO services, investment, and legal support in Saudi Arabia.",
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const [cmsData, jsonLd] = await Promise.all([
    getContactCMS(),
    getStructuredData("contact")
  ]);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ContactHeroSection data={cmsData.heroSection} stats={cmsData.contactStats} />
      <ContactMainSection
        locale={locale}
        header={cmsData.contactFormHeader}
        steps={cmsData.contactNextSteps}
        contactMethods={cmsData.contactMethods}
      />
    </>
  );
}
