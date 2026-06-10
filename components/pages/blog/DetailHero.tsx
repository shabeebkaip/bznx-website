import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import type { BlogPost } from "@/lib/blog-data";
import { unescapeHTML } from "@/lib/utils";

export default function BlogDetailHero({
  post,
  locale,
}: {
  post: BlogPost;
  locale: string;
}) {
  return (
    <section className="relative min-h-[65vh] flex items-end overflow-hidden pt-20">
      {/* Background image */}
      <Image
        src={post.image}
        alt={post.title}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[#091d37]/75" />
      <div className="absolute inset-0 bg-linear-to-t from-[#091d37] via-[#091d37]/50 to-transparent" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-20">
        {/* Back link */}
        <Link
          href={`/${locale}/blogs`}
          className="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs font-bold tracking-[0.15em] uppercase transition-colors duration-200 mb-8 group"
        >
          <ArrowLeft className={`w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform ${locale === "ar" ? "rotate-180" : ""}`} />
          {locale === "ar" ? "العودة إلى المدونة" : "Back to Blog"}
        </Link>

        <div className="max-w-3xl">
          {/* Category */}
          <div className="flex items-center gap-3 mb-5">
            <span
              className="text-[10px] font-bold tracking-[0.25em] uppercase px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: `#26D0CE20`,
                color: "#26D0CE",
                border: `1px solid #26D0CE40`,
              }}
            >
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-[28px] sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-[0.92] mb-6"
            dangerouslySetInnerHTML={{ __html: unescapeHTML(post.title) }}
          />

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Calendar className="w-3.5 h-3.5" />
              <span>{post.date}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-white/50 text-sm">{locale === "ar" ? "فريق تحرير BZNX" : "BZNX Editorial Team"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
