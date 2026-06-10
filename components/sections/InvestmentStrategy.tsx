"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import SplitReveal from "@/components/ui/SplitReveal";

interface InvestmentStrategyProps {
  locale: string;
}

export default function InvestmentStrategy({ locale }: InvestmentStrategyProps) {
  const t          = useTranslations("investmentStrategy");
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<(HTMLDivElement | null)[]>([]);
  const highlightsT = useTranslations("investmentHighlights");

  const pillars    = t.raw("pillars")    as { num: string; title: string; desc: string }[];
  const highlights = highlightsT.raw("items") as { icon: string; title: string; desc: string }[];

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Timeline line draws in
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, transformOrigin: locale === "ar" ? "right center" : "left center" },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        }
      );

      // Pillars explode in
      gsap.fromTo(
        pillarsRef.current.filter((el): el is HTMLDivElement => el !== null),
        { y: 50, opacity: 0, scale: 0.88 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "back.out(1.5)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );

      // Highlights
      gsap.fromTo(
        ".highlight-item",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".highlights-grid", start: "top 82%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [locale]);

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 left-0 w-96 h-96 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,196,180,0.04) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(26,43,90,0.04) 0%, transparent 70%)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <SplitReveal as="h2" className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4" style={{ color: "#1A2B5A", letterSpacing: "-0.02em" }}>
            {t("title")}
          </SplitReveal>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">{t("sub")}</p>
        </div>

        {/* Timeline */}
        <div className="relative mb-20">
          {/* Connecting line */}
          <div ref={lineRef} className="hidden lg:block absolute top-8 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, rgba(0,196,180,0.5), rgba(200,162,74,0.4), rgba(0,196,180,0.5))", zIndex: 0 }} />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {pillars.map((p, i) => (
              <div
                key={i}
                ref={(el) => { pillarsRef.current[i] = el; }}
                className="group relative"
              >
                {/* Node dot on timeline */}
                <div
                  className="hidden lg:flex w-16 h-16 rounded-full items-center justify-center text-xl font-extrabold mx-auto mb-6 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_24px_rgba(0,196,180,0.4)] relative z-10"
                  style={{
                    background: i % 2 === 0 ? "linear-gradient(135deg, #1A2B5A, #243370)" : "linear-gradient(135deg, #C8A24A, #E0BC6A)",
                    color: "white",
                    fontFamily: "monospace",
                  }}
                >
                  {p.num}
                </div>

                {/* Mobile: show number inline */}
                <div className={`lg:hidden flex items-center gap-3 mb-4 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0"
                    style={{
                      background: i % 2 === 0 ? "#1A2B5A" : "#C8A24A",
                      color: "white",
                      fontFamily: "monospace",
                    }}
                  >
                    {p.num}
                  </div>
                  <div className="h-px flex-1" style={{ background: "rgba(0,196,180,0.3)" }} />
                </div>

                {/* Card */}
                <div
                  className="rounded-2xl p-5 transition-all duration-300 group-hover:-translate-y-1"
                  style={{
                    background: "#F8F9FC",
                    border: "1px solid #E8EDF7",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "rgba(0,196,180,0.35)";
                    el.style.boxShadow = "0 8px 28px rgba(0,196,180,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "#E8EDF7";
                    el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
                  }}
                >
                  <h3 className={`font-bold text-base mb-2 leading-snug ${locale === "ar" ? "text-right" : "text-left"}`} style={{ color: "#1A2B5A" }}>
                    {p.title}
                  </h3>
                  <p className={`text-slate-500 text-sm leading-relaxed ${locale === "ar" ? "text-right" : "text-left"}`}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why WINVENTURES highlights */}
        <div className="highlights-grid">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold" style={{ color: "#1A2B5A" }}>{highlightsT("title")}</h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {highlights.map((h, i) => (
              <div
                key={i}
                className="highlight-item group relative p-6 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1"
                style={{ background: "linear-gradient(135deg, #0d1a38, #1A2B5A)", border: "1px solid rgba(0,196,180,0.15)" }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(0,196,180,0.4)";
                  el.style.boxShadow = "0 0 24px rgba(0,196,180,0.12)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(0,196,180,0.15)";
                  el.style.boxShadow = "none";
                }}
              >
                <div className="absolute inset-0 rounded-2xl pointer-events-none" />
                <div className="text-3xl mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300">{h.icon}</div>
                <h4 className="font-bold text-white text-base mb-2 relative z-10">{h.title}</h4>
                <p className="text-white/55 text-sm leading-relaxed relative z-10">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
