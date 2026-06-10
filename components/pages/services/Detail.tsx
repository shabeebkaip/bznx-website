import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Clock, Building2, FileText, SearchCheck, BarChart3, Scale, BookOpen, Monitor } from "lucide-react";
import CTASection from "@/components/sections/CTASection";
import { unescapeHTML } from "@/lib/utils";

const iconMap: { [key: string]: any } = {
  "company-formation": Building2,
  "pro-services": FileText,
  "financial-due-diligence": SearchCheck,
  "audit-tax-compliance": BarChart3,
  "legal-advisory": Scale,
  "bookkeeping-payroll": BookOpen,
  "erp-implementation": Monitor
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function ServiceDetailPage({ service, locale, related, cta }: { service: any; locale: string; related: any[]; cta: any }) {
  const l = locale as 'en' | 'ar';
  const Icon = iconMap[service.slug] || Building2;

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 sm:pt-40 sm:pb-24 bg-[#091d37] overflow-hidden">
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-teal/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center gap-2 text-white/40 hover:text-teal text-xs font-bold tracking-[0.15em] uppercase transition-colors duration-200 mb-12"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {locale === 'ar' ? 'العودة للخدمات' : 'All Services'}
          </Link>

          <div className="grid lg:grid-cols-[1fr_360px] gap-12 items-center">
            <div>
              {/* Tag */}
              <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/25 rounded-full px-4 py-2 mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                <span className="text-teal text-[10px] font-bold tracking-[0.3em] uppercase">
                  {service.tag?.[l]}
                </span>
              </div>

              <h1 className="text-3xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-6"
                dangerouslySetInnerHTML={{ __html: unescapeHTML(service.title?.[l]) }}
              />
              <div  className="text-white/50 text-lg leading-relaxed max-w-2xl mb-8 ql-editor-view"
                dangerouslySetInnerHTML={{ __html: unescapeHTML(service.fullDescription?.[l]) }}
              />

              {/* Timeline badge */}
              <div className="inline-flex items-center gap-2 border border-white/[0.12] rounded-full px-5 py-2.5">
                <Clock className="w-3.5 h-3.5 text-teal" />
                <span className="text-white/60 text-xs font-bold tracking-wide">
                  {locale === 'ar' ? 'الجدول الزمني:' : 'Typical Timeline:'} <span className="text-teal">{service.timeline?.[l]}</span>
                </span>
              </div>
            </div>

            {/* Right: icon block + quick bullets */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-8">
              <div className="w-14 h-14 rounded-2xl bg-teal/15 border border-teal/25 flex items-center justify-center mb-6 overflow-hidden">
                {service.icon?.url ? (
                  <img src={service.icon.url} alt={service.title?.[l]} className="w-7 h-7 object-cover" />
                ) : (
                  <Icon className="w-7 h-7 text-teal" />
                )}
              </div>
              <p className="text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                {locale === 'ar' ? 'النقاط الرئيسية' : 'Key Deliverables'}
              </p>
              <div className="flex flex-col gap-3">
                {(service.bullets || []).map((b: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal/15 border border-teal/25 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-teal" />
                    </div>
                    <span className="text-white/60 text-sm">{b[l]}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3">
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center justify-center gap-2 bg-teal text-[#091d37] text-xs font-black tracking-[0.15em] uppercase px-6 py-3 rounded-full hover:bg-teal/90 transition-colors duration-200"
                >
                  {locale === 'ar' ? 'ابدأ الآن' : 'Get Started'} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href="https://wa.me/966598958838"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/50 text-xs font-bold tracking-[0.1em] uppercase px-6 py-3 rounded-full hover:border-teal/40 hover:text-teal transition-colors duration-200"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5" /> {locale === 'ar' ? 'راسلنا واتساب' : 'WhatsApp Us'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-teal text-xs font-bold tracking-[0.3em] uppercase mb-4">
              {service.featuresSection?.badge?.[l] || "What's Included"}
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-[#091d37] uppercase tracking-tighter leading-tight"
              dangerouslySetInnerHTML={{ __html: unescapeHTML(service.featuresSection?.title?.[l] || "Everything Covered <span class='text-[#091d37]/25'>For You</span>") }}
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(service.featuresSection?.items || []).map((feature: any, i: number) => (
              <div
                key={i}
                className="group p-7 rounded-2xl border border-[#091d37]/[0.07] hover:border-teal/30 hover:bg-teal/[0.02] transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-teal/10 border border-teal/20 flex items-center justify-center mb-5">
                  <Check className="w-4 h-4 text-teal" />
                </div>
                <h3 className="text-[#091d37] font-black text-sm uppercase tracking-tight mb-2"
                  dangerouslySetInnerHTML={{ __html: unescapeHTML(feature.title?.[l]) }}
                />
                <p className="text-[#091d37]/50 text-xs leading-relaxed">
                  {feature.description?.[l]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCESS ──────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 bg-[#091d37]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-teal text-xs font-bold tracking-[0.3em] uppercase mb-4">
              {service.processSection?.badge?.[l] || "How It Works"}
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-tight"
              dangerouslySetInnerHTML={{ __html: unescapeHTML(service.processSection?.title?.[l] || "Our <span class='text-white/25'>Process</span>") }}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {(service.processSection?.items || []).map((step: any, i: number) => (
              <div
                key={i}
                className="relative p-8 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.05] hover:border-teal/20 transition-all duration-300"
              >
                <span className="text-white/8 font-black text-6xl tabular-nums absolute top-4 right-6 rtl:left-6 rtl:right-auto select-none leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-full bg-teal/15 border border-teal/25 flex items-center justify-center shrink-0">
                    <span className="text-teal text-[10px] font-black">{i + 1}</span>
                  </div>
                  <div className="h-px flex-1 bg-teal/15" />
                </div>
                <h3 className="text-white font-black text-base uppercase tracking-tight mb-3"
                  dangerouslySetInnerHTML={{ __html: unescapeHTML(step.title?.[l]) }}
                />
                <p className="text-white/45 text-sm leading-relaxed">
                  {step.description?.[l]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DELIVERABLES + WHY BZNX ──────────────────────────────── */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">

            {/* Deliverables */}
            <div>
              <p className="text-teal text-xs font-bold tracking-[0.3em] uppercase mb-4">
                {service.deliverablesSection?.badge?.[l] || "What You Receive"}
              </p>
              <h2 className="text-3xl font-black text-[#091d37] uppercase tracking-tighter leading-tight mb-8"
                dangerouslySetInnerHTML={{ __html: unescapeHTML(service.deliverablesSection?.title?.[l] || "Full <span class='text-[#091d37]/25'>Deliverables</span>") }}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(service.deliverablesSection?.items || []).map((d: any, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal/12 border border-teal/25 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-teal" />
                    </div>
                    <span className="text-[#091d37]/65 text-sm leading-snug">{d[l]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Why BZNX */}
            <div>
              <p className="text-teal text-xs font-bold tracking-[0.3em] uppercase mb-4">
                {service.differenceSection?.badge?.[l] || "Why Choose BZNX"}
              </p>
              <h2 className="text-3xl font-black text-[#091d37] uppercase tracking-tighter leading-tight mb-8"
                dangerouslySetInnerHTML={{ __html: unescapeHTML(service.differenceSection?.title?.[l] || "Our <span class='text-[#091d37]/25'>Difference</span>") }}
              />
              <div className="flex flex-col gap-5">
                {(service.differenceSection?.items || []).map((item: any, i: number) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#091d37] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-teal text-[10px] font-black">0{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-[#091d37] font-black text-sm uppercase tracking-tight mb-1"
                        dangerouslySetInnerHTML={{ __html: unescapeHTML(item.title?.[l]) }}
                      />
                      <p className="text-[#091d37]/50 text-sm leading-relaxed">
                        {item.description?.[l]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── OTHER SERVICES ───────────────────────────────────────── */}
      <section className="py-12 sm:py-20 bg-[#091d37]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-teal text-xs font-bold tracking-[0.3em] uppercase mb-4">
                {service.otherServicesSection?.badge?.[l] || "Explore More"}
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-tight"
                dangerouslySetInnerHTML={{ __html: unescapeHTML(service.otherServicesSection?.title?.[l] || "Other <span class='text-white/25'>Services</span>") }}
              />
            </div>
            <Link
              href={`/${locale}/services`}
              className="hidden sm:inline-flex items-center gap-2 text-white/40 hover:text-teal text-xs font-bold tracking-[0.15em] uppercase transition-colors duration-200"
            >
              {locale === 'ar' ? 'عرض الكل' : 'View All'} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((s) => {
              const RelIcon = iconMap[s.slug] || Building2;
              return (
                <Link
                  key={s.slug}
                  href={`/${locale}/services/${s.slug}`}
                  className="group p-7 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.05] hover:border-teal/25 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-teal/50 text-[10px] font-bold tracking-[0.2em] uppercase">
                      {s.tag?.[l]}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden group-hover:bg-teal transition-all duration-300">
                      {s.icon?.url ? (
                        <img 
                          src={s.icon.url} 
                          alt={s.title?.[l]} 
                          className="w-5 h-5 object-cover transition-all duration-300 group-hover:brightness-0 group-hover:invert" 
                        />
                      ) : (
                        <RelIcon className="w-5 h-5 text-white/20 group-hover:text-white transition-colors duration-300" />
                      )}
                    </div>
                  </div>
                  <h3 className="text-white font-black text-sm uppercase tracking-tight mb-2 group-hover:text-teal transition-colors duration-300">
                    {s.title?.[l]}
                  </h3>
                  <p className="text-white/35 text-xs leading-relaxed mb-4">
                    {s.description?.[l]}
                  </p>
                  <div className="flex items-center gap-1.5 text-teal text-[10px] font-bold tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {locale === 'ar' ? 'اعرف المزيد' : 'Learn More'} <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      
      <CTASection data={cta} />
    </>
  );
}
