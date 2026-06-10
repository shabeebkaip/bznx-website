"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import SplitReveal from "@/components/ui/SplitReveal";

interface InvestmentSectorsProps {
  locale: string;
  showCta?: boolean;
}

const SECTOR_ICONS = [
  // Real Estate
  <svg key={0} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M3 7l9-4 9 4v14H3V7zM9 21V12h6v9"/></svg>,
  // Education
  <svg key={1} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L2 8l10 5 10-5-10-5zM2 13l10 5 10-5M2 18l10 5 10-5"/></svg>,
  // Government
  <svg key={2} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="10" width="18" height="11" rx="1"/><path d="M3 10l9-7 9 7M7 21V14h4v7M13 21V14h4v7"/></svg>,
  // Healthcare
  <svg key={3} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2zM12 8v8M8 12h8"/></svg>,
];

const SECTOR_COLORS = ["#00C4B4", "#C8A24A", "#00C4B4", "#C8A24A"];

export default function InvestmentSectors({ locale, showCta = true }: InvestmentSectorsProps) {
  const t          = useTranslations("investment");
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);

  const sectors = t.raw("sectors") as { title: string; desc: string }[];

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRefs.current,
        { y: 60, opacity: 0, scale: 0.9, rotationX: -20 },
        {
          y: 0, opacity: 1, scale: 1, rotationX: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Mode 3: tilt
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const cleanups: Array<() => void> = [];
    cardRefs.current.forEach((el) => {
      if (!el) return;
      const rxTo = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power2.out" });
      const ryTo = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power2.out" });
      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        rxTo(((e.clientX - r.left) / r.width  - 0.5) * 16);
        ryTo(((e.clientY - r.top)  / r.height - 0.5) * -12);
      };
      const onLeave = () => { rxTo(0); ryTo(0); };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
      style={{ background: "#F0F4FB" }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(26,43,90,1) 1px, transparent 1px), linear-gradient(90deg, rgba(26,43,90,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6" style={{ background: "rgba(0,196,180,0.1)", color: "#00C4B4", border: "1px solid rgba(0,196,180,0.25)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#00C4B4" }} />
            {t("badge")}
          </span>
          <SplitReveal as="h2" className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4" style={{ color: "#1A2B5A", letterSpacing: "-0.02em" }}>
            {t("title")}
          </SplitReveal>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">{t("sub")}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6" style={{ perspective: "1100px" }}>
          {sectors.map((sector, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="group relative rounded-2xl p-7 overflow-hidden cursor-default"
              style={{
                background: i % 2 === 0
                  ? "linear-gradient(135deg, #060d1f 0%, #0d1a38 100%)"
                  : "linear-gradient(135deg, #1A2B5A 0%, #243370 100%)",
                border: `1px solid ${SECTOR_COLORS[i]}25`,
                transformStyle: "preserve-3d",
                boxShadow: `0 0 30px ${SECTOR_COLORS[i]}0D`,
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = `${SECTOR_COLORS[i]}50`;
                el.style.boxShadow = `0 0 40px ${SECTOR_COLORS[i]}20, 0 16px 40px rgba(0,0,0,0.3)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = `${SECTOR_COLORS[i]}25`;
                el.style.boxShadow = `0 0 30px ${SECTOR_COLORS[i]}0D`;
              }}
            >
              <div className="absolute inset-0 rounded-2xl pointer-events-none" />
              <div
                className="absolute top-0 right-0 w-40 h-40 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `radial-gradient(circle at top right, ${SECTOR_COLORS[i]}18 0%, transparent 70%)` }}
              />

              <div className={`flex items-start gap-5 relative z-10 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${SECTOR_COLORS[i]}20`, border: `1px solid ${SECTOR_COLORS[i]}40`, color: SECTOR_COLORS[i], boxShadow: `0 0 0 0 ${SECTOR_COLORS[i]}40` }}
                >
                  <span className="w-7 h-7">{SECTOR_ICONS[i]}</span>
                </div>

                <div className={locale === "ar" ? "text-right" : "text-left"}>
                  <h3 className="font-bold text-white text-xl mb-3 leading-snug group-hover:text-white transition-colors">{sector.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{sector.desc}</p>

                  {/* IRR badge */}
                  <div
                    className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{ background: `${SECTOR_COLORS[i]}15`, color: SECTOR_COLORS[i], border: `1px solid ${SECTOR_COLORS[i]}35` }}
                  >
                    <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: SECTOR_COLORS[i] }} />
                    Target IRR: 18–24%
                  </div>
                </div>
              </div>

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${SECTOR_COLORS[i]}, transparent)` }}
              />
            </div>
          ))}
        </div>

        {showCta && (
          <div className="mt-12 text-center">
            <div className="relative inline-block group">
              <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: "rgba(0,196,180,0.15)", filter: "blur(12px)", animation: "pulse-ring 2.5s ease-out infinite" }} />
              <Link
                href={`/${locale}/services`}
                className="relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-sm transition-all hover:scale-105 neon-breathe"
                style={{
                  background: "linear-gradient(135deg, rgba(0,196,180,0.18), rgba(0,196,180,0.06))",
                  border: "1px solid rgba(0,196,180,0.4)",
                  color: "#00C4B4",
                }}
              >
                {t("cta")}
                <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(0,196,180,0.2)", border: "1px solid rgba(0,196,180,0.4)" }}>
                  {locale === "ar" ? "←" : "→"}
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
