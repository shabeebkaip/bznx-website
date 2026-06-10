"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CommonTable, { Column } from "@/components/admin/common/CommonTable";
import CMSDialog from "@/components/admin/common/CMSDialog";
import DeleteConfirmModal from "@/components/admin/common/DeleteConfirmModal";
import TranslatableField from "@/components/admin/common/TranslatableField";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { Button, TextField, Box, Typography, Divider } from "@mui/material";
import { Plus } from "lucide-react";

interface SEOData {
  _id?: string;
  page: string;
  metaTitle: { en: string; ar: string };
  metaDescription: { en: string; ar: string };
  metaKeywords: { en: string; ar: string };
  canonicalUrl?: string;
  ogTitle: { en: string; ar: string };
  ogDescription: { en: string; ar: string };
  ogImage?: any;
  robots?: string;
  structuredData?: string;
}

const initialSEO = (): SEOData => ({
  page: "",
  metaTitle: { en: "", ar: "" },
  metaDescription: { en: "", ar: "" },
  metaKeywords: { en: "", ar: "" },
  canonicalUrl: "",
  ogTitle: { en: "", ar: "" },
  ogDescription: { en: "", ar: "" },
  ogImage: "",
  robots: "index, follow",
  structuredData: "",
});

export default function SEOManager() {
  const router = useRouter();
  const [seos, setSeos] = useState<SEOData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedSeo, setSelectedSeo] = useState<SEOData>(initialSEO());
  const [isEdit, setIsEdit] = useState(false);

  const fetchSEOs = async () => {
    try {
      const res = await fetch("/api/seo");
      const result = await res.json();
      if (result.status) setSeos(result.data || []);
    } catch (error) {
      enqueueSnackbar("Error fetching SEO configurations", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSEOs();
  }, []);

  const handleOpenAdd = () => {
    setSelectedSeo(initialSEO());
    setIsEdit(false);
    setDialogOpen(true);
  };

  const handleOpenEdit = (seo: SEOData) => {
    setSelectedSeo(JSON.parse(JSON.stringify(seo)));
    setIsEdit(true);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedSeo.page.trim()) {
      enqueueSnackbar("Page slug is required", { variant: "warning" });
      return;
    }
    if (!selectedSeo.metaTitle.en.trim() || !selectedSeo.metaTitle.ar.trim()) {
      enqueueSnackbar("Meta title is required in both English and Arabic", { variant: "warning" });
      return;
    }

    setSaving(true);
    try {
      const url = "/api/seo";
      const method = isEdit ? "PUT" : "POST";
      const payload = isEdit ? { id: selectedSeo._id, ...selectedSeo } : selectedSeo;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.status) {
        enqueueSnackbar(isEdit ? "SEO updated successfully" : "SEO created successfully", { variant: "success" });
        setDialogOpen(false);
        fetchSEOs();
      } else {
        enqueueSnackbar(result.error || "Failed to save SEO config", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Error saving SEO config", { variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/seo?id=${deleteId}`, { method: "DELETE" });
      const result = await res.json();
      if (result.status) {
        enqueueSnackbar("SEO configuration deleted", { variant: "success" });
        setSeos(seos.filter((s) => s._id !== deleteId));
      } else {
        enqueueSnackbar("Failed to delete SEO config", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Error deleting SEO config", { variant: "error" });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: Column[] = [
    {
      key: "page",
      label: "Page",
      render: (row: SEOData) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#091d37] capitalize">{row.page}</span>
          <span className="text-[10px] text-slate-400 font-mono mt-0.5">/{row.page === "home" ? "" : row.page}</span>
        </div>
      ),
    },
    {
      key: "metaTitle",
      label: "Meta Title",
      render: (row: SEOData) => (
        <span className="text-sm text-slate-600 truncate max-w-xs block">
          {row.metaTitle?.en || <span className="text-slate-300 italic text-xs">Not set</span>}
        </span>
      ),
    },
    {
      key: "metaKeywords",
      label: "Meta Keywords",
      render: (row: SEOData) => (
        <span className="text-sm text-slate-500 truncate max-w-xs block">
          {row.metaKeywords?.en || <span className="text-slate-300 italic text-xs">Not set</span>}
        </span>
      ),
    },
  ];

  return (
    <SnackbarProvider maxSnack={3}>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#091d37] uppercase tracking-tighter">SEO</h1>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Manage search engine optimization configs</p>
          </div>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={handleOpenAdd}
            sx={{ bgcolor: '#00C4B4', borderRadius: '12px', px: 4, py: 1.5, fontWeight: 800, '&:hover': { bgcolor: '#00A396' } }}
          >
            New SEO Page
          </Button>
        </div>

        <CommonTable
          columns={columns}
          data={seos}
          loading={loading}
          onEdit={handleOpenEdit}
          onDelete={(row: SEOData) => setDeleteId(row._id!)}
          emptyMessage="No SEO configs configured yet. Click 'New SEO Page' to get started."
        />

        <DeleteConfirmModal
          open={!!deleteId}
          loading={deleting}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Delete SEO"
          message="Are you sure you want to delete the SEO configuration for this page? The page will lose custom meta search tags."
        />

        <CMSDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSave}
          title={isEdit ? `Edit SEO: ${selectedSeo.page}` : "Add SEO Page"}
          saving={saving}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>

            {/* ── Page Identifier ── */}
            <Box
              sx={{
                p: 2.5,
                borderRadius: "14px",
                border: "1px solid rgba(0, 196, 180, 0.18)",
                background: "rgba(0, 196, 180, 0.04)",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mb: 1.5,
                  fontWeight: 900,
                  color: "#00C4B4",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontSize: "0.65rem",
                }}
              >
                Page Identifier
              </Typography>
              <TextField
                label="Page (e.g. 'home', 'about')"
                disabled={isEdit}
                fullWidth
                value={selectedSeo.page}
                onChange={(e) => setSelectedSeo({ ...selectedSeo, page: e.target.value })}
                helperText="Unique slug used to identify which page this SEO config applies to."
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                  "& .MuiOutlinedInput-root.Mui-disabled": {
                    background: "rgba(0, 196, 180, 0.06)",
                  },
                  "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 196, 180, 0.25) !important",
                  },
                  "& .MuiInputBase-input.Mui-disabled": {
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                  },
                  "& .MuiFormHelperText-root": { fontSize: "0.7rem" },
                }}
              />
            </Box>

            <Divider />

            {/* ── Standard SEO ── */}
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.12em", fontSize: "0.7rem" }}>
              Standard SEO Tags
            </Typography>

            <TranslatableField
              label="Meta Title"
              value={selectedSeo.metaTitle}
              onChange={(val) => setSelectedSeo({ ...selectedSeo, metaTitle: val })}
            />

            <TranslatableField
              label="Meta Description"
              value={selectedSeo.metaDescription}
              onChange={(val) => setSelectedSeo({ ...selectedSeo, metaDescription: val })}
            />

            <TranslatableField
              label="Meta Keywords"
              value={selectedSeo.metaKeywords}
              onChange={(val) => setSelectedSeo({ ...selectedSeo, metaKeywords: val })}
            />

            <TextField
              label="Canonical URL"
              fullWidth
              value={selectedSeo.canonicalUrl || ""}
              onChange={(e) => setSelectedSeo({ ...selectedSeo, canonicalUrl: e.target.value })}
              placeholder="https://example.com/page"
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />

            <TextField
              label="Robots Directives"
              fullWidth
              value={selectedSeo.robots || ""}
              onChange={(e) => setSelectedSeo({ ...selectedSeo, robots: e.target.value })}
              placeholder="index, follow"
              helperText="e.g. 'index, follow' or 'noindex, nofollow'"
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                "& .MuiFormHelperText-root": { fontSize: "0.7rem" },
              }}
            />

            <Divider />

            {/* ── Open Graph ── */}
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.12em", fontSize: "0.7rem" }}>
              Open Graph (Social Sharing)
            </Typography>

            <TranslatableField
              label="OG Title"
              value={selectedSeo.ogTitle}
              onChange={(val) => setSelectedSeo({ ...selectedSeo, ogTitle: val })}
            />

            <TranslatableField
              label="OG Description"
              value={selectedSeo.ogDescription}
              onChange={(val) => setSelectedSeo({ ...selectedSeo, ogDescription: val })}
            />

            <TextField
              label="OG Image URL"
              fullWidth
              value={typeof selectedSeo.ogImage === "string" ? selectedSeo.ogImage : ""}
              onChange={(e) => setSelectedSeo({ ...selectedSeo, ogImage: e.target.value })}
              placeholder="https://example.com/og-image.jpg"
              helperText="Paste an absolute URL to the social sharing image (recommended: 1200×630px)."
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                "& .MuiFormHelperText-root": { fontSize: "0.7rem" },
              }}
            />

            <Divider />

            {/* ── Structured Data ── */}
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.12em", fontSize: "0.7rem" }}>
              Schema Markup (Structured Data)
            </Typography>

            <TextField
              label="Structured Data (JSON-LD)"
              multiline
              rows={6}
              fullWidth
              value={selectedSeo.structuredData || ""}
              onChange={(e) => setSelectedSeo({ ...selectedSeo, structuredData: e.target.value })}
              placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "WebPage"\n}`}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                "& .MuiInputBase-input": { fontFamily: "monospace", fontSize: "0.8rem", lineHeight: 1.6 },
              }}
            />
          </Box>
        </CMSDialog>
      </div>
    </SnackbarProvider>
  );
}
