"use client";

import { 
  Dialog, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box, 
  IconButton 
} from "@mui/material";
import { X } from "lucide-react";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  loading = false,
}: DeleteConfirmModalProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            padding: "4px",
            maxWidth: "360px"
          }
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary',
            '&:hover': { bgcolor: '#f1f5f9' }
          }}
        >
          <X size={18} />
        </IconButton>

        <DialogContent sx={{ pt: 4, pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: '#0f172a' }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.5 }}>
            {message}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button 
            fullWidth
            onClick={onClose}
            variant="text"
            sx={{ 
              color: '#64748b', 
              borderRadius: '12px',
              py: 1,
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': { bgcolor: '#f8fafc' }
            }}
          >
            Cancel
          </Button>
          <Button 
            fullWidth
            onClick={onConfirm}
            disabled={loading}
            variant="contained"
            disableElevation
            sx={{ 
              bgcolor: '#000', 
              color: 'white', 
              borderRadius: '12px',
              py: 1,
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': { bgcolor: '#222' },
              '&.Mui-disabled': { bgcolor: '#ccc', color: 'white' }
            }}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
