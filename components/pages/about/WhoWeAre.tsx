"use client";

import Image from "next/image";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { unescapeHTML } from "@/lib/utils";

export default function AboutWhoWeAre({ 
  locale, 
  data,
  stats 
}: { 
  locale: string;
  data: any;
  stats: any;
}) {
  const l = locale as "en" | "ar";
  const displayFacts = Array.isArray(data.features) ? data.features : data.features?.items || [];
  const displayStats = Array.isArray(stats) ? stats : stats?.items || [];

  const getVal = (val: any) => {
    if (!val) return "";
    return typeof val === "string" ? val : val[l] || val.en || "";
  };

  return (
    <section className="py-12 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top: split layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-10 sm:mb-20">

          {/* Left: image */}
          <div className="relative rounded-2xl overflow-hidden aspect-4/5">
            <Image
              src={(typeof data.image === "string" ? data.image : data.image?.url) || "/whySaudi/business-setup-in-Saudi.jpg"}
              alt="BZNX Team"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#091d37]/60 via-transparent to-transparent" />

            {/* Badge overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                  <span className={`text-teal text-[10px] font-bold tracking-[0.2em] uppercase ${l === 'ar' ? "text-right" : ""}`}>
                    {l === 'ar' ? "المقر الرئيسي في الرياض" : "Headquartered in Riyadh"}
                  </span>
                </div>
                <p className={`text-white text-sm font-semibold leading-snug ${l === 'ar' ? "text-right" : ""}`}>
                  {l === 'ar' ? "المملكة العربية السعودية — متوافق مع رؤية 2030" : "Kingdom of Saudi Arabia — Vision 2030 Aligned"}
                </p>
              </div>
            </div>
          </div>

          {/* Right: content */}
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-teal text-xs font-bold tracking-[0.3em] uppercase mb-4">
                {getVal(data.badge) || "Who We Are"}
              </p>
              <h2 className="text-3xl sm:text-5xl font-black text-[#091d37] uppercase tracking-tighter leading-[0.95] mb-6"
                dangerouslySetInnerHTML={{ __html: unescapeHTML(getVal(data.title) || "Saudi Arabia's<br /><span className='text-[#091d37]/25'>Trusted Business</span><br />Partner") }}
              />
              <div  className="text-[#091d37]/55 text-sm leading-relaxed mb-4 ql-editor-view"
                dangerouslySetInnerHTML={{ __html: unescapeHTML(getVal(data.description)) }}
              />
              <div  className="text-[#091d37]/45 text-sm leading-relaxed ql-editor-view"
                dangerouslySetInnerHTML={{ __html: unescapeHTML(getVal(data.subDescription)) }}
              />
            </div>

            {/* Key facts */}
            <div className="flex flex-col divide-y divide-[#091d37]/8">
              {displayFacts.map((fact: any, i: number) => (
                <div key={i} className="flex items-start gap-4 py-4">
                  <span className="text-teal font-black text-xs tabular-nums shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[#091d37]/65 text-sm font-medium leading-snug">
                    {getVal(fact)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#091d37]/8 rounded-2xl overflow-hidden">
          {displayStats.map((stat: any, i: number) => {
            const rawVal = getVal(stat.value) || "0";
            // Extract numeric part and any suffix (e.g., "50+" -> [50, "+"])
            const numMatch = rawVal.match(/^(\d+)(.*)$/);
            const endValue = numMatch ? parseInt(numMatch[1]) : 0;
            const derivedSuffix = numMatch ? numMatch[2] : "";
            const explicitSuffix = getVal(stat.suffix);

            return (
              <div key={i} className="bg-white p-5 sm:p-8 flex flex-col gap-2">
                <p className="text-4xl sm:text-5xl font-black text-[#091d37] tabular-nums leading-none">
                  <AnimatedCounter 
                    end={endValue} 
                    suffix={explicitSuffix || derivedSuffix} 
                    duration={1800} 
                  />
                </p>
                <p className="text-teal text-xs font-bold tracking-[0.15em] uppercase">
                  {getVal(stat.label)}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
