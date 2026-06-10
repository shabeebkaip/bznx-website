"use client";

import { useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { unescapeHTML } from "@/lib/utils";

interface HeroStat {
  value: string;
  label: string;
}

interface HeroBadge {
  text: string;
}

interface HeroProps {
  locale: string;
  data?: any;
  stats?: HeroStat[] | { items: HeroStat[] };
  badges?: HeroBadge[] | { items: HeroBadge[] };
}



export default function Hero({ locale, data, stats, badges }: HeroProps) {
  const t = useTranslations("hero");
  const sectionRef = useRef<HTMLElement>(null);
  const isRTL = locale === 'ar';

  const stripHtml = (html: string) => {
    if (typeof window === 'undefined') return html;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const getVal = (field: any, strip: boolean = false) => {
    let val = "";
    if (typeof field !== 'object' || field === null) {
        val = field || "";
    } else {
        val = field[locale] || field.en || "";
    }
    return strip ? stripHtml(val) : val;
  };

  const displayBadges = useMemo(() => {
    const list = Array.isArray(badges) ? badges : (badges as { items: HeroBadge[] })?.items || [];
    return list.map((b: any) => getVal(b.text, true));
  }, [badges, locale]);

  const displayStats = useMemo(() => {
    const list = Array.isArray(stats) ? stats : (stats as { items: HeroStat[] })?.items || [];
    return list.map((s: any) => ({ 
        value: getVal(s.value, true), 
        label: getVal(s.label, true) 
    }));
  }, [stats, locale]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Ken Burns */
      gsap.fromTo(".hero-img-wrap",
        { scale: 1.08 },
        { scale: 1.0, duration: 10, ease: "power1.out" }
      );

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      /* Edge line draws in */
      tl.fromTo(".hero-edge",
        { scaleY: 0, opacity: 0, transformOrigin: "top" },
        { scaleY: 1, opacity: 1, duration: 1.3, ease: "power3.inOut" },
        0.1
      );

      /* Badge chips */
      tl.fromTo(".hero-badge",
        { x: isRTL ? 20 : -20, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.09, duration: 0.7 },
        0.4
      );

      /* Headline lines */
      tl.fromTo(".hero-line",
        { clipPath: "inset(0 0 110% 0)", y: 20 },
        { clipPath: "inset(0 0 0% 0)", y: 0, stagger: 0.14, duration: 1.1 },
        0.58
      );

      tl.fromTo(".hero-sub",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85 },
        "-=0.5"
      );

      tl.fromTo(".hero-cta-group",
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.72 },
        "-=0.44"
      );

      tl.fromTo(".hero-stat",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.6 },
        "-=0.35"
      );

      tl.fromTo(".hero-float-card",
        { x: isRTL ? -44 : 44, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.1 },
        0.85
      );

/* Float card bob */
      gsap.to(".hero-float-card", {
        y: -12, duration: 3.4,
        ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2,
      });

      /* Scroll indicator pulse */
      gsap.to(".hero-scroll-line", {
        scaleY: 0.4, transformOrigin: "top",
        duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.5,
      });

      /* Pulsing glow ring on CTA */
      gsap.to(".hero-cta-ring", {
        scale: 1.4, opacity: 0,
        duration: 1.8, ease: "power2.out", repeat: -1, delay: 2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [displayBadges, displayStats, isRTL]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] lg:h-screen flex flex-col overflow-hidden lg:overflow-hidden"
      style={{ background: "#040E1A" }}
    >
      {/* ── Background image ──────────────────────────────── */}
      <div className="hero-img-wrap absolute inset-0 z-0" style={{ willChange: "transform" }}>
        <Image
          src={typeof data?.image === 'string' ? data.image : data?.image?.url || "/home/kafd.webp"}
          alt="King Abdullah Financial District, Riyadh"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
          style={{ filter: "brightness(1.05) saturate(1.1) contrast(1.0)" }}
        />
      </div>

      {/* ── Overlays ──────────────────────────────────────── */}
      {/* Primary diagonal — lighter than before so city shows */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: isRTL
            ? "linear-gradient(248deg, rgba(4,14,26,0.92) 0%, rgba(4,14,26,0.82) 22%, rgba(4,14,26,0.55) 40%, rgba(4,14,26,0.25) 60%, transparent 80%)"
            : "linear-gradient(112deg, rgba(4,14,26,0.92) 0%, rgba(4,14,26,0.82) 22%, rgba(4,14,26,0.55) 40%, rgba(4,14,26,0.25) 60%, transparent 80%)",
        }}
      />
      {/* Bottom fade for ticker */}
      <div className="absolute bottom-0 inset-x-0 z-10" style={{ height: "20%", background: "linear-gradient(to top, rgba(4,14,26,0.6), transparent)" }} />
      {/* Top fade for navbar */}
      <div className="absolute top-0 inset-x-0 z-10" style={{ height: "18%", background: "linear-gradient(to bottom, rgba(4,14,26,0.65), transparent)" }} />

      {/* ── Ambient glows — punchy ────────────────────────── */}
      {/* Teal bloom upper-left / upper-right */}
      <div
        className="absolute z-10 pointer-events-none"
        style={{
          top: "-15%",
          ...(isRTL ? { right: "-8%" } : { left: "-8%" }),
          width: "900px", height: "800px",
          background: isRTL
            ? "radial-gradient(ellipse at 75% 30%, rgba(38,208,206,0.13) 0%, transparent 58%)"
            : "radial-gradient(ellipse at 25% 30%, rgba(38,208,206,0.13) 0%, transparent 58%)",
        }}
      />
      {/* Secondary teal mid-left / mid-right */}
      <div
        className="absolute z-10 pointer-events-none"
        style={{
          top: "40%",
          ...(isRTL ? { right: "5%" } : { left: "5%" }),
          width: "500px", height: "400px",
          background: "radial-gradient(ellipse, rgba(38,208,206,0.07) 0%, transparent 65%)",
        }}
      />
      {/* Gold bloom lower-right / lower-left */}
      <div
        className="absolute z-10 pointer-events-none"
        style={{
          bottom: "-5%",
          ...(isRTL ? { left: "5%" } : { right: "5%" }),
          width: "700px", height: "600px",
          background: "radial-gradient(circle, rgba(200,162,74,0.13) 0%, transparent 60%)",
        }}
      />

      {/* ── Subtle grid texture ───────────────────────────── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(38,208,206,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(38,208,206,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(112deg, rgba(0,0,0,0.4) 0%, transparent 55%)",
          WebkitMaskImage: "linear-gradient(112deg, rgba(0,0,0,0.4) 0%, transparent 55%)",
        }}
      />

      {/* ── Diagonal accent edge line ─────────────────────── */}
      <div
        className="hero-edge absolute z-20 pointer-events-none hidden lg:block"
        style={{
          top: 0,
          ...(isRTL
            ? { right: "clamp(360px, 46%, 720px)" }
            : { left: "clamp(360px, 46%, 720px)" }),
          width: "1px",
          height: "100%",
          background:
            "linear-gradient(to bottom, transparent 3%, rgba(38,208,206,0.0) 8%, rgba(38,208,206,0.5) 22%, rgba(38,208,206,0.9) 46%, rgba(200,162,74,0.65) 72%, rgba(200,162,74,0.0) 90%, transparent 100%)",
          transform: isRTL ? "skewX(4deg)" : "skewX(-4deg)",
          boxShadow: "0 0 12px rgba(38,208,206,0.25), 0 0 40px rgba(38,208,206,0.08)",
          filter: "blur(0.3px)",
        }}
      />

      {/* ── Floating insight card ─────────────────────────── */}
      <div
        className="hero-float-card absolute z-30 pointer-events-none hidden xl:flex flex-col gap-2.5"
        style={{
          top: "clamp(140px, 17vh, 220px)",
          ...(isRTL ? { left: "clamp(48px, 5.5vw, 100px)" } : { right: "clamp(48px, 5.5vw, 100px)" }),
          width: 218,
        }}
      >
        {/* Vision 2030 */}
        <div
          style={{
            background: "rgba(4,14,26,0.45)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(38,208,206,0.22)",
            borderRadius: "18px",
            padding: "20px 22px",
            boxShadow: "0 32px 72px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07), 0 0 0 1px rgba(38,208,206,0.06)",
          }}
        >
          <div style={{ fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#26D0CE", marginBottom: "8px", fontWeight: 700 }}>
            {isRTL ? "رؤية السعودية" : "Saudi Vision"}
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 900, color: "#FFFFFF", lineHeight: 1, letterSpacing: "-0.04em" }}>
            2030
          </div>
          <div style={{ fontSize: "0.67rem", color: "rgba(255,255,255,0.45)", marginTop: "5px", lineHeight: 1.5 }}>
            {isRTL ? "1.5 تريليون ريال في\nالمشاريع الكبرى" : "SAR 1.5T in\nMega-Projects"}
          </div>
          <div style={{ marginTop: "12px", height: "1.5px", borderRadius: "9999px", background: "linear-gradient(90deg, #26D0CE 0%, #C8A24A 100%)", opacity: 0.9 }} />
        </div>

        {/* Stat chips row */}
        <div className="flex gap-2">
          {[{ v: "100%", l: isRTL ? "ملكية\nأجنبية" : "Foreign\nOwnership" }, { v: isRTL ? "٤٥ يوماً" : "45d", l: isRTL ? "وقت\nالتأسيس" : "Setup\nTime" }].map(({ v, l }) => (
            <div
              key={v}
              style={{
                flex: 1,
                background: "rgba(4,14,26,0.45)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                padding: "10px 12px",
              }}
            >
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#26D0CE", letterSpacing: "-0.03em", lineHeight: 1, textShadow: "0 0 16px rgba(38,208,206,0.5)" }}>{v}</div>
              <div style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.38)", marginTop: "3px", lineHeight: 1.3, whiteSpace: "pre-line", textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Gold chip */}
        <div
          style={{
            background: "rgba(200,162,74,0.1)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(200,162,74,0.32)",
            borderRadius: "10px",
            padding: "9px 14px",
            display: "flex",
            alignItems: "center",
            gap: "9px",
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8A24A", flexShrink: 0, boxShadow: "0 0 8px rgba(200,162,74,0.9)" }} />
          <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#C8A24A", textTransform: "uppercase", letterSpacing: "0.09em" }}>{isRTL ? "السوق مفتوح الآن" : "Market Open Now"}</span>
        </div>
      </div>

      {/* ── Main content — fills remaining height ─────────── */}
      <div className="relative z-30 flex-1 flex items-center py-16 lg:py-0" style={{ paddingTop: "80px" }}>
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">

          {/* Badge pills */}
          <div className="flex flex-wrap gap-2 mb-5 mt-12 md:mt-0">
            {displayBadges.map((badge: string, idx: number) => (
              <span
                key={idx}
                className="hero-badge inline-flex items-center gap-2 rounded-full font-semibold uppercase"
                style={{
                  background: "rgba(38,208,206,0.08)",
                  border: "1px solid rgba(38,208,206,0.25)",
                  color: "#26D0CE",
                  padding: "5px 13px",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              >
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#26D0CE", flexShrink: 0, boxShadow: "0 0 8px rgba(38,208,206,1)" }} />
                {badge}
              </span>
            ))}
          </div>

          {/* Headline */}
          <div className="mb-5 space-y-0.5">
            <div className={isRTL ? "overflow-visible" : "overflow-hidden leading-none"}>
              <h1 className={`hero-line text-white uppercase ${isRTL ? "font-bold leading-[1.2] tracking-normal text-[1.7rem] sm:text-[2.6rem] md:text-[3.6rem] xl:text-[4.8rem]" : "font-black leading-[0.88] tracking-[-0.035em] text-[2.2rem] sm:text-[3.5rem] md:text-[4.8rem] xl:text-[6.4rem]"}`}>
                {getVal(data?.titleLine1) || "Build. Grow. Scale."}
              </h1>
            </div>
            <div className={isRTL ? "overflow-visible" : "overflow-hidden leading-none"}>
              <h1 className={`hero-line uppercase ${isRTL ? "font-bold leading-[1.2] tracking-normal text-[1.7rem] sm:text-[2.6rem] md:text-[3.6rem] xl:text-[4.8rem]" : "font-black leading-[0.88] tracking-[-0.035em] text-[2.2rem] sm:text-[3.5rem] md:text-[4.8rem] xl:text-[6.4rem]"}`} style={{ color: "rgba(255,255,255,0.55)" }}>
                {getVal(data?.titleLine2) || "Your Business"}
              </h1>
            </div>
            <div className={isRTL ? "overflow-visible" : "overflow-hidden leading-none"}>
              <h1
                className={`hero-line uppercase ${isRTL ? "font-bold leading-[1.2] tracking-normal text-[1.7rem] sm:text-[2.6rem] md:text-[3.6rem] xl:text-[4.8rem]" : "font-black leading-[0.88] tracking-[-0.035em] text-[2.2rem] sm:text-[3.5rem] md:text-[4.8rem] xl:text-[6.4rem]"}`}
                style={{ color: "#26D0CE" }}
              >
                {getVal(data?.titleLine3) || "in Saudi Arabia"}
              </h1>
            </div>
          </div>

          {/* Sub */}
          <div  className="hero-sub text-white/55 text-sm sm:text-base leading-relaxed max-w-md mb-7 font-light ql-editor-view"
            dangerouslySetInnerHTML={{ __html: unescapeHTML(getVal(data?.description) || t("sub")) }}
          />

          {/* CTAs */}
          <div className="hero-cta-group flex flex-wrap items-center gap-3 mb-7">
            {/* Primary CTA with pulse ring */}
            <div className="relative inline-flex">
              <div
                className="hero-cta-ring absolute inset-0 rounded-full pointer-events-none"
                style={{ background: "rgba(38,208,206,0.25)", opacity: 0.6 }}
              />
              <Link
                href={data?.primaryButtonLink || data?.buttonLink || `/${locale}/contact`}
                className="group relative inline-flex items-center gap-2.5 font-bold uppercase tracking-[0.14em] text-sm transition-all duration-300 hover:scale-[1.04] hover:brightness-110 active:scale-[0.97]"
                style={{
                  background: "linear-gradient(135deg, #26D0CE 0%, #1bbfbd 100%)",
                  color: "#040E1A",
                  padding: "14px 32px",
                  borderRadius: "9999px",
                  boxShadow: "0 8px 32px rgba(38,208,206,0.5), 0 2px 8px rgba(38,208,206,0.25), inset 0 1px 0 rgba(255,255,255,0.25)",
                }}
              >
                {getVal(data?.primaryButtonText) || t("cta")}
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${isRTL ? 'group-hover:-translate-x-0.5 scale-x-[-1]' : 'group-hover:translate-x-0.5'}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Secondary CTA */}
            <Link
              href={data?.secondaryButtonLink || data?.buttonLink || `/${locale}/services`}
              className="group inline-flex items-center gap-2.5 font-semibold uppercase tracking-[0.14em] text-sm transition-all duration-300 active:scale-[0.97]"
              style={{
                color: "rgba(255,255,255,0.65)",
                padding: "14px 28px",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.16)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
            >
              {getVal(data?.secondaryButtonText) || (isRTL ? "خدماتنا" : "Our Services")}
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${isRTL ? 'group-hover:-translate-x-0.5 scale-x-[-1]' : 'group-hover:translate-x-0.5'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:flex sm:flex-nowrap gap-y-4" style={{ maxWidth: "460px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.2rem" }}>
            {displayStats.map((s: any, i: number) => (
              <div
                key={i}
                className={`hero-stat ${
                  isRTL 
                    ? (i === 1 ? "border-r border-white/10 pr-5" : i === 2 ? "sm:border-r sm:border-white/10 sm:pr-5" : "") 
                    : (i === 1 ? "border-l border-white/10 pl-5" : i === 2 ? "sm:border-l sm:border-white/10 sm:pl-5" : "")
                }`}
                style={{
                  flex: 1,
                  ...(isRTL ? {
                    paddingLeft: i < displayStats.length - 1 ? "1.25rem" : 0,
                  } : {
                    paddingRight: i < displayStats.length - 1 ? "1.25rem" : 0,
                  }),
                }}
              >
                <div style={{ color: "#26D0CE", fontSize: "clamp(1.2rem, 2vw, 1.8rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, textShadow: "0 0 24px rgba(38,208,206,0.55)" }}>
                  {s.value}
                </div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", letterSpacing: "0.07em", textTransform: "uppercase", marginTop: "0.25rem", lineHeight: 1.3 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ──────────────────────────────── */}
      {/* <div
        className="absolute z-30 pointer-events-none hidden lg:flex flex-col items-center gap-1.5"
        style={{ bottom: "4.5rem", ...(isRTL ? { left: "2.5rem" } : { right: "2.5rem" }), opacity: 0.4 }}
      >
        <span style={{ fontSize: "0.5rem", letterSpacing: "0.26em", color: "white", textTransform: "uppercase", writingMode: "vertical-rl", marginBottom: "5px" }}>
          Scroll
        </span>
        <div className="hero-scroll-line" style={{ width: "1px", height: "48px", background: "linear-gradient(to bottom, rgba(38,208,206,0.8), transparent)", borderRadius: "9999px" }} />
      </div> */}

    </section>
  );
}
