"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NextIntlClientProvider } from "next-intl";

import BlogDetailHero from "@/components/pages/blog/DetailHero";
import BlogDetailContent from "@/components/pages/blog/DetailContent";

import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

gsap.registerPlugin(ScrollTrigger);

const DESIGN_WIDTH = 1440;

interface FullPreviewProps {
  form: any;
  locale?: "en" | "ar";
}

export default function AdminBlogFullPreview({ form, locale = "ar" }: FullPreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState(480);
  const [innerHeight, setInnerHeight] = useState(2500);

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

  // Localize content blocks
  const resolvedContent = (form.contentSection?.content || []).map((block: any) => {
    const newBlock: any = { type: block.type };
    if (block.text) newBlock.text = resolveBilingual(block.text);
    if (block.title) newBlock.title = resolveBilingual(block.title);
    if (block.author) newBlock.author = resolveBilingual(block.author);
    if (block.items) {
      const itemsEn = block.items.en || [];
      const itemsAr = block.items.ar || [];
      newBlock.items = locale === "ar" ? itemsAr : itemsEn;
    }
    return newBlock;
  });

  // Localize CTA section
  const resolvedCtaSection = form.ctaSection ? {
    badge: resolveBilingual(form.ctaSection.badge),
    title: resolveBilingual(form.ctaSection.title),
    description: resolveBilingual(form.ctaSection.description),
    ctaText: resolveBilingual(form.ctaSection.ctaText),
    ctaLink: form.ctaSection.ctaLink || "",
    ctaText2: resolveBilingual(form.ctaSection.ctaText2),
    ctaLink2: form.ctaSection.ctaLink2 || "",
  } : undefined;

  const imageUrl = form.image?.url || (typeof form.image === 'string' ? form.image : "");

  // Build resolved single blog post object for preview
  const resolvedBlog = {
    ...form,
    image: imageUrl,
    title: resolveBilingual(form.title),
    category: resolveBilingual(form.category),
    excerpt: resolveBilingual(form.excerpt),
    readTime: resolveBilingual(form.readTime),
    author: resolveBilingual(form.author),
    content: resolvedContent,
    ctaSection: resolvedCtaSection,
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
            <BlogDetailHero post={resolvedBlog as any} locale={locale} />
            <BlogDetailContent post={resolvedBlog as any} locale={locale} relatedPosts={[]} />
          </div>
        </NextIntlClientProvider>
      </div>
    </div>
  );
}
