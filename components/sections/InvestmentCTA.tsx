"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import SplitReveal from "@/components/ui/SplitReveal";

interface InvestmentCTAProps {
  locale: string;
}

export default function InvestmentCTA({ locale }: InvestmentCTAProps) {
  const t          = useTranslations("investment");
  const sectionRef = useRef<HTMLDivElement>(null);
  const boxRef     = useRef<HTMLDivElement>(null);
  const ring1Ref   = useRef<HTMLDivElement>(null);
  const ring2Ref   = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const magBtn     = useRef<HTMLDivElement>(null);
  const glowTR     = useRef<HTMLDivElement>(null);
  const glowBL     = useRef<HTMLDivElement>(null);

  const highlights = t.raw("highlights") as { label: string; value: string }[];

  // ─── Mode 1: explosive scale reveal ──────────────────────────
  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Box explodes in from center
      gsap.fromTo(
        boxRef.current,
        { scale: 0.75, opacity: 0, rotationX: 8, y: 40 },
        {
          scale: 1, opacity: 1, rotationX: 0, y: 0,
          duration: 1.1,
          ease: "back.out(1.5)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );

      // Content fades in after box appears
      gsap.fromTo(
        contentRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        }
      );

      // Highlights pop in with stagger
      gsap.fromTo(
        ".inv-item",
        { scale: 0.75, opacity: 0, y: 20 },
        {
          scale: 1, opacity: 1, y: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ─── Mode 2: ambient pulsing rings ────────────────────────────
  useEffect(() => {
    if (!ring1Ref.current || !ring2Ref.current) return;
    gsap.to(ring1Ref.current, { rotation: 360, duration: 20, repeat: -1, ease: "none" });
    gsap.to(ring2Ref.current, { rotation: -360, duration: 28, repeat: -1, ease: "none" });
  }, []);

  // ─── Parallax depth on glow blobs ────────────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const scrub = { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true };
    if (glowTR.current) gsap.to(glowTR.current, { yPercent: -40, ease: "none", scrollTrigger: scrub });
    if (glowBL.current) gsap.to(glowBL.current, { yPercent: 30, ease: "none", scrollTrigger: { ...scrub } });
  }, []);

  // ─── Mode 3: magnetic CTA button ─────────────────────────────
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const el = magBtn.current;
    if (!el) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power2.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power2.out" });
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width  / 2) * 0.3);
      yTo((e.clientY - r.top  - r.height / 2) * 0.3);
    };
    const onLeave = () => { xTo(0); yTo(0); };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">

      {/* Mode 2: ambient bg glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,196,180,0.04) 0%, transparent 70%)", animation: "pulse-ring 5s ease-out infinite" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={boxRef}
          className="rounded-3xl overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg, #060d1f 0%, #0d1a38 55%, #1e3370 100%)",
            perspective: "1000px",
            boxShadow: "0 0 80px rgba(0,196,180,0.12), 0 40px 80px rgba(0,0,0,0.3)",
          }}
        >
          {/* Mode 2: orbital decoration rings inside the box */}
          <div
            ref={ring1Ref}
            className="absolute pointer-events-none"
            style={{
              width: 500,
              height: 500,
              border: "1px solid rgba(0,196,180,0.1)",
              borderRadius: "50%",
              top: "-20%",
              right: "-10%",
            }}
          >
            {[0, 90, 180, 270].map((deg) => (
              <span key={deg} className="absolute w-1.5 h-1.5 rounded-full" style={{ background: "#00C4B4", top: "50%", left: "50%", transformOrigin: "0 0", transform: `rotate(${deg}deg) translateX(248px) translateY(-50%)`, opacity: 0.4, boxShadow: "0 0 5px rgba(0,196,180,0.8)" }} />
            ))}
          </div>
          <div
            ref={ring2Ref}
            className="absolute pointer-events-none"
            style={{
              width: 300,
              height: 300,
              border: "1px dashed rgba(200,162,74,0.18)",
              borderRadius: "50%",
              bottom: "-15%",
              left: "2%",
            }}
          />

          {/* Background glow blobs — parallax */}
          <div ref={glowTR} className="absolute pointer-events-none" style={{ width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,196,180,0.13) 0%, transparent 70%)", top: "-20%", right: "-5%" }} />
          <div ref={glowBL} className="absolute pointer-events-none" style={{ width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,162,74,0.09) 0%, transparent 70%)", bottom: "-10%", left: "5%" }} />

          {/* Mode 1: grid inside box */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(0,196,180,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,196,180,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

          <div ref={contentRef} className="relative p-10 md:p-16">
            <div className="max-w-3xl">
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
                style={{ background: "rgba(200,162,74,0.13)", color: "#C8A24A", border: "1px solid rgba(200,162,74,0.32)", boxShadow: "0 0 16px rgba(200,162,74,0.12)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#C8A24A", boxShadow: "0 0 6px rgba(200,162,74,0.8)" }} />
                {t("badge")}
              </span>

              <SplitReveal
                as="h2"
                className={`text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4 ${locale === "ar" ? "text-right" : "text-left"}`}
              >
                {t("title")}
              </SplitReveal>
              <p className={`text-white/60 text-lg leading-relaxed mb-10 ${locale === "ar" ? "text-right" : "text-left"}`}>
                {t("sub")}
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                {highlights.map((h, i) => (
                  <div
                    key={i}
                    className="inv-item group p-4 rounded-2xl text-center relative overflow-hidden cursor-default transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: "rgba(255,255,255,0.055)",
                      border: "1px solid rgba(255,255,255,0.09)",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.borderColor = "rgba(0,196,180,0.4)";
                      el.style.background  = "rgba(0,196,180,0.08)";
                      el.style.boxShadow   = "0 0 20px rgba(0,196,180,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.borderColor = "rgba(255,255,255,0.09)";
                      el.style.background  = "rgba(255,255,255,0.055)";
                      el.style.boxShadow   = "none";
                    }}
                  >
                    {/* Mode 2: scan line on highlight cards */}
                    <div className="absolute inset-0 rounded-2xl pointer-events-none" />
                    <div className="text-2xl font-extrabold mb-1" style={{ color: "#00C4B4", textShadow: "0 0 12px rgba(0,196,180,0.5)" }}>
                      {h.value}
                    </div>
                    <div className="text-white/50 text-xs leading-snug">{h.label}</div>
                  </div>
                ))}
              </div>

              {/* Mode 3: magnetic CTA */}
              <div ref={magBtn} className="inline-block">
                <Link
                  href={`/${locale}/investment`}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white text-sm transition-colors hover:brightness-110 neon-breathe"
                  style={{
                    background: "linear-gradient(135deg, #00C4B4, #00A899)",
                    boxShadow: "0 0 28px rgba(0,196,180,0.4), 0 0 60px rgba(0,196,180,0.15)",
                  }}
                >
                  {t("cta")}
                  <span>{locale === "ar" ? "←" : "→"}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
