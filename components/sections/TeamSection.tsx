"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import SplitReveal from "@/components/ui/SplitReveal";

interface TeamSectionProps {
  locale: string;
}

const INITIALS = ["ME", "FA", "OA", "SP"];
const COLORS   = ["#00C4B4", "#C8A24A", "#00C4B4", "#C8A24A"];

export default function TeamSection({ locale }: TeamSectionProps) {
  const t         = useTranslations("team");
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);

  const members = t.raw("members") as { name: string; role: string; bio: string }[];

  // ─── Mode 1: stagger reveal ───────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRefs.current,
        { y: 60, opacity: 0, scale: 0.93, rotationX: -15 },
        {
          y: 0, opacity: 1, scale: 1, rotationX: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ─── Mode 3: card tilt ────────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const cleanups: Array<() => void> = [];

    cardRefs.current.forEach((el) => {
      if (!el) return;
      const rxTo = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power2.out" });
      const ryTo = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power2.out" });
      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        rxTo(((e.clientX - r.left) / r.width  - 0.5) * 14);
        ryTo(((e.clientY - r.top)  / r.height - 0.5) * -10);
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
      style={{ background: "linear-gradient(160deg, #05101f 0%, #0d1a38 50%, #111e45 100%)" }}
    >
      {/* Mode 2: grid bg */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(0,196,180,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,196,180,1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,196,180,0.06) 0%, transparent 70%)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6" style={{ background: "rgba(0,196,180,0.1)", color: "#00C4B4", border: "1px solid rgba(0,196,180,0.3)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#00C4B4" }} />
            {t("badge")}
          </span>
          <SplitReveal as="h2" className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
            {t("title")}
          </SplitReveal>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">{t("sub")}</p>
        </div>

        {/* Team grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ perspective: "1200px" }}>
          {members.map((member, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="group relative rounded-2xl p-6 cursor-default overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${COLORS[i]}30`,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                transformStyle: "preserve-3d",
                transition: "border-color 0.3s, background 0.3s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = `${COLORS[i]}55`;
                el.style.background = `${COLORS[i]}10`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = `${COLORS[i]}30`;
                el.style.background = "rgba(255,255,255,0.04)";
              }}
            >
              {/* Mode 2: scan line */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none" />

              {/* Avatar placeholder */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 text-xl font-bold transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `${COLORS[i]}22`,
                  border: `2px solid ${COLORS[i]}44`,
                  color: COLORS[i],
                  boxShadow: `0 0 16px ${COLORS[i]}25`,
                  fontFamily: "monospace",
                  letterSpacing: "0.05em",
                }}
              >
                {INITIALS[i]}
              </div>

              {/* Info */}
              <div className={locale === "ar" ? "text-right" : "text-left"}>
                <h3 className="font-bold text-white text-base mb-1 leading-snug">{member.name}</h3>
                <p className="text-xs font-semibold tracking-wide mb-3" style={{ color: COLORS[i] }}>{member.role}</p>
                <p className="text-white/50 text-sm leading-relaxed">{member.bio}</p>
              </div>

              {/* Mode 2: bottom accent bar */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${COLORS[i]}, transparent)` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
