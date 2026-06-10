"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building2, TrendingUp, Users, Globe, ArrowRight } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Link from "next/link";
import { useLocale } from "next-intl";
import { unescapeHTML } from "@/lib/utils";

const STATS_DEFAULTS = [
  { value: 1100, suffix: "B+", prefix: "$", label: "Saudi GDP",           description: "World's 18th largest economy"    },
  { value: 5,    suffix: "T",  prefix: "$", label: "Vision 2030 Target",  description: "Total committed capital"         },
  { value: 63,   suffix: "%",  prefix: "",  label: "Youth under 35",      description: "Fastest-growing consumer market" },
  { value: 1500, suffix: "+",  prefix: "",  label: "Multinationals Licensed", description: "In 2023 alone via MISA"      },
];

const PILLARS_DEFAULTS = [
  {
    id: "giga", icon: Building2, label: "Giga-Projects",
    headline: "$500B+", subhead: "in active mega-projects",
    color: "#00C4B4",
    items: ["NEOM — $500B futuristic smart city", "Red Sea Project — world-class luxury tourism", "Qiddiya — $8B entertainment capital", "KAFD — global finance & business hub"],
    insight: "5 giga-projects running simultaneously — unprecedented in history",
  },
  {
    id: "reform", icon: TrendingUp, label: "Economic Reform",
    headline: "20% YoY", subhead: "FDI growth, year-on-year",
    color: "#0891b2",
    items: ["Non-oil GDP target: 50% by 2030", "FDI up 20% YoY — record-breaking", "MISA fast-track approvals in 45 days", "100% foreign ownership via MISA License"],
    insight: "Fastest regulatory reform pace of any G20 economy",
  },
  {
    id: "workforce", icon: Users, label: "Workforce",
    headline: "1M+", subhead: "new jobs created",
    color: "#7c3aed",
    items: ["1M+ new private sector jobs created", "Women workforce participation up to 30%+", "World-class international talent attraction", "Saudization driving local talent pipeline"],
    insight: "63% of Saudi population is under 35 — enormous consumer potential",
  },
  {
    id: "global", icon: Globe, label: "Global Hub",
    headline: "120M", subhead: "passengers/yr — new Riyadh Airport",
    color: "#d97706",
    items: ["New King Salman Airport — 120M pax/year", "Saudi Vision Fund — $700B+ global investments", "G20 permanent member with strategic influence", "Arab world's largest and most stable economy"],
    insight: "Saudi Arabia sits at the crossroads of Europe, Asia & Africa",
  },
];

interface SaudiStat {
  value: number;
  prefix: string;
  suffix: string;
  label: string;
  description: string;
}

interface SaudiPillar {
  id: string;
  icon?: any;
  image: string;
  label: string;
  headline: string;
  subhead: string;
  color: string;
  items: string[];
  insight: string;
}

const INTERVAL = 4000;

export default function SaudiOpportunity({ data }: { data?: any }) {
  const locale = useLocale();
  const isArabic = locale === "ar";
  
  const getVal = (field: any) => {
    if (!field) return "";
    return typeof field === "string" ? field : field[locale] || field["en"] || "";
  };


  const badge = getVal(data?.badge) || "Vision 2030";
  const title = getVal(data?.title) || "The Saudi <br /> <span style='color: #00C4B4'>Opportunity</span>";
  const description = getVal(data?.description) || "Saudi Arabia is undergoing an unprecedented transformation under Vision 2030, creating a world-class environment for global business.";
  const ctaText = getVal(data?.ctaText) || "Explore Vision 2030";
  const ctaLink = data?.ctaLink || `/${locale}/services`;

  const stats: SaudiStat[] = (data?.stats || []).length > 0 
    ? data.stats.map((s: any) => {
        const rawValue = getVal(s.value);
        const numericValue = parseFloat(rawValue.replace(/[^0-9.]/g, "")) || 0;
        const prefix = s.prefix || (rawValue.match(/^[^0-9.]+/) || [""])[0];
        const suffix = s.suffix || (rawValue.match(/[^0-9.]+$/) || [""])[0];
        
        return {
          value: numericValue,
          prefix: prefix,
          suffix: suffix,
          label: getVal(s.label),
          description: getVal(s.description)
        };
      })
    : STATS_DEFAULTS;

  const pillars: SaudiPillar[] = (data?.pillars || []).length > 0
    ? data.pillars.map((p: any, idx: number) => ({
        id: p._id || idx.toString(),
        icon: [Building2, TrendingUp, Users, Globe][idx % 4],
        image: typeof p.image === 'string' ? p.image : (p.image?.url || ""),
        label: getVal(p.label),
        headline: getVal(p.heading),
        subhead: getVal(p.subheading),
        color: p.color || "#00C4B4",
        items: p.items || [],
        insight: getVal(p.insight)
      }))
    : PILLARS_DEFAULTS.map((p, idx) => ({
        ...p,
        image: ""
      }));

  const [active, setActive] = useState(0);
  const sectionRef   = useRef<HTMLDivElement>(null);
  const contentRef   = useRef<HTMLDivElement>(null);
  const progressRef  = useRef<HTMLDivElement>(null);
  const timerRef     = useRef<ReturnType<typeof setInterval> | null>(null);

  const switchTo = useCallback((idx: number) => {
    if (!contentRef.current) return;
    gsap.to(contentRef.current, {
      opacity: 0, y: 10, duration: 0.18, ease: "power2.in",
      onComplete: () => {
        setActive(idx);
        gsap.fromTo(contentRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }
        );
      },
    });
    // restart progress bar
    if (progressRef.current) {
      gsap.killTweensOf(progressRef.current);
      gsap.fromTo(progressRef.current, { scaleX: 0 }, { scaleX: 1, duration: INTERVAL / 1000, ease: "none" });
    }
  }, []);

  // Auto-advance
  useEffect(() => {
    timerRef.current = setInterval(() => {
        const next = (active + 1) % pillars.length;
        switchTo(next);
    }, INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [active, pillars.length, switchTo]);

  // Start progress bar
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (progressRef.current) {
      gsap.fromTo(progressRef.current, { scaleX: 0 }, { scaleX: 1, duration: INTERVAL / 1000, ease: "none" });
    }

    const ctx = gsap.context(() => {
        gsap.from(".stat-item", {
          scrollTrigger: { trigger: ".stats-grid", start: "top 85%" },
          y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out"
        });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleClick = (idx: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    switchTo(idx);
  };

  const currentPillar = pillars[active] || pillars[0];
  const PillarIcon = currentPillar.icon;

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-[#f8fafc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
          <div>
            <div className="inline-flex items-center gap-2.5 bg-white border border-red-100 rounded-full px-4 py-2 mb-6 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-red-500 text-[10px] font-bold tracking-[0.25em] uppercase">{badge}</span>
            </div>
            <h2 className="text-[32px] sm:text-5xl lg:text-7xl font-black text-[#091d37] uppercase tracking-tighter leading-[0.92]"
              dangerouslySetInnerHTML={{ __html: unescapeHTML(title) }}
            />
          </div>
          <div className="lg:max-w-sm">
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              <span dangerouslySetInnerHTML={{ __html: unescapeHTML(description) }} />
            </p>
            <Link href={ctaLink} className="inline-flex items-center gap-2 bg-[#091d37] text-white text-xs font-black tracking-[0.15em] uppercase px-6 py-3 rounded-full hover:bg-[#00C4B4] transition-colors duration-300"
            >
              <span className="relative">
                {ctaText}
                <span className="absolute -bottom-1 left-0 w-full h-px bg-[#00C4B4] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 hover:border-[#00C4B4]/30 hover:shadow-lg transition-all duration-300">
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-[#091d37] text-4xl lg:text-5xl font-black tracking-tighter">
                <AnimatedCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} duration={1800} />
              </span>
              </div>
              <p className="text-[#00C4B4] text-[10px] font-bold tracking-[0.15em] uppercase mb-1">{stat.label}</p>
              <p className="text-slate-400 text-[11px] leading-snug"
                dangerouslySetInnerHTML={{ __html: unescapeHTML(stat.description) }}
              />
            </div>
          ))}
        </div>

        {/* ── Auto-rotating explorer ── */}
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden">

          {/* Progress bar — auto-advances */}
          <div className="h-[3px] bg-slate-100 relative">
            <div
              ref={progressRef}
              className="absolute left-0 top-0 h-full origin-left rounded-full"
              style={{ background: currentPillar.color, width: "100%", transformOrigin: "left" }}
            />
          </div>

          <div className="grid lg:grid-cols-[1fr_320px]">

            {/* LEFT — rotating content */}
            <div ref={contentRef} className="p-5 sm:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-100">
              {/* Pillar label */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center overflow-hidden" style={{ background: `${currentPillar.color}18` }}>
                  {currentPillar.image ? (
                    <img src={currentPillar.image} alt="" className="w-5 h-5 object-cover" />
                  ) : (
                    <PillarIcon className="w-5 h-5" style={{ color: currentPillar.color }} />
                  )}
                </div>
                <div>
                  <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-slate-300">Currently Viewing</p>
                  <p className="text-[#091d37] font-black text-sm uppercase tracking-tight">{currentPillar.label}</p>
                </div>
                <div className="ml-auto text-[10px] font-bold text-slate-200 tracking-widest uppercase">
                  {active + 1} / {pillars.length}
                </div>
              </div>

              {/* Headline number */}
              <div className="mb-1">
                <span className="font-black text-[#091d37] leading-none" style={{ fontSize: "clamp(52px, 7vw, 80px)", color: currentPillar.color }}>
                  {currentPillar.headline}
                </span>
              </div>
              <p className="text-slate-400 text-lg font-medium mb-10">{currentPillar.subhead}</p>

              {/* Bullet points — always visible */}
              <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                {currentPillar.items.map((item: any, j: number) => (
                  <li key={j} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${currentPillar.color}18` }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: currentPillar.color }} />
                    </div>
                    <p className="text-[#091d37] text-sm leading-relaxed font-medium">{getVal(item)}</p>
                  </li>
                ))}
              </ul>

              {/* Insight */}
              <div className="rounded-2xl border p-4 flex items-start gap-3" style={{ borderColor: `${currentPillar.color}25`, background: `${currentPillar.color}06` }}>
                <span className="text-lg">💡</span>
                <div>
                    <div 
                        className="text-sm font-medium leading-relaxed" 
                        style={{ color: currentPillar.color }}
                        dangerouslySetInnerHTML={{ __html: unescapeHTML(currentPillar.insight) }}
                    />
                </div>
              </div>
            </div>

            {/* RIGHT — all 4 pillars always visible as selector cards */}
            <div className="flex flex-col divide-y divide-slate-50 bg-slate-50/30">
              {pillars.map((p: any, i: number) => {
                const Icon = p.icon;
                const isActive = active === i;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleClick(i)}
                    className={`flex-1 flex items-center gap-4 px-6 py-5 text-left transition-all duration-300 ${
                      isActive ? "bg-slate-50" : "hover:bg-slate-50/60"
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
                      style={{ background: isActive ? p.color : `${p.color}12` }}
                    >
                      {p.image ? (
                        <img src={p.image} alt="" className={`w-4 h-4 object-cover transition ${isActive ? "invert brightness-0" : "opacity-50"}`} />
                      ) : (
                      <Icon className="w-4 h-4 transition-colors duration-300" style={{ color: isActive ? "white" : p.color }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-black uppercase tracking-tight transition-colors duration-300 ${isActive ? "text-[#091d37]" : "text-slate-400"}`}>
                        {p.label}
                      </p>
                      <p className={`text-xs font-bold transition-colors duration-300 ${isActive ? "text-[#091d37]" : "text-slate-300"}`}>
                        {p.headline}
                      </p>
                    </div>
                  </button>
                );
              })}

              {/* CTA bottom */}
              <div className="p-6">
                <Link
                  href={ctaLink}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-xs font-bold uppercase tracking-widest transition-all duration-300"
                  style={{ background: currentPillar.color }}
                >
                  {locale === 'ar' ? 'ادخل السوق' : 'Enter the Market'} <ArrowRight className={`w-3.5 h-3.5 ${locale === 'ar' ? 'rotate-180' : ''}`} />
                </Link>
              </div>
            </div>

          </div>
        </div>

        <p className="mt-6 text-slate-300 text-[10px] text-center tracking-wider">
          Sources: Saudi Vision 2030 Annual Report · MISA · IMF World Economic Outlook · GASTAT
        </p>

      </div>
    </section>
  );
}
