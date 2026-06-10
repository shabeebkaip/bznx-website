"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

export default function InvestmentExecutiveSummarySection({ locale }: { locale: string }) {
  const t = useTranslations("investmentExecutiveSummary");
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo(
      sectionRef.current?.querySelectorAll(".summary-card") || [],
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      }
    );
  }, []);

  const points = [0, 1, 2, 3];

  return (
    <section ref={sectionRef} className="py-24 bg-[#0A1D37] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white/[0.02] -skew-x-12 transform translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Header Area */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-teal rounded-full" />
              </div>
              <span className="text-teal font-black uppercase tracking-[0.25em] text-xs">
                {t("badge")}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight uppercase tracking-tighter">
              {t("title")}
            </h2>
            <p className="text-white/60 text-lg font-medium leading-relaxed max-w-md">
              {t("sub")}
            </p>
          </div>

          {/* Points Grid */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-8">
            {points.map((i) => (
              <div 
                key={i} 
                className="summary-card p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-all duration-500 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-teal/10 flex items-center justify-center mb-6 group-hover:bg-teal transition-colors duration-500">
                   <span className="text-teal group-hover:text-white font-black">0{i + 1}</span>
                </div>
                <h3 className="text-white font-black text-xl tracking-tight uppercase mb-4">
                  {t(`points.${i}.title`)}
                </h3>
                <p className="text-white/40 text-sm font-medium leading-relaxed">
                  {t(`points.${i}.desc`)}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
