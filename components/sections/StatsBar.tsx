"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function StatsBar() {
  const t          = useTranslations("stats");
  const sectionRef = useRef<HTMLDivElement>(null);
  const scanRef    = useRef<HTMLDivElement>(null);
  const itemRefs   = useRef<(HTMLDivElement | null)[]>([]);

  const stats = [
    { value: 150, suffix: "+", label: t("clients") },
    { value: 300, suffix: "+", label: t("projects") },
    { value: 8,   suffix: "+", label: t("years") },
    { value: 12,  suffix: "",  label: t("sectors") },
  ];

  // ─── Mode 1: scan sweep + stagger reveal ─────────────────────
  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Scan line sweeps across the bar
      gsap.fromTo(
        scanRef.current,
        { x: "-105%" },
        {
          x: "105%",
          duration: 1.1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Stats cards slide up with stagger
      gsap.fromTo(
        itemRefs.current,
        { y: 40, opacity: 0, scale: 0.92 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ─── Mode 3: hover neon glow on each stat ─────────────────────
  const handleEnter = (el: HTMLDivElement | null) => {
    if (!el) return;
    gsap.to(el, { y: -6, duration: 0.3, ease: "power2.out" });
  };
  const handleLeave = (el: HTMLDivElement | null) => {
    if (!el) return;
    gsap.to(el, { y: 0, duration: 0.4, ease: "power2.inOut" });
  };

  return (
    <section ref={sectionRef} className="bg-white py-16 border-b border-slate-100 relative overflow-hidden">

      {/* Mode 1: horizontal scan beam */}
      <div
        ref={scanRef}
        className="absolute inset-y-0 pointer-events-none"
        style={{
          width: "60px",
          background: "linear-gradient(90deg, transparent, rgba(0,196,180,0.18), rgba(0,196,180,0.06), transparent)",
          zIndex: 2,
          left: 0,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              ref={(el) => { itemRefs.current[i] = el; }}
              className="text-center group cursor-default"
              onMouseEnter={() => handleEnter(itemRefs.current[i])}
              onMouseLeave={() => handleLeave(itemRefs.current[i])}
            >
              {/* Mode 2: neon ring pulse behind number */}
              <div className="relative inline-block mb-2">
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, rgba(0,196,180,0.12) 0%, transparent 70%)",
                    transform: "scale(2.2)",
                    animation: `pulse-ring 2.5s ease-out infinite`,
                    animationDelay: `${i * 0.4}s`,
                  }}
                />
                <div
                  className="text-4xl sm:text-5xl font-extrabold"
                  style={{
                    color: "#1A2B5A",
                    textShadow: "0 0 0 transparent",
                    transition: "text-shadow 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.textShadow = "0 0 20px rgba(0,196,180,0.4)";
                    (e.currentTarget as HTMLDivElement).style.color = "#00C4B4";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.textShadow = "0 0 0 transparent";
                    (e.currentTarget as HTMLDivElement).style.color = "#1A2B5A";
                  }}
                >
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
              </div>

              <div className="text-slate-500 text-sm font-medium">{stat.label}</div>

              {/* Mode 2: teal bar widens on hover */}
              <div
                className="mt-3 h-0.5 w-8 mx-auto rounded-full transition-all duration-500 group-hover:w-16"
                style={{ backgroundColor: "#00C4B4", boxShadow: "0 0 6px rgba(0,196,180,0.5)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
