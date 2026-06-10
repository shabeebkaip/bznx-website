"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

export default function MisaLicenseSection({ locale }: { locale: string }) {
  const t = useTranslations("whySaudiPage");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current?.querySelectorAll(".misa-ai") || [],
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const benefits = [
    locale === "ar" ? "ملكية أجنبية 100%" : "100% Foreign Ownership",
    locale === "ar" ? "فروع متعددة برخصة واحدة" : "Multiple Branches Under One License",
    locale === "ar" ? "أنشطة متعددة بدون رسوم إضافية" : "Multiple Activities at No Extra Charge",
    locale === "ar" ? "لا حاجة لكفيل محلي" : "No Local Sponsor Required",
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0d1a38 0%, #1A2B5A 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(0,196,180,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,196,180,1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      <div className="absolute pointer-events-none" style={{ width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,196,180,0.10) 0%, transparent 70%)", top: "-18%", right: "-10%" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className={locale === "ar" ? "text-right" : "text-left"}>
            <h2 className="misa-ai text-4xl font-extrabold text-white mb-4">
              {t("visa.title")}
            </h2>
            <p className="misa-ai text-white/65 text-lg leading-relaxed mb-8">
              {t("visa.body")}
            </p>

            <div className="misa-ai grid grid-cols-1 gap-3">
              {benefits.map((benefit) => (
                <div key={benefit} className={`flex items-center gap-3 ${locale === "ar" ? "flex-row-reverse" : ""}`}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(0,196,180,0.18)" }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#00C4B4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-white/75 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="misa-ai rounded-3xl p-9"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "0 0 40px rgba(0,196,180,0.08)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            <div className="text-5xl mb-5">🏛️</div>
            <h3 className="text-white font-extrabold text-xl mb-3">
              {locale === "ar" ? "لماذا تحتاج رخصة وزارة الاستثمار؟" : "Why You Need a MISA License"}
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-7">
              {locale === "ar"
                ? "رخصة وزارة الاستثمار هي المفتاح للدخول للسوق السعودي بدون شريك محلي، مع مرونة أعلى لتوسيع النشاط وإضافة الفروع."
                : "A MISA license is the key to entering the Saudi market without a local partner, with the flexibility to expand activities and add branches."}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white text-sm transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #00C4B4, #00A899)" }}
            >
              {locale === "ar" ? "ابدأ العملية" : "Start the Process"}
              <span>{locale === "ar" ? "←" : "→"}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

