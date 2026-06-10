import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Service from "@/lib/models/Service";
import ServiceCMS from "@/lib/models/ServiceCMS";
import { getSession } from "@/lib/auth";
import { NextIntlClientProvider } from "next-intl";
import ServiceDetailPage from "@/components/pages/services/Detail";

import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

export default async function AdminServicePreviewPage({
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
        <p className="text-slate-500 font-bold">No service ID specified for preview.</p>
      </div>
    );
  }

  await connectToDatabase();
  const service = await Service.findById(id).lean();

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500 font-bold">Service not found.</p>
      </div>
    );
  }

  const serializedService = JSON.parse(JSON.stringify(service));

  // Get related services (up to 3, excluding the current one)
  const relatedServices = await Service.find({ _id: { $ne: id } }).limit(3).lean();
  const serializedRelated = JSON.parse(JSON.stringify(relatedServices));

  // Get CTA section data
  const cmsData = await ServiceCMS.findOne({ section: 'cta' }).lean();
  const cta = cmsData?.content ? JSON.parse(JSON.stringify(cmsData.content)) : {};

  return (
    <NextIntlClientProvider locale={l} messages={l === "ar" ? arMessages : enMessages}>
      <div dir={l === "ar" ? "rtl" : "ltr"}>
        <main>
          <ServiceDetailPage 
            service={serializedService} 
            related={serializedRelated} 
            cta={cta}
            locale={l} 
          />
        </main>
      </div>
    </NextIntlClientProvider>
  );
}