import { notFound } from "next/navigation";
import { getBlogBySlug, getBlogs, getRelatedBlogs } from "@/lib/cms";
import BlogDetailHero from "@/components/pages/blog/DetailHero";
import BlogDetailContent from "@/components/pages/blog/DetailContent";
import CTASection from "@/components/sections/CTASection";
import type { Metadata } from "next";

import { getSEODoc, getStructuredData } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const locales = ["en", "ar"];
  const dbBlogs = await getBlogs();
  
  const dbParams = locales.flatMap((locale) =>
    dbBlogs.map((post: any) => ({ locale, slug: post.slug }))
  );

  return dbParams;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = locale as "en" | "ar";
  
  const seo = await getSEODoc(slug);
  
  if (!seo) {
    const post = await getBlogBySlug(slug, locale);
    if (!post) return {};
    return {
      title: `${post.title} | BZNX Blog`,
      description: post.excerpt,
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

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const [post, jsonLd] = await Promise.all([
    getBlogBySlug(slug, locale),
    getStructuredData(slug)
  ]);

  if (!post) notFound();
  const relatedBlogs = await getRelatedBlogs(post.slug, post.category, locale, 2);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <BlogDetailHero post={post} locale={locale} />
      <BlogDetailContent post={post} locale={locale} relatedPosts={relatedBlogs} />
      <CTASection />
    </>
  );
}
