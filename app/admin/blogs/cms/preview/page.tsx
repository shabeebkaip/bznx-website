import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Blog from "@/lib/models/Blog";
import BlogCMS from "@/lib/models/BlogCMS";
import { getSession } from "@/lib/auth";
import { NextIntlClientProvider } from "next-intl";

import DetailContent from "@/components/pages/blog/DetailContent";
import BlogDetailHero from "@/components/pages/blog/DetailHero";
import BlogGrid from "@/components/pages/blog/Grid";
import BlogsHero from "@/components/pages/blog/Hero"
import CTASection from "@/components/sections/CTASection";

import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

export default async function AdminBlogsPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { locale = "ar" } = await searchParams;
  const l = locale as "en" | "ar";

  await connectToDatabase();

  const [allCmsSections, allBlogs] = await Promise.all([
    BlogCMS.find().lean(),
    Blog.find().sort({ createdAt: 1 }).lean(),
  ]);

  const cmsMap = allCmsSections.reduce((acc: any, curr: any) => {
    acc[curr.section] = curr.content;
    return acc;
  }, {} as Record<string, any>);

  const serializedBlogs = JSON.parse(JSON.stringify(allBlogs));

  const localizedBlogs = serializedBlogs.map((blog: any) => {
    const imageUrl = blog.image?.url || (typeof blog.image === 'string' ? blog.image : "");
    return {
      ...blog,
      image: imageUrl,
      title: blog.title?.[l] || blog.title?.en || blog.title || "",
      excerpt: blog.excerpt?.[l] || blog.excerpt?.en || blog.excerpt || "",
      category: blog.category?.[l] || blog.category?.en || blog.category || "",
      categoryId: blog.category?.en || blog.category || "",
      readTime: blog.readTime?.[l] || blog.readTime?.en || blog.readTime || "",
      author: blog.author?.[l] || blog.author?.en || blog.author || "BZNX Editorial",
    };
  });

  const cmsLayout = {
    ...cmsMap,
    hero: cmsMap.hero ? {
      ...cmsMap.hero,
      backgroundImage: cmsMap.hero.image
    } : {}
  };

  return (
    <NextIntlClientProvider locale={l} messages={l === "ar" ? arMessages : enMessages}>
      <div dir={l === "ar" ? "rtl" : "ltr"}>
        <main>
          <BlogsHero locale={l} cmsData={cmsLayout} blogs={localizedBlogs} />
          <BlogGrid locale={l} initialPosts={localizedBlogs} cmsData={cmsLayout} />
          <CTASection data={cmsLayout.cta || {}} />
        </main>
      </div>
    </NextIntlClientProvider>
  );
}
