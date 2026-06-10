"use client";
import React, { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Tooltip
} from "@mui/material";
import { 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Type, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Quote as QuoteIcon, 
  AlertCircle,
  ChevronDown,
  Sparkles,
  Layers,
  ThumbsUp
} from "lucide-react";
import ImageUploadField from "@/components/admin/common/ImageUploadField";
import TranslatableField from "@/components/admin/common/TranslatableField";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface ContentBlock {
  type: "paragraph" | "heading" | "subheading" | "bullets" | "numbered" | "quote" | "callout";
  text?: { en: string; ar: string };
  items?: { en: string[]; ar: string[] };
  title?: { en: string; ar: string };
  author?: { en: string; ar: string };
}

interface BlogFormProps {
  formData: any;
  setFormData: (data: any) => void;
  updateSectionHeading: (section: string, field: string, value: any) => void;
  initialTrans: { en: string; ar: string };
}

const LangSwitch = ({ lang, setLang }: { lang: "en" | "ar"; setLang: (l: "en" | "ar") => void }) => (
  <Box sx={{ display: 'flex', gap: '2px', bgcolor: '#f1f5f9', p: '2px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
    {(["en", "ar"] as const).map((l) => (
      <button
        key={l}
        type="button"
        onClick={() => setLang(l)}
        style={{
          padding: "3px 12px",
          borderRadius: "6px",
          fontSize: "10px",
          fontWeight: 800,
          letterSpacing: "0.05em",
          border: "none",
          cursor: "pointer",
          transition: "all 0.15s",
          background: lang === l ? "#00C4B4" : "transparent",
          color: lang === l ? "#fff" : "#64748b",
        }}
      >
        {l.toUpperCase()}
      </button>
    ))}
  </Box>
);

const BlockItem = React.memo(({
  block, 
  index, 
  totalBlocks,
  updateBlock, 
  removeBlock, 
  moveBlock 
}: { 
  block: ContentBlock, 
  index: number, 
  totalBlocks: number,
  updateBlock: (index: number, updates: Partial<ContentBlock>) => void,
  removeBlock: (index: number) => void,
  moveBlock: (index: number, direction: 'up' | 'down') => void
}) => {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const isAr = lang === "ar";

  return (
    <Paper 
      sx={{ 
        p: 4, 
        borderRadius: '24px', 
        border: '1px solid #e2e8f0', 
        bgcolor: '#f8fafc',
        position: 'relative',
        boxShadow: 'none',
        '&:hover .block-actions': { opacity: 1 }
      }}
    >
      <Box className="flex justify-between items-center mb-6">
        <Box className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-teal bg-teal/10 px-3 py-1 rounded">
            {block.type}
          </span>
          <LangSwitch lang={lang} setLang={setLang} />
        </Box>
        <Box className="block-actions opacity-0 transition-opacity flex gap-1">
          <IconButton size="small" onClick={() => moveBlock(index, 'up')} disabled={index === 0}>
            <MoveUp size={14} />
          </IconButton>
          <IconButton size="small" onClick={() => moveBlock(index, 'down')} disabled={index === totalBlocks - 1}>
            <MoveDown size={14} />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => removeBlock(index)}>
            <Trash2 size={14} />
          </IconButton>
        </Box>
      </Box>

      <Box className="space-y-4" dir={isAr ? "rtl" : "ltr"}>
        {/* Callout Title */}
        {block.type === 'callout' && (
          <div className="space-y-1">
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
              {isAr ? "AR عنوان الكال آوت" : "EN Callout Title"}
            </Typography>
            <input
              type="text"
              placeholder={isAr ? "العنوان بالعربية..." : "English Title..."}
              value={isAr ? (block.title?.ar || "") : (block.title?.en || "")}
              onChange={(e) => updateBlock(index, { title: isAr ? { ...block.title!, ar: e.target.value } : { ...block.title!, en: e.target.value } })}
              className="w-full p-2 text-sm font-bold border-b border-slate-200 focus:outline-none bg-transparent"
            />
          </div>
        )}

        {/* Text fields (Quill) */}
        {["paragraph", "heading", "subheading", "quote", "callout"].includes(block.type) && (
          <div className="space-y-2">
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
              {isAr ? "المحتوى العربي" : "English Content"}
            </Typography>
            <ReactQuill
              theme="snow"
              value={isAr ? (block.text?.ar || "") : (block.text?.en || "")}
              onChange={(v) => {
                const current = isAr ? block.text?.ar : block.text?.en;
                if (v !== current) {
                  updateBlock(index, { text: isAr ? { ...block.text!, ar: v } : { ...block.text!, en: v } });
                }
              }}
              className={`bg-white rounded-lg overflow-hidden${isAr ? " ql-editor-rtl" : ""}`}
            />
          </div>
        )}

        {/* Author for Quote */}
        {block.type === 'quote' && (
          <div className="space-y-1">
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
              {isAr ? "AR الكاتب" : "EN Author"}
            </Typography>
            <input
              type="text"
              placeholder={isAr ? "الكاتب بالعربية..." : "English Author..."}
              value={isAr ? (block.author?.ar || "") : (block.author?.en || "")}
              onChange={(e) => updateBlock(index, { author: isAr ? { ...block.author!, ar: e.target.value } : { ...block.author!, en: e.target.value } })}
              className="w-full p-2 text-xs italic border-b border-slate-200 focus:outline-none bg-transparent"
            />
          </div>
        )}

        {/* Items for Lists */}
        {["bullets", "numbered"].includes(block.type) && (
          <div className="space-y-3">
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
              {isAr ? "عناصر القائمة بالعربية" : "English List Items"}
            </Typography>
            <Box className="space-y-2">
              {(isAr ? block.items?.ar : block.items?.en)?.map((item, i) => (
                <Box key={i} className="flex gap-2 items-start">
                  <span className="mt-2 text-slate-400 text-xs font-bold">{i + 1}.</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      if (isAr) {
                        const newItems = [...(block.items?.ar || [])];
                        newItems[i] = e.target.value;
                        updateBlock(index, { items: { ...block.items!, ar: newItems } });
                      } else {
                        const newItems = [...(block.items?.en || [])];
                        newItems[i] = e.target.value;
                        updateBlock(index, { items: { ...block.items!, en: newItems } });
                      }
                    }}
                    className="flex-1 p-2 text-sm border-b border-slate-200 focus:outline-none bg-transparent"
                  />
                  {!isAr && (
                    <IconButton size="small" onClick={() => {
                      const newEn = (block.items?.en || []).filter((_, idx) => idx !== i);
                      const newAr = (block.items?.ar || []).filter((_, idx) => idx !== i);
                      updateBlock(index, { items: { en: newEn, ar: newAr } });
                    }}>
                      <Trash2 size={12} />
                    </IconButton>
                  )}
                </Box>
              ))}
              {!isAr && (
                <Button
                  size="small"
                  startIcon={<Plus size={14} />}
                  onClick={() => updateBlock(index, { items: { en: [...(block.items?.en || []), ""], ar: [...(block.items?.ar || []), ""] } })}
                  sx={{ fontSize: '10px', fontWeight: 800, color: 'teal' }}
                >
                  Add Item
                </Button>
              )}
            </Box>
          </div>
        )}
      </Box>
    </Paper>
  );
});

BlockItem.displayName = "BlockItem";

const ContentBlocksEditor = ({ 
  blocks, 
  onChange,
  initialTrans
}: { 
  blocks: ContentBlock[], 
  onChange: (blocks: ContentBlock[]) => void,
  initialTrans: { en: string, ar: string }
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const addBlock = (type: ContentBlock["type"]) => {
    const newBlock: any = { type };
    if (["paragraph", "heading", "subheading", "quote", "callout"].includes(type)) newBlock.text = { ...initialTrans };
    if (["bullets", "numbered"].includes(type)) newBlock.items = { en: [""], ar: [""] };
    if (type === "callout") newBlock.title = { ...initialTrans };
    if (type === "quote") newBlock.author = { ...initialTrans };
    
    onChange([...blocks, newBlock]);
    setAnchorEl(null);
  };

  const updateBlock = React.useCallback((index: number, updates: Partial<ContentBlock>) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...updates };
    onChange(newBlocks);
  }, [blocks, onChange]);

  const removeBlock = React.useCallback((index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  }, [blocks, onChange]);

  const moveBlock = React.useCallback((index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    onChange(newBlocks);
  }, [blocks, onChange]);

  return (
    <Box className="space-y-6">
      {blocks.map((block, index) => (
        <BlockItem
          key={index}
          block={block}
          index={index}
          totalBlocks={blocks.length}
          updateBlock={updateBlock}
          removeBlock={removeBlock}
          moveBlock={moveBlock}
        />
      ))}

      <Button
        variant="outlined"
        fullWidth
        onClick={(e) => setAnchorEl(e.currentTarget)}
        startIcon={<Plus />}
        sx={{ 
          borderRadius: '20px', 
          border: '2px dashed #e2e8f0', 
          color: '#64748b',
          py: 3,
          '&:hover': { border: '2px dashed #26D0CE', color: '#26D0CE', bgcolor: 'rgba(38,208,206,0.05)' }
        }}
      >
        Add Content Block
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{ 
          paper: { 
            sx: { 
              borderRadius: '15px', 
              mt: 1, 
              minWidth: '200px', 
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' 
            } 
          } 
        }}
      >
        <MenuItem onClick={() => addBlock('paragraph')}><Type size={16} className="mr-3 text-slate-400" /> Paragraph</MenuItem>
        <MenuItem onClick={() => addBlock('heading')}><Heading1 size={16} className="mr-3 text-slate-400" /> Heading</MenuItem>
        <MenuItem onClick={() => addBlock('subheading')}><Heading2 size={16} className="mr-3 text-slate-400" /> Subheading</MenuItem>
        <MenuItem onClick={() => addBlock('bullets')}><List size={16} className="mr-3 text-slate-400" /> Bullets</MenuItem>
        <MenuItem onClick={() => addBlock('numbered')}><ListOrdered size={16} className="mr-3 text-slate-400" /> Numbered List</MenuItem>
        <MenuItem onClick={() => addBlock('quote')}><QuoteIcon size={16} className="mr-3 text-slate-400" /> Quote</MenuItem>
        <MenuItem onClick={() => addBlock('callout')}><AlertCircle size={16} className="mr-3 text-slate-400" /> Callout Card</MenuItem>
      </Menu>
    </Box>
  );
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

export default function BlogForm({
  formData,
  setFormData,
  updateSectionHeading,
  initialTrans
}: BlogFormProps) {
  const [openSection, setOpenSection] = useState<string | null>("identity");

  if (!formData) return null;

  const toggleSection = (key: string) => {
    setOpenSection(prev => prev === key ? null : key);
  };

  return (
    <div className="space-y-4 mb-12 font-sans">
      {/* 1. HERO & METADATA SECTION */}
      <SectionCard 
        title="Blog Identity" 
        subtitle="Main header details and metadata" 
        icon={<Sparkles size={16} />}
        sectionKey="identity"
        openSection={openSection}
        onToggle={toggleSection}
      >
        <div className="space-y-4 w-full">
          <TranslatableField
            label="Blog Title"
            value={formData.title || initialTrans}
            onChange={(v) => setFormData({ ...formData, title: v })}
          />

          <div className="flex items-center pt-2">
            <FormControlLabel
              control={<Switch checked={formData.featured || false} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} />}
              label={<Typography sx={{ fontWeight: 700, fontSize: '14px' }}>Featured Post</Typography>}
            />
          </div>

          <TranslatableField label="Category" value={formData.category || initialTrans} onChange={(v) => setFormData({ ...formData, category: v })} />
          <TranslatableField label="Read Time" value={formData.readTime || initialTrans} onChange={(v) => setFormData({ ...formData, readTime: v })} />

          <div className="flex flex-col">
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'gray.400', textTransform: 'uppercase', mb: 1, display: 'block' }}>Publish Date</Typography>
            <input
              type="text"
              value={formData.date || ""}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal/20"
              placeholder="May 15, 2025"
            />
          </div>
          <TranslatableField label="Author" value={formData.author || initialTrans} onChange={(v) => setFormData({ ...formData, author: v })} />

          <TranslatableField label="Excerpt (Short Summary)" value={formData.excerpt || initialTrans} onChange={(v) => setFormData({ ...formData, excerpt: v })} />

          <ImageUploadField
            label="Featured Image"
            value={formData.image?.url || formData.image || ""}
            onChange={(val) => setFormData({ ...formData, image: val })}
          />
        </div>
      </SectionCard>

      {/* 2. STRUCTURED CONTENT SECTION */}
      <SectionCard 
        title="Structured Blog Content" 
        subtitle="Build your article using content blocks" 
        icon={<Layers size={16} />}
        sectionKey="content"
        openSection={openSection}
        onToggle={toggleSection}
      >
        <div className="space-y-4 w-full">
          <ContentBlocksEditor 
            blocks={formData.contentSection?.content || []} 
            onChange={(newBlocks) => updateSectionHeading('contentSection', 'content', newBlocks)}
            initialTrans={initialTrans}
          />
        </div>
      </SectionCard>

      {/* 4. CTA SECTION */}
      <SectionCard 
        title="CTA Section" 
        subtitle="Call to action at the bottom" 
        icon={<ThumbsUp size={16} />}
        sectionKey="cta"
        openSection={openSection}
        onToggle={toggleSection}
      >
        <div className="space-y-4 w-full">
          <TranslatableField label="CTA Badge" value={formData.ctaSection?.badge || initialTrans} onChange={(v) => updateSectionHeading('ctaSection', 'badge', v)} />
          <TranslatableField label="CTA Title" type="quill" value={formData.ctaSection?.title || initialTrans} onChange={(v) => updateSectionHeading('ctaSection', 'title', v)} />
          <TranslatableField label="CTA Description" value={formData.ctaSection?.description || initialTrans} onChange={(v) => updateSectionHeading('ctaSection', 'description', v)} />

          <TranslatableField label="Button Text" value={formData.ctaSection?.ctaText || initialTrans} onChange={(v) => updateSectionHeading('ctaSection', 'ctaText', v)} />
          <div className="flex flex-col">
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'gray.400', textTransform: 'uppercase', mb: 1, display: 'block' }}>Button Link</Typography>
            <input
              type="text"
              value={formData.ctaSection?.ctaLink || ""}
              onChange={(e) => updateSectionHeading('ctaSection', 'ctaLink', e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal/20"
              placeholder="/contact"
            />
          </div>

          <TranslatableField label="Button Text 2" value={formData.ctaSection?.ctaText2 || initialTrans} onChange={(v) => updateSectionHeading('ctaSection', 'ctaText2', v)} />
          <div className="flex flex-col">
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'gray.400', textTransform: 'uppercase', mb: 1, display: 'block' }}>Button Link 2</Typography>
            <input
              type="text"
              value={formData.ctaSection?.ctaLink2 || ""}
              onChange={(e) => updateSectionHeading('ctaSection', 'ctaLink2', e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal/20"
              placeholder="/services"
            />
          </div>
        </div>
      </SectionCard>

      <style jsx global>{`
        .quill-rtl .ql-editor {
          direction: rtl;
          text-align: right;
        }
        .ql-container {
          font-family: inherit !important;
          font-size: 14px !important;
        }
        .ql-editor {
          min-height: 100px;
        }
      `}</style>
    </div>
  );
}
