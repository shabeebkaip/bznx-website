"use client";

import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NextIntlClientProvider } from "next-intl";

import CaseStudyDetailPage from "@/components/pages/case-studies/Detail";

import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

gsap.registerPlugin(ScrollTrigger);

const DESIGN_WIDTH = 1440;

interface Props {
  form: any;
  locale?: "en" | "ar";
}

export default function AdminCaseStudyFullPreview({
  form,
  locale = "ar",
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const [panelWidth, setPanelWidth] = useState(480);
  const [innerHeight, setInnerHeight] = useState(2500);

  // Scale preview container
  useLayoutEffect(() => {
    if (!wrapperRef.current) return;

    const obs = new ResizeObserver(([entry]) => {
      setPanelWidth(entry.contentRect.width || 480);
    });

    obs.observe(wrapperRef.current);

    return () => obs.disconnect();
  }, []);

  // Measure page height
  useLayoutEffect(() => {
    if (!innerRef.current) return;

    const obs = new ResizeObserver(() => {
      if (innerRef.current) {
        setInnerHeight(innerRef.current.scrollHeight);
      }
    });

    obs.observe(innerRef.current);

    return () => obs.disconnect();
  }, []);

  // Force reveal GSAP animations
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!innerRef.current) return;

      innerRef.current.querySelectorAll<HTMLElement>("*").forEach((el) => {
        if (
          el.style.opacity === "0" ||
          el.classList.contains("opacity-0")
        ) {
          gsap.set(el, {
            opacity: 1,
            y: 0,
            x: 0,
            clearProps: "transform",
          });

          el.classList.remove("opacity-0");
        }
      });

      ScrollTrigger.refresh();
    }, 800);

    return () => clearTimeout(timer);
  }, [form, locale]);

  const resolveBilingual = (value: any): any => {
    if (!value) return value;

    // translation object
    if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      ("en" in value || "ar" in value)
    ) {
      return value[locale] || value.en || value.ar || "";
    }

    if (Array.isArray(value)) {
      return value.map(resolveBilingual);
    }

    if (typeof value === "object") {
      const result: any = {};

      Object.keys(value).forEach((key) => {
        result[key] = resolveBilingual(value[key]);
      });

      return result;
    }

    return value;
  };

  // Resolve all bilingual content
  const resolvedStudy = resolveBilingual(form);

  // Fix image object
  resolvedStudy.image =
    form.image?.url ||
    (typeof form.image === "string" ? form.image : "");

  const scale =
    panelWidth > 0 ? panelWidth / DESIGN_WIDTH : 1;

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
        <NextIntlClientProvider
          locale={locale}
          messages={locale === "ar" ? arMessages : enMessages}
        >
          <div dir={locale === "ar" ? "rtl" : "ltr"}>
            <CaseStudyDetailPage
              study={resolvedStudy}
              related={[]}
              locale={locale}
            />
          </div>
        </NextIntlClientProvider>
      </div>
    </div>
  );
}