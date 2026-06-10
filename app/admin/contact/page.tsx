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
  Image as ImageIcon,
  MessageSquare
} from "lucide-react";
import TranslatableField from "@/components/admin/common/TranslatableField";
import ImageUploadField from "@/components/admin/common/ImageUploadField";
import AdminContactFullPreview from "./FullPreview";

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

function ContactEditorInner() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("heroSection");
  const [previewLocale, setPreviewLocale] = useState<"en" | "ar">("ar");

  // Contact CMS form state
  const [form, setForm] = useState<any>({
    heroSection: { badge: b(), title: b(), description: b(), image: { url: "" } },
    contactStats: { items: [] },
    contactFormHeader: {
      leftBadge: b(), leftTitle: b(), leftDescription: b(),
      rightBadge: b(), rightTitle: b(), rightDescription: b()
    },
    contactNextSteps: { badge: b(), items: [] },
    contactMethods: { items: [] },
  });

  const toggleSection = useCallback((key: string) => {
    setOpenSection(p => p === key ? null : key);
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/contact");
      const json = await res.json();
      if (json.status && Array.isArray(json.data)) {
        const get = (sec: string) => json.data.find((s: any) => s.section === sec)?.content ?? {};

        const heroSection = get("heroSection");
        const contactStats = get("contactStats");
        const contactFormHeader = get("contactFormHeader");
        const contactNextSteps = get("contactNextSteps");
        const contactMethods = get("contactMethods");

        setForm({
          heroSection: {
            badge: ensureBilingual(heroSection.badge),
            title: ensureBilingual(heroSection.title),
            description: ensureBilingual(heroSection.description),
            image: ensureImage(heroSection.image),
          },
          contactStats: {
            items: Array.isArray(contactStats.items) ? contactStats.items.map((item: any) => ({
              _id: item._id || Math.random().toString(),
              value: ensureBilingual(item.value),
              label: ensureBilingual(item.label),
            })) : [],
          },
          contactFormHeader: {
            leftBadge: ensureBilingual(contactFormHeader.leftBadge),
            leftTitle: ensureBilingual(contactFormHeader.leftTitle),
            leftDescription: ensureBilingual(contactFormHeader.leftDescription),
            rightBadge: ensureBilingual(contactFormHeader.rightBadge),
            rightTitle: ensureBilingual(contactFormHeader.rightTitle),
            rightDescription: ensureBilingual(contactFormHeader.rightDescription),
          },
          contactNextSteps: {
            badge: ensureBilingual(contactNextSteps.badge),
            items: Array.isArray(contactNextSteps.items) ? contactNextSteps.items.map((item: any) => ({
              _id: item._id || Math.random().toString(),
              title: ensureBilingual(item.title),
              description: ensureBilingual(item.description),
            })) : [],
          },
          contactMethods: {
            items: Array.isArray(contactMethods.items) ? contactMethods.items.map((item: any) => ({
              _id: item._id || Math.random().toString(),
              label: ensureBilingual(item.label),
              value: ensureBilingual(item.value),
              image: ensureImage(item.image),
              href: item.href || "",
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
    return fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, content }),
    }).then(r => r.json());
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const results = await Promise.all([
        saveSection("heroSection", form.heroSection),
        saveSection("contactStats", form.contactStats),
        saveSection("contactFormHeader", form.contactFormHeader),
        saveSection("contactNextSteps", form.contactNextSteps),
        saveSection("contactMethods", form.contactMethods),
      ]);

      if (results.every(r => r.status)) {
        enqueueSnackbar("Contact page changes saved successfully", { variant: "success" });
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
        <div className="text-[#00C4B4] font-black uppercase tracking-widest animate-pulse">Loading Contact CMS...</div>
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
            <h1 className="text-base font-extrabold text-slate-800 tracking-tight">Contact Page Editor</h1>
            <p className="text-slate-400 text-xs">Manage BZNX contact page content & live preview</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Preview locale toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/50">
            {(["en", "ar"] as const).map(l => (
              <button
                key={l}
                onClick={() => setPreviewLocale(l)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${previewLocale === l
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
            href={`/admin/contact/preview?locale=${previewLocale}`}
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
              <SectionCard title="Contact Hero" subtitle="Main introduction banner" icon={<Sparkles size={16} />} sectionKey="heroSection" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Badge" value={form.heroSection.badge} onChange={v => setField("heroSection", "badge", v)} />
                <TranslatableField label="Title" type="quill" value={form.heroSection.title} onChange={v => setField("heroSection", "title", v)} />
                <TranslatableField label="Description" type="quill" value={form.heroSection.description} onChange={v => setField("heroSection", "description", v)} />
                <ImageUploadField label="Hero Banner Image" value={form.heroSection.image} onChange={v => setField("heroSection", "image", v)} />
              </SectionCard>

              {/* 2. Contact Stats */}
              <SectionCard title="Contact Stats" subtitle="Performance stats" icon={<ThumbsUp size={16} />} sectionKey="contactStats" openSection={openSection} onToggle={toggleSection}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Stats Cards</span>
                  <button
                    onClick={() => setForm((p: any) => ({ ...p, contactStats: { ...p.contactStats, items: [...p.contactStats.items, { _id: Math.random().toString(), value: b(), label: b() }] } }))}
                    className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                  >
                    <Plus size={10} /> Add Stat
                  </button>
                </div>
                <div className="space-y-4">
                  {form.contactStats.items.map((item: any, idx: number) => (
                    <div key={item._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 flex items-start gap-4 relative">
                      <button
                        onClick={() => {
                          const list = form.contactStats.items.filter((_: any, i: number) => i !== idx);
                          setField("contactStats", "items", list);
                        }}
                        className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="flex-1 grid grid-cols-1 gap-4">
                        <TranslatableField label="Value" value={item.value} onChange={v => {
                          const list = [...form.contactStats.items];
                          list[idx].value = v;
                          setField("contactStats", "items", list);
                        }} />
                        <TranslatableField label="Label" value={item.label} onChange={v => {
                          const list = [...form.contactStats.items];
                          list[idx].label = v;
                          setField("contactStats", "items", list);
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* 3. Contact Form Header */}
              <SectionCard title="Contact Form Header" subtitle="Form headings & left side details" icon={<Layers size={16} />} sectionKey="contactFormHeader" openSection={openSection} onToggle={toggleSection}>
                <div className="p-4 bg-slate-50/30 border border-slate-100 rounded-xl space-y-4">
                  <h5 className="font-extrabold text-xs text-[#00C4B4] uppercase tracking-wider">Left Side (Info)</h5>
                  <TranslatableField label="Left Badge" value={form.contactFormHeader.leftBadge} onChange={v => setField("contactFormHeader", "leftBadge", v)} />
                  <TranslatableField label="Left Title" type="quill" value={form.contactFormHeader.leftTitle} onChange={v => setField("contactFormHeader", "leftTitle", v)} />
                  <TranslatableField label="Left Description" type="quill" value={form.contactFormHeader.leftDescription} onChange={v => setField("contactFormHeader", "leftDescription", v)} />
                </div>
                <div className="p-4 bg-slate-50/30 border border-slate-100 rounded-xl space-y-4 border-t-2">
                  <h5 className="font-extrabold text-xs text-[#00C4B4] uppercase tracking-wider">Right Side (Form)</h5>
                  <TranslatableField label="Right Badge" value={form.contactFormHeader.rightBadge} onChange={v => setField("contactFormHeader", "rightBadge", v)} />
                  <TranslatableField label="Right Title" type="quill" value={form.contactFormHeader.rightTitle} onChange={v => setField("contactFormHeader", "rightTitle", v)} />
                  <TranslatableField label="Right Description" type="quill" value={form.contactFormHeader.rightDescription} onChange={v => setField("contactFormHeader", "rightDescription", v)} />
                </div>
              </SectionCard>

              {/* 4. What Happens Next steps */}
              <SectionCard title="Contact Next Steps" subtitle="Steps under Info section" icon={<Layers size={16} />} sectionKey="contactNextSteps" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Section Badge" value={form.contactNextSteps.badge} onChange={v => setField("contactNextSteps", "badge", v)} />
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Steps List</span>
                    <button
                      onClick={() => setForm((p: any) => ({ ...p, contactNextSteps: { ...p.contactNextSteps, items: [...p.contactNextSteps.items, { _id: Math.random().toString(), title: b(), description: b() }] } }))}
                      className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                    >
                      <Plus size={10} /> Add Step
                    </button>
                  </div>
                  <div className="space-y-6">
                    {form.contactNextSteps.items.map((item: any, idx: number) => (
                      <div key={item._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 space-y-4 relative">
                        <button
                          onClick={() => {
                            const list = form.contactNextSteps.items.filter((_: any, i: number) => i !== idx);
                            setField("contactNextSteps", "items", list);
                          }}
                          className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                        <h5 className="font-extrabold text-xs text-slate-700 uppercase">Step #{idx + 1}</h5>
                        <TranslatableField label="Title" value={item.title} onChange={v => {
                          const list = [...form.contactNextSteps.items];
                          list[idx].title = v;
                          setField("contactNextSteps", "items", list);
                        }} />
                        <TranslatableField label="Description" type="quill" value={item.description} onChange={v => {
                          const list = [...form.contactNextSteps.items];
                          list[idx].description = v;
                          setField("contactNextSteps", "items", list);
                        }} />
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>

              {/* 5. Contact Methods */}
              <SectionCard title="Contact Methods" subtitle="Phone, Email, Address, etc." icon={<MessageSquare size={16} />} sectionKey="contactMethods" openSection={openSection} onToggle={toggleSection}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Methods List</span>
                  <button
                    onClick={() => setForm((p: any) => ({ ...p, contactMethods: { ...p.contactMethods, items: [...p.contactMethods.items, { _id: Math.random().toString(), label: b(), value: b(), image: { url: "" }, href: "" }] } }))}
                    className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                  >
                    <Plus size={10} /> Add Method
                  </button>
                </div>
                <div className="space-y-6">
                  {form.contactMethods.items.map((item: any, idx: number) => (
                    <div key={item._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 space-y-4 relative">
                      <button
                        onClick={() => {
                          const list = form.contactMethods.items.filter((_: any, i: number) => i !== idx);
                          setField("contactMethods", "items", list);
                        }}
                        className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                      <h5 className="font-extrabold text-xs text-slate-700 uppercase">Method #{idx + 1}</h5>
                      <TranslatableField label="Label (e.g. Phone)" value={item.label} onChange={v => {
                        const list = [...form.contactMethods.items];
                        list[idx].label = v;
                        setField("contactMethods", "items", list);
                      }} />
                      <TranslatableField label="Value (e.g. +966 123...)" value={item.value} onChange={v => {
                        const list = [...form.contactMethods.items];
                        list[idx].value = v;
                        setField("contactMethods", "items", list);
                      }} />
                      <ImageUploadField label="Method Icon (Optional)" value={item.image} onChange={v => {
                        const list = [...form.contactMethods.items];
                        list[idx].image = v;
                        setField("contactMethods", "items", list);
                      }} />
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Link (e.g. tel:+966...)</label>
                        <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-[#00C4B4]" value={item.href} onChange={e => {
                          const list = [...form.contactMethods.items];
                          list[idx].href = e.target.value;
                          setField("contactMethods", "items", list);
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

            </div>
          )}

          {/* ── RIGHT: full live preview ── */}
          <div className={previewMode ? "w-full" : "lg:col-span-6"}>
            <div className={previewMode ? "" : "sticky top-24 space-y-2"}>
              <div style={{ height: "80vh", overflowY: "auto", borderRadius: 14, border: "1px solid rgba(197,160,89,0.12)" }}>
                <AdminContactFullPreview form={form} locale={previewLocale} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function ContactAdminPage() {
  return (
    <SnackbarProvider maxSnack={3}>
      <ContactEditorInner />
    </SnackbarProvider>
  );
}
