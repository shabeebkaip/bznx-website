"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { unescapeHTML } from "@/lib/utils";

export default function BlogsHero({ 
  locale, 
  cmsData = {}, 
  blogs = [] 
}: { 
  locale: string, 
  cmsData?: any,
  blogs?: any[]
}) {
  const l = locale as 'en' | 'ar';
  
  // Find featured post from provided blogs array, fallback to first blog
  const featured = blogs.find((p) => p.featured) ?? blogs[0];

  // Resolve hero content from CMS data
  const heroContent = cmsData.hero || {};
  const heroTitle = heroContent.title?.[l] || heroContent.title?.en || "Saudi Business <br/><span class='text-teal'>Intelligence</span> <br/>Hub";
  const heroSubtitle = heroContent.description?.[l] || heroContent.description?.en || "Expert insights on Saudi business setup, investment, law updates, and everything you need to succeed in the Kingdom.";
  const heroBadge = heroContent.badge?.[l] || heroContent.badge?.en || "BZNX Insights";
  const heroImageRaw = heroContent.backgroundImage;
  const heroImage = (heroImageRaw?.url || (typeof heroImageRaw === 'string' ? heroImageRaw : "")) || "/whySaudi/Saudi-Western-Business-Partnership-Handshake-in-Riyadh.webp";

  return (
    <section className="relative min-h-[85vh] flex items-end overflow-hidden pt-20">
      {/* Background */}
      <Image
        src={heroImage}
        alt="BZNX Blog"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[#091d37]/75" />
      <div className="absolute inset-0 bg-linear-to-t from-[#091d37] via-[#091d37]/30 to-transparent" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-end">
          {/* Left: page intro */}
          <div>
            <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/25 rounded-full px-4 py-2 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
              <span className="text-teal text-[10px] font-bold tracking-[0.3em] uppercase"
                dangerouslySetInnerHTML={{ __html: unescapeHTML(heroBadge) }}
              />
            </div>

            <h1 className={`text-white uppercase mb-6 ${l === 'ar' ? 'text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.2] tracking-normal' : 'text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tighter'}`}
              dangerouslySetInnerHTML={{ __html: unescapeHTML(heroTitle) }}
            />

            <p className="text-white/60 text-[19px] sm:text-lg leading-relaxed max-w-md"
              dangerouslySetInnerHTML={{ __html: unescapeHTML(heroSubtitle) }}
            />
          </div>

          {/* Right: featured article card */}
        {featured && (
          <div className="relative">
            <div className="bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
              {/* Article image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#091d37]/50" />
                <div className="absolute top-4 left-4">
                  <span
                    className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: `#26D0CE20`,
                      color: "#26D0CE",
                      border: `1px solid #26D0CE40`,
                    }}
                  >
                    {featured.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="text-white/60 text-[10px] uppercase tracking-widest font-bold bg-black/30 px-3 py-1.5 rounded-full">
                    {locale === "ar" ? "مميز" : "Featured"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-white/40 text-xs">{featured.date}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-white/40 text-xs">{featured.readTime}</span>
                </div>
                <h2 className="text-white font-bold text-lg leading-snug mb-4 line-clamp-2">
                  {featured.title}
                </h2>
                <p className="text-white/50 text-sm leading-relaxed line-clamp-2 mb-5">
                  {featured.excerpt}
                </p>
                <Link
                  href={`/${locale}/blogs/${featured.slug}`}
                  className="inline-flex items-center gap-2 text-teal text-xs font-black tracking-[0.15em] uppercase hover:gap-3 transition-all duration-200"
                >
                  {locale === "ar" ? "اقرأ المقال" : "Read Article"} <ArrowRight className={`w-3.5 h-3.5 ${locale === "ar" ? "rotate-180" : ""}`} />
                </Link>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
