"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "next-intl";
import { Building2, FileText, SearchCheck, BarChart3, Scale, BookOpen, Monitor } from "lucide-react";
import { unescapeHTML } from "@/lib/utils";

const iconMap: { [key: string]: any } = {
  "company-formation": Building2,
  "pro-services": FileText,
  "financial-due-diligence": SearchCheck,
  "audit-tax-compliance": BarChart3,
  "legal-advisory": Scale,
  "bookkeeping-payroll": BookOpen,
  "erp-implementation": Monitor
};

interface ServicesContent {
  badge?: string | Record<string, string>;
  title?: string | Record<string, string>;
  description?: string | Record<string, string>;
  ctaText?: string | Record<string, string>;
  ctaLink?: string;
}

export default function ServicesGrid({ data, services = [] }: { data?: ServicesContent, services?: any[] }) {
  const locale = useLocale();
  const l = locale as 'en' | 'ar';
  const gridRef = useRef<HTMLDivElement>(null);

  const getVal = (field: any) => {
    if (!field) return "";
    return typeof field === "string" ? field : field[locale] || field["en"] || "";
  };

  const badge = getVal(data?.badge) || "What We Do";
  const title = getVal(data?.title) || "Comprehensive <br /> <span style='color: #00C4B4'>Business Solutions</span>";
  const description = getVal(data?.description) || "Everything you need to launch and grow your business in Saudi Arabia";
  const ctaText = getVal(data?.ctaText) || (l === 'ar' ? "عرض جميع الخدمات" : "View All Services");
  const ctaLink = data?.ctaLink || `/${locale}/services`;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      gridRef.current?.querySelectorAll(".service-card") || [],
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
      }
    );
  }, [services]);

  return (
    <section className="py-24 bg-[#f8fafc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C4B4]/10 border border-[#00C4B4]/25 text-[#00C4B4] text-[10px] font-bold tracking-[0.25em] uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C4B4] animate-pulse" />
              {badge}
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-[#091d37] leading-tight tracking-tighter uppercase">
              <span dangerouslySetInnerHTML={{ __html: unescapeHTML(title) }} />
            </h2>
          </div>
          <div className="flex flex-col md:items-end gap-3">
            <p className={`text-slate-400 text-sm leading-relaxed max-w-xs ${locale === 'ar' ? 'md:text-left' : 'md:text-right'}`}>
              <span dangerouslySetInnerHTML={{ __html: unescapeHTML(description) }} />
            </p>
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#091d37] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#00C4B4] transition-colors duration-300 w-fit"
            >
              {ctaText}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {services.map((service, i) => {
            const Icon = iconMap[service.slug] || Building2;
            const sTitle = service.title?.[l] || "";
            const sTag = service.tag?.[l] || "";
            const sDesc = service.description?.[l] || "";

            return (
              <Link
                key={service.slug}
                href={`/${locale}/services/${service.slug}`}
                className="service-card group relative bg-white border border-slate-100 hover:border-[#00C4B4]/40 hover:shadow-xl hover:shadow-[#00C4B4]/8 rounded-2xl p-6 flex flex-col gap-4 overflow-hidden transition-all duration-300 min-h-[180px]"
              >
                {/* Teal top border on hover */}
                <div className={`absolute top-0 left-0 right-0 h-0.75 bg-[#00C4B4] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${locale === 'ar' ? 'origin-right' : 'origin-left'} rounded-t-2xl`} />

                {/* Number + Icon row */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-[0.25em] text-slate-200">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#00C4B4]/8 group-hover:bg-[#00C4B4] border border-[#00C4B4]/15 group-hover:border-[#00C4B4] flex items-center justify-center transition-all duration-300 overflow-hidden">
                    {service.icon?.url ? (
                      <img 
                        src={service.icon.url} 
                        alt={sTitle} 
                        className="w-5 h-5 object-cover transition-all duration-300 group-hover:brightness-0 group-hover:invert" 
                      />
                    ) : (
                      <Icon className="w-5 h-5 text-[#00C4B4] group-hover:text-white transition-colors duration-300" />
                    )}
                  </div>
                </div>

                {/* Title */}
                <div className="flex-1">
                  <p className="text-[#00C4B4] text-[9px] font-bold tracking-[0.2em] uppercase mb-1.5">
                    {sTag}
                  </p>
                  <h3 className="text-[#091d37] font-black text-base tracking-tight uppercase leading-snug">
                    {sTitle}
                  </h3>
                </div>

                {/* Arrow */}
                <svg className={`w-4 h-4 text-slate-200 group-hover:text-[#00C4B4] transition-all duration-300 ${locale === 'ar' ? 'group-hover:-translate-x-1 scale-x-[-1]' : 'group-hover:translate-x-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>

                {/* Hover overlay with description */}
                <div className="absolute inset-0 bg-[#091d37] rounded-2xl p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 rounded-xl bg-[#00C4B4] flex items-center justify-center overflow-hidden">
                    {service.icon?.url ? (
                      <img 
                        src={service.icon.url} 
                        alt={sTitle} 
                        className="w-5 h-5 object-cover brightness-0 invert" 
                      />
                    ) : (
                      <Icon className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-black text-sm uppercase tracking-tight leading-snug mb-2">
                      {sTitle}
                    </h3>
                    <p className="text-white/60 text-xs leading-relaxed line-clamp-3">{sDesc}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#00C4B4] text-[10px] font-bold uppercase tracking-widest">
                    {l === 'ar' ? 'تعرف على المزيد' : 'Learn more'}
                    <svg className={`w-3 h-3 ${l === 'ar' ? 'scale-x-[-1]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
