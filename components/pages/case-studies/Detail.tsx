"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, MapPin, Building2, Check, Quote } from "lucide-react";
import { unescapeHTML } from "@/lib/utils";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function CaseStudyDetailPage({
  study,
  related,
  locale,
}: {
  study: any;
  related: any[];
  locale: string;
}) {
  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden pt-24">
        <Image
          src={study.image}
          alt={study.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#091d37]/70" />
        <div className="absolute inset-0 bg-linear-to-t from-[#091d37] via-[#091d37]/40 to-transparent" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-20">
          {/* Breadcrumb */}
          <Link
            href={`/${locale}/case-studies`}
            className="inline-flex items-center gap-2 text-white/40 hover:text-teal text-xs font-bold tracking-[0.15em] uppercase transition-colors duration-200 mb-10"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {locale === 'ar' ? 'العودة لقصص النجاح' : 'Back to Case Studies'}
          </Link>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-block bg-teal/15 border border-teal/30 text-teal text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full">
                {study.tag}
              </span>
              <span className="text-white/30 text-xs font-black tabular-nums">
                {study.id}
              </span>
            </div>

            <h1 className="text-[28px] sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-[0.95] mb-8"
              dangerouslySetInnerHTML={{ __html: unescapeHTML(study.title) }}
            />

            {/* Metadata row */}
            <div className="flex flex-wrap gap-6 mb-10">
              {[
                { icon: Building2, label: study.industry },
                { icon: Clock, label: study.duration },
                { icon: MapPin, label: study.location },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-white/45 text-sm">
                  <Icon className="w-4 h-4 text-teal/60" />
                  {label}
                </div>
              ))}
            </div>

            {/* Outcome badge */}
            <div className="inline-flex items-center gap-2 bg-teal text-[#091d37] font-black text-sm tracking-wide px-5 py-2.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-[#091d37]/30" />
              {study.outcome}
            </div>
          </div>
        </div>
      </section>

      {/* ─── OVERVIEW ─────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">

            {/* Challenge */}
            <div>
              <p className="text-teal text-xs font-bold tracking-[0.3em] uppercase mb-4">
                {study.challengeSection?.badge || (locale === 'ar' ? 'التحدي' : 'The Challenge')}
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-[#091d37] uppercase tracking-tighter leading-tight mb-6"
                dangerouslySetInnerHTML={{ __html: unescapeHTML(study.challengeSection?.title || (locale === 'ar' ? 'ما واجهوه' : 'What They Faced')) }}
              />
              <div 
                className="text-[#091d37]/60 text-base leading-relaxed mb-6"
                dangerouslySetInnerHTML={{ __html: unescapeHTML(study.challengeSection?.content || study.challenge) }}
              />

              {/* Services used */}
              <div className="mt-8 pt-8 border-t border-[#091d37]/[0.07]">
                <p className="text-[#091d37]/35 text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
                  {locale === 'ar' ? 'الخدمات المقدمة' : 'Services Delivered'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {study.services?.map((s: string) => (
                    <span
                      key={s}
                      className="text-xs font-bold text-[#091d37]/60 tracking-wide border border-[#091d37]/12 rounded-full px-4 py-1.5"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Key results sidebar */}
            <div className="lg:sticky lg:top-28">
              <div className="bg-[#091d37] rounded-3xl p-8">
                <p className="text-teal text-[10px] font-bold tracking-[0.3em] uppercase mb-6">
                  {study.resultsSection?.badge || (locale === 'ar' ? 'النتائج الرئيسية' : 'Key Outcomes')}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {study.resultsSection?.items?.map((r: any) => (
                    <div key={r.label} className="bg-white/[0.05] rounded-2xl p-4">
                      <p className="text-white font-black text-2xl leading-none mb-1.5">
                        {r.value}
                      </p>
                      <p className="text-white/35 text-[10px] font-medium leading-snug">
                        {r.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Client type */}
                <div className="mt-6 pt-6 border-t border-white/[0.08]">
                  <p className="text-white/25 text-[10px] font-bold tracking-[0.2em] uppercase mb-1">
                    {locale === 'ar' ? 'العميل' : 'Client'}
                  </p>
                  <p className="text-white/70 text-sm font-semibold">{study.clientType}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── APPROACH ─────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 bg-[#091d37]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-teal text-xs font-bold tracking-[0.3em] uppercase mb-4">
              {study.approachSection?.badge || (locale === 'ar' ? 'كيف قمنا بحلها' : 'How We Solved It')}
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-tight"
              dangerouslySetInnerHTML={{ __html: unescapeHTML(study.approachSection?.title || (locale === 'ar' ? 'نهجنا' : 'Our Approach')) }}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {study.approachSection?.items?.map((step: any, i: number) => (
              <div
                key={i}
                className="relative p-8 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.05] hover:border-teal/20 transition-all duration-300"
              >
                {/* Step number */}
                <span className={`text-white/10 font-black text-5xl tabular-nums absolute top-5 select-none leading-none ${locale === 'ar' ? 'left-6' : 'right-6'}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Teal dot connector */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-teal/15 border border-teal/25 flex items-center justify-center shrink-0">
                    <span className="text-teal text-[10px] font-black">{i + 1}</span>
                  </div>
                  <div className="h-px flex-1 bg-teal/15" />
                </div>

                <h3 className="text-white font-black text-base uppercase tracking-tight mb-3"
                  dangerouslySetInnerHTML={{ __html: unescapeHTML(step.title) }}
                />
                <div className="text-white/45 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: unescapeHTML(step.description) }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DELIVERABLES ─────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid gap-16 items-center ${(study.testimonial?.quote || study.cta?.title) ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
            <div>
              <p className="text-teal text-xs font-bold tracking-[0.3em] uppercase mb-4">
                {study.deliverablesSection?.badge || (locale === 'ar' ? 'ما قدمناه' : 'What We Delivered')}
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-[#091d37] uppercase tracking-tighter leading-tight mb-8"
                dangerouslySetInnerHTML={{ __html: unescapeHTML(study.deliverablesSection?.title || (locale === 'ar' ? 'النطاق الكامل' : 'Full Scope')) }}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {study.deliverablesSection?.items?.map((d: string) => (
                  <div key={d} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal/12 border border-teal/25 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-teal" />
                    </div>
                    <span className="text-[#091d37]/65 text-sm leading-snug">{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial or CTA panel */}
            {study.testimonial?.quote ? (
              <div className="bg-[#091d37] rounded-3xl p-10 relative overflow-hidden">
                <Quote className={`w-12 h-12 text-teal/20 absolute top-6 ${locale === 'ar' ? 'left-8' : 'right-8'}`} />
                <div className="flex items-center gap-1.5 mb-8">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-teal fill-teal" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="text-white/75 text-base leading-relaxed italic mb-8"
                  dangerouslySetInnerHTML={{ __html: `&ldquo;${unescapeHTML(study.testimonial.quote)}&rdquo;` }}
                />
                <div className="pt-6 border-t border-white/[0.08]">
                  <p className="text-white font-bold text-sm">{study.testimonial.author}</p>
                  <p className="text-white/35 text-xs mt-0.5">{study.testimonial.role}</p>
                </div>
              </div>
            ) : study.cta?.title ? (
              <div className="bg-teal/5 border border-teal/15 rounded-3xl p-10 flex flex-col justify-between gap-8">
                <div>
                  <p className="text-teal text-xs font-bold tracking-[0.3em] uppercase mb-3"
                    dangerouslySetInnerHTML={{ __html: unescapeHTML(study.cta?.title || (locale === 'ar' ? 'تحدٍ مماثل؟' : 'Similar Challenge?')) }}
                  />
                  <h3 className="text-[#091d37] font-black text-2xl uppercase tracking-tight leading-tight"
                    dangerouslySetInnerHTML={{ __html: unescapeHTML(study.cta?.description || (locale === 'ar' ? 'يمكننا القيام بنفس الشيء من أجلك' : 'We Can Do The Same For You')) }}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href={study.cta?.ctaLink || `/${locale}/contact`}
                    className="inline-flex items-center justify-center gap-2 bg-teal text-[#091d37] text-xs font-black tracking-[0.15em] uppercase px-6 py-3 rounded-full hover:bg-teal/90 transition-colors duration-200"
                  >
                    {study.cta?.ctaText || (locale === 'ar' ? 'ابدأ الآن' : 'Get Started')} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                {study.cta?.ctaLink2 && (
                  <a
                    href={study.cta.ctaLink2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-[#091d37]/15 text-[#091d37]/60 text-xs font-bold tracking-[0.1em] uppercase px-6 py-3 rounded-full hover:border-teal/40 hover:text-teal transition-colors duration-200"
                  >
                    {study.cta.ctaLink2.includes('wa.me') ? <WhatsAppIcon className="w-3.5 h-3.5" /> : null}
                    {study.cta?.ctaText2 || (locale === 'ar' ? 'واتساب' : 'WhatsApp')}
                  </a>
                )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ─── RELATED ──────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 bg-[#091d37]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-teal text-xs font-bold tracking-[0.3em] uppercase mb-4">
                {study.relatedSection?.badge || (locale === 'ar' ? 'المزيد من قصص النجاح' : 'More Case Studies')}
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-tight">
                {study.relatedSection?.title ? (
                   <span dangerouslySetInnerHTML={{ __html: unescapeHTML(study.relatedSection.title) }} />
                ) : (
                  <>{locale === 'ar' ? 'شاهد المزيد من' : 'See More'} <span className="text-white/25">{locale === 'ar' ? 'أعمالنا' : 'Work'}</span></>
                )}
              </h2>
            </div>
            <Link
              href={`/${locale}/case-studies`}
              className="hidden sm:inline-flex items-center gap-2 text-white/40 hover:text-teal text-xs font-bold tracking-[0.15em] uppercase transition-colors duration-200"
            >
              {locale === 'ar' ? 'عرض الكل' : 'View All'} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {related.map((cs) => (
              <Link
                key={cs.slug}
                href={`/${locale}/case-studies/${cs.slug}`}
                className="group relative rounded-2xl overflow-hidden h-64 cursor-pointer"
              >
                <Image
                  src={cs.image}
                  alt={cs.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#091d37]/95 via-[#091d37]/40 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  <div className="flex items-start justify-between">
                    <span className="inline-block bg-teal/15 border border-teal/30 text-teal text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full">
                      {cs.tag}
                    </span>
                    <span className="text-white/20 text-xs font-black tabular-nums">{cs.id}</span>
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                      <span className="text-white text-[10px] font-bold tracking-wide">{cs.outcome}</span>
                    </div>
                    <h3 className="text-white font-black text-base uppercase tracking-tight leading-snug mb-1">
                      {cs.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-teal text-[10px] font-bold tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                      {locale === 'ar' ? 'اقرأ المزيد' : 'Read Case Study'} <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-24 bg-teal relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#091d37]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-[0.95] mb-6">
            {locale === 'ar' ? <>جاهز لكتابة<br /><span className="text-[#091d37]">قصة نجاحك؟</span></> : <>Ready To Write<br /><span className="text-[#091d37]">Your Story?</span></>}
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
            {locale === 'ar' ? 'أخبرنا عن تحديك. وسنخبرك كيف نحله.' : "Tell us your challenge. We'll tell you how we solve it."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}/contact`}
              className="px-10 py-4 rounded-full bg-[#091d37] text-white font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#091d37]/20"
            >
              {locale === 'ar' ? 'ابدأ التعامل معنا' : 'Start Your Engagement'}
            </Link>
            <a
              href="https://wa.me/966598958838"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-white/20 text-white font-black border-2 border-white/40 uppercase tracking-widest text-xs hover:bg-white hover:text-[#091d37] transition-all"
            >
              <WhatsAppIcon className="w-4 h-4" /> {locale === 'ar' ? 'راسلنا واتساب' : 'WhatsApp Us'}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
