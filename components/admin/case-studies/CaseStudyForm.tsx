"use client";

import { useState } from "react";
import {
  Box,
  Divider,
  Typography,
  Button,
  IconButton,
  Paper
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ImageUploadField from "@/components/admin/common/ImageUploadField";
import TranslatableField from "@/components/admin/common/TranslatableField";
import { 
  ChevronDown, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  ThumbsUp, 
  Settings, 
  ListPlus, 
  Quote 
} from "lucide-react";

interface CaseStudyFormProps {
  formData: any;
  setFormData: (data: any) => void;
  updateSectionHeading: (section: string, field: string, value: any) => void;
  updateArrayItem: (field: string, index: number, value: any) => void;
  addArrayItem: (field: string, defaultValue: any) => void;
  removeArrayItem: (field: string, index: number) => void;
  updateSectionArrayItem: (section: string, index: number, value: any) => void;
  addSectionArrayItem: (section: string, defaultValue: any) => void;
  removeSectionArrayItem: (section: string, index: number) => void;
  initialTrans: { en: string; ar: string };
}

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

export default function CaseStudyForm({
  formData,
  setFormData,
  updateSectionHeading,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
  updateSectionArrayItem,
  addSectionArrayItem,
  removeSectionArrayItem,
  initialTrans
}: CaseStudyFormProps) {
  const [openSection, setOpenSection] = useState<string | null>("hero");

  // Safety check for formData
  if (!formData) return null;

  const toggleSection = (key: string) => {
    setOpenSection(prev => prev === key ? null : key);
  };

  return (
    <div className="space-y-4 mb-12 font-sans">
      {/* 1. HERO SECTION */}
      <SectionCard 
        title="Hero Section" 
        subtitle="Main identity and header details" 
        icon={<Sparkles size={16} />}
        sectionKey="hero"
        openSection={openSection}
        onToggle={toggleSection}
      >
        <div className="space-y-4 w-full">
          <TranslatableField
            label="Case Study Title"
            value={formData.title || initialTrans}
            onChange={(v) => setFormData({ ...formData, title: v })}
          />

          <TranslatableField 
            label="Tag / Badge" 
            value={formData.tag || initialTrans} 
            onChange={(v) => setFormData({ ...formData, tag: v })} 
          />
          
          <TranslatableField 
            label="Main Outcome (Pill)" 
            value={formData.outcome || initialTrans} 
            onChange={(v) => setFormData({ ...formData, outcome: v })} 
          />

          <TranslatableField 
            label="Industry" 
            value={formData.industry || initialTrans} 
            onChange={(v) => setFormData({ ...formData, industry: v })} 
          />
          
          <TranslatableField 
            label="Duration" 
            value={formData.duration || initialTrans} 
            onChange={(v) => setFormData({ ...formData, duration: v })} 
          />
          
          <TranslatableField 
            label="Location" 
            value={formData.location || initialTrans} 
            onChange={(v) => setFormData({ ...formData, location: v })} 
          />

          <TranslatableField 
            label="Grid Summary" 
            value={formData.description || initialTrans} 
            onChange={(v) => setFormData({ ...formData, description: v })} 
          />

          <ImageUploadField
            label="Hero Background Image"
            value={formData.image?.url || ""}
            onChange={(val) => setFormData({ ...formData, image: val })}
          />
        </div>
      </SectionCard>

      {/* 2. OVERVIEW & CHALLENGE SECTION */}
      <SectionCard 
        title="The Challenge" 
        subtitle="Context and obstacles faced" 
        icon={<HelpCircle size={16} />}
        sectionKey="challenge"
        openSection={openSection}
        onToggle={toggleSection}
      >
        <div className="space-y-6 w-full">
          <div className="space-y-4">
            <TranslatableField label="Section Badge" value={formData.challengeSection?.badge || initialTrans} onChange={(v) => updateSectionHeading('challengeSection', 'badge', v)} />
            <TranslatableField type="quill" label="Section Title" value={formData.challengeSection?.title || initialTrans} onChange={(v) => updateSectionHeading('challengeSection', 'title', v)} />
          </div>

          <TranslatableField label="Challenge Content" type="quill" value={formData.challengeSection?.content || initialTrans} onChange={(v) => updateSectionHeading('challengeSection', 'content', v)} />

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'gray.400', textTransform: 'uppercase', mb: 2, display: 'block' }}>Services Delivered</Typography>
            <div className="space-y-3">
              {(formData.services || []).map((item: any, idx: number) => (
                <Box key={idx} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', position: 'relative' }}>
                  <IconButton onClick={() => removeArrayItem('services', idx)} sx={{ position: 'absolute', top: 8, right: 8 }} size="small" color="error">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                  <TranslatableField label={`Service ${idx + 1}`} value={item || initialTrans} onChange={(v) => updateArrayItem('services', idx, v)} />
                </Box>
              ))}
              <Button variant="outlined" onClick={() => addArrayItem('services', { ...initialTrans })} sx={{ borderRadius: '12px' }}>+ Add Service</Button>
            </div>
          </Box>
        </div>
      </SectionCard>

      {/* 3. RESULTS SECTION */}
      <SectionCard 
        title="Outcomes & Results" 
        subtitle="Measurable success metrics" 
        icon={<ThumbsUp size={16} />}
        sectionKey="results"
        openSection={openSection}
        onToggle={toggleSection}
      >
        <div className="space-y-6 w-full">
          <TranslatableField label="Section Badge" value={formData.resultsSection?.badge || initialTrans} onChange={(v) => updateSectionHeading('resultsSection', 'badge', v)} />

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'gray.400', textTransform: 'uppercase', mb: 2, display: 'block' }}>Key Performance Results</Typography>
            
            <div className="space-y-4">
              {(formData.resultsSection?.items || []).map((result: any, idx: number) => (
                <Paper key={idx} sx={{ p: 4, bgcolor: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0', position: 'relative', display: 'flex', flexDirection: 'column', gap: 2, boxShadow: 'none' }}>
                  <IconButton onClick={() => removeSectionArrayItem('resultsSection', idx)} sx={{ position: 'absolute', top: 16, right: 16 }} color="error">
                    <CloseIcon />
                  </IconButton>
                  <TranslatableField label="Metric Value (e.g. 60%)" value={result.value || initialTrans} onChange={(v) => updateSectionArrayItem('resultsSection', idx, { ...result, value: v })} />
                  <TranslatableField label="Metric Label (e.g. ROI)" value={result.label || initialTrans} onChange={(v) => updateSectionArrayItem('resultsSection', idx, { ...result, label: v })} />
                </Paper>
              ))}
            </div>
            <Button variant="contained" onClick={() => addSectionArrayItem('resultsSection', { value: { ...initialTrans }, label: { ...initialTrans } })} sx={{ mt: 2, bgcolor: 'black', borderRadius: '12px', px: 4, py: 1.5 }}>
              Add Result Metric
            </Button>
          </Box>
        </div>
      </SectionCard>

      {/* 4. APPROACH SECTION */}
      <SectionCard 
        title="Our Approach" 
        subtitle="Step-by-step solution methodology" 
        icon={<Layers size={16} />}
        sectionKey="approach"
        openSection={openSection}
        onToggle={toggleSection}
      >
        <div className="space-y-6 w-full">
          <div className="space-y-4">
            <TranslatableField label="Section Badge" value={formData.approachSection?.badge || initialTrans} onChange={(v) => updateSectionHeading('approachSection', 'badge', v)} />
            <TranslatableField label="Section Title" type="quill" value={formData.approachSection?.title || initialTrans} onChange={(v) => updateSectionHeading('approachSection', 'title', v)} />
          </div>

          <div className="space-y-6">
            {(formData.approachSection?.items || []).map((step: any, idx: number) => (
              <Paper key={idx} sx={{ p: 4, bgcolor: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0', position: 'relative', display: 'flex', flexDirection: 'column', gap: 2, boxShadow: 'none' }}>
                <IconButton onClick={() => removeSectionArrayItem('approachSection', idx)} sx={{ position: 'absolute', top: 16, right: 16 }} color="error">
                  <CloseIcon />
                </IconButton>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                      <span className="text-black text-xs font-black">{(idx + 1).toString().padStart(2, '0')}</span>
                    </div>
                    <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase' }}>Step</Typography>
                  </div>
                  <TranslatableField label="Step Title" value={step.title || initialTrans} onChange={(v) => updateSectionArrayItem('approachSection', idx, { ...step, title: v })} />
                </div>
                <TranslatableField label="Step Description" value={step.description || initialTrans} onChange={(v) => updateSectionArrayItem('approachSection', idx, { ...step, description: v })} />
              </Paper>
            ))}
            <Button variant="contained" onClick={() => addSectionArrayItem('approachSection', { title: { ...initialTrans }, description: { ...initialTrans } })} sx={{ bgcolor: 'black', borderRadius: '12px', px: 4, py: 1.5 }}>
              Add Approach Step
            </Button>
          </div>
        </div>
      </SectionCard>

      {/* 5. DELIVERABLES SECTION */}
      <SectionCard 
        title="Deliverables" 
        subtitle="Full scope of items delivered" 
        icon={<ListPlus size={16} />}
        sectionKey="deliverables"
        openSection={openSection}
        onToggle={toggleSection}
      >
        <div className="space-y-6 w-full">
          <TranslatableField label="Section Badge" value={formData.deliverablesSection?.badge || initialTrans} onChange={(v) => updateSectionHeading('deliverablesSection', 'badge', v)} />
          <TranslatableField label="Section Title" type="quill" value={formData.deliverablesSection?.title || initialTrans} onChange={(v) => updateSectionHeading('deliverablesSection', 'title', v)} />

          <div className="space-y-4">
            {(formData.deliverablesSection?.items || []).map((item: any, idx: number) => (
              <Box key={idx} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', position: 'relative' }}>
                <IconButton onClick={() => removeSectionArrayItem('deliverablesSection', idx)} sx={{ position: 'absolute', top: 8, right: 8 }} size="small" color="error">
                  <CloseIcon fontSize="small" />
                </IconButton>
                <TranslatableField label={`Deliverable ${idx + 1}`} value={item || initialTrans} onChange={(v) => {
                  const newItems = [...formData.deliverablesSection.items];
                  newItems[idx] = v;
                  updateSectionHeading('deliverablesSection', 'items', newItems);
                }} />
              </Box>
            ))}
            <Button variant="outlined" onClick={() => addSectionArrayItem('deliverablesSection', { ...initialTrans })} sx={{ borderRadius: '12px' }}>+ Add Deliverable</Button>
          </div>
        </div>
      </SectionCard>

      {/* 6. TESTIMONIAL SECTION */}
      <SectionCard 
        title="Client Testimonial" 
        subtitle="Direct feedback and verification" 
        icon={<Quote size={16} />}
        sectionKey="testimonial"
        openSection={openSection}
        onToggle={toggleSection}
      >
        <div className="space-y-4 w-full">
          <TranslatableField label="Quote" type="quill" value={formData.testimonial?.quote || initialTrans} onChange={(v) => setFormData({ ...formData, testimonial: { ...formData.testimonial, quote: v } })} />
          <TranslatableField label="Author Name" value={formData.testimonial?.author || initialTrans} onChange={(v) => setFormData({ ...formData, testimonial: { ...formData.testimonial, author: v } })} />
          <TranslatableField label="Author Role" value={formData.testimonial?.role || initialTrans} onChange={(v) => setFormData({ ...formData, testimonial: { ...formData.testimonial, role: v } })} />
        </div>
      </SectionCard>

      {/* 7. RELATED SECTION */}
      <SectionCard 
        title="Related Projects Section" 
        subtitle="Headings for the 'More Case Studies' section" 
        icon={<Settings size={16} />}
        sectionKey="related"
        openSection={openSection}
        onToggle={toggleSection}
      >
        <div className="space-y-4 w-full">
          <TranslatableField 
            label="Section Badge" 
            value={formData.relatedSection?.badge || initialTrans} 
            onChange={(v) => updateSectionHeading('relatedSection', 'badge', v)} 
          />
          <TranslatableField 
            label="Section Title" 
            type="quill"
            value={formData.relatedSection?.title || initialTrans} 
            onChange={(v) => updateSectionHeading('relatedSection', 'title', v)} 
          />
        </div>
      </SectionCard>

      {/* 8. CTA SECTION */}
      <SectionCard 
        title="CTA Section" 
        subtitle="Call to action at the bottom of the page" 
        icon={<ThumbsUp size={16} />}
        sectionKey="cta"
        openSection={openSection}
        onToggle={toggleSection}
      >
        <div className="space-y-4 w-full">
          <TranslatableField label="CTA Title" type="quill" value={formData.cta?.title || initialTrans} onChange={(v) => setFormData({ ...formData, cta: { ...formData.cta, title: v } })} />
          <TranslatableField label="CTA Description" value={formData.cta?.description || initialTrans} onChange={(v) => setFormData({ ...formData, cta: { ...formData.cta, description: v } })} />

          <TranslatableField label="Primary Button Text" value={formData.cta?.ctaText || initialTrans} onChange={(v) => setFormData({ ...formData, cta: { ...formData.cta, ctaText: v } })} />
          <div className="flex flex-col">
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'gray.400', textTransform: 'uppercase', mb: 1, display: 'block' }}>Primary Button Link</Typography>
            <input
              type="text"
              value={formData.cta?.ctaLink || ""}
              onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, ctaLink: e.target.value } })}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal/20"
              placeholder="/contact"
            />
          </div>

          <TranslatableField label="Secondary Button Text" value={formData.cta?.ctaText2 || initialTrans} onChange={(v) => setFormData({ ...formData, cta: { ...formData.cta, ctaText2: v } })} />
          <div className="flex flex-col">
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'gray.400', textTransform: 'uppercase', mb: 1, display: 'block' }}>Secondary Button Link</Typography>
            <input
              type="text"
              value={formData.cta?.ctaLink2 || ""}
              onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, ctaLink2: e.target.value } })}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal/20"
              placeholder="https://wa.me/..."
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}