"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Box, 
  Button, 
  Typography, 
  IconButton,
  CircularProgress
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import ServiceForm from "./ServiceForm";
import AdminServiceFullPreview from "./FullPreview";
import { Eye, EyeOff, ArrowLeft, ExternalLink, Save } from "lucide-react";

const initialTrans = { en: "", ar: "" };

interface ServiceManagerProps {
  id?: string;
}

export default function ServiceManager({ id }: ServiceManagerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewLocale, setPreviewLocale] = useState<"en" | "ar">("ar");
  const [formData, setFormData] = useState<any>({
    title: { ...initialTrans },
    slug: "",
    tag: { ...initialTrans },
    icon: null,
    description: { ...initialTrans },
    bullets: [{ ...initialTrans }],
    fullDescription: { ...initialTrans },
    timeline: { ...initialTrans },
    featuresSection: {
      badge: { ...initialTrans },
      title: { ...initialTrans },
      items: [{ title: { ...initialTrans }, description: { ...initialTrans } }]
    },
    processSection: {
      badge: { ...initialTrans },
      title: { ...initialTrans },
      items: [{ number: "01", title: { ...initialTrans }, description: { ...initialTrans } }]
    },
    deliverablesSection: {
      badge: { ...initialTrans },
      title: { ...initialTrans },
      items: [{ ...initialTrans }]
    },
    differenceSection: {
      badge: { ...initialTrans },
      title: { ...initialTrans },
      items: [{ title: { ...initialTrans }, description: { ...initialTrans } }]
    },
    otherServicesSection: {
      badge: { ...initialTrans },
      title: { ...initialTrans }
    }
  });

  useEffect(() => {
    if (id) {
      const fetchService = async () => {
        try {
          const res = await fetch(`/api/services?id=${id}`);
          const result = await res.json();
          if (result.status) {
            setFormData(result.data);
          } else {
            enqueueSnackbar("Service not found", { variant: "error" });
            router.push("/admin/services/list");
          }
        } catch (error) {
          enqueueSnackbar("Error fetching service", { variant: "error" });
        } finally {
          setLoading(false);
        }
      };
      fetchService();
    }
  }, [id, router]);

  const handleSave = async () => {
    if (!formData.title.en) {
      enqueueSnackbar("English Title is required", { variant: "error" });
      return;
    }

    setSaving(true);
    try {
      const method = id ? "PUT" : "POST";
      const body = id ? { id, ...formData } : formData;
      
      const res = await fetch("/api/services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (result.status) {
        enqueueSnackbar(`Service ${id ? "updated" : "created"} successfully`, { variant: "success" });
        router.push("/admin/services/list");
      } else {
        enqueueSnackbar(result.error || `Failed to ${id ? "update" : "create"} service`, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(`Error ${id ? "updating" : "saving"} service`, { variant: "error" });
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

  const updateArrayItem = (field: string, index: number, value: any) => {
    const newArr = [...formData[field]];
    newArr[index] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const addArrayItem = (field: string, defaultValue: any) => {
    setFormData({ ...formData, [field]: [...(formData[field] || []), defaultValue] });
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData({ ...formData, [field]: formData[field].filter((_: any, i: number) => i !== index) });
  };

  const updateSectionArrayItem = (section: string, index: number, value: any) => {
    const newItems = [...formData[section].items];
    newItems[index] = value;
    setFormData({
      ...formData,
      [section]: { ...formData[section], items: newItems }
    });
  };

  const addSectionArrayItem = (section: string, defaultValue: any) => {
    setFormData({
      ...formData,
      [section]: { ...formData[section], items: [...(formData[section].items || []), defaultValue] }
    });
  };

  const removeSectionArrayItem = (section: string, index: number) => {
    setFormData({
      ...formData,
      [section]: { ...formData[section], items: formData[section].items.filter((_: any, i: number) => i !== index) }
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
                {id ? "Edit Service" : "Create Service"}
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
                  <EyeOff size={14} /> Edit & Preview
                </>
              ) : (
                <>
                  <Eye size={14} /> Full Preview
                </>
              )}
            </button>
            {id && (
              <a
                href={`/admin/services/preview?id=${id}&locale=${previewLocale}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all cursor-pointer bg-white decoration-transparent"
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
                <ServiceForm 
                  formData={formData}
                  setFormData={setFormData}
                  updateSectionHeading={updateSectionHeading}
                  updateArrayItem={updateArrayItem}
                  addArrayItem={addArrayItem}
                  removeArrayItem={removeArrayItem}
                  updateSectionArrayItem={updateSectionArrayItem}
                  addSectionArrayItem={addSectionArrayItem}
                  removeSectionArrayItem={removeSectionArrayItem}
                  initialTrans={initialTrans}
                />
              </div>
            )}

            {/* Right side: Live preview */}
            <div className={previewMode ? "w-full" : "lg:col-span-6"}>
              <div className={previewMode ? "" : "sticky top-24 space-y-2"}>
                <div style={{ height: "80vh", overflowY: "auto", borderRadius: 14, border: "1px solid rgba(197,160,89,0.12)" }}>
                  <AdminServiceFullPreview form={formData} locale={previewLocale} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </SnackbarProvider>
  );
}
