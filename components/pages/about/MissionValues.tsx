"use client";

import { Target, Eye, Shield, Zap, Users, Globe, LucideIcon } from "lucide-react";
import { unescapeHTML } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Target,
  Eye,
  Shield,
  Zap,
  Users,
  Globe
};

export default function AboutMissionValues({ 
  locale,
  mission,
  vision,
  valuesHeader,
  values 
}: { 
  locale: string;
  mission: any;
  vision: any;
  valuesHeader: any;
  values: any;
}) {
  const l = locale as 'en' | 'ar';

  return (
    <section className="py-12 sm:py-24 bg-[#091d37] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Mission & Vision cards */}
        <div className="grid lg:grid-cols-2 gap-6 mb-20">
          {/* Mission */}
        {mission && (
          <div className="relative rounded-2xl overflow-hidden p-6 sm:p-10 bg-white/[0.03] border border-white/[0.07]">
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-teal/50 via-teal/20 to-transparent" />
            <p className="text-teal text-[10px] font-bold tracking-[0.3em] uppercase mb-6">
              {mission.badge?.[l] || (l === 'ar' ? "مهمتنا" : "Our Mission")}
            </p>
            <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-tight mb-6"
              dangerouslySetInnerHTML={{ __html: unescapeHTML(mission.title?.[l] || (l === 'ar' ? "اجعل المملكة العربية السعودية<br /><span className='text-white/25'>متاحة لكل</span><br />عمل تجاري عالمي" : "Make Saudi Arabia<br /><span className='text-white/25'>Accessible to Every</span><br />Global Business")) }}
            />
            <div  className="text-white/45 text-sm leading-relaxed ql-editor-view"
              dangerouslySetInnerHTML={{ __html: unescapeHTML(mission.description?.[l]) }}
            />
          </div>
        )}

          {/* Vision */}
        {vision && (
          <div className="relative rounded-2xl overflow-hidden p-6 sm:p-10 bg-teal/[0.06] border border-teal/15">
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-teal/60 via-teal/30 to-transparent" />
            <p className="text-teal text-[10px] font-bold tracking-[0.3em] uppercase mb-6">
              {vision.badge?.[l] || (l === 'ar' ? "رؤيتنا" : "Our Vision")}
            </p>
            <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-tight mb-6"
              dangerouslySetInnerHTML={{ __html: unescapeHTML(vision.title?.[l] || (l === 'ar' ? "أن نكون الشريك رقم 1<br /><span className='text-white/25'>لتأسيس الأعمال</span><br />في المملكة" : "To Be The #1<br /><span className='text-white/25'>Business Setup Partner</span><br />In The Kingdom")) }}
            />
            <div  className="text-white/45 text-sm leading-relaxed ql-editor-view"
              dangerouslySetInnerHTML={{ __html: unescapeHTML(vision.description?.[l]) }}
            />
          </div>
        )}
        </div>

        {/* Values grid */}
        <div>
          <div className="mb-12">
            <p className="text-teal text-xs font-bold tracking-[0.3em] uppercase mb-4">
              {valuesHeader?.badge?.[l] || (l === 'ar' ? "قيمنا" : "Our Values")}
            </p>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter"
              dangerouslySetInnerHTML={{ __html: unescapeHTML(valuesHeader?.title?.[l] || (l === 'ar' ? "ما <span class='text-white/25'>نمثله</span>" : "What We <span class='text-white/25'>Stand For</span>")) }}
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Array.isArray(values) ? values : values?.items || []).map((value: any, i: number) => {
              const Icon = ICON_MAP[value.icon] || Globe;
              return (
                <div
                  key={i}
                  className="group bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 sm:p-7 hover:border-teal/30 hover:bg-teal/[0.04] transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center mb-5 group-hover:bg-teal/15 transition-colors duration-300 overflow-hidden">
                    {((typeof value.image === "string" ? value.image : value.image?.url)) ? (
                      <img 
                        src={(typeof value.image === "string" ? value.image : value.image?.url)} 
                        alt="" 
                        className="w-7 h-7 object-cover" 
                      />
                    ) : (
                      <Icon className="w-5 h-5 text-teal" />
                    )}
                  </div>
                  <h4 className="text-white font-black text-sm uppercase tracking-wider mb-3">
                    {value.title?.[l]}
                  </h4>
                  <div  className="text-white/45 text-xs leading-relaxed ql-editor-view"
                    dangerouslySetInnerHTML={{ __html: unescapeHTML(value.description?.[l]) }}
                  />
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
