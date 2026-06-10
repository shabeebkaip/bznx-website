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
import AdminAboutFullPreview from "./FullPreview";

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

function AboutEditorInner() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("heroSection");
  const [previewLocale, setPreviewLocale] = useState<"en" | "ar">("ar");

  // About CMS form state
  const [form, setForm] = useState<any>({
    heroSection: { badge: b(), title: b(), description: b(), primaryButtonText: b(), primaryButtonLink: "", secondaryButtonText: b(), secondaryButtonLink: "", image: { url: "" } },
    aboutSection: { badge: b(), title: b(), description: b(), image: { url: "" }, features: [] },
    aboutStats: { items: [] },
    aboutMission: { badge: b(), title: b(), description: b() },
    aboutVision: { badge: b(), title: b(), description: b() },
    aboutValuesHeader: { badge: b(), title: b() },
    aboutValues: { items: [] },
    aboutTeamHeader: { badge: b(), title: b() },
    aboutTeam: { items: [] },
    aboutClientsHeader: { badge: b(), title: b(), description: b() },
    aboutCta: { title: b(), description: b(), ctaText: b(), ctaLink: "", ctaText2: b(), ctaLink2: "" },
  });

  const toggleSection = useCallback((key: string) => {
    setOpenSection(p => p === key ? null : key);
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/about");
      const json = await res.json();
      if (json.status && Array.isArray(json.data)) {
        const get = (sec: string) => json.data.find((s: any) => s.section === sec)?.content ?? {};

        const heroSection = get("heroSection");
        const aboutSection = get("aboutSection");
        const aboutStats = get("aboutStats");
        const aboutMission = get("aboutMission");
        const aboutVision = get("aboutVision");
        const aboutValuesHeader = get("aboutValuesHeader");
        const aboutValues = get("aboutValues");
        const aboutTeamHeader = get("aboutTeamHeader");
        const aboutTeam = get("aboutTeam");
        const aboutClientsHeader = get("aboutClientsHeader");
        const aboutCta = get("aboutCta");

        setForm({
          heroSection: {
            badge: ensureBilingual(heroSection.badge),
            title: ensureBilingual(heroSection.title),
            description: ensureBilingual(heroSection.description),
            primaryButtonText: ensureBilingual(heroSection.primaryButtonText),
            primaryButtonLink: heroSection.primaryButtonLink || "",
            secondaryButtonText: ensureBilingual(heroSection.secondaryButtonText),
            secondaryButtonLink: heroSection.secondaryButtonLink || "",
            image: ensureImage(heroSection.image),
          },
          aboutSection: {
            badge: ensureBilingual(aboutSection.badge),
            title: ensureBilingual(aboutSection.title),
            description: ensureBilingual(aboutSection.description),
            image: ensureImage(aboutSection.image),
            features: Array.isArray(aboutSection.features) ? aboutSection.features.map((f: any) => ensureBilingual(f)) : [],
          },
          aboutStats: {
            items: Array.isArray(aboutStats.items) ? aboutStats.items.map((item: any) => ({
              _id: item._id || Math.random().toString(),
              value: ensureBilingual(item.value),
              label: ensureBilingual(item.label),
            })) : [],
          },
          aboutMission: {
            badge: ensureBilingual(aboutMission.badge),
            title: ensureBilingual(aboutMission.title),
            description: ensureBilingual(aboutMission.description),
          },
          aboutVision: {
            badge: ensureBilingual(aboutVision.badge),
            title: ensureBilingual(aboutVision.title),
            description: ensureBilingual(aboutVision.description),
          },
          aboutValuesHeader: {
            badge: ensureBilingual(aboutValuesHeader.badge),
            title: ensureBilingual(aboutValuesHeader.title),
          },
          aboutValues: {
            items: Array.isArray(aboutValues.items) ? aboutValues.items.map((item: any) => ({
              _id: item._id || Math.random().toString(),
              image: ensureImage(item.image),
              title: ensureBilingual(item.title),
              description: ensureBilingual(item.description),
            })) : [],
          },
          aboutTeamHeader: {
            badge: ensureBilingual(aboutTeamHeader.badge),
            title: ensureBilingual(aboutTeamHeader.title),
          },
          aboutTeam: {
            items: Array.isArray(aboutTeam.items) ? aboutTeam.items.map((item: any) => ({
              _id: item._id || Math.random().toString(),
              image: ensureImage(item.image),
              title: ensureBilingual(item.title),
              name: ensureBilingual(item.name),
              description: ensureBilingual(item.description),
              link: item.link || "",
            })) : [],
          },
          aboutClientsHeader: {
            badge: ensureBilingual(aboutClientsHeader.badge),
            title: ensureBilingual(aboutClientsHeader.title),
            description: ensureBilingual(aboutClientsHeader.description),
          },
          aboutCta: {
            title: ensureBilingual(aboutCta.title),
            description: ensureBilingual(aboutCta.description),
            ctaText: ensureBilingual(aboutCta.ctaText || aboutCta.primaryButtonText),
            ctaLink: aboutCta.ctaLink || aboutCta.primaryButtonLink || "",
            ctaText2: ensureBilingual(aboutCta.ctaText2 || aboutCta.secondaryButtonText),
            ctaLink2: aboutCta.ctaLink2 || aboutCta.secondaryButtonLink || "",
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
    return fetch("/api/about", {
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
        saveSection("aboutSection", form.aboutSection),
        saveSection("aboutStats", form.aboutStats),
        saveSection("aboutMission", form.aboutMission),
        saveSection("aboutVision", form.aboutVision),
        saveSection("aboutValuesHeader", form.aboutValuesHeader),
        saveSection("aboutValues", form.aboutValues),
        saveSection("aboutTeamHeader", form.aboutTeamHeader),
        saveSection("aboutTeam", form.aboutTeam),
        saveSection("aboutClientsHeader", form.aboutClientsHeader),
        saveSection("aboutCta", form.aboutCta),
      ]);
      
      if (results.every(r => r.status)) {
        enqueueSnackbar("About page changes saved successfully", { variant: "success" });
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
        <div className="text-[#00C4B4] font-black uppercase tracking-widest animate-pulse">Loading About CMS...</div>
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
            <h1 className="text-base font-extrabold text-slate-800 tracking-tight">About Page Editor</h1>
            <p className="text-slate-400 text-xs">Manage BZNX about page content & live preview</p>
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
            href={`/admin/about/preview?locale=${previewLocale}`}
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
              <SectionCard title="About Hero" subtitle="Introduction banner" icon={<Sparkles size={16} />} sectionKey="heroSection" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Badge" value={form.heroSection.badge} onChange={v => setField("heroSection", "badge", v)} />
                <TranslatableField label="Title" type="quill" value={form.heroSection.title} onChange={v => setField("heroSection", "title", v)} />
                <TranslatableField label="Description" type="quill" value={form.heroSection.description} onChange={v => setField("heroSection", "description", v)} />
                
                <div className="grid grid-cols-2 gap-4">
                  <TranslatableField label="Primary Button Text" value={form.heroSection.primaryButtonText} onChange={v => setField("heroSection", "primaryButtonText", v)} />
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Primary Button Link</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-[#00C4B4]" value={form.heroSection.primaryButtonLink} onChange={e => setField("heroSection", "primaryButtonLink", e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100/50 pt-4">
                  <TranslatableField label="Secondary Button Text" value={form.heroSection.secondaryButtonText} onChange={v => setField("heroSection", "secondaryButtonText", v)} />
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Secondary Button Link</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-[#00C4B4]" value={form.heroSection.secondaryButtonLink} onChange={e => setField("heroSection", "secondaryButtonLink", e.target.value)} />
                  </div>
                </div>

                <ImageUploadField label="Hero Banner Image" value={form.heroSection.image} onChange={v => setField("heroSection", "image", v)} />
              </SectionCard>

              {/* 2. Who We Are */}
              <SectionCard title="Who We Are" subtitle="Main identity description" icon={<Layers size={16} />} sectionKey="aboutSection" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Badge" value={form.aboutSection.badge} onChange={v => setField("aboutSection", "badge", v)} />
                <TranslatableField label="Title" type="quill" value={form.aboutSection.title} onChange={v => setField("aboutSection", "title", v)} />
                <TranslatableField label="Description" type="quill" value={form.aboutSection.description} onChange={v => setField("aboutSection", "description", v)} />
                <ImageUploadField label="Side Banner Image" value={form.aboutSection.image} onChange={v => setField("aboutSection", "image", v)} />

                {/* Key Facts list */}
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Key Facts</span>
                    <button
                      onClick={() => setForm((p: any) => ({ ...p, aboutSection: { ...p.aboutSection, features: [...p.aboutSection.features, b()] } }))}
                      className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                    >
                      <Plus size={10} /> Add Fact
                    </button>
                  </div>
                  <div className="space-y-4">
                    {form.aboutSection.features.map((item: any, idx: number) => (
                      <div key={idx} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 flex items-start gap-4 relative">
                        <button
                          onClick={() => {
                            const list = form.aboutSection.features.filter((_: any, i: number) => i !== idx);
                            setField("aboutSection", "features", list);
                          }}
                          className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="flex-1">
                          <TranslatableField label={`Fact #${idx + 1}`} value={item} onChange={v => {
                            const list = [...form.aboutSection.features];
                            list[idx] = v;
                            setField("aboutSection", "features", list);
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>

              {/* 3. About Stats */}
              <SectionCard title="About Stats" subtitle="Numerical proof cards" icon={<ThumbsUp size={16} />} sectionKey="aboutStats" openSection={openSection} onToggle={toggleSection}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Stats Cards</span>
                  <button
                    onClick={() => setForm((p: any) => ({ ...p, aboutStats: { ...p.aboutStats, items: [...p.aboutStats.items, { _id: Math.random().toString(), value: b(), label: b() }] } }))}
                    className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                  >
                    <Plus size={10} /> Add Stat
                  </button>
                </div>
                <div className="space-y-4">
                  {form.aboutStats.items.map((item: any, idx: number) => (
                    <div key={item._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 flex items-start gap-4 relative">
                      <button
                        onClick={() => {
                          const list = form.aboutStats.items.filter((_: any, i: number) => i !== idx);
                          setField("aboutStats", "items", list);
                        }}
                        className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="flex-1 grid grid-cols-1 gap-4">
                        <TranslatableField label="Value" value={item.value} onChange={v => {
                          const list = [...form.aboutStats.items];
                          list[idx].value = v;
                          setField("aboutStats", "items", list);
                        }} />
                        <TranslatableField label="Label" value={item.label} onChange={v => {
                          const list = [...form.aboutStats.items];
                          list[idx].label = v;
                          setField("aboutStats", "items", list);
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* 4. Mission & Vision */}
              <SectionCard title="Mission & Vision" subtitle="Long-term strategic focus" icon={<Layers size={16} />} sectionKey="missionVision" openSection={openSection} onToggle={toggleSection}>
                <div className="p-4 bg-slate-50/30 border border-slate-100 rounded-xl space-y-4">
                  <h5 className="font-extrabold text-xs text-[#00C4B4] uppercase tracking-wider">Mission</h5>
                  <TranslatableField label="Badge" value={form.aboutMission.badge} onChange={v => setField("aboutMission", "badge", v)} />
                  <TranslatableField label="Title" type="quill" value={form.aboutMission.title} onChange={v => setField("aboutMission", "title", v)} />
                  <TranslatableField label="Description" type="quill" value={form.aboutMission.description} onChange={v => setField("aboutMission", "description", v)} />
                </div>
                <div className="p-4 bg-slate-50/30 border border-slate-100 rounded-xl space-y-4 border-t-2">
                  <h5 className="font-extrabold text-xs text-teal-600 uppercase tracking-wider">Vision</h5>
                  <TranslatableField label="Badge" value={form.aboutVision.badge} onChange={v => setField("aboutVision", "badge", v)} />
                  <TranslatableField label="Title" type="quill" value={form.aboutVision.title} onChange={v => setField("aboutVision", "title", v)} />
                  <TranslatableField label="Description" type="quill" value={form.aboutVision.description} onChange={v => setField("aboutVision", "description", v)} />
                </div>
              </SectionCard>

              {/* 5. Values */}
              <SectionCard title="Corporate Values" subtitle="What BZNX stands for" icon={<ThumbsUp size={16} />} sectionKey="aboutValues" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Section Badge" value={form.aboutValuesHeader.badge} onChange={v => setField("aboutValuesHeader", "badge", v)} />
                <TranslatableField label="Section Title" type="quill" value={form.aboutValuesHeader.title} onChange={v => setField("aboutValuesHeader", "title", v)} />

                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Values List</span>
                    <button
                      onClick={() => setForm((p: any) => ({ ...p, aboutValues: { ...p.aboutValues, items: [...p.aboutValues.items, { _id: Math.random().toString(), image: { url: "" }, title: b(), description: b() }] } }))}
                      className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                    >
                      <Plus size={10} /> Add Value
                    </button>
                  </div>
                  <div className="space-y-6">
                    {form.aboutValues.items.map((item: any, idx: number) => (
                      <div key={item._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 space-y-4 relative">
                        <button
                          onClick={() => {
                            const list = form.aboutValues.items.filter((_: any, i: number) => i !== idx);
                            setField("aboutValues", "items", list);
                          }}
                          className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                        <h5 className="font-extrabold text-xs text-slate-700 uppercase">Value #{idx + 1}</h5>
                        <TranslatableField label="Title" value={item.title} onChange={v => {
                          const list = [...form.aboutValues.items];
                          list[idx].title = v;
                          setField("aboutValues", "items", list);
                        }} />
                        <TranslatableField label="Description" type="quill" value={item.description} onChange={v => {
                          const list = [...form.aboutValues.items];
                          list[idx].description = v;
                          setField("aboutValues", "items", list);
                        }} />
                        <ImageUploadField label="Value Icon / Image" value={item.image} onChange={v => {
                          const list = [...form.aboutValues.items];
                          list[idx].image = v;
                          setField("aboutValues", "items", list);
                        }} />
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>

              {/* 6. Team */}
              <SectionCard title="Our Team" subtitle="Executive leadership list" icon={<Layers size={16} />} sectionKey="aboutTeam" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Section Badge" value={form.aboutTeamHeader.badge} onChange={v => setField("aboutTeamHeader", "badge", v)} />
                <TranslatableField label="Section Title" type="quill" value={form.aboutTeamHeader.title} onChange={v => setField("aboutTeamHeader", "title", v)} />

                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Team Members</span>
                    <button
                      onClick={() => setForm((p: any) => ({ ...p, aboutTeam: { ...p.aboutTeam, items: [...p.aboutTeam.items, { _id: Math.random().toString(), image: { url: "" }, title: b(), name: b(), description: b(), link: "" }] } }))}
                      className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                    >
                      <Plus size={10} /> Add Member
                    </button>
                  </div>
                  <div className="space-y-6">
                    {form.aboutTeam.items.map((item: any, idx: number) => (
                      <div key={item._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 space-y-4 relative">
                        <button
                          onClick={() => {
                            const list = form.aboutTeam.items.filter((_: any, i: number) => i !== idx);
                            setField("aboutTeam", "items", list);
                          }}
                          className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                        <h5 className="font-extrabold text-xs text-slate-700 uppercase">Member #{idx + 1}</h5>
                        <TranslatableField label="Name" value={item.name} onChange={v => {
                          const list = [...form.aboutTeam.items];
                          list[idx].name = v;
                          setField("aboutTeam", "items", list);
                        }} />
                        <TranslatableField label="Title / Role" value={item.title} onChange={v => {
                          const list = [...form.aboutTeam.items];
                          list[idx].title = v;
                          setField("aboutTeam", "items", list);
                        }} />
                        <TranslatableField label="Short Bio" type="quill" value={item.description} onChange={v => {
                          const list = [...form.aboutTeam.items];
                          list[idx].description = v;
                          setField("aboutTeam", "items", list);
                        }} />
                        <ImageUploadField label="Profile Photo" value={item.image} onChange={v => {
                          const list = [...form.aboutTeam.items];
                          list[idx].image = v;
                          setField("aboutTeam", "items", list);
                        }} />
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">LinkedIn Link</label>
                          <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-[#00C4B4]" value={item.link} onChange={e => {
                            const list = [...form.aboutTeam.items];
                            list[idx].link = e.target.value;
                            setField("aboutTeam", "items", list);
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>

              {/* 7. Clients Heading */}
              <SectionCard title="Clients Heading" subtitle="Logo strip header text" icon={<Layers size={16} />} sectionKey="aboutClientsHeader" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Badge" value={form.aboutClientsHeader.badge} onChange={v => setField("aboutClientsHeader", "badge", v)} />
                <TranslatableField label="Title" type="quill" value={form.aboutClientsHeader.title} onChange={v => setField("aboutClientsHeader", "title", v)} />
                <TranslatableField label="Description" type="quill" value={form.aboutClientsHeader.description} onChange={v => setField("aboutClientsHeader", "description", v)} />
              </SectionCard>

              {/* 8. Conversion CTA */}
              <SectionCard title="Conversion CTA" subtitle="Footer action banner" icon={<Layers size={16} />} sectionKey="aboutCta" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Title" type="quill" value={form.aboutCta.title} onChange={v => setField("aboutCta", "title", v)} />
                <TranslatableField label="Description" type="quill" value={form.aboutCta.description} onChange={v => setField("aboutCta", "description", v)} />

                <div className="grid grid-cols-2 gap-4">
                  <TranslatableField label="Primary Button Text" value={form.aboutCta.ctaText} onChange={v => setField("aboutCta", "ctaText", v)} />
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Primary Button Link</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-[#00C4B4]" value={form.aboutCta.ctaLink} onChange={e => setField("aboutCta", "ctaLink", e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100/50 pt-4">
                  <TranslatableField label="Secondary Button Text" value={form.aboutCta.ctaText2} onChange={v => setField("aboutCta", "ctaText2", v)} />
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Secondary Button Link</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-[#00C4B4]" value={form.aboutCta.ctaLink2} onChange={e => setField("aboutCta", "ctaLink2", e.target.value)} />
                  </div>
                </div>
              </SectionCard>

            </div>
          )}

          {/* ── RIGHT: full live preview — all sections, updates instantly ── */}
          <div className={previewMode ? "w-full" : "lg:col-span-6"}>
            <div className={previewMode ? "" : "sticky top-24 space-y-2"}>
              <div style={{ height: "80vh", overflowY: "auto", borderRadius: 14, border: "1px solid rgba(197,160,89,0.12)" }}>
                <AdminAboutFullPreview form={form} locale={previewLocale} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function AboutAdminPage() {
  return (
    <SnackbarProvider maxSnack={3}>
      <AboutEditorInner />
    </SnackbarProvider>
  );
}
