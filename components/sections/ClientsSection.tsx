"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import SplitReveal from "@/components/ui/SplitReveal";

const CLIENTS = [
  { name: "Ainsphere Trading", short: "AINSPHERE" },
  { name: "XDS Solutions",     short: "XDS" },
  { name: "ضياء التفكير",      short: "ضياء" },
  { name: "Alamco",            short: "ALAMCO" },
  { name: "WINWOOD",           short: "WINWOOD" },
  { name: "Faisal Lanjawi",    short: "FAISAL" },
  { name: "ICS Coffee",        short: "ICS" },
  { name: "KINGDOM",           short: "KINGDOM" },
];

export default function ClientsSection({ locale }: { locale: string }) {
  const t          = useTranslations("clients");
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const items = gridRef.current?.querySelectorAll(".client-item");
      if (items) {
        gsap.fromTo(
          items,
          { y: 30, opacity: 0, scale: 0.9 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.55,
            stagger: 0.06,
            ease: "back.out(1.5)",
            scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white relative overflow-hidden">
      {/* subtle grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(26,43,90,1) 1px, transparent 1px), linear-gradient(90deg, rgba(26,43,90,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4" style={{ background: "rgba(0,196,180,0.1)", color: "#00C4B4", border: "1px solid rgba(0,196,180,0.25)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#00C4B4" }} />
            {t("badge")}
          </span>
          <SplitReveal as="h2" className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3" style={{ color: "#1A2B5A", letterSpacing: "-0.02em" }}>
            {t("title")}
          </SplitReveal>
          <p className="text-slate-500 text-base">{t("sub")}</p>
        </div>

        {/* Client logo grid */}
        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CLIENTS.map((client, i) => (
            <div
              key={i}
              className="client-item group relative flex items-center justify-center rounded-2xl py-6 px-4 cursor-default overflow-hidden transition-all duration-300"
              style={{
                background: "#F8F9FC",
                border: "1px solid #E8EDF7",
                minHeight: 80,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "rgba(0,196,180,0.35)";
                el.style.background = "rgba(0,196,180,0.04)";
                gsap.to(el, { y: -4, scale: 1.02, duration: 0.25, ease: "power2.out" });
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "#E8EDF7";
                el.style.background = "#F8F9FC";
                gsap.to(el, { y: 0, scale: 1, duration: 0.3, ease: "power2.inOut" });
              }}
            >
              {/* shimmer on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-400 shimmer-text"
                style={{ background: "linear-gradient(90deg, transparent, #00C4B4, transparent)", backgroundSize: "200% auto" }}
              />

              <div className="text-center">
                <div
                  className="text-sm font-bold tracking-widest transition-colors duration-300"
                  style={{ color: "#1A2B5A", fontFamily: "monospace" }}
                >
                  {client.short}
                </div>
                {client.name !== client.short && (
                  <div className="text-[10px] text-slate-400 mt-0.5 font-medium leading-tight">
                    {client.name}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
