"use client";

import * as React from "react";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Testimonial {
  name: string;
  title: string;
  quote?: string;
  avatarSrc: string;
  rating: number;
}

export interface Stat {
  value: string;
  label: string;
}

export interface ClientsSectionProps {
  tagLabel: string;
  title: string;
  description: string;
  stats: Stat[];
  testimonials: Testimonial[];
  primaryActionLabel: string;
  secondaryActionLabel: string;
  primaryActionHref?: string;
  secondaryActionHref?: string;
  className?: string;
}

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="flex flex-col gap-5 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-7">
    {/* Quote icon + text */}
    <div className="relative flex-1">
      <Quote className="absolute -top-1 -left-1 w-6 h-6 text-teal/25 fill-teal/25" />
      {testimonial.quote && (
        <p className="text-white/60 text-sm leading-relaxed pl-6">
          {testimonial.quote}
        </p>
      )}
    </div>

    {/* Divider */}
    <div className="h-px bg-white/[0.06]" />

    {/* Author row */}
    <div className="flex items-center gap-3">
      <img
        src={testimonial.avatarSrc}
        alt={testimonial.name}
        className="w-10 h-10 rounded-full object-cover border border-teal/30 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-black text-white text-xs uppercase tracking-tight truncate">
          {testimonial.name}
        </p>
        <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mt-0.5 truncate">
          {testimonial.title}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Star className="w-3 h-3 text-teal fill-teal" />
        <span className="text-teal text-xs font-black">{testimonial.rating.toFixed(1)}</span>
      </div>
    </div>
  </div>
);

export const ClientsSection = ({
  tagLabel,
  title,
  description,
  stats,
  testimonials,
  primaryActionLabel,
  secondaryActionLabel,
  primaryActionHref = "/contact",
  secondaryActionHref = "/about",
  className,
}: ClientsSectionProps) => {
  return (
    <section className={cn("w-full bg-[#091d37] py-24 overflow-hidden", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top: two-column header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-16">

          {/* Left */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-teal/20 bg-teal/5 px-4 py-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
              <span className="text-teal text-[10px] font-bold tracking-[0.3em] uppercase">
                {tagLabel}
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-[0.95]">
              {title}
            </h2>
            <div className="h-px bg-linear-to-r from-teal/40 to-transparent" />
          </div>

          {/* Right */}
          <div className="flex flex-col justify-end gap-6">
            <p className="text-white/45 text-sm leading-relaxed">{description}</p>
            <div className="flex items-center gap-3">
              <a
                href={secondaryActionHref}
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-2.5 text-xs font-black tracking-[0.15em] uppercase text-white hover:border-white/35 transition-colors duration-200"
              >
                {secondaryActionLabel}
              </a>
              <a
                href={primaryActionHref}
                className="inline-flex items-center justify-center rounded-full bg-teal px-6 py-2.5 text-xs font-black tracking-[0.15em] uppercase text-[#091d37] hover:bg-teal/90 transition-colors duration-200"
              >
                {primaryActionLabel}
              </a>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1 rounded-2xl border border-white/8 bg-white/[0.03] p-6">
              <p className="text-3xl font-black text-white leading-none">{stat.value}</p>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </div>

        {/* Stars footer */}
        <div className="flex items-center justify-center gap-1.5 mt-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 text-teal fill-teal" />
          ))}
          <span className="ml-2 text-white/35 text-xs font-semibold">
            Rated 4.9 across all client engagements
          </span>
        </div>

      </div>
    </section>
  );
};
