import connectToDatabase from "@/lib/db";
import SEO from "./models/SEO";
import type { Metadata } from "next";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SEODoc {
  page: string;
  metaTitle: { en: string; ar: string };
  metaDescription: { en: string; ar: string };
  metaKeywords?: { en: string; ar: string };
  canonicalUrl?: string;
  ogTitle?: { en: string; ar: string };
  ogDescription?: { en: string; ar: string };
  ogImage?: string;
  robots?: string;
  structuredData?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pick(field: { en: string; ar: string } | undefined, locale: string): string {
  if (!field) return "";
  return (locale === "ar" ? field.ar : field.en) || field.en || "";
}

// ─── Fetch raw SEO doc ────────────────────────────────────────────────────────

export async function getSEODoc(page: string): Promise<SEODoc | null> {
  try {
    await connectToDatabase();
    const doc = await SEO.findOne({ page: page.toLowerCase().trim() }).lean();
    return (doc as SEODoc) ?? null;
  } catch {
    return null;
  }
}

// ─── Build Next.js Metadata object ───────────────────────────────────────────

/**
 * Fetch SEO from the database and return a Next.js Metadata object.
 * Falls back gracefully to the provided defaults when no DB entry exists.
 *
 * @param page     The slug used in the admin panel (e.g. "home", "about")
 * @param locale   Current locale ("en" | "ar")
 * @param defaults Static fallback title & description
 */
export async function getSEOMetadata(
  page: string,
  locale: string,
  defaults: { title: string; description?: string } = { title: "BZNX – Business Gateway to Saudi Arabia" }
): Promise<Metadata> {
  const doc = await getSEODoc(page);

  if (!doc) return { title: defaults.title, description: defaults.description };

  const title = pick(doc.metaTitle, locale) || defaults.title;
  const description = pick(doc.metaDescription, locale) || defaults.description;
  const keywords = pick(doc.metaKeywords, locale) || undefined;
  const ogTitle = pick(doc.ogTitle, locale) || title;
  const ogDescription = pick(doc.ogDescription, locale) || description;
  const ogImage = typeof doc.ogImage === "string" ? doc.ogImage : "";

  const metadata: Metadata = {
    title,
    description,
    ...(keywords && { keywords }),
    ...(doc.robots && { robots: doc.robots }),
    ...(doc.canonicalUrl && { alternates: { canonical: doc.canonicalUrl } }),
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      ...(ogImage && { images: [{ url: ogImage }] }),
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
      siteName: "BZNX",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      ...(ogImage && { images: [ogImage] }),
    },
  };

  return metadata;
}

// ─── Build JSON-LD script tag props ──────────────────────────────────────────

/**
 * Returns the parsed JSON-LD object from the SEO doc, or null if not set / invalid.
 * Use inside a page as: <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
 */
export async function getStructuredData(page: string): Promise<Record<string, unknown> | null> {
  const doc = await getSEODoc(page);
  if (!doc?.structuredData) return null;
  try {
    return JSON.parse(doc.structuredData);
  } catch {
    console.warn(`[SEO] Invalid JSON-LD for page "${page}"`);
    return null;
  }
}
