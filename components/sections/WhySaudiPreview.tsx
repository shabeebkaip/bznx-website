"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import SectionBadge from "@/components/ui/SectionBadge";
import SplitReveal from "@/components/ui/SplitReveal";

interface WhySaudiPreviewProps {
  locale: string;
}

const WHY_ICONS = ["🚀", "🏦", "🌐", "🏗️", "🔑", "💡"];

export default function WhySaudiPreview({ locale }: WhySaudiPreviewProps) {
  const t          = useTranslations("whySaudi");
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const centerGlow = useRef<HTMLDivElement>(null);
  const ringTR     = useRef<HTMLDivElement>(null);
  const ringBL     = useRef<HTMLDivElement>(null);

  const items = t.raw("items") as { title: string; desc: string }[];

  // ─── Mode 2: ambient particle canvas background ───────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const count = window.matchMedia("(hover: none)").matches ? 20 : 40;
    const pts = Array.from({ length: count }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r:  Math.random() * 1.2 + 0.4,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.x = (p.x + p.vx + canvas.width)  % canvas.width;
        p.y = (p.y + p.vy + canvas.height) % canvas.height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,196,180,0.22)";
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(0,196,180,${0.07 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ─── Mode 1: spring elastic stagger reveal ────────────────────
  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.9,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );

      gsap.fromTo(
        ".why-item",
        { y: 60, opacity: 0, scale: 0.88, rotationX: -20 },
        {
          y: 0, opacity: 1, scale: 1, rotationX: 0,
          duration: 0.75,
          stagger: { amount: 0.6, from: "start" },
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ─── Parallax depth on decorative elements ────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const scrub = { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true };
    if (centerGlow.current) gsap.to(centerGlow.current, { yPercent: -20, scale: 1.15, ease: "none", scrollTrigger: scrub });
    if (ringTR.current) gsap.to(ringTR.current, { yPercent: -40, ease: "none", scrollTrigger: { ...scrub } });
    if (ringBL.current) gsap.to(ringBL.current, { yPercent: 30, ease: "none", scrollTrigger: { ...scrub } });
  }, []);

  // ─── Mode 3: magnetic + neon glow on hover ────────────────────
  const onCardEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget as HTMLDivElement;
    el.style.borderColor = "rgba(0,196,180,0.45)";
    el.style.background  = "rgba(0,196,180,0.08)";
    gsap.to(el, { y: -6, duration: 0.3, ease: "power2.out" });
  };
  const onCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget as HTMLDivElement;
    el.style.borderColor = "rgba(255,255,255,0.08)";
    el.style.background  = "rgba(255,255,255,0.05)";
    gsap.to(el, { y: 0, duration: 0.4, ease: "power2.inOut" });
  };

  return (
    <section
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a1526 0%, #0d1a38 50%, #1A2B5A 100%)" }}
    >
      {/* Mode 2: particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.5 }}
      />

      {/* Mode 2: central teal glow — parallax */}
      <div
        ref={centerGlow}
        className="absolute pointer-events-none"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,196,180,0.1) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          animation: "pulse-ring 4s ease-out infinite",
        }}
      />

      {/* Mode 2: corner accent rings — parallax */}
      <div ref={ringTR} className="absolute top-8 right-8 w-32 h-32 pointer-events-none ring-spin opacity-20" style={{ border: "1px solid rgba(0,196,180,0.4)", borderRadius: "50%" }} />
      <div ref={ringBL} className="absolute bottom-8 left-8 w-24 h-24 pointer-events-none ring-spin-rev opacity-15" style={{ border: "1px dashed rgba(200,162,74,0.35)", borderRadius: "50%" }} />

      {/* Mode 1: grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(0,196,180,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,196,180,1) 1px, transparent 1px)", backgroundSize: "70px 70px" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className="text-center mb-16">
          <SectionBadge label={t("badge")} />
          <SplitReveal
            as="h2"
            className="mt-4 text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4"
          >
            {t("title")}
          </SplitReveal>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">{t("sub")}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: "1200px" }}>
          {items.map((item, i) => (
            <div
              key={i}
              className="why-item group p-6 rounded-2xl cursor-default relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                transformStyle: "preserve-3d",
                transition: "border-color 0.3s, background 0.3s",
              }}
              onMouseEnter={onCardEnter}
              onMouseLeave={onCardLeave}
            >
              {/* Mode 2: scan line on each card */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none" />

              {/* Mode 2: neon corner glow on hover */}
              <div
                className="absolute top-0 right-0 w-20 h-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: "radial-gradient(circle at top right, rgba(0,196,180,0.18) 0%, transparent 70%)" }}
              />

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_18px_rgba(0,196,180,0.4)]"
                style={{ background: "rgba(0,196,180,0.14)" }}
              >
                {WHY_ICONS[i]}
              </div>
              <h3 className={`font-bold text-white text-base mb-2 ${locale === "ar" ? "text-right" : "text-left"}`}>
                {item.title}
              </h3>
              <p className={`text-white/55 text-sm leading-relaxed ${locale === "ar" ? "text-right" : "text-left"}`}>
                {item.desc}
              </p>

              {/* Mode 2: shimmer bottom bar on hover */}
              <div
                className="mt-4 h-px w-0 rounded-full transition-all duration-500 group-hover:w-full shimmer-text"
                style={{ background: "linear-gradient(90deg, #00C4B4, #C8A24A, #00C4B4)", backgroundSize: "200% auto" }}
              />
            </div>
          ))}
        </div>

        <div className="mt-14 text-center" />
      </div>
    </section>
  );
}
