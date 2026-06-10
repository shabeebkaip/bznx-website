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
  ListPlus 
} from "lucide-react";

interface ServiceFormProps {
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

export default function ServiceForm({ 
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
}: ServiceFormProps) {
  const [openSection, setOpenSection] = useState<string | null>("hero");

  // Safety check for formData
  if (!formData) return null;

  const toggleSection = (key: string) => {
    setOpenSection(prev => prev === key ? null : key);
  };

  return (
    <div className="space-y-4 mb-12 font-sans">
      {/* HERO SECTION */}
      <SectionCard 
        title="Hero Section" 
        subtitle="Main service identifiers" 
        icon={<Sparkles size={16} />}
        sectionKey="hero"
        openSection={openSection}
        onToggle={toggleSection}
      >
        <div className="space-y-4 w-full">
          <TranslatableField 
            label="Service Title" 
            value={formData.title || initialTrans} 
            onChange={(v) => setFormData({ ...formData, title: v })} 
          />
          
          <TranslatableField label="Tag / Category" value={formData.tag || initialTrans} onChange={(v) => setFormData({ ...formData, tag: v })} />
          <TranslatableField label="Typical Timeline" value={formData.timeline || initialTrans} onChange={(v) => setFormData({ ...formData, timeline: v })} />
          
          <ImageUploadField 
            label="Service Icon / Card Image"
            value={formData.icon?.url || ""}
            onChange={(val) => setFormData({ ...formData, icon: val })}
          />

          <Divider sx={{ my: 4, borderStyle: 'dashed' }} />

          <TranslatableField label="Short Description (For Lists)" value={formData.description || initialTrans} onChange={(v) => setFormData({ ...formData, description: v })} />
          <TranslatableField label="Hero Description (Full Text)" value={formData.fullDescription || initialTrans} onChange={(v) => setFormData({ ...formData, fullDescription: v })} />

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'gray.400', textTransform: 'uppercase', mb: 2, display: 'block' }}>Key Deliverables (Hero Card Bullets)</Typography>
            <div className="space-y-4">
              {(formData.bullets || []).map((item: any, idx: number) => (
                <Box key={idx} sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0', position: 'relative' }}>
                  <IconButton onClick={() => removeArrayItem('bullets', idx)} sx={{ position: 'absolute', top: 12, right: 12 }} color="error">
                    <CloseIcon />
                  </IconButton>
                  <TranslatableField label={`Bullet ${idx + 1}`} value={item || initialTrans} onChange={(v) => updateArrayItem('bullets', idx, v)} />
                </Box>
              ))}
              <Button variant="outlined" onClick={() => addArrayItem('bullets', { ...initialTrans })} sx={{ borderRadius: '12px' }}>+ Add Bullet</Button>
            </div>
          </Box>
        </div>
      </SectionCard>

      {/* FEATURES SECTION */}
      <SectionCard 
        title="Features Section" 
        subtitle="Detailed list of what's included" 
        icon={<Layers size={16} />}
        sectionKey="features"
        openSection={openSection}
        onToggle={toggleSection}
      >
        <div className="space-y-4 w-full">
          <TranslatableField label="Section Badge" value={formData.featuresSection?.badge || initialTrans} onChange={(v) => updateSectionHeading('featuresSection', 'badge', v)} />
          <TranslatableField label="Section Title" type="quill" value={formData.featuresSection?.title || initialTrans} onChange={(v) => updateSectionHeading('featuresSection', 'title', v)} />

          <Box className="space-y-6 mt-8">
            {(formData.featuresSection?.items || []).map((feature: any, idx: number) => (
              <Paper key={idx} sx={{ p: 4, bgcolor: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0', position: 'relative', boxShadow: 'none' }}>
                <IconButton onClick={() => removeSectionArrayItem('featuresSection', idx)} sx={{ position: 'absolute', top: 16, right: 16 }} color="error">
                  <CloseIcon />
                </IconButton>
                <TranslatableField label="Feature Title" value={feature.title || initialTrans} onChange={(v) => updateSectionArrayItem('featuresSection', idx, { ...feature, title: v })} />
                <TranslatableField label="Feature Description" value={feature.description || initialTrans} onChange={(v) => updateSectionArrayItem('featuresSection', idx, { ...feature, description: v })} />
              </Paper>
            ))}
            <Button variant="contained" onClick={() => addSectionArrayItem('featuresSection', { title: { ...initialTrans }, description: { ...initialTrans } })} sx={{ bgcolor: 'black', borderRadius: '12px', px: 4, py: 1.5 }}>
              Add New Feature
            </Button>
          </Box>
        </div>
      </SectionCard>

      {/* PROCESS SECTION */}
      <SectionCard 
        title="Service Process" 
        subtitle="Steps of your workflow" 
        icon={<HelpCircle size={16} />}
        sectionKey="process"
        openSection={openSection}
        onToggle={toggleSection}
      >
        <div className="space-y-4 w-full">
          <TranslatableField label="Section Badge" value={formData.processSection?.badge || initialTrans} onChange={(v) => updateSectionHeading('processSection', 'badge', v)} />
          <TranslatableField label="Section Title" type="quill" value={formData.processSection?.title || initialTrans} onChange={(v) => updateSectionHeading('processSection', 'title', v)} />

          <Box className="space-y-6 mt-8">
            {(formData.processSection?.items || []).map((step: any, idx: number) => (
              <Paper key={idx} sx={{ p: 4, bgcolor: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0', position: 'relative', boxShadow: 'none' }}>
                <IconButton onClick={() => removeSectionArrayItem('processSection', idx)} sx={{ position: 'absolute', top: 16, right: 16 }} color="error">
                  <CloseIcon />
                </IconButton>
                <TranslatableField label="Step Title" value={step.title || initialTrans} onChange={(v) => updateSectionArrayItem('processSection', idx, { ...step, title: v })} />
                <TranslatableField label="Step Description" value={step.description || initialTrans} onChange={(v) => updateSectionArrayItem('processSection', idx, { ...step, description: v })} />
              </Paper>
            ))}
            <Button variant="contained" onClick={() => addSectionArrayItem('processSection', { title: { ...initialTrans }, description: { ...initialTrans } })} sx={{ bgcolor: 'black', borderRadius: '12px', px: 4, py: 1.5 }}>
              Add Process Step
            </Button>
          </Box>
        </div>
      </SectionCard>

      {/* DELIVERABLES */}
      <SectionCard 
        title="Deliverables" 
        subtitle="Items the client will receive" 
        icon={<ListPlus size={16} />}
        sectionKey="deliverables"
        openSection={openSection}
        onToggle={toggleSection}
      >
        <div className="space-y-4 w-full">
          <TranslatableField label="Section Badge" value={formData.deliverablesSection?.badge || initialTrans} onChange={(v) => updateSectionHeading('deliverablesSection', 'badge', v)} />
          <TranslatableField label="Section Title" type="quill" value={formData.deliverablesSection?.title || initialTrans} onChange={(v) => updateSectionHeading('deliverablesSection', 'title', v)} />

          <div className="space-y-4 mt-8">
            {(formData.deliverablesSection?.items || []).map((item: any, idx: number) => (
              <Box key={idx} sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0', position: 'relative' }}>
                <IconButton onClick={() => removeSectionArrayItem('deliverablesSection', idx)} sx={{ position: 'absolute', top: 12, right: 12 }} color="error">
                  <CloseIcon />
                </IconButton>
                <TranslatableField label={`Deliverable ${idx + 1}`} value={item || initialTrans} onChange={(v) => updateSectionArrayItem('deliverablesSection', idx, v)} />
              </Box>
            ))}
            <Button variant="outlined" onClick={() => addSectionArrayItem('deliverablesSection', { ...initialTrans })} sx={{ borderRadius: '12px', mt: 1 }}>+ Add Deliverable</Button>
          </div>
        </div>
      </SectionCard>

      {/* WHY BZNX */}
      <SectionCard 
        title="Our Difference" 
        subtitle="Why choose BZNX?" 
        icon={<ThumbsUp size={16} />}
        sectionKey="difference"
        openSection={openSection}
        onToggle={toggleSection}
      >
        <div className="space-y-4 w-full">
          <TranslatableField label="Section Badge" value={formData.differenceSection?.badge || initialTrans} onChange={(v) => updateSectionHeading('differenceSection', 'badge', v)} />
          <TranslatableField label="Section Title" type="quill" value={formData.differenceSection?.title || initialTrans} onChange={(v) => updateSectionHeading('differenceSection', 'title', v)} />

          <div className="space-y-6 mt-8">
            {(formData.differenceSection?.items || []).map((item: any, idx: number) => (
              <Paper key={idx} sx={{ p: 4, bgcolor: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0', position: 'relative', boxShadow: 'none' }}>
                <IconButton onClick={() => removeSectionArrayItem('differenceSection', idx)} sx={{ position: 'absolute', top: 16, right: 16 }} color="error">
                  <CloseIcon />
                </IconButton>
                <TranslatableField label="Benefit Title" value={item.title || initialTrans} onChange={(v) => updateSectionArrayItem('differenceSection', idx, { ...item, title: v })} />
                <TranslatableField label="Benefit Description" value={item.description || initialTrans} onChange={(v) => updateSectionArrayItem('differenceSection', idx, { ...item, description: v })} />
              </Paper>
            ))}
            <Button variant="contained" onClick={() => addSectionArrayItem('differenceSection', { title: { ...initialTrans }, description: { ...initialTrans } })} sx={{ bgcolor: 'black', borderRadius: '12px', px: 4, py: 1.5 }}>
              Add Benefit
            </Button>
          </div>
        </div>
      </SectionCard>

      {/* OTHER SERVICES HEADING */}
      <SectionCard 
        title="Other Services Section" 
        subtitle="Heading for the 'Explore More' area" 
        icon={<Settings size={16} />}
        sectionKey="other"
        openSection={openSection}
        onToggle={toggleSection}
      >
        <div className="space-y-4 w-full">
          <TranslatableField label="Section Badge" value={formData.otherServicesSection?.badge || initialTrans} onChange={(v) => updateSectionHeading('otherServicesSection', 'badge', v)} />
          <TranslatableField label="Section Title" type="quill" value={formData.otherServicesSection?.title || initialTrans} onChange={(v) => updateSectionHeading('otherServicesSection', 'title', v)} />
        </div>
      </SectionCard>
    </div>
  );
}
