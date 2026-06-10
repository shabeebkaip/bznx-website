import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Blog from "@/lib/models/Blog";
import { getSession } from "@/lib/auth";
import { NextIntlClientProvider } from "next-intl";

import BlogDetailHero from "@/components/pages/blog/DetailHero";
import BlogDetailContent from "@/components/pages/blog/DetailContent";

import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

export default async function AdminBlogPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; locale?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id, locale = "ar" } = await searchParams;
  const l = locale as "en" | "ar";

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500 font-bold">No blog post ID specified for preview.</p>
      </div>
    );
  }

  await connectToDatabase();
  const blog = await Blog.findById(id).lean();

  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500 font-bold">Blog post not found.</p>
      </div>
    );
  }

  const serializedBlog = JSON.parse(JSON.stringify(blog));

  // Helper to resolve bilingual fields safely
  const resolveBilingual = (val: any) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object") {
      return val[l] || val.en || val.ar || "";
    }
    return String(val);
  };

  // Localize content blocks
  const resolvedContent = (serializedBlog.contentSection?.content || []).map((block: any) => {
    const newBlock: any = { type: block.type };
    if (block.text) newBlock.text = resolveBilingual(block.text);
    if (block.title) newBlock.title = resolveBilingual(block.title);
    if (block.author) newBlock.author = resolveBilingual(block.author);
    if (block.items) {
      const itemsEn = block.items.en || [];
      const itemsAr = block.items.ar || [];
      newBlock.items = l === "ar" ? itemsAr : itemsEn;
    }
    return newBlock;
  });

  // Localize CTA section
  const resolvedCtaSection = serializedBlog.ctaSection ? {
    badge: resolveBilingual(serializedBlog.ctaSection.badge),
    title: resolveBilingual(serializedBlog.ctaSection.title),
    description: resolveBilingual(serializedBlog.ctaSection.description),
    ctaText: resolveBilingual(serializedBlog.ctaSection.ctaText),
    ctaLink: serializedBlog.ctaSection.ctaLink || "",
    ctaText2: resolveBilingual(serializedBlog.ctaSection.ctaText2),
    ctaLink2: serializedBlog.ctaSection.ctaLink2 || "",
  } : undefined;

  const imageUrl = serializedBlog.image?.url || (typeof serializedBlog.image === 'string' ? serializedBlog.image : "");

  // Build resolved blog post object for preview
  const resolvedBlog = {
    ...serializedBlog,
    image: imageUrl,
    title: resolveBilingual(serializedBlog.title),
    category: resolveBilingual(serializedBlog.category),
    excerpt: resolveBilingual(serializedBlog.excerpt),
    readTime: resolveBilingual(serializedBlog.readTime),
    author: resolveBilingual(serializedBlog.author),
    content: resolvedContent,
    ctaSection: resolvedCtaSection,
  };

  return (
    <NextIntlClientProvider locale={l} messages={l === "ar" ? arMessages : enMessages}>
      <div dir={l === "ar" ? "rtl" : "ltr"}>
        <main>
          <BlogDetailHero post={resolvedBlog as any} locale={l} />
          <BlogDetailContent post={resolvedBlog as any} locale={l} relatedPosts={[]} />
        </main>
      </div>
    </NextIntlClientProvider>
  );
}
