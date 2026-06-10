import BlogsHero from "@/components/pages/blog/Hero";
import BlogGrid from "@/components/pages/blog/Grid";
import CTASection from "@/components/sections/CTASection";
import { getBlogs, getBlogCMS } from "@/lib/cms";
import type { Metadata } from "next";
import { getSEOMetadata, getStructuredData } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return getSEOMetadata("blogs", locale, {
  title: "Blog & Insights | BZNX — Saudi Business Intelligence",
  description:
    "Expert insights on Saudi business setup, company formation, MISA regulations, Iqama renewal, foreign investment, and real estate opportunities in the Kingdom.",
  });
}

export default async function BlogsPage({ params }: Props) {
  const { locale } = await params;
  
  // Fetch from DB
  const [dbBlogs, cmsLayout, jsonLd] = await Promise.all([
    getBlogs(locale),
    getBlogCMS(),
    getStructuredData("blogs")
  ]);
  
  const displayBlogs = dbBlogs;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <BlogsHero locale={locale} cmsData={cmsLayout} blogs={displayBlogs} />
      <BlogGrid locale={locale} initialPosts={displayBlogs} cmsData={cmsLayout} />
      <CTASection data={cmsLayout.cta} />
    </>
  );
}
