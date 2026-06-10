"use client";

import { useState } from "react";
import { Box, Button, CircularProgress, Typography, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";

interface ImageObject {
  url: string;
  public_id?: string;
  resource_type?: string;
}

interface ImageUploadFieldProps {
  label: string;
  value: string | ImageObject;
  onChange: (data: ImageObject | string) => void;
}

export default function ImageUploadField({ label, value, onChange }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);

  // Helper to get URL from value which might be string or object
  const imageUrl = typeof value === 'string' ? value : value?.url || "";
  const publicId = typeof value === 'string' ? "" : value?.public_id || "";
  const resourceType = typeof value === 'string' ? "image" : value?.resource_type || "image";

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    if (publicId) formData.append("public_id", publicId);
    if (resourceType) formData.append("resource_type", resourceType);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.status) {
        onChange({
            url: result.fileUrl,
            public_id: result.public_id,
            resource_type: result.resource_type
        });
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (publicId) {
        try {
            await fetch("/api/upload", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ public_id: publicId, resource_type: resourceType }),
            });
        } catch (e) {
            console.error("Delete failed", e);
        }
    }
    onChange("");
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="caption" sx={{ fontWeight: 800, color: 'gray.400', textTransform: 'uppercase', mb: 2, display: 'block' }}>
        {label}
      </Typography>
      <div className="relative w-full h-48 rounded-[2rem] border-2 border-dashed border-gray-200 bg-[#fcfcfc] group flex items-center justify-center overflow-hidden transition-all hover:border-black">
        {imageUrl ? (
          <>
            <Image src={imageUrl} alt={label} fill className="object-contain p-6" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
               <Button 
                 variant="contained" 
                 component="label" 
                 sx={{ bgcolor: 'white', color: 'black', borderRadius: '12px', fontWeight: 700, px: 3, "&:hover": { bgcolor: '#f3f4f6' } }}
               >
                 Replace
                 <input type="file" hidden accept="image/*" onChange={handleUpload} />
               </Button>
               <IconButton 
                 onClick={handleDelete} 
                 sx={{ bgcolor: '#fee2e2', color: '#ef4444', borderRadius: '12px', "&:hover": { bgcolor: '#fecaca' } }}
               >
                 <DeleteIcon />
               </IconButton>
            </div>
          </>
        ) : (
          <Button 
            component="label" 
            disabled={uploading}
            sx={{ flexDirection: 'column', gap: 2, color: 'gray.400', textTransform: 'none', width: '100%', height: '100%' }}
          >
            {uploading ? (
              <CircularProgress size={32} sx={{ color: 'black' }} />
            ) : (
              <>
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-1">
                   <CloudUploadIcon sx={{ fontSize: 32, color: 'gray.300' }} />
                </div>
                <div className="text-center">
                  <Typography variant="body2" sx={{ fontWeight: 800, color: 'gray.800' }}>
                    Drag & drop image here, or click to select
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'gray.400' }}>
                    Max size: 10MB
                  </Typography>
                </div>
              </>
            )}
            <input type="file" hidden accept="image/*" onChange={handleUpload} />
          </Button>
        )}
      </div>
    </Box>
  );
}
