"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { unescapeHTML } from "@/lib/utils";

function LogoMarquee({
  clients,
  l,
  direction = "left",
  speed = 40,
}: {
  clients: any[];
  l: string;
  direction?: "left" | "right";
  speed?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const getImg = (item: any) => {
    if (!item) return "";
    if (typeof item === 'string') return item;
    return item.url || item[l] || item.en || "";
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const unit = track.scrollWidth / 3;
    const startX = direction === "left" ? 0 : -unit;

    gsap.set(track, { x: startX });

    const anim = gsap.to(track, {
      x: direction === "left" ? -unit : 0,
      ease: "none",
      duration: unit / speed,
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x: number) => {
          const mod = ((x % unit) + unit) % unit;
          return direction === "left" ? -mod : mod - unit;
        }),
      },
    });

    const parent = track.parentElement;
    const onEnter = () => gsap.to(anim, { timeScale: 0.3, duration: 0.4 });
    const onLeave = () => gsap.to(anim, { timeScale: 1, duration: 0.5 });
    parent?.addEventListener("mouseenter", onEnter);
    parent?.addEventListener("mouseleave", onLeave);

    return () => {
      anim.kill();
      parent?.removeEventListener("mouseenter", onEnter);
      parent?.removeEventListener("mouseleave", onLeave);
    };
  }, [direction, speed]);

  const tripled = [...clients, ...clients, ...clients];

  return (
    <div className="relative overflow-hidden" dir="ltr">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div
        ref={trackRef}
        className="flex items-center gap-2 w-max"
        style={{ willChange: "transform" }}
      >
        {tripled.map((client, i) => (
          <div
            key={i}
            className="flex-shrink-0 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 w-[160px] h-[90px]"
          >
            <img
              src={getImg(client.image) || client.src}
              alt={client.alt || "Client Logo"}
              className="max-h-[50px] max-w-[120px] w-auto h-auto object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AboutClients({
  locale,
  header,
  logos,
  testimonial
}: {
  locale: string;
  header: any;
  logos: any;
  testimonial: any;
}) {
  const l = locale as 'en' | 'ar';

  const displayLogos = Array.isArray(logos) ? logos : logos?.logos || logos?.items || [];
  const ROW_1 = displayLogos.slice(0, Math.ceil(displayLogos.length / 2));
  const ROW_2 = displayLogos.slice(Math.ceil(displayLogos.length / 2));

  return (
    <section className="py-12 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-teal text-xs font-bold tracking-[0.3em] uppercase mb-4">
            {header?.badge?.[l] || (l === 'ar' ? "موضع ثقة من" : "Trusted By")}
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-[#091d37] uppercase tracking-tighter"
            dangerouslySetInnerHTML={{ __html: unescapeHTML(header?.title?.[l] || (l === 'ar' ? "عملائنا <span class='text-[#091d37]/25'>الكرام</span>" : "Our <span class='text-[#091d37]/25'>Clients</span>")) }}
          />
          <div  className="text-slate-400 text-sm mt-4 max-w-xl mx-auto ql-editor-view"
            dangerouslySetInnerHTML={{ __html: unescapeHTML(header?.description?.[l] || (l === 'ar' ? "فخورون بالشراكة مع العلامات التجارية الرائدة في المملكة العربية السعودية وخارجها" : "Proud to partner with leading brands across Saudi Arabia and beyond")) }}
          />
        </div>

        {/* Marquee Row 1 — scrolls left */}
        <div className="mb-3">
          <LogoMarquee clients={ROW_1} l={l} direction="left" speed={35} />
        </div>

        {/* Marquee Row 2 — scrolls right */}
        <div className="mb-16">
          <LogoMarquee clients={ROW_2} l={l} direction="right" speed={30} />
        </div>

        {/* Featured testimonial */}
      {testimonial && (
        <div className="relative rounded-2xl border border-gray-100 bg-gray-50 p-6 sm:p-10 lg:p-14">
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-teal/40 to-transparent" />

          {/* Large quote mark */}
          <div className="text-8xl font-black text-teal/10 leading-none mb-6 select-none">
            &ldquo;
          </div>

          <blockquote className="text-[#091d37] text-lg sm:text-2xl font-medium leading-relaxed mb-10 max-w-4xl ql-editor-view"
            dangerouslySetInnerHTML={{ __html: unescapeHTML(testimonial.quote?.[l]) }}
          />

          <div className="flex items-center gap-4">
            <img
              src={testimonial.avatar?.url || testimonial.avatar?.[l] || testimonial.avatar?.en || testimonial.avatar || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80"}
              alt={testimonial.name?.[l]}
              className="w-12 h-12 rounded-full object-cover border-2 border-teal/30"
            />
            <div>
              <p className="text-[#091d37] font-black text-sm uppercase tracking-tight">
                {testimonial.name?.[l]}
              </p>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5">
                {testimonial.role?.[l] || testimonial.title?.[l]}
              </p>
            </div>
          </div>
        </div>
      )}
      </div>
    </section>
  );
}
