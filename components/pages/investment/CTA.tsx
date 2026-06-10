import Link from "next/link";

export default function InvestmentCtaSection({ locale }: { locale: string }) {
  return (
    <section className="py-20" style={{ background: "linear-gradient(135deg, #0d1a38 0%, #1A2B5A 100%)" }}>
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-extrabold text-white mb-4">
          {locale === "ar" ? "هل أنت مستعد للاستثمار؟" : "Ready to Invest?"}
        </h2>
        <p className="text-white/60 text-lg mb-8">
          {locale === "ar"
            ? "تواصل مع فريقنا لاستكشاف فرص الاستثمار المتاحة"
            : "Connect with our team to explore available investment opportunities"}
        </p>
        <Link
          href={`/${locale}/contact`}
          className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-white transition-all hover:scale-105 hover:shadow-xl neon-breathe"
          style={{ background: "linear-gradient(135deg, #00C4B4, #00A899)", boxShadow: "0 0 25px rgba(0,196,180,0.3)" }}
        >
          {locale === "ar" ? "تحدث مع خبير" : "Speak with an Expert"}
          <span>{locale === "ar" ? "←" : "→"}</span>
        </Link>
      </div>
    </section>
  );
}

