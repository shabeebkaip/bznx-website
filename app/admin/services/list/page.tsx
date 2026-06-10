"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CommonTable, { Column } from "@/components/admin/common/CommonTable";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { Button } from "@mui/material";
import { Plus } from "lucide-react";
import DeleteConfirmModal from "@/components/admin/common/DeleteConfirmModal";

export default function ServiceListPage() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const result = await res.json();
      if (result.status) setServices(result.data);
    } catch (error) {
      enqueueSnackbar("Error fetching services", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/services?id=${deleteId}`, { method: "DELETE" });
      const result = await res.json();
      if (result.status) {
        enqueueSnackbar("Service deleted successfully", { variant: "success" });
        setServices(services.filter(s => s._id !== deleteId));
      } else {
        enqueueSnackbar("Failed to delete service", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Error deleting service", { variant: "error" });
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns: Column[] = [
    { 
      key: "title", 
      label: "Service Info", 
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#091d37]">{row.title?.en || "No Title"}</span>
          <span className="text-xs text-slate-400 line-clamp-1">{row.description?.en?.replace(/<[^>]*>?/gm, '') || "No description"}</span>
        </div>
      )
    },
    { 
      key: "tag", 
      label: "Tag",
      render: (row) => (
        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-wider">
          {row.tag?.en}
        </span>
      )
    },
    { 
      key: "slug", 
      label: "Slug",
      render: (row) => <code className="text-xs text-cyan-600 bg-cyan-50 px-2 py-1 rounded">{row.slug}</code>
    }
  ];

  return (
    <SnackbarProvider maxSnack={3}>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#091d37] uppercase tracking-tighter">Services</h1>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Manage your service list</p>
          </div>
          <Button 
            variant="contained" 
            startIcon={<Plus size={18} />}
            onClick={() => router.push("/admin/services/manage")}
            sx={{ bgcolor: '#00C4B4', borderRadius: '12px', px: 4, py: 1.5, fontWeight: 800, '&:hover': { bgcolor: '#00A396' } }}
          >
            New Service
          </Button>
        </div>

        <CommonTable 
          columns={columns} 
          data={services} 
          loading={loading}
          onEdit={(row) => router.push(`/admin/services/manage/${row._id}`)}
          onDelete={(row) => setDeleteId(row._id)}
          emptyMessage="No services found. Click 'New Service' to add one."
        />

        <DeleteConfirmModal 
          open={!!deleteId}
          loading={deleting}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Delete Service"
          message="Are you sure you want to delete this service? This action will remove all its content and cannot be undone."
        />
      </div>
    </SnackbarProvider>
  );
}
