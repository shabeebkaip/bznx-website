"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NextIntlClientProvider } from "next-intl";

import CaseStudiesHero from "@/components/pages/case-studies/Hero";
import CaseStudiesGrid from "@/components/pages/case-studies/Grid";
import CTASection from "@/components/sections/CTASection";

import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";
// Removed erroneous import of Stats from fs; stats are derived from form data

gsap.registerPlugin(ScrollTrigger);

const DESIGN_WIDTH = 1440;

interface FullPreviewProps {
  form: any;
  locale?: "en" | "ar";
}

export default function AdminCaseStudiesFullPreview({ form, locale = "ar" }: FullPreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState(480);
  const [innerHeight, setInnerHeight] = useState(2500);
  const [caseStudiesList, setCaseStudiesList] = useState<any[]>([]);

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
  
  // Fetch case studies list for preview
  useEffect(() => {
    fetch("/api/case-studies")
      .then((r) => r.json())
      .then((res) => {
        setCaseStudiesList(res.data || []);
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
  
  // Localize raw case studies fetched from API for rendering in preview
  const localizeCaseStudy = (caseStudy: any) => {
    const l = locale;
    const imageUrl = caseStudy.image?.url || (typeof caseStudy.image === 'string' ? caseStudy.image : "");
    return {
      ...caseStudy,
      image: imageUrl,
      title: caseStudy.title?.[l] || caseStudy.title?.en || caseStudy.title || "",
      description: caseStudy.description?.[l] || caseStudy.description?.en || caseStudy.description || "",
      tag: caseStudy.tag?.[l] || caseStudy.tag?.en || caseStudy.tag || "",
      industry: caseStudy.industry?.[l] || caseStudy.industry?.en || caseStudy.industry || "",
      location: caseStudy.location?.[l] || caseStudy.location?.en || caseStudy.location || "",
      duration: caseStudy.duration?.[l] || caseStudy.duration?.en || caseStudy.duration || "",
      outcome: caseStudy.outcome?.[l] || caseStudy.outcome?.en || caseStudy.outcome || "",
      services: (caseStudy.services || []).map((s: any) => s?.[l] || s?.en || s || ""),
      resultsSection: caseStudy.resultsSection ? {
        ...caseStudy.resultsSection,
        badge: caseStudy.resultsSection.badge?.[l] || caseStudy.resultsSection.badge?.en || caseStudy.resultsSection.badge || "",
        title: caseStudy.resultsSection.title?.[l] || caseStudy.resultsSection.title?.en || caseStudy.resultsSection.title || "",
        items: (caseStudy.resultsSection.items || []).map((item: any) => ({
          value: item.value?.[l] || item.value?.en || item.value || "",
          label: item.label?.[l] || item.label?.en || item.label || ""
        }))
      } : undefined
    };
  };
 
  const localizedCaseStudies = caseStudiesList.map(localizeCaseStudy);
 
   // Build resolved CMS layout data for preview
  const resolvedHero = {
    ...form.hero,
    badge: { [locale]: resolveBilingual(form.hero?.badge) },
    title: { [locale]: resolveBilingual(form.hero?.title) },
    description: { [locale]: resolveBilingual(form.hero?.description) },
    stats: form.hero?.stats?.map((stat: any) => ({
      ...stat,
      label: { [locale]: resolveBilingual(stat.label) },
      value: { [locale]: resolveBilingual(stat.value) }
    }))
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
            <CaseStudiesHero locale={locale} data={resolvedHero} />
            <CaseStudiesGrid locale={locale} studies={localizedCaseStudies} />
            <CTASection data={resolvedCta} />
          </div>
        </NextIntlClientProvider>
      </div>
    </div>
  );
}