"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import SplitReveal from "@/components/ui/SplitReveal";

interface AboutPreviewProps {
  locale: string;
}

export default function AboutPreview({ locale }: AboutPreviewProps) {
  const t          = useTranslations("aboutPreview");
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const cardsRef   = useRef<HTMLDivElement>(null);
  const cardEls    = useRef<(HTMLDivElement | null)[]>([]);
  const glow1      = useRef<HTMLDivElement>(null);
  const glow2      = useRef<HTMLDivElement>(null);

  // ─── Mode 1: slide-in with rotationY ────────────────────────
  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { x: locale === "ar" ? 70 : -70, opacity: 0, rotationY: locale === "ar" ? 15 : -15 },
        {
          x: 0, opacity: 1, rotationY: 0,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
      gsap.fromTo(
        cardsRef.current,
        { x: locale === "ar" ? -70 : 70, opacity: 0, rotationY: locale === "ar" ? -15 : 15 },
        {
          x: 0, opacity: 1, rotationY: 0,
          duration: 1.0,
          ease: "power3.out",
          delay: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );

      // Mode 1: clip-path reveal on each card
      gsap.fromTo(
        cardEls.current,
        { clipPath: "inset(0 100% 0 0)", opacity: 0 },
        {
          clipPath: "inset(0 0% 0 0)", opacity: 1,
          duration: 0.75,
          ease: "power2.inOut",
          stagger: 0.2,
          scrollTrigger: { trigger: cardsRef.current, start: "top 78%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [locale]);

  // ─── Mode 3: card hover tilt ─────────────────────────────────
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const cleanups: Array<() => void> = [];

    cardEls.current.forEach((el) => {
      if (!el) return;
      const rxTo = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power2.out" });
      const ryTo = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power2.out" });
      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        rxTo(((e.clientX - r.left) / r.width  - 0.5) * 12);
        ryTo(((e.clientY - r.top)  / r.height - 0.5) * -8);
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

  // ─── Parallax depth on decorative elements ────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const scrubCfg = { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true };
    if (glow1.current) gsap.to(glow1.current, { yPercent: -35, ease: "none", scrollTrigger: scrubCfg });
    if (glow2.current) gsap.to(glow2.current, { yPercent: 25,  ease: "none", scrollTrigger: { ...scrubCfg } });
  }, []);

  const cards = [
    { icon: "🎯", label: t("mission"), text: t("missionText") },
    { icon: "🔭", label: t("vision"),  text: t("visionText") },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">

      {/* Mode 2: ambient corner glows — parallax */}
      <div ref={glow1} className="absolute top-0 left-0 w-96 h-96 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,196,180,0.04) 0%, transparent 70%)" }} />
      <div ref={glow2} className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(26,43,90,0.04) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-16 items-center ${locale === "ar" ? "lg:flex-row-reverse" : ""}`}>

          {/* Text */}
          <div ref={textRef} className={locale === "ar" ? "text-right" : "text-left"} style={{ perspective: "900px" }}>
            <SplitReveal
              as="h2"
              className="mt-4 text-4xl sm:text-5xl font-extrabold leading-tight mb-6"
              style={{ color: "#1A2B5A" }}
            >
              {t("title")}
            </SplitReveal>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">{t("body")}</p>
            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center gap-2 font-semibold text-sm transition-all hover:gap-3"
              style={{ color: "#00C4B4" }}
            >
              {t("learnMore")}
              <span>{locale === "ar" ? "←" : "→"}</span>
            </Link>
          </div>

          {/* Cards */}
          <div ref={cardsRef} className="flex flex-col gap-6" style={{ perspective: "900px" }}>
            {cards.map((card, i) => (
              <div
                key={card.label}
                ref={(el) => { cardEls.current[i] = el; }}
                className="group p-6 rounded-2xl border relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  borderColor: "#E8EDF7",
                  background: "#F8F9FC",
                  transformStyle: "preserve-3d",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "rgba(0,196,180,0.3)";
                  el.style.boxShadow = "0 8px 28px rgba(0,196,180,0.1), 0 0 0 1px rgba(0,196,180,0.08)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "#E8EDF7";
                  el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
                }}
              >
                {/* Mode 2: holographic shimmer strip */}
                <div
                  className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(90deg, transparent, #00C4B4, #C8A24A, #00C4B4, transparent)",
                    backgroundSize: "200% auto",
                    animation: "shimmer-text 2.5s linear infinite",
                  }}
                />

                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(0,196,180,0.3)]"
                    style={{ background: "rgba(26,43,90,0.06)" }}
                  >
                    {card.icon}
                  </div>
                  <div className={locale === "ar" ? "text-right" : "text-left"}>
                    <div className="font-bold text-base mb-2" style={{ color: "#1A2B5A" }}>
                      {card.label}
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">{card.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
