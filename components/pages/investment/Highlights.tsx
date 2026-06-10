import type { ReactNode } from "react";

export default function InvestmentHighlightsSection({
  highlights,
}: {
  highlights: { label: ReactNode; value: ReactNode }[];
}) {
  return (
    <section className="py-20 bg-navy relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-md rounded-[32px] p-10 text-center border border-white/10 hover:bg-white/10 hover:-translate-y-2 transition-all duration-500 group"
            >
              <div className="text-4xl font-black mb-4 group-hover:scale-110 transition-transform text-teal">
                {h.value}
              </div>
              <div className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] leading-snug">{h.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

