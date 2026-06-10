"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { Button } from "@mui/material";
import { Plus } from "lucide-react";
import DeleteConfirmModal from "@/components/admin/common/DeleteConfirmModal";

export default function CaseStudyListPage() {
  const router = useRouter();
  const [caseStudies, setCaseStudies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCaseStudies = async () => {
    try {
      const res = await fetch("/api/case-studies");
      const result = await res.json();
      if (result.status) setCaseStudies(result.data);
    } catch (error) {
      enqueueSnackbar("Error fetching case studies", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseStudies();
  }, []);
  useEffect(() => {
    console.log("CASE STUDIES:", caseStudies);
  }, [caseStudies]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/case-studies?id=${deleteId}`, { method: "DELETE" });
      const result = await res.json();
      if (result.status) {
        enqueueSnackbar("Case Study deleted successfully", { variant: "success" });
        setCaseStudies(caseStudies.filter(s => s._id !== deleteId));
      } else {
        enqueueSnackbar("Failed to delete case study", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Error deleting case study", { variant: "error" });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#091d37] uppercase tracking-tighter">Case Studies</h1>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Manage your case study list</p>
          </div>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => router.push("/admin/case-studies/manage")}
            sx={{ bgcolor: '#00C4B4', borderRadius: '12px', px: 4, py: 1.5, fontWeight: 800, '&:hover': { bgcolor: '#00A396' } }}
          >
            New Case Study
          </Button>
        </div>

        {/* CHANGED: Replaced CommonTable with Card Grid View */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-slate-400 font-semibold">Loading case studies...</p>
          </div>
        ) : caseStudies.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <p className="text-slate-500 font-semibold">
              No case studies found. Click "New Case Study" to add one.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {caseStudies.map((study) => (
              <div
                key={study._id}
                className="
          bg-white
          rounded-3xl
          border
          border-slate-200
          overflow-hidden
          shadow-sm
          hover:shadow-xl
          hover:-translate-y-1
          transition-all
          duration-300
          flex
          flex-col
        "
              >
                {/* CHANGED: Optional Hero Image */}
                {study.image?.url && (
                  <img
                    src={study.image.url}
                    alt={study.title?.en || "Case Study"}
                    className="w-full h-56 object-cover"
                  />
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* CHANGED: Tag Badge */}
                  <span className="inline-flex w-fit px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider mb-4">
                    {study.tag?.en || "No Tag"}
                  </span>

                  {/* CHANGED: Title */}
                  <h2 className="text-xl font-black text-[#091d37] mb-3">
                    {study.title?.en || "No Title"}
                  </h2>

                  {/* CHANGED: Description */}
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-1">
                    {study.description?.en || "No description available"}
                  </p>

                  {/* CHANGED: Slug Display */}
                  <code className="mt-4 inline-block bg-cyan-50 text-cyan-700 text-xs px-3 py-1 rounded-lg">
                    {study.slug}
                  </code>

                  {/* CHANGED: Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() =>
                        router.push(`/admin/case-studies/manage/${study._id}`)
                      }
                      sx={{
                        bgcolor: "#00C4B4",
                        fontWeight: 700,
                        borderRadius: "12px",
                        "&:hover": {
                          bgcolor: "#00A396",
                        },
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      onClick={() => setDeleteId(study._id)}
                      sx={{
                        borderRadius: "12px",
                        fontWeight: 700,
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <DeleteConfirmModal
          open={!!deleteId}
          loading={deleting}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Delete Case Study"
          message="Are you sure you want to delete this case study? This action will remove all its content and cannot be undone."
        />
      </div>
    </SnackbarProvider>
  );
}
