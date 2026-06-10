import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost, ContentBlock } from "@/lib/blog-data";
import { unescapeHTML, cleanTitle } from "@/lib/utils";

function renderBlock(block: ContentBlock, idx: number, locale: string) {
  const l = locale as "en" | "ar";
  
  const getVal = (val: any) => {
    if (!val) return "";
    if (typeof val === 'string') return val;
    return val[l] || val['en'] || "";
  };

  const getItems = (items: any) => {
    if (!items) return [];
    if (Array.isArray(items)) return items;
    return items[l] || items['en'] || [];
  };

  switch (block.type) {
    case "paragraph":
      return (
        <p
          key={idx}
          className="text-slate-600 text-base sm:text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: unescapeHTML(getVal(block.text)) }}
        />
      );

    case "heading":
      return (
        <h2
          key={idx}
          className="text-2xl sm:text-3xl font-black tracking-tight mt-10 mb-4"
          style={{ color: "#0A1D37" }}
          dangerouslySetInnerHTML={{ __html: cleanTitle(getVal(block.text)) }}
        />
      );

    case "subheading":
      return (
        <h3
          key={idx}
          className="text-lg sm:text-xl font-bold mt-6 mb-3"
          style={{ color: "#1A2B5A" }}
          dangerouslySetInnerHTML={{ __html: cleanTitle(getVal(block.text)) }}
        />
      );

    case "bullets":
      return (
        <ul key={idx} className="space-y-3 my-4">
          {getItems(block.items).map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0"
                style={{ backgroundColor: "#26D0CE" }}
              />
              <span className="text-slate-600 text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: unescapeHTML(item) }}
              />
            </li>
          ))}
        </ul>
      );

    case "numbered":
      return (
        <ol key={idx} className="space-y-3 my-4">
          {getItems(block.items).map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-4">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
                style={{ backgroundColor: "#0A1D37", color: "#26D0CE" }}
              >
                {i + 1}
              </span>
              <span className="text-slate-600 text-base leading-relaxed flex-1"
                dangerouslySetInnerHTML={{ __html: unescapeHTML(item) }}
              />
            </li>
          ))}
        </ol>
      );

    case "quote":
      return (
        <blockquote
          key={idx}
          className="my-8 pl-6 border-l-4 py-4 bg-[#F8F9FC] rounded-r-2xl pr-6"
          style={{ borderColor: "#26D0CE" }}
        >
          <p className="text-slate-700 text-lg italic leading-relaxed mb-2"
            dangerouslySetInnerHTML={{ __html: unescapeHTML(getVal(block.text)) }}
          />
          {getVal(block.author) && (
            <cite className="text-slate-400 text-xs font-bold tracking-widest uppercase not-italic">
              — {getVal(block.author)}
            </cite>
          )}
        </blockquote>
      );

    case "callout":
      return (
        <div
          key={idx}
          className="my-6 rounded-2xl p-6 border"
          style={{
            backgroundColor: "rgba(38,208,206,0.06)",
            borderColor: "rgba(38,208,206,0.25)",
          }}
        >
          <p
            className="text-xs font-black tracking-[0.2em] uppercase mb-2"
            style={{ color: "#26D0CE" }}
            dangerouslySetInnerHTML={{ __html: cleanTitle(getVal(block.title)) }}
          />
          <p className="text-slate-700 text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: unescapeHTML(getVal(block.text)) }}
          />
        </div>
      );

    default:
      return null;
  }
}

function RelatedCard({
  post,
  locale,
}: {
  post: BlogPost;
  locale: string;
}) {
  return (
    <Link
      href={`/${locale}/blogs/${post.slug}`}
      className="group flex gap-4 items-start bg-white rounded-2xl p-4 border border-slate-100 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
    >
      <div className="relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="80px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 min-w-0">
        <span
          className="text-[9px] font-bold tracking-[0.2em] uppercase"
          style={{ color: "#26D0CE" }}
        >
          {post.category}
        </span>
        <p
          className="text-sm font-bold leading-snug mt-0.5 line-clamp-2 group-hover:text-teal transition-colors duration-200"
          style={{ color: "#1A2B5A" }}
          dangerouslySetInnerHTML={{ __html: cleanTitle(post.title) }}
        />
      </div>
    </Link>
  );
}

export default function BlogDetailContent({
  post,
  locale,
  relatedPosts = [],
}: {
  post: BlogPost;
  locale: string;
  relatedPosts?: BlogPost[];
}) {
  const others = relatedPosts;

  return (
    <section className="py-10 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-16">
          {/* Article body */}
          <article className="max-w-none">
            {/* Excerpt lead */}
            <p
              className="text-xl font-medium leading-relaxed mb-10 pb-10 border-b border-slate-100"
              style={{ color: "#1A2B5A" }}
              dangerouslySetInnerHTML={{ __html: unescapeHTML(post.excerpt) }}
            />

            <div className="space-y-5">
              {post.content.map((block, idx) => renderBlock(block, idx, locale))}
            </div>

            {/* CTA strip */}
            <div
              className="mt-10 sm:mt-16 rounded-3xl p-6 sm:p-10"
              style={{ background: "linear-gradient(135deg, #0A1D37 0%, #1A2B5A 100%)" }}
            >
              <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/25 rounded-full px-4 py-2 mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                <span className="text-teal text-[10px] font-bold tracking-[0.3em] uppercase">
                  {post.ctaSection?.badge 
                    ? unescapeHTML(post.ctaSection.badge)
                    : (locale === "ar" ? "هل أنت مستعد للبدء؟" : "Ready to Start?")
                  }
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter leading-none mb-4"
                dangerouslySetInnerHTML={{ 
                  __html: post.ctaSection?.title 
                    ? unescapeHTML(post.ctaSection.title) 
                    : (locale === "ar" ? "دع BZNX تتولى <br /> <span style='color: #26D0CE'>التعقيدات</span>" : unescapeHTML(`Let BZNX Handle <br /> <span style="color: #26D0CE">The Complexity</span>`))
                }}
              />
              <p className="text-white/55 text-sm leading-relaxed mb-6 max-w-md">
                {post.ctaSection?.description 
                  ? unescapeHTML(post.ctaSection.description)
                  : (locale === "ar" 
                    ? "فريقنا من خبراء الأعمال السعوديين مستعد لإرشادك من الخطوات الأولى إلى العمليات الكاملة - بامتثال وكفاءة." 
                    : "Our team of Saudi business experts is ready to guide you from first steps to full operations — compliantly and efficiently.")
                }
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={post.ctaSection?.ctaLink || `/${locale}/contact`}
                  className="inline-flex items-center gap-2 bg-teal text-[#091d37] text-xs font-black tracking-[0.15em] uppercase px-7 py-3.5 rounded-full hover:bg-teal/90 transition-colors duration-200"
                >
                  {post.ctaSection?.ctaText 
                    ? unescapeHTML(post.ctaSection.ctaText)
                    : (locale === "ar" ? "احصل على استشارة مجانية" : "Get a Free Consultation")
                  } <ArrowRight className={`w-3.5 h-3.5 ${locale === "ar" ? "rotate-180" : ""}`} />
                </Link>
                <Link
                  href={post.ctaSection?.ctaLink2 || `/${locale}/services`}
                  className="inline-flex items-center gap-2 border border-white/20 text-white text-xs font-black tracking-[0.15em] uppercase px-7 py-3.5 rounded-full hover:border-white/40 transition-colors duration-200"
                >
                  {post.ctaSection?.ctaText2 
                    ? unescapeHTML(post.ctaSection.ctaText2)
                    : (locale === "ar" ? "خدماتنا" : "Our Services")
                  }
                </Link>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* About tag */}
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: "#F8F9FC" }}
            >
              <p className="text-xs font-black tracking-[0.2em] uppercase mb-3" style={{ color: "#0A1D37" }}>
                {locale === "ar" ? "حول هذا المقال" : "About This Article"}
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">{locale === "ar" ? "الفئة" : "Category"}</span>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: `#26D0CE15`,
                      color: "#26D0CE",
                    }}
                  >
                    {post.category}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">{locale === "ar" ? "تاريخ النشر" : "Published"}</span>
                  <span className="text-slate-700 text-xs font-bold">{post.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">{locale === "ar" ? "مدة القراءة" : "Read time"}</span>
                  <span className="text-slate-700 text-xs font-bold">{post.readTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">{locale === "ar" ? "المؤلف" : "Author"}</span>
                  <span className="text-slate-700 text-xs font-bold">{locale === "ar" ? "فريق تحرير BZNX" : "BZNX Editorial"}</span>
                </div>
              </div>
            </div>

            {/* Related articles */}
            {others.length > 0 && (
              <div>
                <p className="text-xs font-black tracking-[0.2em] uppercase mb-4" style={{ color: "#0A1D37" }}>
                  {locale === "ar" ? "مقالات ذات صلة" : "Related Articles"}
                </p>
                <div className="space-y-3">
                  {others.map((p) => (
                    <RelatedCard key={p.slug} post={p} locale={locale} />
                  ))}
                </div>
              </div>
            )}

            {/* Quick links */}
            <div
              className="rounded-2xl p-6 border"
              style={{
                backgroundColor: "rgba(38,208,206,0.04)",
                borderColor: "rgba(38,208,206,0.2)",
              }}
            >
              <p
                className="text-xs font-black tracking-[0.2em] uppercase mb-4"
                style={{ color: "#26D0CE" }}
              >
                {locale === "ar" ? "روابط سريعة" : "Quick Links"}
              </p>
              <div className="space-y-2">
                {[
                  { label: locale === "ar" ? "تأسيس الشركات" : "Company Formation", href: `/${locale}/services` },
                  { label: locale === "ar" ? "الخدمات الحكومية (PRO)" : "PRO Services", href: `/${locale}/services` },
                  { label: locale === "ar" ? "الاستشارات الاستثمارية" : "Investment Advisory", href: `/${locale}/investment` },
                  { label: locale === "ar" ? "اتصل بفريقنا" : "Contact Our Team", href: `/${locale}/contact` },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center justify-between py-2 border-b border-teal/10 last:border-0 group"
                  >
                    <span className="text-slate-600 text-xs font-bold group-hover:text-teal transition-colors duration-200">
                      {link.label}
                    </span>
                    <ArrowRight className={`w-3 h-3 text-slate-300 group-hover:text-teal transition-colors duration-200 ${locale === "ar" ? "rotate-180" : ""}`} />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
