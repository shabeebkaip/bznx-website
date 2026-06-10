"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { unescapeHTML } from "@/lib/utils";
interface FeatureItem {
  text: string;
}

interface StatItem {
  value: string | number;
  label: string;
}

interface FloatingCard {
  title: string;
  subTitle: string;
  type?: string;
}

interface AboutWithStatsProps {
  locale: string;
  data?: any;
  features?: FeatureItem[] | { items: FeatureItem[] };
  stats?: StatItem[] | { items: StatItem[] };
}

export default function AboutWithStats({ locale, data, features, stats }: AboutWithStatsProps) {
  const t = useTranslations("aboutPreview");
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);

  const getVal = (field: any, strip: boolean = false) => {
    let val = "";
    if (typeof field !== 'object' || field === null) {
        val = field || "";
    } else {
        val = field[locale] || field.en || "";
    }
    return strip ? val.replace(/<[^>]*>/g, '') : val;
  };

  const displayFeatures = useMemo(() => {
    const list = Array.isArray(features) ? features : (features as { items: FeatureItem[] })?.items || [];
    return list.map((f: any) => getVal(f.text || f));
  }, [features, locale]);

  const displayStats = useMemo(() => {
    const list = Array.isArray(stats) ? stats : (stats as { items: StatItem[] })?.items || [];
    return list.map((s: any) => ({
        value: getVal(s.value || s.end),
        label: getVal(s.label)
    }));
  }, [stats, locale]);

  const displayFloatingCards = useMemo(() => {
    const cards = [];
    if (data?.topRightCard) {
        cards.push({
            title: getVal(data.topRightCard.title),
            subTitle: getVal(data.topRightCard.subTitle),
            type: "top-right"
        });
    }
    if (data?.bottomLeftCard) {
        cards.push({
            title: getVal(data.bottomLeftCard.title),
            subTitle: getVal(data.bottomLeftCard.subTitle),
            type: "bottom-left"
        });
    }
    return cards;
  }, [data, locale]);

  const topCard = displayFloatingCards.find(c => c.type === "top-right");
  const bottomCard = displayFloatingCards.find(c => c.type === "bottom-left");


  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-stat-card",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: statsRef.current, start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".about-feature-pill",
        { x: -20, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [displayStats, displayFeatures]);

  const imageUrl = typeof data?.image === 'string' ? data.image : data?.image?.url || "/riyadh.jpg";

  return (
    <section ref={sectionRef} className="py-16 lg:py-28 bg-[#f8fafc] overflow-hidden relative">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(#091d37 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT — Image stack */}
          <div className="relative hidden lg:block">
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 aspect-[4/5]">
              <Image
                src={imageUrl}
                alt="About BZNX"
                fill
                sizes="(max-width: 1280px) 50vw, 640px"
                className="object-cover"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#091d37]/30 via-transparent to-transparent" />
            </div>

            {/* Floating stat badge */}
          {topCard && (
            <div
              className="absolute -right-8 top-12 bg-white rounded-2xl shadow-xl shadow-slate-200/80 px-6 py-5 border border-slate-100"
              style={{ minWidth: 160, zIndex: 10 }}
            >
              <div className="text-3xl font-black text-[#00C4B4] tracking-tighter leading-none">{topCard.title}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1 leading-tight" dangerouslySetInnerHTML={{ __html: topCard.subTitle.replace(/\n/g, '<br/>') }}/>
            </div>
            )}

            {/* Floating pill bottom */}
          {bottomCard && (
            <div className="absolute -left-6 bottom-12 bg-[#091d37] rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3" style={{ zIndex: 10 }}>
              <div className="w-8 h-8 rounded-full bg-[#00C4B4]/20 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00C4B4]" />
              </div>
              <div>
                <div className="text-white text-xs font-bold">{bottomCard.title}</div>
                <div className="text-white/40 text-[10px]">{bottomCard.subTitle}</div>
              </div>
            </div>
          )}
          </div>

          {/* RIGHT — Content */}
          <div className="space-y-8">
            {/* Badge */}
          {(getVal(data?.badge) || t("badge")) && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00C4B4]/30 bg-[#00C4B4]/8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C4B4] animate-pulse" />
              <span className="text-[#00C4B4] text-xs font-bold tracking-[0.2em] uppercase">{getVal(data?.badge) || t("badge")}</span>
            </div>
          )}

            {/* Heading */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#091d37] leading-[1.05] uppercase tracking-tighter">
          {getVal(data?.title) ? (
            <span
  dangerouslySetInnerHTML={{
    __html: unescapeHTML(getVal(data.title)),
  }}
/>
          ) : (
            <>
              {t("title").split("IN SAUDI ARABIA")[0]}
              <span className="block text-[#00C4B4]">
                in Saudi Arabia
              </span>
            </>
          )}
            </h2>

            {/* Body */}
            <div className="space-y-4 text-slate-500 text-base leading-relaxed">
              {getVal(data?.description) ? (
                   <div dangerouslySetInnerHTML={{ __html: unescapeHTML(getVal(data.description)) }} />
              ) : (
                  <>
                    <p>{t("body2")}</p>
                    <p>{t("body3")}</p>
                  </>
              )}
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {displayFeatures.map((f: string, idx: number) => (
                <span
                  key={idx}
                  className="about-feature-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[#091d37] text-xs font-semibold shadow-sm"
                >
                  <svg className="w-3 h-3 text-[#00C4B4]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {f}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {displayStats.map((stat: any, i: number) => (
                <div
                  key={i}
                  className="about-stat-card bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 text-center hover:shadow-md hover:border-[#00C4B4]/30 transition-all duration-300"
                >
                  <div className="text-2xl sm:text-3xl font-black text-[#091d37] tracking-tighter leading-none mb-1">
                    {stat.value}
                  </div>
                  <p className="text-slate-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider leading-tight">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link
                href={data?.ctaLink || "/en/contact"}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#091d37] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#00C4B4] transition-colors duration-300 shadow-lg shadow-slate-900/20"
              >
                {getVal(data?.ctaText) || t("cta")}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
