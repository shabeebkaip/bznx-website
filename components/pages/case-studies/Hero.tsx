import { unescapeHTML } from "@/lib/utils";

export default function CaseStudiesHero({ data, locale }: { data: any; locale: string }) {
  const l = locale as 'en' | 'ar';
  
  const cmsStats = data?.stats || [];
  
  const STATS = cmsStats.length > 0 ? cmsStats.map((s: any) => ({
    value: s.value?.[l] || s.value || "",
    label: s.label?.[l] || s.label || ""
  })) : [
    { value: "15", label: (l === 'ar' ? "دراسة حالة" : "Case Studies") },
    { value: "12+", label: (l === 'ar' ? "قطاعاً مخدوماً" : "Industries Served") },
    { value: "95%", label: (l === 'ar' ? "التسليم في الوقت" : "On-Time Delivery") },
    { value: "45", label: (l === 'ar' ? "متوسط أيام العمل" : "Avg. Days to Operational") },
  ];

  return (
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
      {/* Glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/25 rounded-full px-4 py-2 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
            <span className="text-teal text-[10px] font-bold tracking-[0.3em] uppercase">
              {data?.badge?.[l] || (l === 'ar' ? "دراسات الحالة" : "Case Studies")}
            </span>
          </div>

          <h1 
            className={`text-white uppercase mb-8 ${l === 'ar' ? 'text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.2] tracking-normal' : 'text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tighter'}`}
            dangerouslySetInnerHTML={{ __html: unescapeHTML(data?.title?.[l] || (l === 'ar' ? "عمل حقيقي.<br /><span className='text-teal'>نتائج حقيقية.</span>" : "Real Work.<br /><span className='text-teal'>Real Results.</span>")) }}
          />

          <div 
            className="text-white/60 text-[19px] sm:text-lg leading-relaxed max-w-2xl ql-editor-view"
            dangerouslySetInnerHTML={{ __html: unescapeHTML(data?.description?.[l] || (l === 'ar' ? "تحكي كل مشاركة قصة. فيما يلي النتائج التي قدمناها للشركات التي تبني مستقبلها في المملكة العربية السعودية." : "Every engagement tells a story. Here are the outcomes we've delivered for companies building their future in the Kingdom of Saudi Arabia.")) }}
          />
        </div>

        {/* Stats row */}
        <div className="mt-10 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((stat: { value: string; label: string }, i: number) => (
            <div
              key={i}
              className="bg-white/[0.04] border border-white/[0.08] rounded-2xl px-6 py-5"
            >
              <p className="text-3xl font-black text-white tracking-tight mb-1">
                {stat.value}
              </p>
              <p className="text-white/35 text-xs font-medium tracking-wide uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
