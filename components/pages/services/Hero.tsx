"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { unescapeHTML } from "@/lib/utils";

export default function ServicesHero({ locale, data }: { locale: string; data: any }) {
  const l = locale as 'en' | 'ar';
  

  return (
    <section className="relative min-h-[75vh] flex items-end overflow-hidden pt-20">
      <Image
        src={data?.image?.url || data?.image || "/home/kafd.webp"}
        alt={unescapeHTML(data?.title?.[l] || "BZNX Services")}
        fill
        priority
        sizes="100vw"
        className="object-cover object-top"
      />
      <div className="absolute inset-0 bg-[#091d37]/65" />
      <div className="absolute inset-0 bg-linear-to-t from-[#091d37] via-[#091d37]/35 to-transparent" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-3xl">
        {data?.badge?.[l] && (
          <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/25 rounded-full px-4 py-2 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
            <span className="text-teal text-[10px] font-bold tracking-[0.3em] uppercase">{data.badge[l]}</span>
          </div>
        )}

          <h1 className={`text-white uppercase mb-8 ${l === 'ar' ? 'text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.2] tracking-normal' : 'text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tighter'}`}
            dangerouslySetInnerHTML={{ __html: unescapeHTML(data?.title?.[l] || "Everything You Need To Operate In <span class='text-teal'>Saudi Arabia</span>") }}
          />

          <div  className="text-white/60 text-[19px] sm:text-lg leading-relaxed max-w-xl mb-10 ql-editor-view"
            dangerouslySetInnerHTML={{ __html: unescapeHTML(data?.description?.[l] || "From company formation to ongoing compliance — we handle every step of your Saudi business journey so you can focus on growth.") }}
          />

          <div className="flex flex-col min-[480px]:flex-row gap-4 items-stretch min-[480px]:items-center">
          {data?.primaryButtonText?.[l] && (
            <Link
              href={data.primaryButtonLink || `/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 bg-teal text-[#091d37] text-xs font-black tracking-[0.15em] uppercase px-7 py-3.5 rounded-full hover:bg-teal/90 transition-colors duration-200"
            >
              {data.primaryButtonText[l]} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
          {data?.secondaryButtonText?.[l] && (
            <Link
              href={data.secondaryButtonLink || `/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white text-xs font-black tracking-[0.15em] uppercase px-7 py-3.5 rounded-full hover:border-white/40 transition-colors duration-200"
            >
              {data.secondaryButtonText[l]}
            </Link>
          )}
          </div>
        </div>
      </div>
    </section>
  );
}
