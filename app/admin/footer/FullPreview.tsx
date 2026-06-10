"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NextIntlClientProvider } from "next-intl";

import Navbar from "@/components/layout/Navbar";
import { BznxFooter } from "@/components/ui/footer-section";

import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

const DESIGN_WIDTH = 1440;

interface FullPreviewProps {
  form: any;
  locale: "en" | "ar";
}

export default function AdminFooterFullPreview({ form, locale = "ar" }: FullPreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState(480);
  const [innerHeight, setInnerHeight] = useState(1500);

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
          <div dir={locale === "ar" ? "rtl" : "ltr"} className="bg-slate-50 min-h-screen flex flex-col justify-between">
            {/* BznxFooter */}
            <BznxFooter locale={locale} data={form} />
          </div>
        </NextIntlClientProvider>
      </div>
    </div>
  );
}
