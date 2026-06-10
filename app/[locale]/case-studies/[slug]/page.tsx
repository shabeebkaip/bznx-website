import { notFound } from "next/navigation";
import { getCaseStudies, getCaseStudyBySlug } from "@/lib/cms";
import CaseStudyDetailPage from "@/components/pages/case-studies/Detail";

import type { Metadata } from "next";
import { getSEODoc, getStructuredData } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const locales = ["en", "ar"];
  const studies = await getCaseStudies();
  
  return locales.flatMap((locale) =>
    studies.map((study: any) => ({
      locale,
      slug: study.slug,
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = locale as "en" | "ar";
  
  const seo = await getSEODoc(slug);
  
  if (!seo) {
    const study = await getCaseStudyBySlug(slug, locale);
    if (!study) return {};
    return {
      title: `${study.title} | BZNX Case Study`,
      description: study.description?.en || study.description?.ar || "",
    };
  }

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
      type: "article",
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

export default async function CaseStudyPage({ params }: Props) {
  const { locale, slug } = await params;
  const [study, jsonLd] = await Promise.all([
    getCaseStudyBySlug(slug, locale),
    getStructuredData(slug)
  ]);

  if (!study) notFound();

  const allStudies = await getCaseStudies(locale);
  const related = allStudies.filter((s: any) => s.slug !== slug).slice(0, 2);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CaseStudyDetailPage study={study} related={related} locale={locale} />
    </>
  );
}
