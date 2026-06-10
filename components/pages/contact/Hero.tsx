"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useTranslations, useLocale } from "next-intl";
import { ArrowDown } from "lucide-react";
import { unescapeHTML } from "@/lib/utils";

export default function ContactHeroSection({ data, stats }: { data?: any; stats?: any }) {
  const t = useTranslations("contact");
  const locale = useLocale();
  const l = locale as 'en' | 'ar';
  const rootRef = useRef<HTMLElement>(null);

  const getImg = (item: any) => {
    if (!item) return "/whySaudi/Saudi-Western-Business-Partnership-Handshake-in-Riyadh.webp";
    if (typeof item === 'string') return item;
    return item.url || item[l] || item.en || "";
  };

  const CMS_STATS = stats?.items || [
    { value: "500+", label: (l === 'ar' ? "أعمال تم إطلاقها" : "Businesses Launched") },
    { value: "45–50", label: (l === 'ar' ? "يوماً للتأسيس" : "Days to Setup") },
    { value: "100%", label: (l === 'ar' ? "معدل الامتثال" : "Compliance Rate") },
    { value: "24h", label: (l === 'ar' ? "وقت الاستجابة" : "Response Time") },
  ];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ch-line",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out", delay: 0.2 }
      );
      gsap.fromTo(
        ".ch-stat",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out", delay: 0.7 }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20"
    >
      {/* Background image */}
      <Image
        src={getImg(data?.image)}
        alt="Contact BZNX"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center scale-105"
      />

      {/* Layered overlays */}
      <div className="absolute inset-0 bg-[#091d37]/80" />
      <div className="absolute inset-0 bg-linear-to-b from-[#091d37]/60 via-transparent to-[#091d37]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Teal glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(38,208,206,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(200,162,74,0.10) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex-1 flex flex-col items-center justify-center pb-16">
        {/* Badge */}
        <div className="ch-line inline-flex items-center gap-2 bg-teal/10 border border-teal/25 rounded-full px-4 py-2 mb-10">
          <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
          <span className="text-teal text-[10px] font-bold tracking-[0.3em] uppercase">
            {data?.badge?.[l] || (l === 'ar' ? "تواصل معنا" : "Get In Touch")}
          </span>
        </div>

        <h1 
          className={`ch-line text-white uppercase mb-8 ${l === 'ar' ? 'text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.2] tracking-normal' : 'text-4xl sm:text-7xl lg:text-8xl font-black leading-[0.88] tracking-tighter'}`}
          dangerouslySetInnerHTML={{ __html: unescapeHTML(data?.title?.[l] || t("title")) }}
        />

        <div 
          className="ch-line text-white/60 text-[19px] sm:text-xl leading-relaxed max-w-xl mb-14 ql-editor-view"
          dangerouslySetInnerHTML={{ __html: unescapeHTML(data?.description?.[l] || t("sub")) }}
        />

        {/* Scroll hint */}
        <div className="ch-line flex flex-col items-center gap-2 text-white/30">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase">
            {l === 'ar' ? 'قم بالتمرير للاتصال' : 'Scroll to Contact'}
          </span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 w-full border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {CMS_STATS.map((stat: any, i: number) => {
              const borderClass = l === 'ar'
                ? "border-l border-white/10 [&:nth-child(2n)]:border-l-0 sm:[&:nth-child(2n)]:border-l sm:last:border-l-0"
                : "border-r border-white/10 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r sm:last:border-r-0";
              return (
                <div
                  key={i}
                  className={`ch-stat py-7 flex flex-col items-center gap-1 [&:nth-child(-n+2)]:border-b border-white/10 sm:border-b-0 ${borderClass}`}
                >
                  <span className="text-3xl font-black" style={{ color: "#26D0CE" }}>
                    {typeof stat.value === "object" ? (stat.value?.[l] || stat.value?.en || "") : stat.value}
                  </span>
                  <span className="text-white/40 text-xs font-bold tracking-widest uppercase text-center">
                    {typeof stat.label === "object" ? (stat.label?.[l] || stat.label?.en || "") : stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
