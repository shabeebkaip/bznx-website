"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Eye,
  Building2,
  InboxIcon,
} from "lucide-react";
import { SnackbarProvider, useSnackbar } from "notistack";
import DeleteConfirmModal from "@/components/admin/common/DeleteConfirmModal";
import ViewEnquiryModal from "@/components/admin/sections/ViewEnquiryModal";

export default function EnquiriesPage() {
  return (
    <SnackbarProvider maxSnack={3}>
      <EnquiriesList />
    </SnackbarProvider>
  );
}

function EnquiriesList() {
  const [enquiries, setEnquiries]         = useState<any[]>([]);
  const [loading, setLoading]             = useState(true);
  const [isDeleting, setIsDeleting]       = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen]     = useState(false);
  const [selectedId, setSelectedId]       = useState<string | null>(null);
  const [viewingEnquiry, setViewingEnquiry] = useState<any>(null);
  const { enqueueSnackbar } = useSnackbar();

  const fetchEnquiries = async () => {
    try {
      const res  = await fetch("/api/enquiry?admin=true");
      const json = await res.json();
      if (json.status) setEnquiries(json.data);
    } catch (err) {
      enqueueSnackbar("Failed to fetch enquiries", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEnquiries(); }, []);

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/enquiry?id=${selectedId}`, { method: "DELETE" });
      if (res.ok) {
        enqueueSnackbar("Deleted successfully", { variant: "success" });
        fetchEnquiries();
      }
    } catch (err) {
      enqueueSnackbar("Error deleting", { variant: "error" });
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setSelectedId(null);
    }
  };

  const handleViewClick = (enquiry: any) => {
    setViewingEnquiry(enquiry);
    setIsViewModalOpen(true);
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-1">Enquiries</h1>
          <p className="text-slate-400 text-sm font-medium">List of all client inquiries from the contact form.</p>
        </div>

        {/* Card list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-400 rounded-full animate-spin" />
            <p className="text-slate-400 font-medium text-sm">Fetching enquiries...</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
              <InboxIcon size={22} />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No enquiries found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {enquiries.map((e) => (
              <div
                key={e._id}
                className="bg-white rounded-2xl transition-all duration-200 group shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]"
                style={{
                  border: "1px solid rgba(148,163,184,0.15)",
                  // boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                }}
              >
                <div className="p-5">
                  {/* Top row: avatar · name · service badge · contact · actions */}
                  <div className="flex items-start gap-3 mb-3">

                    {/* Avatar initial */}
                    <div
                      className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center font-black text-sm"
                      style={{
                        background: "rgba(148,163,184,0.1)",
                        color: "#64748b",
                        border: "1px solid rgba(148,163,184,0.2)",
                      }}
                    >
                      {e.name?.trim().charAt(0)?.toUpperCase() || "?"}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Name + service badge */}
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <span className="text-slate-800 font-black text-[0.9rem] leading-tight">{e.name}</span>
                        {e.service && (
                          <span
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest"
                            style={{
                              background: "rgba(92, 125, 122, 0.06)",
                              color: "#94A3B8",
                              borderColor: "rgba(13,148,136,0.2)",
                            }}
                          >
                            {/* <MessageCircle size={9} /> */}
                            {e.service}
                          </span>
                        )}
                      </div>

                      {/* Contact info */}
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-0.5">
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Mail size={10} className="text-slate-300" />{e.email}
                        </span>
                        {e.phone && (
                          <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <Phone size={10} className="text-slate-300" />{e.phone}
                          </span>
                        )}
                        {e.company && (
                          <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <Building2 size={10} className="text-slate-300" />{e.company}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Clock size={9} />
                          {new Date(e.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons — visible on hover */}
                    <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* View */}
                      <button
                        onClick={() => handleViewClick(e)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest border border-slate-200 text-slate-400 bg-slate-50 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-all"
                        title="View Details"
                      >
                        <Eye size={11} /> View
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteClick(e._id)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-300 border border-transparent hover:text-red-400 hover:border-red-200 hover:bg-red-50 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Message preview */}
                  <div className="ml-12 mt-3 pt-3 border-t border-slate-50">
                    <p className="text-[0.8rem] leading-relaxed line-clamp-2 text-black">
                      {e.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        loading={isDeleting}
        title="Delete Enquiry"
        message="Are you sure you want to delete this client enquiry? This action cannot be undone."
      />

      <ViewEnquiryModal
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        data={viewingEnquiry}
      />
    </div>
  );
}
