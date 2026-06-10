"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { unescapeHTML } from "@/lib/utils";

export default function AboutHero({ 
  locale,
  data 
}: { 
  locale: string;
  data: any;
}) {
  const l = locale as 'en' | 'ar';
  
  if (!data) return null;

  return (
    <section className="relative min-h-[80vh] flex items-end overflow-hidden pt-20">
      {/* Background image */}
      <Image
        src={(typeof data.image === "string" ? data.image : data.image?.url) || "/whySaudi/Saudi-Western-Business-Partnership-Handshake-in-Riyadh.webp"}
        alt={data.title?.[l] || "BZNX About"}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-[#091d37]/70" />
      <div className="absolute inset-0 bg-linear-to-t from-[#091d37] via-[#091d37]/40 to-transparent" />

      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/25 rounded-full px-4 py-2 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
            <span className="text-teal text-[10px] font-bold tracking-[0.3em] uppercase">
              {data.badge?.[l] || "About BZNX"}
            </span>
          </div>

          <h1 className={`text-white uppercase mb-8 ${l === 'ar' ? 'text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.2] tracking-normal' : 'text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tighter'}`}
            dangerouslySetInnerHTML={{ __html: unescapeHTML(data.title?.[l] || "Unlocking Saudi<br />Arabia For<br /><span className='text-teal'>Global Business</span>") }}
          />

          <div  className="text-white/60 text-[19px] sm:text-lg leading-relaxed max-w-xl mb-10 ql-editor-view"
            dangerouslySetInnerHTML={{ __html: unescapeHTML(data.description?.[l]) }}
          />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 bg-teal text-[#091d37] text-xs font-black tracking-[0.15em] uppercase px-7 py-3.5 rounded-full hover:bg-teal/90 transition-colors duration-200"
            >
              {l === 'ar' ? 'اعمل معنا' : 'Work With Us'} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white text-xs font-black tracking-[0.15em] uppercase px-7 py-3.5 rounded-full hover:border-white/40 transition-colors duration-200"
            >
              {l === 'ar' ? 'خدماتنا' : 'Our Services'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
