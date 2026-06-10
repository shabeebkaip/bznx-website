"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NextIntlClientProvider } from "next-intl";

import ServicesHero from "@/components/pages/services/Hero";
import ServicesAll from "@/components/pages/services/All";
import ServicesMISA from "@/components/pages/services/MISA";
import CTASection from "@/components/sections/CTASection";

import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

gsap.registerPlugin(ScrollTrigger);

const DESIGN_WIDTH = 1440;

interface FullPreviewProps {
  form: any;
  locale: "en" | "ar";
}

export default function AdminServicesFullPreview({ form, locale = "ar" }: FullPreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState(480);
  const [innerHeight, setInnerHeight] = useState(2500);
  const [servicesList, setServicesList] = useState<any[]>([]);

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

  // Fetch services list
  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((res) => {
        setServicesList(res.data || []);
      })
      .catch(() => {});
  }, []);

  // Reveal GSAP/elements in preview
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

  // Helper to ensure bilingual fields map correctly without object fallback issues
  const resolveBilingual = (val: any) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object") {
      return val[locale] || val.en || val.ar || "";
    }
    return String(val);
  };

  const resolvedHero = {
    ...form.hero,
    badge: { [locale]: resolveBilingual(form.hero?.badge) },
    title: { [locale]: resolveBilingual(form.hero?.title) },
    description: { [locale]: resolveBilingual(form.hero?.description) },
    primaryButtonText: { [locale]: resolveBilingual(form.hero?.primaryButtonText) },
    secondaryButtonText: { [locale]: resolveBilingual(form.hero?.secondaryButtonText) },
    image: form.hero?.image
  };

  const resolvedHeading = {
    ...form.servicesHeading,
    badge: { [locale]: resolveBilingual(form.servicesHeading?.badge) },
    title: { [locale]: resolveBilingual(form.servicesHeading?.title) },
    description: { [locale]: resolveBilingual(form.servicesHeading?.description) },
  };

  const resolvedBusinessSetup = {
    ...form.businessSetup,
    badge: { [locale]: resolveBilingual(form.businessSetup?.badge) },
    title: { [locale]: resolveBilingual(form.businessSetup?.title) },
    description: { [locale]: resolveBilingual(form.businessSetup?.description) },
    ctaText: { [locale]: resolveBilingual(form.businessSetup?.ctaText) },
    features: (form.businessSetup?.features || []).map((feat: any) => {
      if (typeof feat === "string") return feat;
      return {
        [locale]: resolveBilingual(feat),
        title: { [locale]: resolveBilingual(feat.title) },
        description: { [locale]: resolveBilingual(feat.description) }
      };
    })
  };

  const resolvedTimelines = {
    ...form.timelines,
    badge: { [locale]: resolveBilingual(form.timelines?.badge) },
    title: { [locale]: resolveBilingual(form.timelines?.title) },
    description: { [locale]: resolveBilingual(form.timelines?.description) },
    stats: (form.timelines?.stats || []).map((stat: any) => ({
      ...stat,
      title: { [locale]: resolveBilingual(stat.title) },
      label: { [locale]: resolveBilingual(stat.label) }
    }))
  };

  const resolvedCta = {
    ...form.cta,
    title: { [locale]: resolveBilingual(form.cta?.title) },
    description: { [locale]: resolveBilingual(form.cta?.description) },
    ctaText: { [locale]: resolveBilingual(form.cta?.ctaText) },
    ctaText2: { [locale]: resolveBilingual(form.cta?.ctaText2) },
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
            <div>
              <ServicesHero locale={locale} data={resolvedHero} />
              <ServicesAll locale={locale} heading={resolvedHeading} services={servicesList} />
              <ServicesMISA locale={locale} data={resolvedBusinessSetup} timelines={resolvedTimelines} />
              <CTASection data={resolvedCta} />
            </div>
          </div>
        </NextIntlClientProvider>
      </div>
    </div>
  );
}
