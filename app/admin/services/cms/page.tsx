"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SnackbarProvider, useSnackbar } from "notistack";
import { 
  ChevronDown, 
  ExternalLink, 
  Trash2, 
  Plus, 
  Save, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  Sparkles,
  Layers,
  ThumbsUp,
  Image as ImageIcon
} from "lucide-react";
import TranslatableField from "@/components/admin/common/TranslatableField";
import ImageUploadField from "@/components/admin/common/ImageUploadField";
import AdminServicesFullPreview from "./FullPreview";

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface Bilingual {
  en: string;
  ar: string;
}

const b = (): Bilingual => ({ en: "", ar: "" });

const ensureBilingual = (val: any): Bilingual => {
  if (val && typeof val === "object" && !Array.isArray(val)) {
    return {
      en: typeof val.en === "string" ? val.en : "",
      ar: typeof val.ar === "string" ? val.ar : "",
    };
  }
  return { en: typeof val === "string" ? val : "", ar: "" };
};

const ensureImage = (img: any) => {
  if (!img) return { url: "", public_id: "", resource_type: "image" };
  if (typeof img === "string") return { url: img, public_id: "", resource_type: "image" };
  return {
    url: img.url || "",
    public_id: img.public_id || "",
    resource_type: img.resource_type || "image",
  };
};

function SectionCard({
  title,
  subtitle,
  icon,
  sectionKey,
  openSection,
  onToggle,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  sectionKey: string;
  openSection: string | null;
  onToggle: (k: string) => void;
  children: React.ReactNode;
}) {
  const isOpen = openSection === sectionKey;
  return (
    <div className={`bg-white rounded-2xl border transition-all duration-300 ${isOpen ? "border-[#00C4B4] shadow-lg shadow-[#00C4B4]/5" : "border-slate-100"}`}>
      <button
        onClick={() => onToggle(sectionKey)}
        className="w-full flex items-center justify-between p-5 text-left bg-transparent border-0 cursor-pointer outline-none"
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${isOpen ? "bg-[#00C4B4]/10 text-[#00C4B4]" : "bg-slate-50 text-slate-400"}`}>
            {icon}
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm tracking-tight">{title}</h4>
            <p className="text-slate-400 text-xs mt-0.5">{subtitle}</p>
          </div>
        </div>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#00C4B4]" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-slate-50 space-y-6">
          {children}
        </div>
      )}
    </div>
  );
}

function ServicesEditorInner() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("hero");
  const [previewLocale, setPreviewLocale] = useState<"en" | "ar">("ar");

  // Services CMS form state
  const [form, setForm] = useState<any>({
    hero: { badge: b(), title: b(), description: b(), primaryButtonText: b(), primaryButtonLink: "", secondaryButtonText: b(), secondaryButtonLink: "", image: { url: "" } },
    servicesHeading: { badge: b(), title: b(), description: b() },
    businessSetup: { badge: b(), title: b(), description: b(), features: [], ctaText: b(), ctaLink: "" },
    timelines: { badge: b(), title: b(), description: b(), stats: [] },
    cta: { title: b(), description: b(), ctaText: b(), ctaLink: "", ctaText2: b(), ctaLink2: "" },
  });

  const toggleSection = useCallback((key: string) => {
    setOpenSection(p => p === key ? null : key);
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/service-cms");
      const json = await res.json();
      if (json.status && Array.isArray(json.data)) {
        const get = (sec: string) => json.data.find((s: any) => s.section === sec)?.content ?? {};

        const hero = get("hero");
        const servicesHeading = get("servicesHeading");
        const businessSetup = get("businessSetup");
        const timelines = get("timelines");
        const cta = get("cta");

        setForm({
          hero: {
            badge: ensureBilingual(hero.badge),
            title: ensureBilingual(hero.title),
            description: ensureBilingual(hero.description),
            primaryButtonText: ensureBilingual(hero.primaryButtonText),
            primaryButtonLink: hero.primaryButtonLink || "",
            secondaryButtonText: ensureBilingual(hero.secondaryButtonText),
            secondaryButtonLink: hero.secondaryButtonLink || "",
            image: ensureImage(hero.image),
          },
          servicesHeading: {
            badge: ensureBilingual(servicesHeading.badge),
            title: ensureBilingual(servicesHeading.title),
            description: ensureBilingual(servicesHeading.description),
          },
          businessSetup: {
            badge: ensureBilingual(businessSetup.badge),
            title: ensureBilingual(businessSetup.title),
            description: ensureBilingual(businessSetup.description),
            features: Array.isArray(businessSetup.features) ? businessSetup.features.map((f: any) => ensureBilingual(f)) : [],
            ctaText: ensureBilingual(businessSetup.ctaText),
            ctaLink: businessSetup.ctaLink || "",
          },
          timelines: {
            badge: ensureBilingual(timelines.badge),
            title: ensureBilingual(timelines.title),
            description: ensureBilingual(timelines.description),
            stats: Array.isArray(timelines.stats) ? timelines.stats.map((item: any) => ({
              _id: item._id || Math.random().toString(),
              title: ensureBilingual(item.title),
              label: ensureBilingual(item.label),
            })) : [],
          },
          cta: {
            title: ensureBilingual(cta.title),
            description: ensureBilingual(cta.description),
            ctaText: ensureBilingual(cta.ctaText),
            ctaLink: cta.ctaLink || "",
            ctaText2: ensureBilingual(cta.ctaText2),
            ctaLink2: cta.ctaLink2 || "",
          },
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveSection = async (section: string, content: any) => {
    return fetch("/api/service-cms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, content }),
    }).then(r => r.json());
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const results = await Promise.all([
        saveSection("hero", form.hero),
        saveSection("servicesHeading", form.servicesHeading),
        saveSection("businessSetup", form.businessSetup),
        saveSection("timelines", form.timelines),
        saveSection("cta", form.cta),
      ]);
      
      if (results.every(r => r.status)) {
        enqueueSnackbar("Services page changes saved successfully", { variant: "success" });
      } else {
        enqueueSnackbar("Some sections failed to save", { variant: "error" });
      }
    } catch {
      enqueueSnackbar("An error occurred while saving", { variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const setField = (section: string, field: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[#00C4B4] font-black uppercase tracking-widest animate-pulse">Loading Services CMS...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* Sticky top editor bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/admin")}
            className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-slate-800 tracking-tight">Services Page Editor</h1>
            <p className="text-slate-400 text-xs">Manage BZNX services listing page content & live preview</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Preview locale toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/50">
            {(["en", "ar"] as const).map(l => (
              <button
                key={l}
                onClick={() => setPreviewLocale(l)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  previewLocale === l 
                    ? "bg-white text-[#00C4B4] shadow-sm" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPreviewMode(p => !p)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all cursor-pointer"
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

          <a
            href={`/admin/services/cms/preview?locale=${previewLocale}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all cursor-pointer decoration-none"
          >
            <ExternalLink size={14} /> Full Size
          </a>

          {/* Save Button */}
          <button
            disabled={saving}
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-[#00C4B4] hover:bg-[#00b2a3] text-white rounded-xl text-xs font-black uppercase shadow-md shadow-[#00C4B4]/10 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save size={14} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className={`grid gap-6 transition-all duration-300 ${previewMode ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"}`}>
          
          {/* ── LEFT: CMS input accordions ── */}
          {!previewMode && (
            <div className="lg:col-span-6 space-y-4">
              
              {/* 1. Hero Section */}
              <SectionCard title="Services Hero" subtitle="Top introductory banner" icon={<Sparkles size={16} />} sectionKey="hero" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Badge" value={form.hero.badge} onChange={v => setField("hero", "badge", v)} />
                <TranslatableField label="Title" type="quill" value={form.hero.title} onChange={v => setField("hero", "title", v)} />
                <TranslatableField label="Description" type="quill" value={form.hero.description} onChange={v => setField("hero", "description", v)} />
                
                <div className="grid grid-cols-2 gap-4">
                  <TranslatableField label="Primary Button Text" value={form.hero.primaryButtonText} onChange={v => setField("hero", "primaryButtonText", v)} />
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Primary Button Link</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-[#00C4B4]" value={form.hero.primaryButtonLink} onChange={e => setField("hero", "primaryButtonLink", e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100/50 pt-4">
                  <TranslatableField label="Secondary Button Text" value={form.hero.secondaryButtonText} onChange={v => setField("hero", "secondaryButtonText", v)} />
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Secondary Button Link</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-[#00C4B4]" value={form.hero.secondaryButtonLink} onChange={e => setField("hero", "secondaryButtonLink", e.target.value)} />
                  </div>
                </div>

                <ImageUploadField label="Hero Banner Image" value={form.hero.image} onChange={v => setField("hero", "image", v)} />
              </SectionCard>

              {/* 2. Services List Heading */}
              <SectionCard title="Services Listing Header" subtitle="Heading text above services grid" icon={<Layers size={16} />} sectionKey="servicesHeading" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Badge" value={form.servicesHeading.badge} onChange={v => setField("servicesHeading", "badge", v)} />
                <TranslatableField label="Title" type="quill" value={form.servicesHeading.title} onChange={v => setField("servicesHeading", "title", v)} />
                <TranslatableField label="Description" type="quill" value={form.servicesHeading.description} onChange={v => setField("servicesHeading", "description", v)} />
              </SectionCard>

              {/* 3. Business Setup (MISA) */}
              <SectionCard title="MISA Business Setup" subtitle="MISA License & benefits section" icon={<Sparkles size={16} />} sectionKey="businessSetup" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Badge" value={form.businessSetup.badge} onChange={v => setField("businessSetup", "badge", v)} />
                <TranslatableField label="Title" type="quill" value={form.businessSetup.title} onChange={v => setField("businessSetup", "title", v)} />
                <TranslatableField label="Description" type="quill" value={form.businessSetup.description} onChange={v => setField("businessSetup", "description", v)} />
                
                <div className="grid grid-cols-2 gap-4">
                  <TranslatableField label="CTA Button Text" value={form.businessSetup.ctaText} onChange={v => setField("businessSetup", "ctaText", v)} />
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">CTA Button Link</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-[#00C4B4]" value={form.businessSetup.ctaLink} onChange={e => setField("businessSetup", "ctaLink", e.target.value)} />
                  </div>
                </div>

                {/* Features list */}
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Benefits / Features</span>
                    <button
                      onClick={() => setForm((p: any) => ({ ...p, businessSetup: { ...p.businessSetup, features: [...p.businessSetup.features, b()] } }))}
                      className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                    >
                      <Plus size={10} /> Add Benefit
                    </button>
                  </div>
                  <div className="space-y-4">
                    {form.businessSetup.features.map((item: any, idx: number) => (
                      <div key={idx} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 flex items-start gap-4 relative">
                        <button
                          onClick={() => {
                            const list = form.businessSetup.features.filter((_: any, i: number) => i !== idx);
                            setField("businessSetup", "features", list);
                          }}
                          className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="flex-1">
                          <TranslatableField label={`Benefit #${idx + 1}`} value={item} onChange={v => {
                            const list = [...form.businessSetup.features];
                            list[idx] = v;
                            setField("businessSetup", "features", list);
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>

              {/* 4. Timelines Header & Stats */}
              <SectionCard title="MISA Registration Timeline" subtitle="Timeline header & steps list" icon={<ThumbsUp size={16} />} sectionKey="timelines" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Section Badge" value={form.timelines.badge} onChange={v => setField("timelines", "badge", v)} />
                <TranslatableField label="Section Title" type="quill" value={form.timelines.title} onChange={v => setField("timelines", "title", v)} />
                <TranslatableField label="Section Note/Description" type="quill" value={form.timelines.description} onChange={v => setField("timelines", "description", v)} />

                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Timeline Steps</span>
                    <button
                      onClick={() => setForm((p: any) => ({ ...p, timelines: { ...p.timelines, stats: [...p.timelines.stats, { _id: Math.random().toString(), title: b(), label: b() }] } }))}
                      className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                    >
                      <Plus size={10} /> Add Step
                    </button>
                  </div>
                  <div className="space-y-4">
                    {form.timelines.stats.map((item: any, idx: number) => (
                      <div key={item._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 flex items-start gap-4 relative">
                        <button
                          onClick={() => {
                            const list = form.timelines.stats.filter((_: any, i: number) => i !== idx);
                            setField("timelines", "stats", list);
                          }}
                          className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="flex-1 grid grid-cols-1 gap-4">
                          <TranslatableField label="Step Title" value={item.title} onChange={v => {
                            const list = [...form.timelines.stats];
                            list[idx].title = v;
                            setField("timelines", "stats", list);
                          }} />
                          <TranslatableField label="Step Duration (e.g. 1–2 Days)" value={item.label} onChange={v => {
                            const list = [...form.timelines.stats];
                            list[idx].label = v;
                            setField("timelines", "stats", list);
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>

              {/* 5. Services CTA */}
              <SectionCard title="Services Conversion CTA" subtitle="Bottom call to action banner" icon={<Layers size={16} />} sectionKey="cta" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="CTA Title" type="quill" value={form.cta.title} onChange={v => setField("cta", "title", v)} />
                <TranslatableField label="CTA Description" type="quill" value={form.cta.description} onChange={v => setField("cta", "description", v)} />
                
                <div className="grid grid-cols-2 gap-4">
                  <TranslatableField label="Primary Button Text" value={form.cta.ctaText} onChange={v => setField("cta", "ctaText", v)} />
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Primary Button Link</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-[#00C4B4]" value={form.cta.ctaLink} onChange={e => setField("cta", "ctaLink", e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100/50 pt-4">
                  <TranslatableField label="Secondary Button Text" value={form.cta.ctaText2} onChange={v => setField("cta", "ctaText2", v)} />
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Secondary Button Link</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-[#00C4B4]" value={form.cta.ctaLink2} onChange={e => setField("cta", "ctaLink2", e.target.value)} />
                  </div>
                </div>
              </SectionCard>

            </div>
          )}

          {/* ── RIGHT: full live preview ── */}
          <div className={previewMode ? "w-full" : "lg:col-span-6"}>
            <div className={previewMode ? "" : "sticky top-24 space-y-2"}>
              <div style={{ height: "80vh", overflowY: "auto", borderRadius: 14, border: "1px solid rgba(197,160,89,0.12)" }}>
                <AdminServicesFullPreview form={form} locale={previewLocale} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ServicesCMSPage() {
  return (
    <SnackbarProvider maxSnack={3}>
      <ServicesEditorInner />
    </SnackbarProvider>
  );
}
