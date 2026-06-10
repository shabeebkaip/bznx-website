"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import SplitReveal from "@/components/ui/SplitReveal";

interface RegistrationProcessProps {
  locale: string;
}

const PHASE_COLORS = ["#00C4B4", "#C8A24A", "#1A2B5A"];
const PHASE_GLOWS  = [
  "rgba(0,196,180,0.15)",
  "rgba(200,162,74,0.12)",
  "rgba(26,43,90,0.15)",
];

export default function RegistrationProcess({ locale }: RegistrationProcessProps) {
  const t          = useTranslations("registrationProcess");
  const sectionRef = useRef<HTMLDivElement>(null);
  const phaseRefs  = useRef<(HTMLDivElement | null)[]>([]);

  const phases  = t.raw("phases")  as { num: string; label: string; title: string; time: string; steps: string[] }[];
  const payment = t.raw("payment") as { title: string; terms: { label: string; value: string }[]; note: string; totalTime: string };

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        phaseRefs.current.filter((el): el is HTMLDivElement => el !== null),
        { x: locale === "ar" ? 60 : -60, opacity: 0, rotationY: locale === "ar" ? -15 : 15 },
        {
          x: 0, opacity: 1, rotationY: 0,
          duration: 0.85,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        }
      );

      gsap.fromTo(
        ".payment-card",
        { scale: 0.88, opacity: 0 },
        {
          scale: 1, opacity: 1,
          duration: 0.8,
          ease: "back.out(1.5)",
          scrollTrigger: { trigger: ".payment-card", start: "top 85%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [locale]);

  return (
    <section
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #05101f 0%, #0d1a38 50%, #111e45 100%)" }}
    >
      {/* Mode 2 ambient */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(0,196,180,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,196,180,1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(0,196,180,0.05) 0%, transparent 70%)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <SplitReveal as="h2" className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
            {t("title")}
          </SplitReveal>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">{t("sub")}</p>
        </div>

        {/* Phases grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12" style={{ perspective: "1100px" }}>
          {phases.map((phase, i) => (
            <div
              key={i}
              ref={(el) => { phaseRefs.current[i] = el; }}
              className="group relative rounded-2xl p-6 overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${PHASE_COLORS[i]}35`,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow: `0 0 30px ${PHASE_GLOWS[i]}`,
              }}
            >
              {/* Scan line */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none" />

              {/* Corner glow */}
              <div
                className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `radial-gradient(circle at top right, ${PHASE_GLOWS[i]} 0%, transparent 70%)` }}
              />

              {/* Phase badge */}
              <div className={`flex items-center gap-3 mb-5 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-extrabold shrink-0"
                  style={{ background: `${PHASE_COLORS[i]}22`, border: `1px solid ${PHASE_COLORS[i]}44`, color: PHASE_COLORS[i], fontFamily: "monospace" }}
                >
                  {phase.num}
                </div>
                <div className={locale === "ar" ? "text-right" : "text-left"}>
                  <div className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: PHASE_COLORS[i] }}>{phase.label}</div>
                  <h3 className="font-bold text-white text-base">{phase.title}</h3>
                </div>
              </div>

              {/* Steps */}
              <ul className={`space-y-2.5 mb-5 ${locale === "ar" ? "text-right" : "text-left"}`}>
                {phase.steps.map((step, j) => (
                  <li key={j} className={`flex items-start gap-2.5 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${PHASE_COLORS[i]}22` }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke={PHASE_COLORS[i]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-white/65 text-sm leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment terms card */}
        <div
          className="payment-card relative rounded-3xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(200,162,74,0.25)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 40px rgba(200,162,74,0.08)",
          }}
        >
          <div className="absolute inset-0 rounded-3xl pointer-events-none" />
          <div className="relative p-8 md:p-10">
            <div className={`flex flex-col md:flex-row gap-8 items-start ${locale === "ar" ? "md:flex-row-reverse" : ""}`}>
              {/* Payment breakdown */}
              <div className="flex-1">
                <h3 className={`font-bold text-white text-xl mb-6 ${locale === "ar" ? "text-right" : "text-left"}`} style={{ color: "#C8A24A" }}>
                  {payment.title}
                </h3>
                <div className="space-y-4">
                  {payment.terms.map((term, i) => (
                    <div key={i} className={`flex items-center justify-between gap-4 pb-4 ${i < payment.terms.length - 1 ? "border-b" : ""}`} style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <span className="text-white/60 text-sm">{term.label}</span>
                      <span className="font-extrabold text-xl tabular-nums" style={{ color: "#C8A24A", textShadow: "0 0 12px rgba(200,162,74,0.4)" }}>{term.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total time + note */}
              <div className="md:w-64 shrink-0">
                <div
                  className="rounded-2xl p-6 text-center relative overflow-hidden"
                  style={{ background: "rgba(0,196,180,0.08)", border: "1px solid rgba(0,196,180,0.25)" }}
                >
                  <div className="absolute inset-0 rounded-2xl pointer-events-none" />
                  <div className="relative z-10">
                    <div className="text-white/50 text-xs tracking-widest uppercase mb-2">Total Timeframe</div>
                    <div className="text-3xl font-extrabold mb-1" style={{ color: "#00C4B4", textShadow: "0 0 16px rgba(0,196,180,0.5)" }}>
                      {payment.totalTime}
                    </div>
                    <div className="text-white/40 text-xs mt-4 leading-relaxed">{payment.note}</div>
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
