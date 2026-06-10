"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NextIntlClientProvider } from "next-intl";

import ContactHeroSection from "@/components/pages/contact/Hero";
import ContactMainSection from "@/components/pages/contact/Main";

import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

gsap.registerPlugin(ScrollTrigger);

const DESIGN_WIDTH = 1440;

interface FullPreviewProps {
  form: any;
  locale: "en" | "ar";
}

export default function AdminContactFullPreview({ form, locale = "ar" }: FullPreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState(480);
  const [innerHeight, setInnerHeight] = useState(2000);

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

  const resolveBilingual = (val: any) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object") {
      return val[locale] || val.en || val.ar || "";
    }
    return String(val);
  };

  const resolvedHeroSection = {
    ...form.heroSection,
    badge: { [locale]: resolveBilingual(form.heroSection?.badge) },
    title: { [locale]: resolveBilingual(form.heroSection?.title) },
    description: { [locale]: resolveBilingual(form.heroSection?.description) },
  };

  const resolvedContactStats = {
    ...form.contactStats,
    items: (form.contactStats?.items || []).map((item: any) => ({
      ...item,
      value: { [locale]: resolveBilingual(item.value) },
      label: { [locale]: resolveBilingual(item.label) },
    })),
  };

  const resolvedContactFormHeader = {
    ...form.contactFormHeader,
    leftBadge: { [locale]: resolveBilingual(form.contactFormHeader?.leftBadge) },
    leftTitle: { [locale]: resolveBilingual(form.contactFormHeader?.leftTitle) },
    leftDescription: { [locale]: resolveBilingual(form.contactFormHeader?.leftDescription) },
    rightBadge: { [locale]: resolveBilingual(form.contactFormHeader?.rightBadge) },
    rightTitle: { [locale]: resolveBilingual(form.contactFormHeader?.rightTitle) },
    rightDescription: { [locale]: resolveBilingual(form.contactFormHeader?.rightDescription) },
  };

  const resolvedContactNextSteps = {
    ...form.contactNextSteps,
    items: (form.contactNextSteps?.items || []).map((item: any) => ({
      ...item,
      title: { [locale]: resolveBilingual(item.title) },
      description: { [locale]: resolveBilingual(item.description) },
    })),
  };

  const resolvedContactMethods = {
    ...form.contactMethods,
    items: (form.contactMethods?.items || []).map((item: any) => ({
      ...item,
      label: { [locale]: resolveBilingual(item.label) },
      value: { [locale]: resolveBilingual(item.value) },
    })),
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
              <ContactHeroSection data={resolvedHeroSection} stats={resolvedContactStats} />
              <ContactMainSection
                locale={locale}
                header={resolvedContactFormHeader}
                steps={resolvedContactNextSteps}
                contactMethods={resolvedContactMethods}
              />
            </div>
          </div>
        </NextIntlClientProvider>
      </div>
    </div>
  );
}
