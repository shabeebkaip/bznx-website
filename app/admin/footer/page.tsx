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
import AdminFooterFullPreview from "./FullPreview";

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

function FooterEditorInner() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("footerMain");
  const [previewLocale, setPreviewLocale] = useState<"en" | "ar">("ar");

  // Footer CMS form state
  const [form, setForm] = useState<any>({
    footerStats: { items: [] },
    footerMain: { brandDescription: b(), phone: b(), email: b(), address: b() },
    footerNavigate: { items: [] },
    footerServices: { items: [] },
    footerSocials: { items: [] },
  });

  const toggleSection = useCallback((key: string) => {
    setOpenSection(p => p === key ? null : key);
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/footer");
      const json = await res.json();
      if (json.status && Array.isArray(json.data)) {
        const get = (sec: string) => json.data.find((s: any) => s.section === sec)?.content ?? {};

        const footerStats = get("footerStats");
        const footerMain = get("footerMain");
        const footerNavigate = get("footerNavigate");
        const footerServices = get("footerServices");
        const footerSocials = get("footerSocials");

        setForm({
          footerMain: {
            brandDescription: ensureBilingual(footerMain.brandDescription),
            phone: ensureBilingual(footerMain.phone),
            email: ensureBilingual(footerMain.email),
            address: ensureBilingual(footerMain.address),
          },
          footerStats: {
            items: Array.isArray(footerStats.items) ? footerStats.items.map((item: any) => ({
              _id: item._id || Math.random().toString(),
              value: ensureBilingual(item.value),
              label: ensureBilingual(item.label),
            })) : [],
          },
          footerNavigate: {
            items: Array.isArray(footerNavigate.items) ? footerNavigate.items.map((item: any) => ({
              _id: item._id || Math.random().toString(),
              title: ensureBilingual(item.title),
              href: item.href || "",
            })) : [],
          },
          footerServices: {
            items: Array.isArray(footerServices.items) ? footerServices.items.map((item: any) => ({
              _id: item._id || Math.random().toString(),
              title: ensureBilingual(item.title),
              href: item.href || "",
            })) : [],
          },
          footerSocials: {
            items: Array.isArray(footerSocials.items) ? footerSocials.items.map((item: any) => ({
              _id: item._id || Math.random().toString(),
              platform: ensureBilingual(item.platform),
              url: item.url || "",
              image: ensureImage(item.image),
            })) : [],
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
    return fetch("/api/footer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, content }),
    }).then(r => r.json());
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const results = await Promise.all([
        saveSection("footerMain", form.footerMain),
        saveSection("footerStats", form.footerStats),
        saveSection("footerNavigate", form.footerNavigate),
        saveSection("footerServices", form.footerServices),
        saveSection("footerSocials", form.footerSocials),
      ]);
      
      if (results.every(r => r.status)) {
        enqueueSnackbar("Footer changes saved successfully", { variant: "success" });
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
        <div className="text-[#00C4B4] font-black uppercase tracking-widest animate-pulse">Loading Footer CMS...</div>
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
            <h1 className="text-base font-extrabold text-slate-800 tracking-tight">Footer Editor</h1>
            <p className="text-slate-400 text-xs">Manage BZNX global footer sections & preview</p>
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
            href={`/admin/footer/preview?locale=${previewLocale}`}
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
              
              {/* 1. Brand description & Contacts */}
              <SectionCard title="Company Information" subtitle="Brand details & contacts" icon={<Sparkles size={16} />} sectionKey="footerMain" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Brand Description" type="quill" value={form.footerMain.brandDescription} onChange={v => setField("footerMain", "brandDescription", v)} />
                <TranslatableField label="Phone Contact" value={form.footerMain.phone} onChange={v => setField("footerMain", "phone", v)} />
                <TranslatableField label="Email Address" value={form.footerMain.email} onChange={v => setField("footerMain", "email", v)} />
                <TranslatableField label="Office Address" value={form.footerMain.address} onChange={v => setField("footerMain", "address", v)} />
              </SectionCard>

              {/* 2. Stats Strip */}
              <SectionCard title="Footer Stats Strip" subtitle="Global stats counters" icon={<ThumbsUp size={16} />} sectionKey="footerStats" openSection={openSection} onToggle={toggleSection}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Counters</span>
                  <button
                    onClick={() => setForm((p: any) => ({ ...p, footerStats: { ...p.footerStats, items: [...p.footerStats.items, { _id: Math.random().toString(), value: b(), label: b() }] } }))}
                    className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                  >
                    <Plus size={10} /> Add Counter
                  </button>
                </div>
                <div className="space-y-4">
                  {form.footerStats.items.map((item: any, idx: number) => (
                    <div key={item._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 flex items-start gap-4 relative">
                      <button
                        onClick={() => {
                          const list = form.footerStats.items.filter((_: any, i: number) => i !== idx);
                          setField("footerStats", "items", list);
                        }}
                        className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="flex-1 grid grid-cols-1 gap-4">
                        <TranslatableField label="Value" value={item.value} onChange={v => {
                          const list = [...form.footerStats.items];
                          list[idx].value = v;
                          setField("footerStats", "items", list);
                        }} />
                        <TranslatableField label="Label" value={item.label} onChange={v => {
                          const list = [...form.footerStats.items];
                          list[idx].label = v;
                          setField("footerStats", "items", list);
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* 3. Navigation Links */}
              <SectionCard title="Navigate Links" subtitle="Company page paths" icon={<Layers size={16} />} sectionKey="footerNavigate" openSection={openSection} onToggle={toggleSection}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Links</span>
                  <button
                    onClick={() => setForm((p: any) => ({ ...p, footerNavigate: { ...p.footerNavigate, items: [...p.footerNavigate.items, { _id: Math.random().toString(), title: b(), href: "" }] } }))}
                    className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                  >
                    <Plus size={10} /> Add Link
                  </button>
                </div>
                <div className="space-y-4">
                  {form.footerNavigate.items.map((item: any, idx: number) => (
                    <div key={item._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 space-y-4 relative">
                      <button
                        onClick={() => {
                          const list = form.footerNavigate.items.filter((_: any, i: number) => i !== idx);
                          setField("footerNavigate", "items", list);
                        }}
                        className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                      <TranslatableField label="Link Title" value={item.title} onChange={v => {
                        const list = [...form.footerNavigate.items];
                        list[idx].title = v;
                        setField("footerNavigate", "items", list);
                      }} />
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Link Target Path</label>
                        <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-[#00C4B4]" value={item.href} onChange={e => {
                          const list = [...form.footerNavigate.items];
                          list[idx].href = e.target.value;
                          setField("footerNavigate", "items", list);
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* 4. Service Links */}
              <SectionCard title="Service Links" subtitle="Practice area paths" icon={<Layers size={16} />} sectionKey="footerServices" openSection={openSection} onToggle={toggleSection}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Links</span>
                  <button
                    onClick={() => setForm((p: any) => ({ ...p, footerServices: { ...p.footerServices, items: [...p.footerServices.items, { _id: Math.random().toString(), title: b(), href: "" }] } }))}
                    className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                  >
                    <Plus size={10} /> Add Link
                  </button>
                </div>
                <div className="space-y-4">
                  {form.footerServices.items.map((item: any, idx: number) => (
                    <div key={item._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 space-y-4 relative">
                      <button
                        onClick={() => {
                          const list = form.footerServices.items.filter((_: any, i: number) => i !== idx);
                          setField("footerServices", "items", list);
                        }}
                        className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                      <TranslatableField label="Link Title" value={item.title} onChange={v => {
                        const list = [...form.footerServices.items];
                        list[idx].title = v;
                        setField("footerServices", "items", list);
                      }} />
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Link Target Path</label>
                        <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-[#00C4B4]" value={item.href} onChange={e => {
                          const list = [...form.footerServices.items];
                          list[idx].href = e.target.value;
                          setField("footerServices", "items", list);
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* 5. Social Links */}
              <SectionCard title="Social Links" subtitle="External platform URLs & icons" icon={<ThumbsUp size={16} />} sectionKey="footerSocials" openSection={openSection} onToggle={toggleSection}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Social Networks</span>
                  <button
                    onClick={() => setForm((p: any) => ({ ...p, footerSocials: { ...p.footerSocials, items: [...p.footerSocials.items, { _id: Math.random().toString(), platform: b(), url: "", image: { url: "" } }] } }))}
                    className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                  >
                    <Plus size={10} /> Add Platform
                  </button>
                </div>
                <div className="space-y-6">
                  {form.footerSocials.items.map((item: any, idx: number) => (
                    <div key={item._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 space-y-4 relative">
                      <button
                        onClick={() => {
                          const list = form.footerSocials.items.filter((_: any, i: number) => i !== idx);
                          setField("footerSocials", "items", list);
                        }}
                        className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                      <h5 className="font-extrabold text-xs text-slate-700 uppercase">Social Link #{idx + 1}</h5>
                      <TranslatableField label="Platform Name" value={item.platform} onChange={v => {
                        const list = [...form.footerSocials.items];
                        list[idx].platform = v;
                        setField("footerSocials", "items", list);
                      }} />
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Social Link URL</label>
                        <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-[#00C4B4]" value={item.url} onChange={e => {
                          const list = [...form.footerSocials.items];
                          list[idx].url = e.target.value;
                          setField("footerSocials", "items", list);
                        }} />
                      </div>
                      <ImageUploadField label="Platform SVG Icon" value={item.image} onChange={v => {
                        const list = [...form.footerSocials.items];
                        list[idx].image = v;
                        setField("footerSocials", "items", list);
                      }} />
                    </div>
                  ))}
                </div>
              </SectionCard>

            </div>
          )}

          {/* ── RIGHT: full live preview — updates instantly ── */}
          <div className={previewMode ? "w-full" : "lg:col-span-6"}>
            <div className={previewMode ? "" : "sticky top-24 space-y-2"}>
              <div style={{ height: "80vh", overflowY: "auto", borderRadius: 14, border: "1px solid rgba(197,160,89,0.12)" }}>
                <AdminFooterFullPreview form={form} locale={previewLocale} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function FooterAdminPage() {
  return (
    <SnackbarProvider maxSnack={3}>
      <FooterEditorInner />
    </SnackbarProvider>
  );
}
