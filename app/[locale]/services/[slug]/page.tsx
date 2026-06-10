import { notFound } from "next/navigation";
import ServiceDetailPage from "@/components/pages/services/Detail";
import connectToDatabase from "@/lib/db";
import Service from "@/lib/models/Service";
import type { Metadata } from "next";
import { getSEODoc, getStructuredData } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  await connectToDatabase();
  const services = await Service.find({}, { slug: 1 });
  return services.map((s) => ({ slug: s.slug }));
}

import ServiceCMS from "@/lib/models/ServiceCMS";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = locale as "en" | "ar";
  
  const seo = await getSEODoc(slug);
  if (!seo) return {};

  const title       = (l === "ar" ? seo.metaTitle?.ar       : seo.metaTitle?.en)       || "";
  const description = (l === "ar" ? seo.metaDescription?.ar : seo.metaDescription?.en) || "";
  const keywords    = (l === "ar" ? seo.metaKeywords?.ar    : seo.metaKeywords?.en)    || undefined;
  const ogTitle     = (l === "ar" ? seo.ogTitle?.ar         : seo.ogTitle?.en)         || title;
  const ogDesc      = (l === "ar" ? seo.ogDescription?.ar   : seo.ogDescription?.en)   || description;
  const ogImage     = typeof seo.ogImage === "string" ? seo.ogImage : "";

  return {
    title,
    description,
    ...(keywords && { keywords }),
    ...(seo.robots && { robots: seo.robots }),
    ...(seo.canonicalUrl && { alternates: { canonical: seo.canonicalUrl } }),
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      ...(ogImage && { images: [{ url: ogImage }] }),
      locale: l === "ar" ? "ar_SA" : "en_US",
      type: "website",
      siteName: "BZNX",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDesc,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

async function getServiceData(slug: string) {
  await connectToDatabase();
  const service = await Service.findOne({ slug });
  if (!service) return null;
  
  const related = await Service.find({ slug: { $ne: slug } }).limit(3);
  const cmsData = await ServiceCMS.findOne({ section: 'cta' });
  
  return {
    service: JSON.parse(JSON.stringify(service)),
    related: JSON.parse(JSON.stringify(related)),
    cta: cmsData?.content || {}
  };
}

export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params;
  const data = await getServiceData(slug);

  if (!data) notFound();

  const jsonLd = await getStructuredData(slug);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ServiceDetailPage service={data.service} locale={locale} related={data.related} cta={data.cta} />
    </>
  );
}
