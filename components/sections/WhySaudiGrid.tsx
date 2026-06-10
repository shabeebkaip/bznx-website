"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { unescapeHTML } from "@/lib/utils";

const ICONS = ["🌍", "💰", "📍", "🏗️", "🏢", "🚀"];



interface WhySaudiPoint {
  topHeading?: string;
  title: string;
  description: string;
  image?: any;
  stat1Heading?: string;
  stat1Subheading?: string;
  stat2Heading?: string;
  stat2Subheading?: string;
}

export default function WhySaudiGrid({ data }: { data?: any }) {
  const t = useTranslations("whySaudiGrid");
  const locale = useLocale();
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const getVal = (field: any) => {
    if (!field) return "";
    return typeof field === "string" ? field : field[locale] || field["en"] || "";
  };


  const badge = getVal(data?.badge) || t("badge");
  const title = getVal(data?.title) || `${t("title1")} <span style="color: #00C4B4">${t("title2")}</span>`;
  const sub = getVal(data?.description) || t("sub");
  
  const staticItems = t.raw("items") as { title: string; desc: string }[];
  const cmsItems = (data?.points || []).map((p: WhySaudiPoint) => ({
    topHeading: getVal(p.topHeading),
    title: getVal(p.title),
    desc: getVal(p.description),
    image: typeof p.image === 'string' ? p.image : (p.image?.url || ""),
    stat1: { h: getVal(p.stat1Heading), s: getVal(p.stat1Subheading) },
    stat2: { h: getVal(p.stat2Heading), s: getVal(p.stat2Subheading) }
  }));

  const items = cmsItems.length > 0 ? cmsItems : staticItems.map(item => ({
    ...item,
    image: "",
    stat1: { h: "", s: "" },
    stat2: { h: "", s: "" }
  }));

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(".why-card", { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
      });
      gsap.fromTo(".why-hero-img", { scale: 1.08, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 1.2, ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C4B4]/10 border border-[#00C4B4]/25 text-[#00C4B4] text-[10px] font-bold tracking-[0.25em] uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C4B4] animate-pulse" />
              {badge}
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black text-[#091d37] uppercase tracking-tighter leading-[1.0]"
              dangerouslySetInnerHTML={{ __html: unescapeHTML(title) }}
            />
          </div>
          <div className="text-slate-400 text-sm max-w-xs leading-relaxed lg:text-right font-medium">
            <span dangerouslySetInnerHTML={{ __html: unescapeHTML(sub) }} />
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* LEFT — Large photo hero */}
        {items[0] && (
          <div className="why-hero-img lg:col-span-2 relative rounded-3xl overflow-hidden shadow-2xl min-h-[300px] sm:min-h-[440px]">
            <Image
              src={items[0].image || "/whySaudi/Saudi-Western-Business-Partnership-Handshake-in-Riyadh.webp"}
              alt={items[0].title}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
            {/* Gradient overlay from bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#091d37]/80 via-[#091d37]/20 to-transparent" />

            {/* Floating stat chips */}
            <div className="absolute top-6 left-6 flex gap-3">
            {(items[0].stat1.h || items[0].stat1.s) && (
              <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-3">
                <div className="text-white font-black text-xl leading-none">{items[0].stat1.h || (locale === 'ar' ? "١.٥ تريليون $" : "$1.5T")}</div>
                <div className="text-white/60 text-[10px] uppercase tracking-wider mt-0.5">{items[0].stat1.s || (locale === 'ar' ? "مشاريع كبرى" : "Mega-Projects")}</div>
              </div>
            )}
            {(items[0].stat2.h || items[0].stat2.s) && (
              <div className="bg-[#00C4B4]/20 backdrop-blur-md border border-[#00C4B4]/35 rounded-2xl px-4 py-3">
                <div className="text-[#00C4B4] font-black text-xl leading-none">{items[0].stat2.h || (locale === 'ar' ? "#١" : "#1")}</div>
                <div className="text-white/60 text-[10px] uppercase tracking-wider mt-0.5">{items[0].stat2.s || (locale === 'ar' ? "اقتصاد الشرق الأوسط" : "MENA Economy")}</div>
              </div>
            )}
            </div>

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-[#00C4B4] text-[10px] font-bold tracking-[0.25em] uppercase mb-2">01</p>
              <h3 className="text-white font-black text-2xl uppercase tracking-tight">{items[0].title}</h3>
              <p className="text-white/60 text-sm mt-2 leading-relaxed max-w-lg"
                dangerouslySetInnerHTML={{ __html: unescapeHTML(items[0].desc) }}
              />
            </div>
          </div>
        )}

          {/* RIGHT COLUMN — 2 stacked cards */}
          <div className="flex flex-col gap-5">
            {/* Aerial Riyadh photo card */}
          {items[1] && (
            <div className="why-card relative rounded-3xl overflow-hidden flex-1 shadow-lg" style={{ minHeight: 200 }}>
              <Image
                src={items[1].image || "/whySaudi/1149336-482084725.jpg"}
                alt="Riyadh skyline"
                fill
                className="object-cover object-center"
                sizes="33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#091d37]/85 via-[#091d37]/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-[#00C4B4] text-[10px] font-bold tracking-[0.25em] uppercase mb-1.5">02</p>
                <h3 className="text-white font-black text-base uppercase tracking-tight leading-snug">{items[1].title}</h3>
                <p 
                  className="text-white/55 text-xs mt-1 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: unescapeHTML(items[1].desc) }}
                />
              </div>
            </div>
          )}

            {/* Teal stat card */}
          {items[2] && (
            <div className="why-card rounded-3xl flex-1 flex flex-col justify-between p-7 bg-gradient-to-br from-[#00C4B4] to-[#0891b2] shadow-lg shadow-[#00C4B4]/20" style={{ minHeight: 180 }}>
              <div className="flex justify-between items-start">
                  <div className="text-white/20 font-black text-6xl leading-none tracking-tighter select-none">03</div>
                  {items[2].stat1.h && (
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-1.5 text-right">
                        <div className="text-white font-black text-sm">{items[2].stat1.h}</div>
                        <div className="text-white/60 text-[8px] uppercase tracking-wider">{items[2].stat1.s}</div>
                    </div>
                  )}
              </div>
              <div>
                <h3 className="text-white font-black text-lg uppercase tracking-tight leading-snug">{items[2].title}</h3>
                <p 
                  className="text-white/70 text-sm mt-2 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: unescapeHTML(items[2].desc) }}
                />
              </div>
            </div>
          )}
          </div>

          {/* BOTTOM ROW — 3 equal feature cards */}
          {items.slice(3).map((item: any, i: number) => (
            <div
              key={i + 3}
              className="why-card group bg-[#f8fafc] hover:bg-white rounded-3xl border border-slate-100 hover:border-[#00C4B4]/30 hover:shadow-2xl hover:shadow-[#00C4B4]/8 transition-all duration-300 p-7 flex flex-col justify-between min-h-[240px]"
            >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-2xl bg-[#00C4B4]/10 border border-[#00C4B4]/20 flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg">{ICONS[i + 3] || "🏢"}</span>
                  )}
                </div>
                <span className="text-slate-200 font-black text-4xl tracking-tighter select-none group-hover:text-[#00C4B4]/15 transition-colors duration-300">
                  0{i + 4}
                </span>
              </div>
              {item.topHeading && (
                <div className="text-xl font-black text-[#00C4B4] mb-1">{item.topHeading}</div>
              )}
              <h3 className="text-[#091d37] font-black text-base uppercase tracking-tight leading-snug mb-2">{item.title}</h3>
              <p 
                className="text-slate-400 text-sm leading-relaxed mb-4"
                dangerouslySetInnerHTML={{ __html: unescapeHTML(item.desc) }}
              />
            </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
