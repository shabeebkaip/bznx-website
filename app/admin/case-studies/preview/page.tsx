import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import CaseStudy from "@/lib/models/CaseStudy";
import { getSession } from "@/lib/auth";
import { NextIntlClientProvider } from "next-intl";
import { getCaseStudies, localizeCaseStudy } from "@/lib/cms";
import CaseStudyDetailPage from "@/components/pages/case-studies/Detail";

import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

export default async function AdminCaseStudyPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; locale?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id, locale = "ar" } = await searchParams;
  const l = locale as "en" | "ar";

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500 font-bold">No case study ID specified for preview.</p>
      </div>
    );
  }

  await connectToDatabase();
  const caseStudy = await CaseStudy.findById(id).lean();

  if (!caseStudy) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500 font-bold">Case study not found.</p>
      </div>
    );
  }

  const serializedCaseStudy = JSON.parse(JSON.stringify(caseStudy));
  const resolvedCaseStudy = localizeCaseStudy(serializedCaseStudy, l);

  if (!resolvedCaseStudy) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500 font-bold">Failed to load localized case study.</p>
      </div>
    );
  }

  const allStudies = await getCaseStudies(l);
  const related = allStudies.filter((s: any) => s.slug !== resolvedCaseStudy.slug).slice(0, 2);

  return (
    <NextIntlClientProvider locale={l} messages={l === "ar" ? arMessages : enMessages}>
      <div dir={l === "ar" ? "rtl" : "ltr"}>
        <main>
          <CaseStudyDetailPage 
            study={resolvedCaseStudy as any} 
            related={related} 
            locale={l} 
          />
        </main>
      </div>
    </NextIntlClientProvider>
  );
}