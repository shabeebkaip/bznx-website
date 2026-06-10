"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NextIntlClientProvider } from "next-intl";

import ServiceDetailPage from "@/components/pages/services/Detail";

import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

gsap.registerPlugin(ScrollTrigger);

const DESIGN_WIDTH = 1440;

interface FullPreviewProps {
  form: any;
  locale?: "en" | "ar";
}

export default function AdminServiceFullPreview({ form, locale = "ar" }: FullPreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState(480);
  const [innerHeight, setInnerHeight] = useState(2500);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setServices(data);
        }
      })
      .catch((err) => console.error("Error fetching services for preview:", err));
  }, []);

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

  // Build a resolved service object for preview
  const resolvedService = {
    ...form,
    title: { [locale]: resolveBilingual(form.title) },
    tag: { [locale]: resolveBilingual(form.tag) },
    description: { [locale]: resolveBilingual(form.description) },
    bullets: (form.bullets || []).map((b: any) => ({ [locale]: resolveBilingual(b) })),
    fullDescription: { [locale]: resolveBilingual(form.fullDescription) },
    timeline: { [locale]: resolveBilingual(form.timeline) },
    // Sections that contain nested bilingual fields – map similarly if needed
    // For simplicity, we spread the original and let ServiceDetail handle its own structure.
  };

  const relatedServices = services
    .filter((s) => s.slug !== form.slug)
    .slice(0, 3);

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
            <ServiceDetailPage service={resolvedService} locale={locale} related={relatedServices} cta={{}} />
          </div>
        </NextIntlClientProvider>
      </div>
    </div>
  );
}
