"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  IconButton,
  CircularProgress
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import BlogForm from "./BlogForm";
import AdminBlogFullPreview from "./FullPreview";
import { Eye, EyeOff, ArrowLeft, ExternalLink, Save } from "lucide-react";
const initialTrans = { en: "", ar: "" };

interface BlogManagerProps {
  id?: string;
}

export default function BlogManager({ id }: BlogManagerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewLocale, setPreviewLocale] = useState<"en" | "ar">("ar");
  const [formData, setFormData] = useState<any>({
    title: { ...initialTrans },
    slug: "",
    category: { ...initialTrans },
    excerpt: { ...initialTrans },
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readTime: { ...initialTrans },
    featured: false,
    image: null,
    gradient: "linear-gradient(135deg, #0A1D37 0%, #1A2B5A 50%, #243370 100%)",
    author: { ...initialTrans },
    
    contentSection: {
      content: []
    },

    ctaSection: {
      title: { ...initialTrans },
      description: { ...initialTrans },
      ctaText: { ...initialTrans },
      ctaLink: "",
      ctaText2: { ...initialTrans },
      ctaLink2: ""
    }
  });
useEffect(() => {
}, [formData.featured]);
  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const res = await fetch(`/api/blogs?id=${id}`);
          const result = await res.json();
          if (result.status) {
            setFormData(result.data);
          } else {
            enqueueSnackbar("Blog not found", { variant: "error" });
            router.push("/admin/blogs/list");
          }
        } catch (error) {
          enqueueSnackbar("Error fetching blog", { variant: "error" });
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id, router]);

  const handleSave = async () => {
    if (!formData.title.en) {
      enqueueSnackbar("English Title is required", { variant: "error" });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.status) {
        enqueueSnackbar(`Blog ${id ? "updated" : "created"} successfully`, { variant: "success" });
        router.push("/admin/blogs/list");
      } else {
        enqueueSnackbar(result.error || `Failed to ${id ? "update" : "create"} blog`, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(`Error ${id ? "updating" : "saving"} blog`, { variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const updateSectionHeading = (section: string, field: string, value: any) => {
    setFormData({
      ...formData,
      [section]: { ...formData[section], [field]: value }
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <CircularProgress size={30} sx={{ color: '#00C4B4' }} />
    </div>
  );

  return (
    <SnackbarProvider maxSnack={3}>
      <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
        {/* Sticky top editor bar */}
        <div className="sticky top-0 z-50 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-500 hover:text-slate-800 border-0 bg-transparent cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
          <h1 className="text-base font-extrabold text-slate-800 tracking-tight">
              {id ? "Edit Blog Post" : "Create Blog Post"}
            </h1>
             <p className="text-slate-400 text-xs">
              {id ? `Editing: ${formData.title?.en}` : "Arabic & English Multi-language"}
            </p>
          </div>
        </div>

          <div className="flex items-center gap-3">
            {/* Preview locale toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/50">
              {(["en", "ar"] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setPreviewLocale(l)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-0 cursor-pointer ${
                    previewLocale === l 
                      ? "bg-white text-[#00C4B4] shadow-sm" 
                      : "text-slate-500 hover:text-slate-800 bg-transparent"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPreviewMode(p => !p)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all cursor-pointer bg-white"
            >
              {previewMode ? (
                <>
                  <EyeOff size={14} /> Edit &amp; Preview
                </>
              ) : (
                <>
                  <Eye size={14} /> Full Preview
                </>
              )}
            </button>
            {id && (
                <a
                  href={`/admin/blogs/preview?id=${id}&locale=${previewLocale}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all cursor-pointer bg-white"
                >
                  <ExternalLink size={14} /> Full Size
                </a>
              )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-[#00C4B4] hover:bg-[#00b0a2] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#00C4B4]/10 disabled:opacity-50 border-0 cursor-pointer"
            >
              <Save size={14} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">
          <div className={`grid gap-6 transition-all duration-300 ${previewMode ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"}`}>
            
            {/* Left side: Form fields */}
            {!previewMode && (
              <div className="lg:col-span-6 space-y-4">

        <BlogForm
          formData={formData}
          setFormData={setFormData}
          updateSectionHeading={updateSectionHeading}
          initialTrans={initialTrans}
        />
   </div>
            )}

            {/* Right side: Live preview */}
            <div className={previewMode ? "w-full" : "lg:col-span-6"}>
              <div className={previewMode ? "" : "sticky top-24 space-y-2"}>
                <div style={{ height: "80vh", overflowY: "auto", borderRadius: 14, border: "1px solid rgba(197,160,89,0.12)" }}>
                  <AdminBlogFullPreview form={formData} locale={previewLocale} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </SnackbarProvider>
  );
}
