"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import { unescapeHTML } from "@/lib/utils";

function CaseStudyCard({ study }: { study: any }) {
  const locale = useLocale();
  
  const getVal = (val: any) => {
    if (!val) return "";
    if (typeof val === 'string') return val;
    return val[locale] || val.en || "";
  };

  const tTag = getVal(study.tag);
  const tOutcome = getVal(study.outcome);
  const tTitle = getVal(study.title);
  const tDescription = getVal(study.description);

  return (
    <Link href={`/${locale}/case-studies/${study.slug}`} className="group relative rounded-2xl overflow-hidden h-[280px] sm:h-full cursor-pointer">
      <Image
        src={study.image}
        alt={tTitle}
        fill
        sizes="(max-width: 768px) 100vw, 420px"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-[#091d37]/95 via-[#091d37]/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-6">
        {/* Top: tag + number */}
        <div className="flex items-start justify-between">
          <span className="inline-block bg-teal/15 border border-teal/30 text-teal text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full">
            {tTag}
          </span>
          <span className="text-white/20 text-xs font-black tabular-nums">{study.id}</span>
        </div>

        {/* Bottom: outcome + title + desc */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-teal" />
            <span className="text-white text-[10px] font-bold tracking-wide">{tOutcome}</span>
          </div>
          <h3 className="text-white font-black text-base uppercase tracking-tight leading-snug">
            {tTitle}
          </h3>
          <p className="text-white/50 text-xs leading-relaxed line-clamp-2">
            {tDescription}
          </p>
          <div className="flex items-center gap-1.5 text-teal text-[10px] font-bold tracking-[0.15em] uppercase pt-1 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
            {locale === 'ar' ? 'اقرأ المزيد' : 'Read More'} <ArrowRight className={`w-3 h-3 ${locale === 'ar' ? 'scale-x-[-1]' : ''}`} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CaseStudies({ data, studies = [] }: { data?: any; studies?: any[] }) {
  const locale = useLocale();

  const getVal = (field: any) => {
    if (!field) return "";
    return typeof field === "string" ? field : field[locale] || field["en"] || "";
  };


  const badge = getVal(data?.badge) || (locale === 'ar' ? "دراسات الحالة" : "Case Studies");
  const title = getVal(data?.title) || (locale === 'ar' ? "نتائج <span class='text-[#091d37]/25'>أعمالنا</span>" : `Our <span class="text-[#091d37]/25">Results</span>`);
  const description = getVal(data?.description) || (locale === 'ar' ? "نتائج حقيقية للشركات الحقيقية التي تدخل وتنمو في المملكة العربية السعودية." : "Real outcomes for real businesses entering and growing in the Kingdom of Saudi Arabia.");
  const ctaText = getVal(data?.ctaText) || (locale === 'ar' ? "عرض الكل" : "View All");
  const ctaLink = data?.ctaLink || `/${locale}/case-studies`;

  const displayStudies = studies || [];

  const rows = [];
  const temp = [...displayStudies];
  let isTwo = true;
  while (temp.length > 0) {
    if (isTwo) {
      rows.push({ type: "two", items: temp.splice(0, 2) });
    } else {
      rows.push({ type: "three", items: temp.splice(0, 3) });
    }
    isTwo = !isTwo;
  }


  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div>
            <p className="text-teal text-xs font-bold tracking-[0.3em] uppercase mb-4">
              {badge}
            </p>
            <h2
              className="text-4xl sm:text-5xl font-black text-[#091d37] uppercase tracking-tighter"
              dangerouslySetInnerHTML={{ __html: unescapeHTML(title) }}
            />
          </div>
          <div className="flex flex-col sm:items-end gap-3">
            <p className={`text-[#091d37]/45 text-sm leading-relaxed max-w-xs ${locale === 'ar' ? 'sm:text-left' : 'sm:text-right'}`}>
              <span dangerouslySetInnerHTML={{ __html: unescapeHTML(description) }} />
            </p>
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-1.5 text-teal text-xs font-bold tracking-[0.15em] uppercase hover:gap-2.5 transition-all duration-200"
            >
              {ctaText} <ArrowRight className={`w-3.5 h-3.5 ${locale === 'ar' ? 'scale-x-[-1]' : ''}`} />
            </Link>
          </div>
        </div>

        {/* Row 1: 2 cards (first is wider) */}
        <div className="space-y-4">
          {rows.map((row, rowIndex) => {
            if (row.type === "two") {
              if (row.items.length === 2) {
                return (
                  <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr] gap-4 h-auto sm:h-[420px]">
                    <CaseStudyCard study={row.items[0]} />
                    <CaseStudyCard study={row.items[1]} />
                  </div>
                );
              } else {
                return (
                  <div key={rowIndex} className="grid grid-cols-1 gap-4 h-auto sm:h-[420px]">
                    <CaseStudyCard study={row.items[0]} />
                  </div>
                );
              }
            } else {
              if (row.items.length === 3) {
                return (
                  <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1.4fr] gap-4 h-auto sm:h-[380px]">
                    <CaseStudyCard study={row.items[0]} />
                    <CaseStudyCard study={row.items[1]} />
                    <CaseStudyCard study={row.items[2]} />
                  </div>
                );
              } else if (row.items.length === 2) {
                return (
                  <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-[1fr_1.4fr] gap-4 h-auto sm:h-[380px]">
                    <CaseStudyCard study={row.items[0]} />
                    <CaseStudyCard study={row.items[1]} />
                  </div>
                );
              } else {
                return (
                  <div key={rowIndex} className="grid grid-cols-1 gap-4 h-auto sm:h-[380px]">
                    <CaseStudyCard study={row.items[0]} />
                  </div>
                );
              }
            }
          })}
        </div>

      </div>
    </section>
  );
}
