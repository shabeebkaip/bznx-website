"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NextIntlClientProvider } from "next-intl";

import BlogsHero from "@/components/pages/blog/Hero";
import BlogGrid from "@/components/pages/blog/Grid";
import CTASection from "@/components/sections/CTASection";

import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

gsap.registerPlugin(ScrollTrigger);

const DESIGN_WIDTH = 1440;

interface FullPreviewProps {
  form: any;
  locale?: "en" | "ar";
}

export default function AdminBlogsFullPreview({ form, locale = "ar" }: FullPreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState(480);
  const [innerHeight, setInnerHeight] = useState(2500);
  const [blogsList, setBlogsList] = useState<any[]>([]);

  // Measure wrapper width to scale
  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const obs = new ResizeObserver(([e]) => {
      setPanelWidth(e.contentRect.width || 480);
    });
    obs.observe(wrapperRef.current);
    return () => obs.disconnect();
  }, []);
  
  // Measure inner height after render
  useLayoutEffect(() => {
    if (!innerRef.current) return;
    const obs = new ResizeObserver(() => {
      if (innerRef.current) setInnerHeight(innerRef.current.scrollHeight);
    });
    obs.observe(innerRef.current);
    return () => obs.disconnect();
  }, []);

  // Fetch blogs list for preview
  useEffect(() => {
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((res) => {
        setBlogsList(res.data || []);
      })
      .catch(() => {});
  }, []);
  
  // Reveal GSAP elements in preview
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!innerRef.current) return;
      innerRef.current.querySelectorAll<HTMLElement>("*").forEach((el) => {
        if (el.style.opacity === "0" || el.classList.contains("opacity-0")) {
          gsap.set(el, { opacity: 1, y: 0, x: 0, clearProps: "transform" });
          el.classList.remove("opacity-0");
        }
      });
      ScrollTrigger.refresh();
    }, 800);
    return () => clearTimeout(timer);
  }, [form, locale]);
  
  const scale = panelWidth > 0 ? panelWidth / DESIGN_WIDTH : 1;
  const outerHeight = innerHeight * scale;

  // Helper to resolve bilingual fields safely
  const resolveBilingual = (val: any) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object") {
      return val[locale] || val.en || val.ar || "";
    }
    return String(val);
  };

  // Localize raw blogs fetched from API for rendering in preview
  const localizeBlog = (blog: any) => {
    const l = locale;
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
  };

  const localizedBlogs = blogsList.map(localizeBlog);
  
  // Build resolved CMS layout data for preview
  const resolvedHero = {
    ...form.hero,
    badge: { [locale]: resolveBilingual(form.hero?.badge) },
    title: { [locale]: resolveBilingual(form.hero?.title) },
    description: { [locale]: resolveBilingual(form.hero?.description) },
    backgroundImage: form.hero?.image,
  };

  const resolvedListHeader = {
    ...form.listHeader,
    badge: { [locale]: resolveBilingual(form.listHeader?.badge) },
    title: { [locale]: resolveBilingual(form.listHeader?.title) },
    description: { [locale]: resolveBilingual(form.listHeader?.description) },
  };

  const resolvedCta = {
    ...form.cta,
    title: { [locale]: resolveBilingual(form.cta?.title) },
    description: { [locale]: resolveBilingual(form.cta?.description) },
    ctaText: { [locale]: resolveBilingual(form.cta?.ctaText) },
    ctaText2: { [locale]: resolveBilingual(form.cta?.ctaText2) },
  };

  const cmsLayout = {
    hero: resolvedHero,
    listHeader: resolvedListHeader,
    cta: resolvedCta,
  };
  return (
    <div
      ref={wrapperRef}
      style={{
        width: "100%",
        overflow: "hidden",
        position: "relative",
        height: outerHeight,
      }}
    >
      <div
        ref={innerRef}
        style={{
          width: DESIGN_WIDTH,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <NextIntlClientProvider locale={locale} messages={locale === "ar" ? arMessages : enMessages}>
          <div dir={locale === "ar" ? "rtl" : "ltr"}>
            <BlogsHero locale={locale} cmsData={cmsLayout} blogs={localizedBlogs} />
            <BlogGrid locale={locale} initialPosts={localizedBlogs} cmsData={cmsLayout} />
            <CTASection data={resolvedCta} />
          </div>
        </NextIntlClientProvider>
      </div>
    </div>
  );
}