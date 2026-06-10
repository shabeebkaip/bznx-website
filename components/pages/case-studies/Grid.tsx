"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Building2 } from "lucide-react";

export default function CaseStudiesGrid({ locale, studies }: { locale: string, studies: any[] }) {
  const [active, setActive] = useState("All");
  
  const allTags = ["All", ...Array.from(new Set(studies.map((cs) => cs.tag)))];
  
  const filtered =
    active === "All" ? studies : studies.filter((cs) => cs.tag === active);

  return (
    <section className="py-12 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Filter pills */}
        <div className="flex gap-2 mb-14 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActive(tag)}
              className={`shrink-0 px-5 py-2 rounded-full text-xs font-bold tracking-[0.15em] uppercase transition-all duration-200 ${
                active === tag
                  ? "bg-[#091d37] text-white"
                  : "bg-[#091d37]/5 text-[#091d37]/50 hover:bg-[#091d37]/10 hover:text-[#091d37]/70"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-6">
          {filtered.map((study, i) => (
            <Link
              key={study.slug}
              href={`/${locale}/case-studies/${study.slug}`}
              className="group grid lg:grid-cols-[420px_1fr] rounded-3xl overflow-hidden border border-[#091d37]/[0.07] hover:border-teal/30 hover:shadow-xl hover:shadow-teal/5 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-64 lg:h-auto overflow-hidden">
                <Image
                  src={study.image}
                  alt={study.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#091d37]/60 via-transparent to-transparent lg:bg-linear-to-r lg:from-transparent lg:to-[#091d37]/10" />

                {/* ID watermark */}
                <span className={`absolute top-5 text-white/20 font-black text-4xl tabular-nums select-none ${locale === 'ar' ? 'right-5' : 'left-5'}`}>
                  {study.id}
                </span>

                {/* Outcome pill */}
                <div className={`absolute bottom-5 inline-flex items-center gap-1.5 bg-teal text-[#091d37] text-[10px] font-black tracking-[0.15em] uppercase px-3 py-1.5 rounded-full ${locale === 'ar' ? 'right-5' : 'left-5'}`}>
                  <div className="w-1 h-1 rounded-full bg-[#091d37]/40" />
                  {study.outcome}
                </div>
              </div>

              {/* Content */}
              <div className="p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  {/* Tag + metadata */}
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="inline-block bg-teal/10 border border-teal/20 text-teal text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full">
                      {study.tag}
                    </span>
                    <span className="flex items-center gap-1 text-[#091d37]/35 text-[11px] font-medium">
                      <Building2 className="w-3 h-3" /> {study.industry}
                    </span>
                    <span className="flex items-center gap-1 text-[#091d37]/35 text-[11px] font-medium">
                      <Clock className="w-3 h-3" /> {study.duration}
                    </span>
                    <span className="flex items-center gap-1 text-[#091d37]/35 text-[11px] font-medium">
                      <MapPin className="w-3 h-3" /> {study.location}
                    </span>
                  </div>

                  <h2 className="text-[#091d37] font-black text-xl sm:text-2xl uppercase tracking-tight leading-snug mb-3">
                    {study.title}
                  </h2>
                  <p className="text-[#091d37]/50 text-sm leading-relaxed mb-6">
                    {study.description}
                  </p>

                  {/* Services */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {study.services?.map((s: string) => (
                      <span
                        key={s}
                        className="text-[10px] font-bold text-[#091d37]/40 tracking-[0.1em] uppercase border border-[#091d37]/10 rounded-full px-3 py-1"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Key results inline */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    {study.resultsSection?.items?.map((r: any) => (
                      <div key={r.label} className="bg-[#091d37]/[0.03] rounded-xl p-3">
                        <p className="text-[#091d37] font-black text-lg leading-none mb-1">
                          {r.value}
                        </p>
                        <p className="text-[#091d37]/40 text-[10px] font-medium leading-snug">
                          {r.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-teal text-xs font-black tracking-[0.15em] uppercase group-hover:gap-3 transition-all duration-300">
                  {locale === 'ar' ? 'اقرأ قصة النجاح كاملة' : 'Read Full Case Study'} 
                  <ArrowRight className={`w-4 h-4 ${locale === 'ar' ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
