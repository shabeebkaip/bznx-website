"use client";
import Link from "next/link";
import { ArrowRight, Building2, FileText, SearchCheck, BarChart3, Scale, BookOpen, Monitor } from "lucide-react";
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

export default function ServicesAll({ locale, heading, services }: { locale: string; heading: any; services: any[] }) {
  const l = locale as 'en' | 'ar';


  return (
    <section className="py-12 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
          <div>
            <p className="text-teal text-xs font-bold tracking-[0.3em] uppercase mb-4">{heading?.badge?.[l] || "What We Do"}</p>
            <h2 className="text-3xl sm:text-5xl font-black text-[#091d37] uppercase tracking-tighter leading-[0.95]"
              dangerouslySetInnerHTML={{ __html: unescapeHTML(heading?.title?.[l] || "Our Services") }}
            />
          </div>
          <div  className="text-[#091d37]/45 text-sm leading-relaxed max-w-xs sm:text-right ql-editor-view"
            dangerouslySetInnerHTML={{ __html: unescapeHTML(heading?.description?.[l] || "Comprehensive support for every stage of your Saudi Arabia business journey.") }}
          />
        </div>

        {/* Services grid — 2 columns */}
        <div className="grid md:grid-cols-2 gap-4">
          {services.map((service) => {
            const Icon = iconMap[service.slug] || Building2;
            return (
              <div
                key={service.slug}
                className="group flex flex-col sm:flex-row gap-4 sm:gap-6 p-5 sm:p-7 rounded-2xl border border-[#091d37]/[0.07] hover:border-teal/30 hover:bg-teal/[0.02] transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-teal/8 border border-teal/15 flex items-center justify-center shrink-0 group-hover:bg-teal transition-all duration-300 overflow-hidden">
                  {service.icon?.url ? (
                    <img 
                      src={service.icon.url} 
                      alt={service.title?.[l]} 
                      className="w-5 h-5 object-cover transition-all duration-300 group-hover:brightness-0 group-hover:invert"
                    />
                  ) : (
                    <Icon className="w-5 h-5 text-teal group-hover:text-white transition-colors duration-300" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-teal/70">{service.tag?.[l]}</span>
                  </div>
                  <h3 className="text-[#091d37] font-black text-base uppercase tracking-tight mb-2">
                    {service.title?.[l]}
                  </h3>
                  <p className="text-[#091d37]/50 text-xs leading-relaxed mb-4">
                    {service.description?.[l]}
                  </p>

                  {/* Bullets */}
                  <div className="grid grid-cols-1 min-[370px]:grid-cols-2 gap-x-4 gap-y-1 mb-5">
                    {(service.bullets || []).map((bullet: any, i: number) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-teal/50 shrink-0" />
                        <span className="text-[#091d37]/40 text-[10px] font-medium leading-snug">{bullet[l]}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#091d37]/[0.06]">
                    <Link
                      href={`/${locale}/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 bg-teal text-[#091d37] text-[10px] font-black tracking-[0.15em] uppercase px-4 py-2 rounded-full hover:bg-teal/90 transition-colors duration-200"
                    >
                      {locale === 'ar' ? 'اعرف المزيد' : 'Learn More'} <ArrowRight className="w-3 h-3" />
                    </Link>
                    <a
                      href="https://wa.me/966598958838"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 border border-[#091d37]/10 text-[#091d37]/50 text-[10px] font-bold tracking-[0.1em] uppercase px-4 py-2 rounded-full hover:border-teal/40 hover:text-teal transition-colors duration-200"
                    >
                      <WhatsAppIcon className="w-3 h-3" /> {locale === 'ar' ? 'واتساب' : 'WhatsApp'}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
