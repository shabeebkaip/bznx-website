"use client";

import { use } from "react";
import BlogManager from "@/components/admin/blogs/BlogManager";

export default function ManageBlogPage({ params }: { params: Promise<{ id?: string[] }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id?.[0];
  
  return <BlogManager id={id} />;
}
