"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { unescapeHTML } from "@/lib/utils";

export default function ServicesMISA({ locale, data, timelines }: { locale: string; data: any; timelines: any }) {
  const l = locale as 'en' | 'ar';
  

  const benefits = data?.features || [];
  const timelineItems = timelines?.stats || [];

  return (
    <section className="py-12 sm:py-24 bg-[#091d37] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-16">
          <p className="text-teal text-xs font-bold tracking-[0.3em] uppercase mb-4">{data?.badge?.[l] || (l === 'ar' ? "تأسيس الأعمال" : "Business Setup")}</p>
          <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-[0.95]"
            dangerouslySetInnerHTML={{ __html: unescapeHTML(data?.title?.[l] || (l === 'ar' ? "ترخيص وزارة الاستثمار (MISA)<br /><span class='text-white/25'>وتأسيس الشركات</span>" : "MISA License &<br /><span class='text-white/25'>Company Formation</span>")) }}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left — benefits + CTA */}
          <div className="flex flex-col gap-8">
            <div  className="text-white/45 text-sm leading-relaxed ql-editor-view"
              dangerouslySetInnerHTML={{ __html: unescapeHTML(data?.description?.[l] || "A MISA license is your gateway to operating legally in Saudi Arabia with full foreign ownership.") }}
            />

            <div className="flex flex-col divide-y divide-white/[0.07]">
              {benefits.map((benefit: any, i: number) => (
                <div key={i} className="flex items-start gap-4 py-4">
                  <div className="w-5 h-5 rounded-full bg-teal/15 border border-teal/25 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-teal" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm">
                      {typeof benefit === 'string' ? benefit : (benefit[l] || benefit.title?.[l] || "")}
                    </span>
                    {benefit.description?.[l] && (
                      <span className="text-white/60 text-xs leading-snug">{benefit.description[l]}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

          {data?.ctaText?.[l] && (
            <Link
              href={data.ctaLink || `/${locale}/contact`}
              className="inline-flex items-center gap-2 self-start bg-teal text-[#091d37] text-xs font-black tracking-[0.15em] uppercase px-6 py-3 rounded-full hover:bg-teal/90 transition-colors duration-200"
            >
              {data.ctaText[l]} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
          </div>

          {/* Right — timeline */}
          <div>
            <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center justify-between gap-3 mb-6">
              <p className="text-white/30 text-xs font-bold tracking-[0.2em] uppercase"
                dangerouslySetInnerHTML={{ __html: unescapeHTML(timelines?.title?.[l] || "Registration Timeline") }}
              />
              <div className="self-start min-[420px]:self-auto bg-teal/10 border border-teal/20 rounded-full px-4 py-1.5">
                <span className="text-teal text-xs font-black">{timelines?.badge?.[l] || "45–50 Working Days"}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {timelineItems.map((item: any, i: number) => (
                <div
                  key={i}
                  className="flex flex-col min-[420px]:flex-row items-start min-[420px]:items-center gap-2 min-[420px]:gap-5 p-5 rounded-xl border border-white/[0.07] bg-white/[0.03]"
                >
                <div className="flex items-center gap-3 w-full min-[420px]:w-auto">
                  <span className="text-white/20 font-black text-lg tabular-nums shrink-0 w-8">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-white font-semibold text-sm flex-1 min-[420px]:hidden">{item.title?.[l]}</span>
                </div>
                <span className="text-white font-semibold text-sm flex-1 hidden min-[420px]:inline-block">{item.title?.[l]}</span>
                <span className="text-teal text-xs font-bold tracking-wide shrink-0 self-start min-[420px]:self-auto ml-11 min-[420px]:ml-0">{item.label?.[l]}</span>
                </div>
              ))}
            </div>

            {/* Note */}
            <div  className="mt-6 text-white/20 text-xs leading-relaxed ql-editor-view"
              dangerouslySetInnerHTML={{ __html: unescapeHTML(timelines?.description?.[l] || "* Timelines are estimates inclusive of government processing.") }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
