"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { unescapeHTML } from "@/lib/utils";

interface BenefitItem {
  title: string;
  description: string;
  image?: any;
}

const ICONS = [
  // End-to-end setup
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>,
  // Fast registration
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
  // Expert support
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>,
  // Reduced risk
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
  // Scalable
  <svg key="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
];

const DESCS = [
  "From company formation to operational launch — we handle every step so you can focus on growth.",
  "45-day setup with full regulatory compliance, MISA licensing, and ZATCA registration.",
  "On-the-ground Saudi expertise backed by an international advisory network.",
  "Navigate complex Saudi regulations with confidence — no surprises, no delays.",
  "Future-proof infrastructure built to scale with your business across every sector.",
];

interface BenefitsContent {
  badge?: string | Record<string, string>;
  title?: string | Record<string, string>;
  description?: string | Record<string, string>;
  image?: string | Record<string, string>;
  items?: any[];
}

export default function BenefitsSection({ data }: { data?: BenefitsContent }) {
  const t = useTranslations("benefitsSection");
  const locale = useLocale();
  const sectionRef = useRef<HTMLDivElement>(null);

  const getVal = (field: any) => {
    if (!field) return "";
    return typeof field === "string" ? field : field[locale] || field["en"] || "";
  };


  const badge = getVal(data?.badge) || t("badge");
  const title = getVal(data?.title) || `Unmatched<br /><span style="color: #00C4B4">Value</span> <span class="text-[#091d37]/20">with BZNX</span>`;
  const sub = getVal(data?.description) || "Everything you need to launch, operate, and scale — delivered under one roof.";
  const mainImage = typeof data?.image === 'string' ? data.image : (data?.image?.url || "/home/benefit.png");

  const items = ((data?.items || []).length > 0
    ? data?.items?.map((it: any, i: number) => ({
        title: getVal(it.title),
        desc: getVal(it.description),
        image: typeof it.image === 'string' ? it.image : (it.image?.url || ""),
        icon: ICONS[i % ICONS.length]
      }))
    : (t.raw("items") as string[]).map((label, i) => ({
        title: label,
        desc: DESCS[i],
        image: null,
        icon: ICONS[i]
      }))) || [];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Stagger in the header
      gsap.fromTo(".benefit-header", { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".benefit-header", start: "top 80%" },
      });

      // Each row slides in from alternating directions
      items.forEach((_: any, i: number) => {
        gsap.fromTo(`.brow-${i}`, { opacity: 0, x: i % 2 === 0 ? -50 : 50 }, {
          opacity: 1, x: 0, duration: 0.75, ease: "power3.out",
          scrollTrigger: { trigger: `.brow-${i}`, start: "top 85%" },
        });
      });

      // Image parallax
      gsap.fromTo(".benefit-img", { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [items]);

  return (
    <section ref={sectionRef} className="bg-[#f8fafc] overflow-hidden">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="benefit-header pt-16 lg:pt-24 pb-10 lg:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C4B4]/10 border border-[#00C4B4]/25 text-[#00C4B4] text-[10px] font-bold tracking-[0.25em] uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C4B4] animate-pulse" />
              {badge}
            </span>
            <h2 
              className="text-3xl sm:text-5xl lg:text-7xl font-black text-[#091d37] uppercase tracking-tighter leading-[0.95]"
              dangerouslySetInnerHTML={{ __html: unescapeHTML(title) }}
            />
          </div>
          <p className={`text-slate-400 text-sm leading-relaxed max-w-xs ${locale === 'ar' ? 'lg:text-left' : 'lg:text-right'}`}>
            <span dangerouslySetInnerHTML={{ __html: unescapeHTML(sub) }} />
          </p>
        </div>
      </div>

      {/* ── Main grid: rows + side image ───────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">

          {/* Left — Full-width benefit rows */}
          <div className="border-t border-slate-200">
            {items.map((it: any, i: number) => (
              <div
                key={i}
                className={`brow-${i} group relative border-b border-slate-200 hover:bg-white transition-all duration-300 cursor-default`}
              >
                {/* Animated side border */}
                <div className={`absolute top-0 bottom-0 w-[3px] bg-[#00C4B4] scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500 ease-out ${locale === 'ar' ? 'right-0' : 'left-0'}`} />

                <div className="flex items-center gap-3 sm:gap-6 px-3 sm:px-6 py-5 sm:py-7">
                  {/* Oversized number */}
                  <div
                    className="shrink-0 font-black tabular-nums select-none leading-none"
                    style={{ fontSize: "clamp(28px, 4.5vw, 72px)", color: "rgba(0,196,180,0.1)", lineHeight: 1, minWidth: "2ch" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Icon circle */}
                  <div className="group shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-[#00C4B4]/10 border border-[#00C4B4]/20 flex items-center justify-center text-[#00C4B4] group-hover:bg-[#00C4B4] group-hover:text-white group-hover:border-[#00C4B4] transition-all duration-300 overflow-hidden">
                    {it.image ? (
                      <img src={it.image} alt={it.title} className="w-5 h-5 sm:w-6 sm:h-6 object-cover transition-all duration-300 group-hover:brightness-0 group-hover:saturate-100 group-hover:invert"/>
                    ) : (
                      it.icon
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#091d37] font-black text-base sm:text-lg uppercase tracking-tight leading-tight group-hover:text-[#091d37] transition-colors duration-300">
                      {it.title}
                    </h3>
                    <p 
                      className="text-slate-400 text-sm mt-1.5 leading-relaxed lg:max-h-0 lg:overflow-hidden lg:group-hover:max-h-20 transition-all duration-500 ease-out"
                      dangerouslySetInnerHTML={{ __html: unescapeHTML(it.desc) }}
                    />
                  </div>

                  {/* Arrow */}
                  <div className={`shrink-0 w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-slate-200 group-hover:border-[#00C4B4] group-hover:bg-[#00C4B4] flex items-center justify-center transition-all duration-300 ${locale === 'ar' ? 'mr-auto' : 'ml-auto'}`}>
                    <svg 
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-300 group-hover:text-white transition-all duration-300 ${
                        locale === 'ar' 
                          ? 'group-hover:-translate-x-0.5 rotate-180' 
                          : 'group-hover:translate-x-0.5'
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right — Sticky image panel */}
          <div className="benefit-img hidden lg:block sticky top-24">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-200" style={{ aspectRatio: "3/4" }}>
              <Image
                src={mainImage}
                alt="BZNX Benefits"
                fill
                sizes="380px"
                className="object-cover"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#091d37]/60 via-transparent to-transparent" />

              {/* Bottom badge */}
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 rounded-full bg-[#00C4B4] animate-pulse" />
                    <span className="text-white/60 text-[10px] font-bold tracking-[0.2em] uppercase">
                      {locale === 'ar' ? 'الشركات النشطة' : 'Active Businesses'}
                    </span>
                  </div>
                  <div className="text-white font-black text-3xl tracking-tighter">
                    {locale === 'ar' ? '500+' : '500+'}
                  </div>
                  <div className="text-white/40 text-xs mt-1">
                    {locale === 'ar' ? 'تم إطلاقها بنجاح في المملكة العربية السعودية' : 'Successfully launched in Saudi Arabia'}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
