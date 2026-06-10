import { use } from "react";
import Link from "next/link";
import InvestmentSectors from "@/components/sections/InvestmentSectors";
import InvestmentStrategy from "@/components/sections/InvestmentStrategy";
import RegistrationProcess from "@/components/sections/RegistrationProcess";
import MisaLicenseSection from "@/components/sections/MisaLicenseSection";
import { getTranslations } from "next-intl/server";
import InvestmentHeroSection from "@/components/pages/investment/Hero";
import InvestmentHighlightsSection from "@/components/pages/investment/Highlights";
import InvestmentCtaSection from "@/components/pages/investment/CTA";
import InvestmentExecutiveSummarySection from "@/components/pages/investment/ExecutiveSummary";
import InvestmentNextStepsSection from "@/components/pages/investment/NextSteps";

export default async function InvestmentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("investment");
  const highlights = t.raw("highlights") as { label: string; value: string }[];

  return (
    <div>
      <InvestmentHeroSection
        badge={
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6" style={{ background: "rgba(200,162,74,0.12)", color: "#C8A24A", border: "1px solid rgba(200,162,74,0.3)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#C8A24A" }} />
            {t("badge")}
          </span>
        }
        title={t("title")}
        sub={t("sub")}
      />

      <InvestmentHighlightsSection
        highlights={highlights.map((h) => ({ label: h.label, value: h.value }))}
      />

      {/* Executive Summary */}
      <InvestmentExecutiveSummarySection locale={locale} />

      {/* 4 Investment Sectors */}
      <InvestmentSectors locale={locale} showCta={false} />

      {/* Investment Strategy + Highlights */}
      <InvestmentStrategy locale={locale} />

      {/* Registration Process */}
      <RegistrationProcess locale={locale} />

      {/* Next steps / invitation to investors */}
      <InvestmentNextStepsSection locale={locale} />

      <MisaLicenseSection locale={locale} />

      <InvestmentCtaSection locale={locale} />
    </div>
  );
}
