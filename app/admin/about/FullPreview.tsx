"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NextIntlClientProvider } from "next-intl";

import Navbar from "@/components/layout/Navbar";
import { BznxFooter } from "@/components/ui/footer-section";

import AboutHero from "@/components/pages/about/Hero";
import AboutWhoWeAre from "@/components/pages/about/WhoWeAre";
import AboutMissionValues from "@/components/pages/about/MissionValues";
import AboutTeam from "@/components/pages/about/Team";
import AboutClients from "@/components/pages/about/Clients";
import CTASection from "@/components/sections/CTASection";

import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

gsap.registerPlugin(ScrollTrigger);

const DESIGN_WIDTH = 1440;

interface FullPreviewProps {
  form: any;
  locale: "en" | "ar";
}

export default function AdminAboutFullPreview({ form, locale = "ar" }: FullPreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState(480);
  const [innerHeight, setInnerHeight] = useState(3000);
  const [homeData, setHomeData] = useState<any>({});
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

  // Fetch home and footer CMS data
  useEffect(() => {
    Promise.all([
      fetch("/api/home").then((r) => r.json()),
      fetch("/api/footer").then((r) => r.json()),
    ])
      .then(([resHome, resFooter]) => {
        if (resHome.status && Array.isArray(resHome.data)) {
          const mapped = resHome.data.reduce((acc: any, curr: any) => {
            acc[curr.section] = curr.content;
            return acc;
          }, {});
          setHomeData(mapped);
        }
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
              <AboutHero 
                locale={locale} 
                data={form.heroSection} 
              />
              <AboutWhoWeAre 
                locale={locale}
                data={form.aboutSection}
                stats={form.aboutStats}
              />
              <AboutMissionValues 
                locale={locale}
                mission={form.aboutMission}
                vision={form.aboutVision}
                valuesHeader={form.aboutValuesHeader}
                values={form.aboutValues}
              />
              <AboutTeam 
                locale={locale}
                header={form.aboutTeamHeader}
                team={form.aboutTeam}
              />
              <AboutClients 
                locale={locale}
                header={form.aboutClientsHeader}
                logos={homeData.trustedBy?.logos}
                testimonial={homeData.testimonials?.items?.[0]}
              />
              <CTASection 
                data={form.aboutCta}
              />
            </div>
          </div>
        </NextIntlClientProvider>
      </div>
    </div>
  );
}
