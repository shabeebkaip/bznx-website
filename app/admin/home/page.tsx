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
  HelpCircle,
  ThumbsUp,
  Image as ImageIcon
} from "lucide-react";
import TranslatableField from "@/components/admin/common/TranslatableField";
import ImageUploadField from "@/components/admin/common/ImageUploadField";
import AdminHomeFullPreview from "./FullPreview";

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

function HomeEditorInner() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("hero");
  const [previewLocale, setPreviewLocale] = useState<"en" | "ar">("ar");

  // Dynamic CMS form state
  const [form, setForm] = useState<any>({
    hero: { titleLine1: b(), titleLine2: b(), titleLine3: b(), description: b(), primaryButtonText: b(), primaryButtonLink: "", secondaryButtonText: b(), secondaryButtonLink: "", image: { url: "" } },
    heroStats: { items: [] },
    heroBadges: { items: [] },
    aboutMain: { badge: b(), title: b(), description: b(), ctaText: b(), image: { url: "" }, topRightCard: { title: b(), subTitle: b() }, bottomLeftCard: { title: b(), subTitle: b() } },
    aboutStats: { items: [] },
    trustedBy: { title: b(), logos: [] },
    services: { badge: b(), title: b(), description: b(), ctaText: b(), ctaLink: "" },
    whySaudi: { badge: b(), title: b(), description: b(), points: [] },
    opportunity: { badge: b(), title: b(), description: b(), ctaText: b(), ctaLink: "", stats: [], pillars: [] },
    howWeWork: { badge: b(), title: b(), description: b(), steps: [] },
    benefits: { badge: b(), title: b(), description: b(), image: { url: "" }, items: [] },
    caseStudies: { badge: b(), title: b(), description: b(), ctaText: b(), ctaLink: "" },
    testimonials: { badge: b(), title: b(), ctaText: b(), ctaLink: "", ctaText2: b(), ctaLink2: "", stats: [], items: [] },
    cta: { title: b(), description: b(), ctaText: b(), ctaLink: "", ctaText2: b(), ctaLink2: "" },
  });

  const toggleSection = useCallback((key: string) => {
    setOpenSection(p => p === key ? null : key);
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/home");
      const json = await res.json();
      if (json.status && Array.isArray(json.data)) {
        const get = (sec: string) => json.data.find((s: any) => s.section === sec)?.content ?? {};
        
        const hero = get("hero");
        const heroStats = get("heroStats");
        const heroBadges = get("heroBadges");
        const aboutMain = get("aboutMain");
        const aboutStats = get("aboutStats");
        const trustedBy = get("trustedBy");
        const services = get("services");
        const whySaudi = get("whySaudi");
        const opportunity = get("opportunity");
        const howWeWork = get("howWeWork");
        const benefits = get("benefits");
        const caseStudies = get("caseStudies");
        const testimonials = get("testimonials");
        const cta = get("cta");

        setForm({
          hero: {
            titleLine1: ensureBilingual(hero.titleLine1),
            titleLine2: ensureBilingual(hero.titleLine2),
            titleLine3: ensureBilingual(hero.titleLine3),
            description: ensureBilingual(hero.description),
            primaryButtonText: ensureBilingual(hero.primaryButtonText),
            primaryButtonLink: hero.primaryButtonLink || "",
            secondaryButtonText: ensureBilingual(hero.secondaryButtonText),
            secondaryButtonLink: hero.secondaryButtonLink || "",
            image: ensureImage(hero.image),
          },
          heroStats: {
            items: Array.isArray(heroStats.items) ? heroStats.items.map((item: any) => ({
              _id: item._id || Math.random().toString(),
              value: ensureBilingual(item.value),
              label: ensureBilingual(item.label),
            })) : [],
          },
          heroBadges: {
            items: Array.isArray(heroBadges.items) ? heroBadges.items.map((item: any) => ({
              _id: item._id || Math.random().toString(),
              text: ensureBilingual(item.text),
            })) : [],
          },
          aboutMain: {
            badge: ensureBilingual(aboutMain.badge),
            title: ensureBilingual(aboutMain.title),
            description: ensureBilingual(aboutMain.description),
            ctaText: ensureBilingual(aboutMain.ctaText),
            image: ensureImage(aboutMain.image),
            topRightCard: {
              title: ensureBilingual(aboutMain.topRightCard?.title),
              subTitle: ensureBilingual(aboutMain.topRightCard?.subTitle),
            },
            bottomLeftCard: {
              title: ensureBilingual(aboutMain.bottomLeftCard?.title),
              subTitle: ensureBilingual(aboutMain.bottomLeftCard?.subTitle),
            },
          },
          aboutStats: {
            items: Array.isArray(aboutStats.items) ? aboutStats.items.map((item: any) => ({
              _id: item._id || Math.random().toString(),
              value: ensureBilingual(item.value),
              label: ensureBilingual(item.label),
            })) : [],
          },
          trustedBy: {
            title: ensureBilingual(trustedBy.title),
            logos: Array.isArray(trustedBy.logos) ? trustedBy.logos.map((item: any) => ({
              _id: item._id || Math.random().toString(),
              image: ensureImage(item.image),
              imageAlt: ensureBilingual(item.imageAlt),
            })) : [],
          },
          services: {
            badge: ensureBilingual(services.badge),
            title: ensureBilingual(services.title),
            description: ensureBilingual(services.description),
            ctaText: ensureBilingual(services.ctaText),
            ctaLink: services.ctaLink || "",
          },
          whySaudi: {
            badge: ensureBilingual(whySaudi.badge),
            title: ensureBilingual(whySaudi.title),
            description: ensureBilingual(whySaudi.description),
            points: Array.isArray(whySaudi.points) ? whySaudi.points.map((item: any) => ({
              _id: item._id || Math.random().toString(),
              image: ensureImage(item.image),
              title: ensureBilingual(item.title),
              description: ensureBilingual(item.description),
              topHeading: ensureBilingual(item.topHeading),
              stat1Heading: ensureBilingual(item.stat1Heading),
              stat1Subheading: ensureBilingual(item.stat1Subheading),
              stat2Heading: ensureBilingual(item.stat2Heading),
              stat2Subheading: ensureBilingual(item.stat2Subheading),
            })) : [],
          },
          opportunity: {
            badge: ensureBilingual(opportunity.badge),
            title: ensureBilingual(opportunity.title),
            description: ensureBilingual(opportunity.description),
            ctaText: ensureBilingual(opportunity.ctaText),
            ctaLink: opportunity.ctaLink || "",
            stats: Array.isArray(opportunity.stats) ? opportunity.stats.map((item: any) => ({
              _id: item._id || Math.random().toString(),
              value: ensureBilingual(item.value),
              label: ensureBilingual(item.label),
              description: ensureBilingual(item.description),
            })) : [],
            pillars: Array.isArray(opportunity.pillars) ? opportunity.pillars.map((item: any) => ({
              _id: item._id || Math.random().toString(),
              image: ensureImage(item.image),
              label: ensureBilingual(item.label),
              heading: ensureBilingual(item.heading),
              subheading: ensureBilingual(item.subheading),
              color: item.color || "#00C4B4",
              items: Array.isArray(item.items) ? item.items : [],
              insight: ensureBilingual(item.insight),
            })) : [],
          },
          howWeWork: {
            badge: ensureBilingual(howWeWork.badge),
            title: ensureBilingual(howWeWork.title),
            description: ensureBilingual(howWeWork.description),
            steps: Array.isArray(howWeWork.steps) ? howWeWork.steps.map((item: any) => ({
              _id: item._id || Math.random().toString(),
              image: ensureImage(item.image),
              title: ensureBilingual(item.title),
              description: ensureBilingual(item.description),
            })) : [],
          },
          benefits: {
            badge: ensureBilingual(benefits.badge),
            title: ensureBilingual(benefits.title),
            description: ensureBilingual(benefits.description),
            image: ensureImage(benefits.image),
            items: Array.isArray(benefits.items) ? benefits.items.map((item: any) => ({
              _id: item._id || Math.random().toString(),
              image: ensureImage(item.image),
              title: ensureBilingual(item.title),
              description: ensureBilingual(item.description),
            })) : [],
          },
          caseStudies: {
            badge: ensureBilingual(caseStudies.badge),
            title: ensureBilingual(caseStudies.title),
            description: ensureBilingual(caseStudies.description),
            ctaText: ensureBilingual(caseStudies.ctaText),
            ctaLink: caseStudies.ctaLink || "",
          },
          testimonials: {
            badge: ensureBilingual(testimonials.badge),
            title: ensureBilingual(testimonials.title),
            ctaText: ensureBilingual(testimonials.ctaText),
            ctaLink: testimonials.ctaLink || "",
            ctaText2: ensureBilingual(testimonials.ctaText2),
            ctaLink2: testimonials.ctaLink2 || "",
            stats: Array.isArray(testimonials.stats) ? testimonials.stats.map((item: any) => ({
              _id: item._id || Math.random().toString(),
              value: ensureBilingual(item.value),
              label: ensureBilingual(item.label),
            })) : [],
            items: Array.isArray(testimonials.items) ? testimonials.items.map((item: any) => ({
              _id: item._id || Math.random().toString(),
              image: ensureImage(item.image),
              name: ensureBilingual(item.name),
              title: ensureBilingual(item.title),
              quote: ensureBilingual(item.quote),
              rating: item.rating || "5",
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
    return fetch("/api/home", {
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
        saveSection("heroStats", form.heroStats),
        saveSection("heroBadges", form.heroBadges),
        saveSection("aboutMain", form.aboutMain),
        saveSection("aboutStats", form.aboutStats),
        saveSection("trustedBy", form.trustedBy),
        saveSection("services", form.services),
        saveSection("whySaudi", form.whySaudi),
        saveSection("opportunity", form.opportunity),
        saveSection("howWeWork", form.howWeWork),
        saveSection("benefits", form.benefits),
        saveSection("caseStudies", form.caseStudies),
        saveSection("testimonials", form.testimonials),
        saveSection("cta", form.cta),
      ]);
      
      if (results.every(r => r.status)) {
        enqueueSnackbar("Home page changes saved successfully", { variant: "success" });
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
        <div className="text-[#00C4B4] font-black uppercase tracking-widest animate-pulse">Loading Home CMS...</div>
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
            <h1 className="text-base font-extrabold text-slate-800 tracking-tight">Home Page Editor</h1>
            <p className="text-slate-400 text-xs">Manage BZNX homepage content & live preview</p>
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
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all"
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
            href={`/admin/home/preview?locale=${previewLocale}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all"
          >
            <ExternalLink size={14} /> Full Size
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#00C4B4] hover:bg-[#00b0a2] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#00C4B4]/10 disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Main split view container */}
      <div className=" px-8 py-8">
        <div className={`grid gap-8 ${previewMode ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-[1fr_580px]"}`}>
          
          {/* Left panel: Form editor */}
          {!previewMode && (
            <div className="space-y-4">
              
              {/* 1. Hero Section */}
              <SectionCard title="Hero Main" subtitle="Manage title, description, buttons and image" icon={<Sparkles size={16} />} sectionKey="hero" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Title Line 1" value={form.hero.titleLine1} onChange={v => setField("hero", "titleLine1", v)} />
                <TranslatableField label="Title Line 2" value={form.hero.titleLine2} onChange={v => setField("hero", "titleLine2", v)} />
                <TranslatableField label="Title Line 3" value={form.hero.titleLine3} onChange={v => setField("hero", "titleLine3", v)} />
                <TranslatableField label="Description" type="quill" value={form.hero.description} onChange={v => setField("hero", "description", v)} />
                
                <div className="grid grid-cols-2 gap-4">
                  <TranslatableField label="Primary Button Text" value={form.hero.primaryButtonText} onChange={v => setField("hero", "primaryButtonText", v)} />
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Primary Button Link</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-[#00C4B4]" value={form.hero.primaryButtonLink} onChange={e => setField("hero", "primaryButtonLink", e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <TranslatableField label="Secondary Button Text" value={form.hero.secondaryButtonText} onChange={v => setField("hero", "secondaryButtonText", v)} />
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Secondary Button Link</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-[#00C4B4]" value={form.hero.secondaryButtonLink} onChange={e => setField("hero", "secondaryButtonLink", e.target.value)} />
                  </div>
                </div>

                <ImageUploadField label="Background Image" value={form.hero.image} onChange={v => setField("hero", "image", v)} />
              </SectionCard>

              {/* 2. Hero Badges */}
              <SectionCard title="Hero Badges" subtitle="Manage rotating/floating badges in the hero" icon={<Layers size={16} />} sectionKey="heroBadges" openSection={openSection} onToggle={toggleSection}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Badge List</span>
                  <button
                    onClick={() => setForm((p: any) => ({ ...p, heroBadges: { items: [...p.heroBadges.items, { _id: Math.random().toString(), text: b() }] } }))}
                    className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                  >
                    <Plus size={10} /> Add Badge
                  </button>
                </div>
                <div className="space-y-4">
                  {form.heroBadges.items.map((item: any, idx: number) => (
                    <div key={item._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 flex items-start gap-4">
                      <div className="flex-1">
                        <TranslatableField label={`Badge #${idx + 1}`} value={item.text} onChange={v => {
                          const list = [...form.heroBadges.items];
                          list[idx].text = v;
                          setField("heroBadges", "items", list);
                        }} />
                      </div>
                      <button
                        onClick={() => {
                          const list = form.heroBadges.items.filter((_: any, i: number) => i !== idx);
                          setField("heroBadges", "items", list);
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* 3. Hero Stats */}
              <SectionCard title="Hero Stats" subtitle="Key highlights below CTAs" icon={<Layers size={16} />} sectionKey="heroStats" openSection={openSection} onToggle={toggleSection}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Stats List</span>
                  <button
                    onClick={() => setForm((p: any) => ({ ...p, heroStats: { items: [...p.heroStats.items, { _id: Math.random().toString(), value: b(), label: b() }] } }))}
                    className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                  >
                    <Plus size={10} /> Add Stat
                  </button>
                </div>
                <div className="space-y-4">
                  {form.heroStats.items.map((item: any, idx: number) => (
                    <div key={item._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 flex items-start gap-4">
                      <div className="flex-1 grid grid-cols-1 gap-4">
                        <TranslatableField label="Value" value={item.value} onChange={v => {
                          const list = [...form.heroStats.items];
                          list[idx].value = v;
                          setField("heroStats", "items", list);
                        }} />
                        <TranslatableField label="Label" value={item.label} onChange={v => {
                          const list = [...form.heroStats.items];
                          list[idx].label = v;
                          setField("heroStats", "items", list);
                        }} />
                      </div>
                      <button
                        onClick={() => {
                          const list = form.heroStats.items.filter((_: any, i: number) => i !== idx);
                          setField("heroStats", "items", list);
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* 4. About Section */}
              <SectionCard title="About Main & Stats" subtitle="Our introduction with side metrics" icon={<Sparkles size={16} />} sectionKey="aboutMain" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Badge" value={form.aboutMain.badge} onChange={v => setField("aboutMain", "badge", v)} />
                <TranslatableField label="Title" type="quill" value={form.aboutMain.title} onChange={v => setField("aboutMain", "title", v)} />
                <TranslatableField label="Description" type="quill" value={form.aboutMain.description} onChange={v => setField("aboutMain", "description", v)} />
                <TranslatableField label="CTA Text" value={form.aboutMain.ctaText} onChange={v => setField("aboutMain", "ctaText", v)} />
                <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/20 space-y-4">
                  <h5 className="text-xs font-black text-slate-700 uppercase">Top Right Card</h5>
                  <TranslatableField label="Card Title" value={form.aboutMain.topRightCard?.title} onChange={v => setField("aboutMain", "topRightCard", { ...form.aboutMain.topRightCard, title: v })} />
                  <TranslatableField label="Card Subtitle" value={form.aboutMain.topRightCard?.subTitle} onChange={v => setField("aboutMain", "topRightCard", { ...form.aboutMain.topRightCard, subTitle: v })} />
                </div>

                <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/20 space-y-4">
                  <h5 className="text-xs font-black text-slate-700 uppercase">Bottom Left Card</h5>
                  <TranslatableField label="Card Title" value={form.aboutMain.bottomLeftCard?.title} onChange={v => setField("aboutMain", "bottomLeftCard", { ...form.aboutMain.bottomLeftCard, title: v })} />
                  <TranslatableField label="Card Subtitle" value={form.aboutMain.bottomLeftCard?.subTitle} onChange={v => setField("aboutMain", "bottomLeftCard", { ...form.aboutMain.bottomLeftCard, subTitle: v })} />
                </div>
                <ImageUploadField label="Featured Image" value={form.aboutMain.image} onChange={v => setField("aboutMain", "image", v)} />

                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">About Metrics</span>
                    <button
                      onClick={() => setForm((p: any) => ({ ...p, aboutStats: { items: [...p.aboutStats.items, { _id: Math.random().toString(), value: b(), label: b() }] } }))}
                      className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                    >
                      <Plus size={10} /> Add Metric
                    </button>
                  </div>
                  <div className="space-y-4">
                    {form.aboutStats.items.map((item: any, idx: number) => (
                      <div key={item._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 flex items-start gap-4">
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
                        <button
                          onClick={() => {
                            const list = form.aboutStats.items.filter((_: any, i: number) => i !== idx);
                            setField("aboutStats", "items", list);
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>

              {/* 5. Trusted By Logos */}
              <SectionCard title="Trusted By Logos" subtitle="Logos of clients & partners" icon={<Layers size={16} />} sectionKey="trustedBy" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Title" type="quill" value={form.trustedBy.title} onChange={v => setField("trustedBy", "title", v)} />
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Logos List</span>
                    <button
                      onClick={() => setForm((p: any) => ({ ...p, trustedBy: { ...p.trustedBy, logos: [...p.trustedBy.logos, { _id: Math.random().toString(), image: { url: "" }, imageAlt: b() }] } }))}
                      className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                    >
                      <Plus size={10} /> Add Logo
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {form.trustedBy.logos.map((item: any, idx: number) => (
                      <div key={item._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 space-y-4 relative">
                        <button
                          onClick={() => {
                            const list = form.trustedBy.logos.filter((_: any, i: number) => i !== idx);
                            setField("trustedBy", "logos", list);
                          }}
                          className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                        <ImageUploadField label={`Logo Image #${idx + 1}`} value={item.image} onChange={v => {
                          const list = [...form.trustedBy.logos];
                          list[idx].image = v;
                          setField("trustedBy", "logos", list);
                        }} />
                        <TranslatableField label="Alt Text" value={item.imageAlt} onChange={v => {
                          const list = [...form.trustedBy.logos];
                          list[idx].imageAlt = v;
                          setField("trustedBy", "logos", list);
                        }} />
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>

              {/* 6. Services Header */}
              <SectionCard title="Services Section" subtitle="Section heading and conversion link" icon={<Layers size={16} />} sectionKey="services" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Badge" value={form.services.badge} onChange={v => setField("services", "badge", v)} />
                <TranslatableField label="Title" type="quill" value={form.services.title} onChange={v => setField("services", "title", v)} />
                <TranslatableField label="Description" type="quill" value={form.services.description} onChange={v => setField("services", "description", v)} />
                <div className="grid grid-cols-2 gap-4">
                  <TranslatableField label="CTA Button Text" value={form.services.ctaText} onChange={v => setField("services", "ctaText", v)} />
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">CTA Button Link</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-[#00C4B4]" value={form.services.ctaLink} onChange={e => setField("services", "ctaLink", e.target.value)} />
                  </div>
                </div>
              </SectionCard>

              {/* 7. Why Saudi Section */}
              <SectionCard title="Why Saudi" subtitle="Points about the Saudi Arabian market" icon={<HelpCircle size={16} />} sectionKey="whySaudi" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Badge" value={form.whySaudi.badge} onChange={v => setField("whySaudi", "badge", v)} />
                <TranslatableField label="Title" type="quill" value={form.whySaudi.title} onChange={v => setField("whySaudi", "title", v)} />
                <TranslatableField label="Description" type="quill" value={form.whySaudi.description} onChange={v => setField("whySaudi", "description", v)} />

                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Saudi Market Points</span>
                    <button
                      onClick={() => setForm((p: any) => ({ ...p, whySaudi: { ...p.whySaudi, points: [...p.whySaudi.points, { _id: Math.random().toString(), image: { url: "" }, title: b(), description: b(), topHeading: b(), stat1Heading: b(), stat1Subheading: b(), stat2Heading: b(), stat2Subheading: b() }] } }))}
                      className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                    >
                      <Plus size={10} /> Add Point
                    </button>
                  </div>
                  <div className="space-y-6">
                    {form.whySaudi.points.map((item: any, idx: number) => (
                      <div key={item._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 space-y-4 relative">
                        <button
                          onClick={() => {
                            const list = form.whySaudi.points.filter((_: any, i: number) => i !== idx);
                            setField("whySaudi", "points", list);
                          }}
                          className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                        <h5 className="font-extrabold text-xs text-slate-700 uppercase">Point #{idx + 1}</h5>
                        <TranslatableField label="Title" value={item.title} onChange={v => {
                          const list = [...form.whySaudi.points];
                          list[idx].title = v;
                          setField("whySaudi", "points", list);
                        }} />
                        <TranslatableField label="Description" type="quill" value={item.description} onChange={v => {
                          const list = [...form.whySaudi.points];
                          list[idx].description = v;
                          setField("whySaudi", "points", list);
                        }} />
                        <ImageUploadField label="Point Image" value={item.image} onChange={v => {
                          const list = [...form.whySaudi.points];
                          list[idx].image = v;
                          setField("whySaudi", "points", list);
                        }} />
                        <div className="grid grid-cols-2 gap-4">
                          <TranslatableField label="Top Metric Heading" value={item.topHeading} onChange={v => {
                            const list = [...form.whySaudi.points];
                            list[idx].topHeading = v;
                            setField("whySaudi", "points", list);
                          }} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 border-t border-slate-100/50 pt-4">
                          <TranslatableField label="Stat 1 Title" value={item.stat1Heading} onChange={v => {
                            const list = [...form.whySaudi.points];
                            list[idx].stat1Heading = v;
                            setField("whySaudi", "points", list);
                          }} />
                          <TranslatableField label="Stat 1 Sub" value={item.stat1Subheading} onChange={v => {
                            const list = [...form.whySaudi.points];
                            list[idx].stat1Subheading = v;
                            setField("whySaudi", "points", list);
                          }} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 border-t border-slate-100/50 pt-4">
                          <TranslatableField label="Stat 2 Title" value={item.stat2Heading} onChange={v => {
                            const list = [...form.whySaudi.points];
                            list[idx].stat2Heading = v;
                            setField("whySaudi", "points", list);
                          }} />
                          <TranslatableField label="Stat 2 Sub" value={item.stat2Subheading} onChange={v => {
                            const list = [...form.whySaudi.points];
                            list[idx].stat2Subheading = v;
                            setField("whySaudi", "points", list);
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>

              {/* 8. Opportunity Section */}
              <SectionCard title="Saudi Opportunity" subtitle="Market metrics and pillars" icon={<Layers size={16} />} sectionKey="opportunity" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Badge" value={form.opportunity.badge} onChange={v => setField("opportunity", "badge", v)} />
                <TranslatableField label="Title" type="quill" value={form.opportunity.title} onChange={v => setField("opportunity", "title", v)} />
                <TranslatableField label="Description" type="quill" value={form.opportunity.description} onChange={v => setField("opportunity", "description", v)} />
                
                <div className="grid grid-cols-2 gap-4">
                  <TranslatableField label="CTA Button Text" value={form.opportunity.ctaText} onChange={v => setField("opportunity", "ctaText", v)} />
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">CTA Button Link</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-[#00C4B4]" value={form.opportunity.ctaLink} onChange={e => setField("opportunity", "ctaLink", e.target.value)} />
                  </div>
                </div>

                {/* Opportunity Stats */}
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Opportunity Stats</span>
                    <button
                      onClick={() => setForm((p: any) => ({ ...p, opportunity: { ...p.opportunity, stats: [...p.opportunity.stats, { _id: Math.random().toString(), value: b(), label: b(), description: b() }] } }))}
                      className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                    >
                      <Plus size={10} /> Add Stat
                    </button>
                  </div>
                  <div className="space-y-4">
                    {form.opportunity.stats.map((item: any, idx: number) => (
                      <div key={item._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 flex items-start gap-4 relative">
                        <button
                          onClick={() => {
                            const list = form.opportunity.stats.filter((_: any, i: number) => i !== idx);
                            setField("opportunity", "stats", list);
                          }}
                          className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="flex-1 grid grid-cols-1 gap-4">
                          <TranslatableField label="Value" value={item.value} onChange={v => {
                            const list = [...form.opportunity.stats];
                            list[idx].value = v;
                            setField("opportunity", "stats", list);
                          }} />
                          <TranslatableField label="Label" value={item.label} onChange={v => {
                            const list = [...form.opportunity.stats];
                            list[idx].label = v;
                            setField("opportunity", "stats", list);
                          }} />
                          <TranslatableField label="Sub Description" type="quill" value={item.description} onChange={v => {
                            const list = [...form.opportunity.stats];
                            list[idx].description = v;
                            setField("opportunity", "stats", list);
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Opportunity Pillars */}
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Opportunity Pillars</span>
                    <button
                      onClick={() => setForm((p: any) => ({ ...p, opportunity: { ...p.opportunity, pillars: [...p.opportunity.pillars, { _id: Math.random().toString(), image: { url: "" }, label: b(), heading: b(), subheading: b(), color: "#00C4B4", items: [], insight: b() }] } }))}
                      className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                    >
                      <Plus size={10} /> Add Pillar
                    </button>
                  </div>
                  <div className="space-y-6">
                    {form.opportunity.pillars.map((item: any, idx: number) => (
                      <div key={item._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 space-y-4 relative">
                        <button
                          onClick={() => {
                            const list = form.opportunity.pillars.filter((_: any, i: number) => i !== idx);
                            setField("opportunity", "pillars", list);
                          }}
                          className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                        <h5 className="font-extrabold text-xs text-slate-700 uppercase">Pillar #{idx + 1}</h5>
                        <TranslatableField label="Label/Badge" value={item.label} onChange={v => {
                          const list = [...form.opportunity.pillars];
                          list[idx].label = v;
                          setField("opportunity", "pillars", list);
                        }} />
                        <TranslatableField label="Heading" value={item.heading} onChange={v => {
                          const list = [...form.opportunity.pillars];
                          list[idx].heading = v;
                          setField("opportunity", "pillars", list);
                        }} />
                        <TranslatableField label="Subheading" value={item.subheading} onChange={v => {
                          const list = [...form.opportunity.pillars];
                          list[idx].subheading = v;
                          setField("opportunity", "pillars", list);
                        }} />
                        <TranslatableField label="Insight Overlay Text" type="quill" value={item.insight} onChange={v => {
                          const list = [...form.opportunity.pillars];
                          list[idx].insight = v;
                          setField("opportunity", "pillars", list);
                        }} />
                        <ImageUploadField label="Pillar Background Image" value={item.image} onChange={v => {
                          const list = [...form.opportunity.pillars];
                          list[idx].image = v;
                          setField("opportunity", "pillars", list);
                        }} />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Pillar Theme Color (hex)</label>
                            <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-[#00C4B4]" value={item.color} onChange={e => {
                              const list = [...form.opportunity.pillars];
                              list[idx].color = e.target.value;
                              setField("opportunity", "pillars", list);
                            }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>

              {/* 9. How We Work */}
              <SectionCard title="How We Work" subtitle="Process steps" icon={<Layers size={16} />} sectionKey="howWeWork" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Badge" value={form.howWeWork.badge} onChange={v => setField("howWeWork", "badge", v)} />
                <TranslatableField label="Title" type="quill" value={form.howWeWork.title} onChange={v => setField("howWeWork", "title", v)} />
                <TranslatableField label="Description" type="quill" value={form.howWeWork.description} onChange={v => setField("howWeWork", "description", v)} />

                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Steps List</span>
                    <button
                      onClick={() => setForm((p: any) => ({ ...p, howWeWork: { ...p.howWeWork, steps: [...p.howWeWork.steps, { _id: Math.random().toString(), image: { url: "" }, title: b(), description: b() }] } }))}
                      className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                    >
                      <Plus size={10} /> Add Step
                    </button>
                  </div>
                  <div className="space-y-6">
                    {form.howWeWork.steps.map((item: any, idx: number) => (
                      <div key={item._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 space-y-4 relative">
                        <button
                          onClick={() => {
                            const list = form.howWeWork.steps.filter((_: any, i: number) => i !== idx);
                            setField("howWeWork", "steps", list);
                          }}
                          className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                        <h5 className="font-extrabold text-xs text-slate-700 uppercase">Step #{idx + 1}</h5>
                        <TranslatableField label="Title" value={item.title} onChange={v => {
                          const list = [...form.howWeWork.steps];
                          list[idx].title = v;
                          setField("howWeWork", "steps", list);
                        }} />
                        <TranslatableField label="Description" type="quill" value={item.description} onChange={v => {
                          const list = [...form.howWeWork.steps];
                          list[idx].description = v;
                          setField("howWeWork", "steps", list);
                        }} />
                        <ImageUploadField label="Step Icon / Image" value={item.image} onChange={v => {
                          const list = [...form.howWeWork.steps];
                          list[idx].image = v;
                          setField("howWeWork", "steps", list);
                        }} />
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>

              {/* 10. Benefits Section */}
              <SectionCard title="Benefits Section" subtitle="Why choose BZNX" icon={<ThumbsUp size={16} />} sectionKey="benefits" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Badge" value={form.benefits.badge} onChange={v => setField("benefits", "badge", v)} />
                <TranslatableField label="Title" type="quill" value={form.benefits.title} onChange={v => setField("benefits", "title", v)} />
                <TranslatableField label="Description" type="quill" value={form.benefits.description} onChange={v => setField("benefits", "description", v)} />
                <ImageUploadField label="Side Decoration Image" value={form.benefits.image} onChange={v => setField("benefits", "image", v)} />

                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Benefits Items</span>
                    <button
                      onClick={() => setForm((p: any) => ({ ...p, benefits: { ...p.benefits, items: [...p.benefits.items, { _id: Math.random().toString(), image: { url: "" }, title: b(), description: b() }] } }))}
                      className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                    >
                      <Plus size={10} /> Add Benefit
                    </button>
                  </div>
                  <div className="space-y-6">
                    {form.benefits.items.map((item: any, idx: number) => (
                      <div key={item._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 space-y-4 relative">
                        <button
                          onClick={() => {
                            const list = form.benefits.items.filter((_: any, i: number) => i !== idx);
                            setField("benefits", "items", list);
                          }}
                          className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                        <h5 className="font-extrabold text-xs text-slate-700 uppercase">Benefit #{idx + 1}</h5>
                        <TranslatableField label="Title" value={item.title} onChange={v => {
                          const list = [...form.benefits.items];
                          list[idx].title = v;
                          setField("benefits", "items", list);
                        }} />
                        <TranslatableField label="Description" type="quill" value={item.description} onChange={v => {
                          const list = [...form.benefits.items];
                          list[idx].description = v;
                          setField("benefits", "items", list);
                        }} />
                        <ImageUploadField label="Benefit Icon / Image" value={item.image} onChange={v => {
                          const list = [...form.benefits.items];
                          list[idx].image = v;
                          setField("benefits", "items", list);
                        }} />
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>

              {/* 11. Case Studies Header */}
              <SectionCard title="Case Studies Heading" subtitle="Link to result showcases" icon={<Layers size={16} />} sectionKey="caseStudies" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Badge" value={form.caseStudies.badge} onChange={v => setField("caseStudies", "badge", v)} />
                <TranslatableField label="Title" type="quill" value={form.caseStudies.title} onChange={v => setField("caseStudies", "title", v)} />
                <TranslatableField label="Description" type="quill" value={form.caseStudies.description} onChange={v => setField("caseStudies", "description", v)} />
                <div className="grid grid-cols-2 gap-4">
                  <TranslatableField label="CTA Button Text" value={form.caseStudies.ctaText} onChange={v => setField("caseStudies", "ctaText", v)} />
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">CTA Button Link</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-[#00C4B4]" value={form.caseStudies.ctaLink} onChange={e => setField("caseStudies", "ctaLink", e.target.value)} />
                  </div>
                </div>
              </SectionCard>

              {/* 12. Testimonials Section */}
              <SectionCard title="Testimonials Section" subtitle="Feedback & testimonials carousel" icon={<ThumbsUp size={16} />} sectionKey="testimonials" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Badge" value={form.testimonials.badge} onChange={v => setField("testimonials", "badge", v)} />
                <TranslatableField label="Title" type="quill" value={form.testimonials.title} onChange={v => setField("testimonials", "title", v)} />
                
                <div className="grid grid-cols-2 gap-4">
                  <TranslatableField label="Primary Button Text" value={form.testimonials.ctaText} onChange={v => setField("testimonials", "ctaText", v)} />
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Primary Button Link</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-[#00C4B4]" value={form.testimonials.ctaLink} onChange={e => setField("testimonials", "ctaLink", e.target.value)} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100/50 pt-4">
                  <TranslatableField label="Secondary Button Text" value={form.testimonials.ctaText2} onChange={v => setField("testimonials", "ctaText2", v)} />
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Secondary Button Link</label>
                    <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-[#00C4B4]" value={form.testimonials.ctaLink2} onChange={e => setField("testimonials", "ctaLink2", e.target.value)} />
                  </div>
                </div>

                {/* Testimonials Stats */}
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Testimonials Metrics</span>
                    <button
                      onClick={() => setForm((p: any) => ({ ...p, testimonials: { ...p.testimonials, stats: [...p.testimonials.stats, { _id: Math.random().toString(), value: b(), label: b() }] } }))}
                      className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                    >
                      <Plus size={10} /> Add Metric
                    </button>
                  </div>
                  <div className="space-y-4">
                    {form.testimonials.stats.map((item: any, idx: number) => (
                      <div key={item._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 flex items-start gap-4 relative">
                        <button
                          onClick={() => {
                            const list = form.testimonials.stats.filter((_: any, i: number) => i !== idx);
                            setField("testimonials", "stats", list);
                          }}
                          className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="flex-1 grid grid-cols-1 gap-4">
                          <TranslatableField label="Value" value={item.value} onChange={v => {
                            const list = [...form.testimonials.stats];
                            list[idx].value = v;
                            setField("testimonials", "stats", list);
                          }} />
                          <TranslatableField label="Label" value={item.label} onChange={v => {
                            const list = [...form.testimonials.stats];
                            list[idx].label = v;
                            setField("testimonials", "stats", list);
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonials Reviews */}
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Reviews List</span>
                    <button
                      onClick={() => setForm((p: any) => ({ ...p, testimonials: { ...p.testimonials, items: [...p.testimonials.items, { _id: Math.random().toString(), image: { url: "" }, name: b(), title: b(), quote: b(), rating: "5" }] } }))}
                      className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-[#00C4B4] bg-[#00C4B4]/8 px-3 py-1.5 rounded-lg border border-[#00C4B4]/20 hover:bg-[#00C4B4]/15 transition-all"
                    >
                      <Plus size={10} /> Add Review
                    </button>
                  </div>
                  <div className="space-y-6">
                    {form.testimonials.items.map((item: any, idx: number) => (
                      <div key={item._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 space-y-4 relative">
                        <button
                          onClick={() => {
                            const list = form.testimonials.items.filter((_: any, i: number) => i !== idx);
                            setField("testimonials", "items", list);
                          }}
                          className="absolute top-2 right-2 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                        <h5 className="font-extrabold text-xs text-slate-700 uppercase">Review #{idx + 1}</h5>
                        <TranslatableField label="Reviewer Name" value={item.name} onChange={v => {
                          const list = [...form.testimonials.items];
                          list[idx].name = v;
                          setField("testimonials", "items", list);
                        }} />
                        <TranslatableField label="Reviewer Title/Role" value={item.title} onChange={v => {
                          const list = [...form.testimonials.items];
                          list[idx].title = v;
                          setField("testimonials", "items", list);
                        }} />
                        <TranslatableField label="Review Quote" type="quill" value={item.quote} onChange={v => {
                          const list = [...form.testimonials.items];
                          list[idx].quote = v;
                          setField("testimonials", "items", list);
                        }} />
                        <ImageUploadField label="Reviewer Avatar" value={item.image} onChange={v => {
                          const list = [...form.testimonials.items];
                          list[idx].image = v;
                          setField("testimonials", "items", list);
                        }} />
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Rating (1-5)</label>
                          <input type="number" min="1" max="5" className="w-20 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-[#00C4B4]" value={item.rating} onChange={e => {
                            const list = [...form.testimonials.items];
                            list[idx].rating = e.target.value;
                            setField("testimonials", "items", list);
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>

              {/* 13. Final CTA */}
              <SectionCard title="Final Conversion CTA" subtitle="Footer conversion strip" icon={<Layers size={16} />} sectionKey="cta" openSection={openSection} onToggle={toggleSection}>
                <TranslatableField label="Title" type="quill" value={form.cta.title} onChange={v => setField("cta", "title", v)} />
                <TranslatableField label="Description" type="quill" value={form.cta.description} onChange={v => setField("cta", "description", v)} />
                
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

          {/* ── RIGHT: full live preview — all sections, updates instantly ── */}
          <div className={previewMode ? "w-full" : ""}>
            <div className={previewMode ? "" : "sticky top-24 space-y-2"}>

              {/* Scaled full-page preview — scrollable at 70vh */}
              <div style={{ height: "70vh", overflowY: "auto", borderRadius: 14, border: "1px solid rgba(197,160,89,0.12)" }}>
                <AdminHomeFullPreview form={form} locale={previewLocale} />
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function HomeAdminPage() {
  return (
    <SnackbarProvider maxSnack={3}>
      <HomeEditorInner />
    </SnackbarProvider>
  );
}
