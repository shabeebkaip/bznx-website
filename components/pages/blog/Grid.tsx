"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CATEGORIES, type BlogPost } from "@/lib/blog-data";

function BlogCard({
  post,
  locale,
  index,
}: {
  post: BlogPost;
  locale: string;
  index: number;
}) {
  return (
    <Link
      href={`/${locale}/blogs/${post.slug}`}
      className={`blog-card relative bg-white rounded-3xl overflow-hidden border border-slate-100 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl group flex flex-col ${
        index === 0 ? "md:col-span-2" : ""
      }`}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
        e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
      }}
    >
      {/* Mouse radial glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300 z-10"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(0,196,180,0.04), transparent 40%)`,
        }}
      />

      {/* Image */}
      <div
        className={`relative overflow-hidden flex-shrink-0 ${
          index === 0 ? "h-56 sm:h-80" : "h-48"
        }`}
      >
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#091d37]/40 group-hover:bg-[#091d37]/30 transition-colors duration-300" />

        {/* Category tag */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full backdrop-blur-sm"
            style={{
              backgroundColor: `#26D0CE25`,
              color: "#26D0CE",
              border: `1px solid #26D0CE50`,
            }}
          >
            {post.category}
          </span>
        </div>

        {/* Read time pill */}
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center gap-1 text-white/80 text-[10px] uppercase tracking-widest font-bold bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span className="text-slate-400 text-xs">{post.date}</span>
        </div>

        <h3
          className={`font-bold leading-snug mb-3 group-hover:text-teal transition-colors duration-200 ${
            index === 0 ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
          }`}
          style={{ color: "#1A2B5A" }}
        >
          {post.title}
        </h3>

        <p
          className={`text-slate-500 leading-relaxed flex-1 ${
            index === 0 ? "text-sm line-clamp-3" : "text-xs line-clamp-2"
          }`}
        >
          {post.excerpt}
        </p>

        <div className="mt-5 flex items-center gap-2 text-xs font-black tracking-[0.15em] uppercase text-teal opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {locale === "ar" ? "اقرأ المقال" : "Read Article"} <ArrowRight className={`w-3.5 h-3.5 ${locale === "ar" ? "rotate-180" : ""}`} />
        </div>
      </div>

      {/* Bottom teal bar */}
      <div
        className="h-0.5 w-0 rounded-full transition-all duration-300 group-hover:w-full mx-6 mb-0 relative z-10 -mt-px"
        style={{ backgroundColor: "#00C4B4" }}
      />
    </Link>
  );
}

import { unescapeHTML } from "@/lib/utils";

export default function BlogGrid({ 
  locale, 
  initialPosts = [],
  cmsData = {}
}: { 
  locale: string, 
  initialPosts?: any[],
  cmsData?: any
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const sectionRef = useRef<HTMLElement>(null);
  const l = locale as 'en' | 'ar';

  const listHeader = cmsData.listHeader || {};
  const headerBadge = listHeader.badge?.[l] || listHeader.badge?.en || "Latest Articles";
  const headerTitle = listHeader.title?.[l] || listHeader.title?.en || "Business <br/><span style='color: #26D0CE'>Intelligence</span>";
  const headerSub = listHeader.description?.[l] || listHeader.description?.en || "Expert analysis, how-to guides, and law updates for businesses operating in Saudi Arabia.";

  const filtered =
    activeCategory === "All"
      ? initialPosts
      : initialPosts.filter((p) => p.categoryId === activeCategory);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".blog-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: ".blog-grid", start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Re-animate on category change
  useEffect(() => {
    gsap.fromTo(
      ".blog-card",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power3.out" }
    );
  }, [activeCategory]);

  return (
    <section ref={sectionRef} className="py-12 sm:py-20 bg-[#F8F9FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/25 rounded-full px-4 py-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
            <span className="text-teal text-[10px] font-bold tracking-[0.3em] uppercase">
              {headerBadge}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <h2
              className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none"
              style={{ color: "#0A1D37" }}
              dangerouslySetInnerHTML={{ __html: unescapeHTML(headerTitle) }}
            />
            <p 
              className="text-slate-500 text-sm max-w-xs leading-relaxed"
              dangerouslySetInnerHTML={{ __html: unescapeHTML(headerSub) }}
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 mb-10 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 px-5 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 ${
                activeCategory === cat.id
                  ? "bg-[#0A1D37] text-white shadow-lg"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:shadow-sm"
              }`}
            >
              {cat[l] || cat.en}
            </button>
          ))}
        </div>

        {/* Blog grid */}
        <div className="blog-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <BlogCard key={post.slug} post={post} locale={locale} index={i} />
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg font-bold">{locale === 'ar' ? "لا توجد مقالات في هذه الفئة بعد." : "No articles in this category yet."}</p>
            <p className="text-sm mt-2">{locale === 'ar' ? "يرجى التحقق مرة أخرى قريباً." : "Check back soon."}</p>
          </div>
        )}
      </div>
    </section>
  );
}
