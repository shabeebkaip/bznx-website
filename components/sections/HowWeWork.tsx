"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { unescapeHTML } from "@/lib/utils";

interface WorkStep {
  title: string;
  desc: string;
  image: string;
}

export default function HowWeWork({ data }: { data?: any }) {
  const t = useTranslations("howWeWork");
  const locale = useLocale();
  const sectionRef = useRef<HTMLDivElement>(null);

  const getVal = (field: any) => {
    if (!field) return "";
    return typeof field === "string" ? field : field[locale] || field["en"] || "";
  };


  const stepImages = [
    "/home/discover.png",
    "/home/plan.png",
    "/home/execute.png",
    "/home/grow.png",
  ];

  const badge = getVal(data?.badge) || t("badge");
  const title = getVal(data?.title) || `How We <span class="text-[#091d37]/25">Work</span>`;
  const sub = getVal(data?.description) || t("sub");

  const steps: WorkStep[] = (data?.steps || []).length > 0
    ? data.steps.map((s: any, i: number) => ({
        title: getVal(s.title),
        desc: getVal(s.description),
        image: typeof s.image === 'string' ? s.image : (s.image?.url || stepImages[i % stepImages.length])
      }))
    : (t.raw("steps") as { title: string; desc: string }[]).map((s, i) => ({
        title: s.title,
        desc: s.desc,
        image: stepImages[i] || stepImages[0]
      }));

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      sectionRef.current?.querySelectorAll(".step-card") || [],
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      }
    );
  }, [steps]);

  return (
    <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <p className="text-teal text-xs font-bold tracking-[0.3em] uppercase mb-4">
              {badge}
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-[#091d37] uppercase tracking-tighter"
              dangerouslySetInnerHTML={{ __html:unescapeHTML(title) }}
            />
          </div>
          <p className={`text-[#091d37]/45 text-sm max-w-xs font-medium leading-relaxed ${locale === 'ar' ? 'md:text-left' : 'md:text-right'}`}>
            <span dangerouslySetInnerHTML={{ __html: unescapeHTML(sub) }} />
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className="step-card group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-default"
            >
              {/* Image */}
              <Image
                src={step.image}
                alt={step.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-[#091d37] via-[#091d37]/70 to-[#091d37]/30" />

              {/* Teal top accent on hover */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-teal scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ${locale === 'ar' ? 'origin-right' : 'origin-left'}`} />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-7">
                {/* Step number */}
                <span className="text-white/20 font-black text-6xl leading-none tracking-tighter group-hover:text-teal/40 transition-colors duration-300">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Title + desc */}
                <div className="space-y-3">
                  <h3 className="text-white font-black text-xl uppercase tracking-wide">
                    {step.title}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: unescapeHTML(step.desc) }}
                  />
                  {/* Teal underline accent */}
                  <div className="w-8 h-0.5 bg-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
