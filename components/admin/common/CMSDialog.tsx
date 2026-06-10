"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Divider, Box, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface CMSDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  saving?: boolean;
  children: React.ReactNode;
}

export default function CMSDialog({ open, onClose, onSave, title, saving, children }: CMSDialogProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth 
      slotProps={{ paper: { sx: { borderRadius: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' } } }}
    >
      <DialogTitle sx={{ p: 5, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="text-2xl font-black text-[#1a1a1a]">{title}</span>
        <IconButton onClick={onClose} sx={{ bgcolor: '#f9fafb' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ mx: 5, opacity: 0.5 }} />
      <DialogContent sx={{ p: 5 }}>
        <Box sx={{ mt: 1 }}>
          {children}
        </Box>
      </DialogContent>
      <Divider sx={{ mx: 5, opacity: 0.5 }} />
      <DialogActions sx={{ p: 5, pt: 3, gap: 2 }}>
        <Button 
          onClick={onClose} 
          sx={{ fontWeight: 700, color: "gray", textTransform: "none", px: 4 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onSave} 
          variant="contained" 
          disabled={saving}
          sx={{ 
            borderRadius: "14px", 
            px: 6, 
            py: 1.5, 
            fontWeight: 800, 
            bgcolor: "black",
            textTransform: "none",
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            "&:hover": { bgcolor: "#333", boxShadow: "none" }
          }}
        >
          {saving ? <CircularProgress size={20} color="inherit" /> : "SAVE CHANGES"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
