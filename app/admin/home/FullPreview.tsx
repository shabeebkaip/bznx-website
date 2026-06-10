"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NextIntlClientProvider } from "next-intl";

import Hero from "@/components/sections/Hero";
import AboutWithStats from "@/components/sections/AboutWithStats";
import TrustedBy from "@/components/sections/TrustedBy";
import ServicesGrid from "@/components/sections/ServicesGrid";
import WhySaudiGrid from "@/components/sections/WhySaudiGrid";
import SaudiOpportunity from "@/components/sections/SaudiOpportunity";
import HowWeWork from "@/components/sections/HowWeWork";
import BenefitsSection from "@/components/sections/BenefitsSection";
import CaseStudies from "@/components/sections/CaseStudies";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";

import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

gsap.registerPlugin(ScrollTrigger);

const DESIGN_WIDTH = 1440;

interface FullPreviewProps {
  form: any;
  locale: "en" | "ar";
}

export default function AdminHomeFullPreview({ form, locale = "ar" }: FullPreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState(480);
  const [innerHeight, setInnerHeight] = useState(6000);
  const [services, setServices] = useState<any[]>([]);
  const [footerData, setFooterData] = useState<any>({});
  const [dataReady, setDataReady] = useState(false);

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

  // Fetch services and footer CMS data
  useEffect(() => {
    Promise.all([
      fetch("/api/services").then((r) => r.json()),
      fetch("/api/footer").then((r) => r.json()),
    ])
      .then(([resServices, resFooter]) => {
        setServices(resServices.data || []);
        if (resFooter.status && Array.isArray(resFooter.data)) {
          const mapped = resFooter.data.reduce((acc: any, curr: any) => {
            acc[curr.section] = curr.content;
            return acc;
          }, {});
          setFooterData(mapped);
        }
        setDataReady(true);
      })
      .catch(() => {
        setDataReady(true);
      });
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
  }, [form, locale, dataReady]);

  const scale = panelWidth > 0 ? panelWidth / DESIGN_WIDTH : 1;
  const outerHeight = innerHeight * scale;

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
              <Hero
                locale={locale}
                data={form.hero}
                stats={form.heroStats}
                badges={form.heroBadges}
              />
              <AboutWithStats
                locale={locale}
                data={form.aboutMain}
                features={form.aboutMain?.features || form.aboutFeatures}
                stats={form.aboutStats}
              />
              <TrustedBy data={form.trustedBy} />
              <ServicesGrid data={form.services} services={services} />
              <WhySaudiGrid data={form.whySaudi} />
              <SaudiOpportunity data={form.opportunity} />
              <HowWeWork data={form.howWeWork} />
              <BenefitsSection data={form.benefits} />
              <CaseStudies data={form.caseStudies} />
              <TestimonialsSection data={form.testimonials} />
              <CTASection data={form.cta} />
            </div>
          </div>
        </NextIntlClientProvider>
      </div>
    </div>
  );
}
