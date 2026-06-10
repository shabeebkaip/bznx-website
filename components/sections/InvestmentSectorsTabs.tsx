"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import SplitReveal from "@/components/ui/SplitReveal";

type Sector = { title: string; desc: string };

export default function InvestmentSectorsTabs({ locale }: { locale: string }) {
  const t = useTranslations("investment");
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const sectors = t.raw("sectors") as Sector[];

  const icons = useMemo(
    () => [
      // Real Estate
      <svg key={0} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M3 7l9-4 9 4v14H3V7zM9 21V12h6v9"/></svg>,
      // Education
      <svg key={1} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L2 8l10 5 10-5-10-5zM2 13l10 5 10-5M2 18l10 5 10-5"/></svg>,
      // Government
      <svg key={2} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="10" width="18" height="11" rx="1"/><path d="M3 10l9-7 9 7M7 21V14h4v7M13 21V14h4v7"/></svg>,
      // Healthcare
      <svg key={3} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2zM12 8v8M8 12h8"/></svg>,
    ],
    []
  );
  const accents = useMemo(() => ["#00C4B4", "#C8A24A", "#00C4B4", "#C8A24A"], []);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current?.querySelectorAll(".is-anim") || [],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!panelRef.current) return;
    gsap.fromTo(panelRef.current, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" });
  }, [active]);

  const current = sectors[active] ?? sectors[0];
  const accent = accents[active % accents.length];

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden" style={{ background: "#F0F4FB" }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(26,43,90,1) 1px, transparent 1px), linear-gradient(90deg, rgba(26,43,90,1) 1px, transparent 1px)", backgroundSize: "70px 70px" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 is-anim">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6" style={{ background: "rgba(0,196,180,0.1)", color: "#00C4B4", border: "1px solid rgba(0,196,180,0.25)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#00C4B4" }} />
            {t("badge")}
          </span>
          <SplitReveal as="h2" className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4" style={{ color: "#1A2B5A", letterSpacing: "-0.02em" }}>
            {t("title")}
          </SplitReveal>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">{t("sub")}</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Tabs row / column */}
          <div className="lg:col-span-5 is-anim">
            <div className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden">
              {sectors.map((s, i) => {
                const isActive = i === active;
                const a = accents[i % accents.length];
                return (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => setActive(i)}
                    className={`w-full px-6 py-5 flex items-center gap-4 transition-colors ${locale === "ar" ? "flex-row-reverse text-right" : "text-left"}`}
                    style={{
                      background: isActive ? `${a}10` : "transparent",
                      borderBottom: i < sectors.length - 1 ? "1px solid #F1F5F9" : undefined,
                    }}
                  >
                    <span className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${a}14`, border: `1px solid ${a}24`, color: a }}>
                      <span className="w-6 h-6">{icons[i] ?? icons[0]}</span>
                    </span>
                    <span className="flex-1">
                      <span className="block font-extrabold" style={{ color: "#1A2B5A" }}>
                        {s.title}
                      </span>
                      <span className="block text-xs mt-1 text-slate-500">
                        {locale === "ar" ? "تفاصيل وعائد مستهدف" : "Details + target return"}
                      </span>
                    </span>
                    <span className="text-slate-400 text-sm">{locale === "ar" ? "←" : "→"}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-7 is-anim">
            <div
              ref={panelRef}
              className="rounded-3xl p-8 md:p-10 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #060d1f 0%, #0d1a38 55%, #1A2B5A 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: `0 0 70px ${accent}14`,
              }}
            >
              <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "70px 70px" }} />
              <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)` }} />

              <div className={locale === "ar" ? "text-right" : "text-left"}>
                <div className="text-white/55 text-xs tracking-widest uppercase font-semibold mb-4">
                  {locale === "ar" ? "قطاع استثماري" : "Investment Sector"}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-snug">{current?.title}</h3>
                <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">{current?.desc}</p>

                <div className={`flex flex-wrap gap-3 ${locale === "ar" ? "justify-end" : "justify-start"}`}>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: `${accent}1A`, border: `1px solid ${accent}30`, color: accent }}>
                    <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
                    {locale === "ar" ? "عائد مستهدف: 18–24%" : "Target IRR: 18–24%"}
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.75)" }}>
                    {locale === "ar" ? "أفق: 3–5 سنوات" : "Horizon: 3–5 years"}
                  </span>
                </div>

                <div className="mt-10">
                  <Link
                    href={`/${locale}/investment`}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all hover:scale-105"
                    style={{ background: "linear-gradient(135deg, #00C4B4, #00A899)", color: "white", boxShadow: "0 0 26px rgba(0,196,180,0.32)" }}
                  >
                    {t("cta")}
                    <span>{locale === "ar" ? "←" : "→"}</span>
                  </Link>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-px opacity-80" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

