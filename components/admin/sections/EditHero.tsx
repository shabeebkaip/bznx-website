"use client";

import { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box, 
  IconButton, 
  Divider,
  Typography,
  TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';
import TranslatableField from '../common/TranslatableField';
import ImageUploadField from '../common/ImageUploadField';
import { sanitizeContent } from '@/lib/admin/utils';

type FieldType = "text" | "file" | "quill" | "tags" | "card" | "link";

interface ProcessedField {
    key: string;
    label: string;
    type: FieldType;
}

interface EditHeroProps {
    data: any;
    section: string;
    route: string;
    displayFields: string[];
    onUpdate: () => void;
    name: string;
}

const processFields = (fields: string[]): ProcessedField[] => {
    return fields.map((field) => {
        let type: FieldType = "text";
        if (["tags", "points", "items", "features"].some(f => field.toLowerCase().includes(f))) type = "tags";
        if (field.toLowerCase().includes("card")) type = "card";
        if (field.toLowerCase().includes("link") || field.toLowerCase().includes("url") || field.toLowerCase().includes("href") || field.toLowerCase().includes("phone") || field.toLowerCase().includes("email")) type = "link";
        if (["image", "icon", "logo"].some(f => field.toLowerCase().includes(f))) type = "file";
        if (field === "title" || ["description", "content"].some(f => field.toLowerCase().includes(f))) type = "quill";
        return {
            key: field,
            label: field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z0-9])/g, ' $1'),
            type,
        };
    });
};

const EditHero = ({ data, section, route, displayFields, onUpdate, name }: EditHeroProps) => {
    const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<any>(data?.content || {});
    const [fields, setFields] = useState<ProcessedField[]>([]);

    useEffect(() => {
        if (data?.content) {
            setFormData(data.content);
        }
    }, [data, open]);

    useEffect(() => {
        setFields(processFields(displayFields));
    }, [displayFields]);

    const handleSave = async () => {
        try {
            const sanitizedContent = sanitizeContent(formData);
            const res = await fetch(route, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ section, content: sanitizedContent }),
            });
            const result = await res.json();
            if (result.status) {
                enqueueSnackbar("Updated successfully", { variant: "success" });
                setOpen(false);
                onUpdate();
            }
        } catch (error) {
            enqueueSnackbar("Error saving data", { variant: "error" });
        }
    };

    return (
        <>
            <Button 
                variant="contained" 
                onClick={() => setOpen(true)}
                sx={{ bgcolor: 'black', borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 4 }}
            >
                Edit
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="md"
                fullWidth
                slotProps={{ paper: { sx: { borderRadius: "2rem" } } }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', p: 4, fontWeight: 900 }}>
                    {name} Section
                    <IconButton onClick={() => setOpen(false)} sx={{ bgcolor: '#f9fafb' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ p: 4 }}>
                    <Box sx={{ mt: 1 }}>
                        {fields.map((field) => (
                            <div key={field.key}>
                                {field.type === "file" ? (
                                    <ImageUploadField 
                                        label={field.label} 
                                        value={formData[field.key]} 
                                        onChange={(val) => setFormData({ ...formData, [field.key]: val })} 
                                    />
                                ) : field.type === "tags" ? (
                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 900, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 2, display: 'block' }}>
                                            {field.label}
                                        </Typography>
                                        
                                        <div className="space-y-3">
                                            {(Array.isArray(formData[field.key]) ? formData[field.key] : []).map((item: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-3 group">
                                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-[#f8fafc] rounded-xl border border-slate-200">
                                                        <TextField 
                                                            fullWidth
                                                            size="small"
                                                            placeholder="English"
                                                            value={item.en || ""}
                                                            onChange={(e) => {
                                                                const newList = [...(formData[field.key] || [])];
                                                                newList[idx] = { ...item, en: e.target.value };
                                                                setFormData({ ...formData, [field.key]: newList });
                                                            }}
                                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", bgcolor: '#fff' } }}
                                                        />
                                                        <TextField 
                                                            fullWidth
                                                            size="small"
                                                            placeholder="Arabic (العربية)"
                                                            value={item.ar || ""}
                                                            dir="rtl"
                                                            onChange={(e) => {
                                                                const newList = [...(formData[field.key] || [])];
                                                                newList[idx] = { ...item, ar: e.target.value };
                                                                setFormData({ ...formData, [field.key]: newList });
                                                            }}
                                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", bgcolor: '#fff' } }}
                                                        />
                                                    </div>
                                                    <IconButton 
                                                        color="error" 
                                                        onClick={() => {
                                                            const newList = formData[field.key].filter((_: any, i: number) => i !== idx);
                                                            setFormData({ ...formData, [field.key]: newList });
                                                        }}
                                                        sx={{ 
                                                            border: '1px solid #fee2e2',
                                                            bgcolor: '#fff',
                                                            "&:hover": { bgcolor: '#fef2f2' }
                                                        }}
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </div>
                                            ))}
                                            
                                            <Button 
                                                variant="outlined"
                                                onClick={() => {
                                                    const currentList = Array.isArray(formData[field.key]) ? formData[field.key] : [];
                                                    const newList = [...currentList, { en: "", ar: "" }];
                                                    setFormData({ ...formData, [field.key]: newList });
                                                }}
                                                sx={{ 
                                                    mt: 1,
                                                    borderRadius: '8px', 
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    borderColor: '#6366f1',
                                                    color: '#6366f1',
                                                    "&:hover": { borderColor: '#4f46e5', bgcolor: '#f5f3ff' }
                                                }}
                                            >
                                                + Add {field.label}
                                            </Button>
                                        </div>
                                    </Box>
                                ) : field.type === "card" ? (
                                    <Box sx={{ mb: 4, p: 3, bgcolor: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                        <Typography variant="caption" sx={{ fontWeight: 900, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 2, display: 'block' }}>
                                            {field.label}
                                        </Typography>
                                        <div className="space-y-4">
                                            <TranslatableField 
                                                label="Card Title"
                                                value={formData[field.key]?.title}
                                                onChange={(val) => setFormData({ 
                                                    ...formData, 
                                                    [field.key]: { ...(formData[field.key] || {}), title: val } 
                                                })}
                                            />
                                            <TranslatableField 
                                                label="Card Subtitle"
                                                value={formData[field.key]?.subTitle}
                                                onChange={(val) => setFormData({ 
                                                    ...formData, 
                                                    [field.key]: { ...(formData[field.key] || {}), subTitle: val } 
                                                })}
                                            />
                                        </div>
                                    </Box>
                                ) : field.type === "link" ? (
                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 900, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1, display: 'block' }}>
                                            {field.label}
                                        </Typography>
                                        <TextField 
                                            fullWidth
                                            size="small"
                                            placeholder={`Enter ${field.label}`}
                                            value={typeof formData[field.key] === 'string' ? formData[field.key] : (formData[field.key]?.en || "")}
                                            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: '#fff' } }}
                                        />
                                    </Box>
                                ) : (
                                    <TranslatableField 
                                        label={field.label} 
                                        type={field.type as any}
                                        value={formData[field.key]} 
                                        onChange={(val) => setFormData({ ...formData, [field.key]: val })} 
                                    />
                                )}
                            </div>
                        ))}
                    </Box>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ p: 4, gap: 2 }}>
                    <Button onClick={() => setOpen(false)} sx={{ fontWeight: 700, color: "gray" }}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleSave}
                        sx={{ bgcolor: 'black', borderRadius: '12px', px: 6, py: 1.5, fontWeight: 800 }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EditHero;
