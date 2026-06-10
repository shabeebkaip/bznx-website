"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { unescapeHTML } from "@/lib/utils";

const STATS = [
  { value: "500+", label: "Clients Served" },
  { value: "98%",  label: "Success Rate"   },
  { value: "4.9★", label: "Avg. Rating"    },
];

const TESTIMONIALS = [
  {
    name: "James Hartwell",
    title: "CEO, Hartwell Logistics Group",
    country: "🇬🇧 UK",
    quote: "BZNX made our Saudi Arabia entry effortless. From CR registration to ZATCA compliance, everything was handled professionally and faster than we expected. They are the only team we'd recommend.",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80",
    rating: 5.0,
    featured: true,
  },
  {
    name: "Priya Nair",
    title: "COO, NovaTech Solutions",
    country: "🇮🇳 India",
    quote: "Navigating Saudization requirements seemed daunting, but BZNX had a clear roadmap from day one. Our Nitaqat rating jumped two tiers in under a year.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    rating: 4.9,
    featured: false,
  },
  {
    name: "Marcus Eriksson",
    title: "Managing Director, Nordic Capital ME",
    country: "🇸🇪 Sweden",
    quote: "We needed a joint venture structured under Saudi commercial law with tight timelines. BZNX delivered the SHA and all agreements in 30 days. Outstanding.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
    rating: 5.0,
    featured: false,
  },
  {
    name: "Aisha Al-Farsi",
    title: "Founder, Bloom Retail",
    country: "🇦🇪 UAE",
    quote: "Three Riyadh branches registered in six weeks. BZNX is simply the most efficient consulting team I've encountered across the entire region.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
    rating: 4.8,
    featured: false,
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 20 20" fill={i < Math.round(rating) ? "#00C4B4" : "#e2e8f0"}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1.5 text-[#00C4B4] text-xs font-black">{rating.toFixed(1)}</span>
    </div>
  );
}

interface TestimonialItem {
  name: string;
  title: string;
  quote: string;
  rating: number;
  avatar: string;
}

interface TestimonialsContent {
  badge?: string | Record<string, string>;
  title?: string | Record<string, string>;
  ctaText?: string | Record<string, string>;
  ctaLink?: string;
  ctaText2?: string | Record<string, string>;
  ctaLink2?: string;
  stats?: any[];
  items?: any[];
}

export default function TestimonialsSection({ data }: { data?: TestimonialsContent }) {
  const locale = useLocale();
  const sectionRef = useRef<HTMLDivElement>(null);

  const getVal = (field: any) => {
    if (!field) return "";
    return typeof field === "string" ? field : field[locale] || field["en"] || "";
  };


  const badge = getVal(data?.badge) || "Client Testimonials";
  const title = getVal(data?.title) || `Trusted by<br />Businesses <span style="color: #00C4B4">Worldwide</span>`;
  const ctaText1 = getVal(data?.ctaText) || "Our Services";
  const ctaLink1 = data?.ctaLink || "/services";
  const ctaText2 = getVal(data?.ctaText2) || "Work With Us";
  const ctaLink2 = data?.ctaLink2 || "/contact";

  const stats = ((data?.stats || []).length > 0
    ? data?.stats?.map((s: any) => ({ value: getVal(s.value), label: getVal(s.label) }))
    : STATS) || [];

  const items: TestimonialItem[] = ((data?.items || []).length > 0
    ? data?.items?.map((it: any) => {
        const ratingVal = typeof it.rating === 'object' ? (it.rating.en || it.rating.ar) : it.rating;
        return {
          name: getVal(it.name),
          title: getVal(it.title),
          quote: getVal(it.quote),
        rating: parseFloat(ratingVal) || 5.0,
          avatar: typeof it.image === 'string' ? it.image : (it.image?.url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80")
        };
      })
    : TESTIMONIALS) || [];

  const featured = items[0];
  const rest = items.slice(1);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(".testi-header", { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".testi-header", start: "top 80%" },
      });
      gsap.fromTo(".testi-featured", { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".testi-featured", start: "top 80%" },
      });
      gsap.fromTo(".testi-card", { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: ".testi-card", start: "top 85%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [items]);

  return (
    <section ref={sectionRef} className="py-16 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="testi-header flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C4B4]/10 border border-[#00C4B4]/25 text-[#00C4B4] text-[10px] font-bold tracking-[0.25em] uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C4B4] animate-pulse" />
              {badge}
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#091d37] uppercase tracking-tighter leading-[0.95]"
              dangerouslySetInnerHTML={{ __html: unescapeHTML(title) }}
            />
          </div>

          {/* Stats + CTA */}
          <div className="flex flex-col gap-6 lg:items-end">
            <div className="flex gap-6">
              {stats.map((s: any) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-black text-[#091d37] leading-none">{s.value}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link href={ctaLink1} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-[#091d37] text-xs font-bold uppercase tracking-widest hover:border-[#00C4B4] transition-colors duration-200">
                {ctaText1}
              </Link>
              <Link href={ctaLink2} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#091d37] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#00C4B4] transition-colors duration-300">
                {ctaText2}
              </Link>
            </div>
          </div>
        </div>

        {/* ── Featured testimonial ── */}
    {featured && (
        <div className="testi-featured relative rounded-3xl overflow-hidden mb-5 bg-[#091d37] p-6 sm:p-10 lg:p-14">
          {/* Decorative quote mark */}
          <div
            className="absolute top-6 right-10 font-black text-white/[0.04] select-none leading-none"
            style={{ fontSize: "clamp(120px, 15vw, 200px)" }}
          >
            "
          </div>

          {/* Teal top line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#00C4B4] via-[#00C4B4]/50 to-transparent" />

          <div className="relative grid lg:grid-cols-[1fr_280px] gap-10 items-end">
            <div>
              <Stars rating={featured.rating} />
              <blockquote className="mt-6 text-white text-lg sm:text-xl lg:text-3xl font-medium leading-[1.4] max-w-2xl">
                <span dangerouslySetInnerHTML={{ __html: unescapeHTML(featured.quote) }} />
              </blockquote>
            </div>

            <div className="flex lg:flex-col items-center lg:items-start gap-4 lg:gap-0">
              <img src={featured.avatar} alt={featured.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-[#00C4B4]/40" />
              <div className="lg:mt-4">
                <p className="text-white font-black text-sm uppercase tracking-tight">{featured.name}</p>
                <p className="text-white/40 text-xs font-medium mt-0.5">{featured.title}</p>
                {/* <p className="text-[#00C4B4] text-xs font-bold mt-1">{featured.country}</p> */}
              </div>
            </div>
          </div>
        </div>
      )}

        {/* ── 3 cards row ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {rest.map((t: any) => (
            <div
              key={t.name}
              className="testi-card group relative bg-[#f8fafc] hover:bg-white border border-slate-100 hover:border-[#00C4B4]/25 hover:shadow-lg hover:shadow-[#00C4B4]/8 rounded-3xl p-7 transition-all duration-300"
            >
              {/* Top: rating + country */}
              <div className="flex items-center justify-between mb-5">
                <Stars rating={t.rating} />
                {/* <span className="text-base">{t.country}</span> */}
              </div>

              {/* Quote */}
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                <span dangerouslySetInnerHTML={{ __html: unescapeHTML(t.quote) }} />
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <p className="text-[#091d37] font-black text-xs uppercase tracking-tight">{t.name}</p>
                  <p className="text-slate-400 text-[10px] font-medium mt-0.5">{t.title}</p>
                </div>
              </div>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-[#00C4B4] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 rounded-full" />
            </div>
          ))}
        </div>

        {/* ── Footer rating ── */}
        <div className="flex items-center justify-center gap-2 mt-12">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" fill="#00C4B4">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-2 text-slate-400 text-xs font-semibold">Rated 4.9 across all client engagements</span>
        </div>

      </div>
    </section>
  );
}
