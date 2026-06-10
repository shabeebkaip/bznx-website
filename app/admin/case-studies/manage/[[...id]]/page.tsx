"use client";

import { use } from "react";
import CaseStudyManager from "@/components/admin/case-studies/CaseStudyManager";

export default function ManageCaseStudyPage({ params }: { params: Promise<{ id?: string[] }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id?.[0];
  
  return <CaseStudyManager id={id} />;
}
