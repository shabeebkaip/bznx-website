"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { unescapeHTML } from "@/lib/utils";

import { useTranslations, useLocale } from "next-intl";

interface CTAContent {
  title?: string | Record<string, string>;
  description?: string | Record<string, string>;
  ctaText?: string | Record<string, string>;
  ctaLink?: string;
  ctaText2?: string | Record<string, string>;
  ctaLink2?: string;
}

export default function CTASection({ data }: { data?: CTAContent }) {
  const t = useTranslations("ctaSection");
  const locale = useLocale();
  const sectionRef = useRef<HTMLDivElement>(null);

  const getVal = (field: any) => {
    if (!field) return "";
    return typeof field === "string" ? field : field[locale] || field["en"] || "";
  };


  const title = getVal(data?.title) || `${t("title1")} <br /> <span class="text-[#091d37]">${t("title2")}</span> ${t("title3")}`;
  const sub = getVal(data?.description) || t("sub");
  const ctaText1 = getVal(data?.ctaText) || t("cta1");
  const ctaLink1 = data?.ctaLink || `/${locale}/contact`;
  const ctaText2 = getVal(data?.ctaText2) || t("cta2");
  const ctaLink2 = data?.ctaLink2 || `/${locale}/contact`;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const element = sectionRef.current?.querySelector(".cta-content");
    if (element) {
      gsap.fromTo(
        element,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-32 bg-teal relative overflow-hidden"
    >
      {/* Subtle dark glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#091d37]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="cta-content space-y-12 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] uppercase tracking-tighter"
            dangerouslySetInnerHTML={{ __html: unescapeHTML(title) }}
          />

          <p className="text-white/80 text-base sm:text-xl lg:text-2xl font-medium">
            <span dangerouslySetInnerHTML={{ __html: unescapeHTML(sub) }} />
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <Link
              href={ctaLink1.startsWith('/') ? ctaLink1 : `/${locale}${ctaLink1}`}
              className="w-full sm:w-auto px-12 py-5 rounded-full bg-[#091d37] text-white font-black uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#091d37]/30"
            >
              {ctaText1}
            </Link>
            <Link
              href={ctaLink2.startsWith('/') ? ctaLink2 : `/${locale}${ctaLink2}`}
              className="w-full sm:w-auto px-12 py-5 rounded-full bg-white/20 text-white font-black border-2 border-white/40 uppercase tracking-widest text-sm transition-all hover:bg-white hover:text-[#091d37]"
            >
              {ctaText2}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
