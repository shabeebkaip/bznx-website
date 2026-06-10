"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitReveal from "@/components/ui/SplitReveal";

export default function InvestmentNextStepsSection({ locale }: { locale: string }) {
  const t = useTranslations("investmentNextSteps");
  const rootRef = useRef<HTMLElement>(null);

  const items = t.raw("items") as { title: string; desc: string }[];

  useEffect(() => {
    if (!rootRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current?.querySelectorAll(":scope .ns-head > *") ?? [],
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 82%" },
        }
      );

      gsap.fromTo(
        rootRef.current?.querySelectorAll(":scope .ns-item") ?? [],
        { y: 50, opacity: 0, scale: 0.95, rotationX: -12 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #060d1f 0%, #0d1a38 55%, #1e3370 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(0,196,180,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,196,180,1) 1px, transparent 1px)", backgroundSize: "70px 70px" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 15% 40%, rgba(0,196,180,0.10) 0%, transparent 60%), radial-gradient(circle at 85% 60%, rgba(200,162,74,0.08) 0%, transparent 60%)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="ns-head text-center mb-14">
          <SplitReveal as="h2" className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
            {t("title")}
          </SplitReveal>
          <p className="text-white/60 text-lg max-w-3xl mx-auto">{t("sub")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" style={{ perspective: "1200px" }}>
          {items.map((it, i) => {
            const accent = i % 2 === 0 ? "#00C4B4" : "#C8A24A";
            return (
              <div
                key={`${it.title}-${i}`}
                className="ns-item group rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = `${accent}55`;
                  el.style.background = `${accent}12`;
                  el.style.boxShadow = `0 0 28px ${accent}18`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(255,255,255,0.10)";
                  el.style.background = "rgba(255,255,255,0.05)";
                  el.style.boxShadow = "none";
                }}
              >
                <div className="absolute inset-0 rounded-2xl pointer-events-none" />
                <div className={`flex items-start gap-4 ${locale === "ar" ? "flex-row-reverse text-right" : "text-left"}`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0" style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}40`, fontFamily: "monospace" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base mb-2">{it.title}</h3>
                    <p className="text-white/55 text-sm leading-relaxed">{it.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-white transition-all hover:scale-105 neon-breathe"
            style={{ background: "linear-gradient(135deg, #00C4B4, #00A899)", boxShadow: "0 0 28px rgba(0,196,180,0.35)" }}
          >
            {t("cta")}
            <span>{locale === "ar" ? "←" : "→"}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

