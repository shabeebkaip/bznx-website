"use client";

import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Mail, Phone, Clock, User, MessageCircle } from "lucide-react";

interface ViewEnquiryModalProps {
  open: boolean;
  onClose: () => void;
  data: any;
}

export default function ViewEnquiryModal({ open, onClose, data }: ViewEnquiryModalProps) {
  if (!data) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: "1.5rem" } } }}
    >
      <DialogTitle sx={{ p: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "1rem", color: "#1e293b" }}
        >
          Enquiry Details
        </Typography>
        <IconButton onClick={onClose} sx={{ bgcolor: "#f8fafc" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 0 }}>
        {/* ── Name / contact header ── */}
        <div className="bg-slate-50/50 p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <User size={16} className="text-slate-400" />
            <h3 className="font-black text-lg text-slate-800">{data.name}</h3>
          </div>
          <div className="flex items-center flex-wrap gap-4 text-sm text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Mail size={14} className="text-slate-300" /> {data.email}
            </span>
            {data.phone && (
              <span className="flex items-center gap-1.5">
                <Phone size={14} className="text-slate-300" /> {data.phone}
              </span>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* ── Service ── */}
          {data.service && (
            <div>
              <Typography
                variant="caption"
                sx={{ fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", mb: 1, display: "block" }}
              >
                Service
              </Typography>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider"
                style={{ background: "rgba(13,148,136,0.06)", color: "#0d9488", border: "1px solid rgba(13,148,136,0.2)" }}
              >
                <MessageCircle size={11} />
                {data.service}
              </span>
            </div>
          )}

          {/* ── Message ── */}
          <div>
            <Typography
              variant="caption"
              sx={{ fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", mb: 1, display: "block" }}
            >
              Message
            </Typography>
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {data.message}
            </div>
          </div>

          {/* ── Submitted date ── */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 pt-4 mt-4 border-t border-slate-100">
            <Clock size={14} />
            Submitted on{" "}
            {new Date(data.createdAt).toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
