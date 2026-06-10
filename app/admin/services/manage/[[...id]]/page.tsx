"use client";

import { use } from "react";
import ServiceManager from "@/components/admin/services/ServiceManager";

export default function ManageServicePage({ params }: { params: Promise<{ id?: string[] }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id?.[0]; // Get the first element of the catch-all array
  
  return <ServiceManager id={id} />;
}
