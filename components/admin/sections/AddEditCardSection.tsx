"use client";

import { useState, useEffect } from 'react';
import { Box, TextField, MenuItem, FormControl, Select, Button, IconButton } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import CMSDialog from '../common/CMSDialog';
import TranslatableField from '../common/TranslatableField';
import ImageUploadField from '../common/ImageUploadField';
import { useSnackbar } from 'notistack';
import { sanitizeContent } from '@/lib/admin/utils';

type DisplayFieldType = "text" | "file" | "quill" | "tags" | "category-select" | "number" | "simple-text";

interface FieldConfig {
    key: string;
    label: string;
    type: DisplayFieldType;
}

interface AddEditCardSectionProps {
    open: boolean;
    onClose: () => void;
    onUpdate: () => void;
    data: any;        // The individual item being edited (or null for new)
    sectionData: any; // The full section document { section, content }
    section: string;
    route: string;
    listKey: string;
    displayFields: (string | FieldConfig)[];
    name: string;
}

const processDisplayFields = (displayFields: (string | FieldConfig)[]): FieldConfig[] => {
    return displayFields.map((field) => {
        if (typeof field === "object") return field as FieldConfig;

        let type: DisplayFieldType = "text";
        if (["tags", "items", "features", "list"].some(f => field.toLowerCase().includes(f))) type = "tags";
        if (["category"].includes(field)) type = "category-select";
        if (["image", "iconImage", "Icon", "logo", "icon", "image"].some(f => field.toLowerCase().includes(f))) type = "file";
        if (field.toLowerCase().includes("alt") || field.toLowerCase().includes("link") || field.toLowerCase().includes("url") || field.toLowerCase().includes("href") || field.toLowerCase().includes("phone") || field.toLowerCase().includes("email") || field.toLowerCase().includes("color") || field.toLowerCase().includes("value") || field.toLowerCase().includes("prefix") || field.toLowerCase().includes("suffix")) type = "simple-text";
        if (["description", "content", "text", "point", "insight", "quote"].some(f => field.toLowerCase().includes(f))) type = "quill";
        if (["number", "count", "rating"].some(f => field.toLowerCase().includes(f))) type = "number";

        return {
            key: field,
            label: field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z0-9])/g, ' $1'),
            type,
        };
    });
};

export default function AddEditCardSection({
    open,
    onClose,
    onUpdate,
    data,
    sectionData,
    section,
    route,
    listKey,
    displayFields,
    name,
}: AddEditCardSectionProps) {
    const { enqueueSnackbar } = useSnackbar();
    const [formData, setFormData] = useState<any>(data || {});
    const [saving, setSaving] = useState(false);
    const [fields, setFields] = useState<FieldConfig[]>([]);

    useEffect(() => {
        setFormData(data || {});
        setFields(processDisplayFields(displayFields));
    }, [data, open, displayFields]);

    const onFieldChange = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const existingContent = sectionData?.content || {};
            const existingItems: any[] = Array.isArray(existingContent[listKey])
                ? existingContent[listKey]
                : Array.isArray(existingContent)
                ? existingContent
                : [];

            let updatedItems: any[];

            if (data?._id) {
                updatedItems = existingItems.map((item: any) =>
                    item._id === data._id ? { ...item, ...formData } : item
                );
            } else {
                const newItem = { _id: `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`, ...formData };
                updatedItems = [...existingItems, newItem];
            }

            const isTopLevelArray = Array.isArray(existingContent);
            const mergedContent = isTopLevelArray
                ? updatedItems
                : { ...existingContent, [listKey]: updatedItems };

            const sanitizedItems = sanitizeContent(mergedContent);

            const res = await fetch(route, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ section, content: sanitizedItems }),
            });
            const result = await res.json();
            if (result.status) {
                enqueueSnackbar("Saved successfully", { variant: "success" });
                onUpdate();
                onClose();
            } else {
                enqueueSnackbar(result.error || "Save failed", { variant: "error" });
            }
        } catch (error) {
            enqueueSnackbar("Error saving", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <CMSDialog
            open={open}
            onClose={onClose}
            onSave={handleSave}
            title={`${data?._id ? 'Edit' : 'Add'} ${name} Item`}
            saving={saving}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{field.label}</h3>
                        
                        {field.type === "category-select" && (
                            <FormControl fullWidth margin="dense">
                                <Select
                                    value={formData[field.key]?.en || ""}
                                    onChange={(e) => onFieldChange(field.key, { en: e.target.value })}
                                    displayEmpty
                                    sx={{ borderRadius: "12px" }}
                                >
                                    <MenuItem value="" disabled>Select Category</MenuItem>
                                    <MenuItem value="Core Services">Core Services</MenuItem>
                                    <MenuItem value="Support & Growth">Support & Growth</MenuItem>
                                    <MenuItem value="Apps & Licensing">Apps & Licensing</MenuItem>
                                    <MenuItem value="Why Us">Why Us</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        {field.type === "file" && (
                            <ImageUploadField
                                label={field.label}
                                value={formData[field.key]}
                                onChange={(val) => onFieldChange(field.key, val)}
                            />
                        )}

                        {field.type === "number" && (
                            <TextField
                                type="number"
                                fullWidth
                                value={formData[field.key] || ""}
                                onChange={(e) => onFieldChange(field.key, e.target.value)}
                                variant="outlined"
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                            />
                        )}

                        {field.type === "simple-text" && (
                            <TextField
                                fullWidth
                                placeholder={`Enter ${field.label}`}
                                value={typeof formData[field.key] === 'string' ? formData[field.key] : (formData[field.key]?.en || "")}
                                onChange={(e) => onFieldChange(field.key, e.target.value)}
                                variant="outlined"
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: '#fff' } }}
                            />
                        )}

                        {field.type === "tags" && (
                            <div className="space-y-3">
                                {(formData[field.key] || [{ en: "", ar: "" }]).map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2 group">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-[#f8fafc] rounded-xl border border-slate-200">
                                            <TextField 
                                                fullWidth
                                                size="small"
                                                placeholder="English"
                                                value={typeof item === 'string' ? item : (item.en || "")}
                                                onChange={(e) => {
                                                    const newList = [...(formData[field.key] || [])];
                                                    if (typeof item === 'string') {
                                                        newList[idx] = e.target.value;
                                                    } else {
                                                        newList[idx] = { ...item, en: e.target.value };
                                                    }
                                                    onFieldChange(field.key, newList);
                                                }}
                                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", bgcolor: '#fff' } }}
                                            />
                                            <TextField 
                                                fullWidth
                                                size="small"
                                                placeholder="Arabic (العربية)"
                                                value={typeof item === 'string' ? "" : (item.ar || "")}
                                                dir="rtl"
                                                onChange={(e) => {
                                                    const newList = [...(formData[field.key] || [])];
                                                    if (typeof item === 'string') {
                                                        newList[idx] = { en: item, ar: e.target.value };
                                                    } else {
                                                        newList[idx] = { ...item, ar: e.target.value };
                                                    }
                                                    onFieldChange(field.key, newList);
                                                }}
                                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", bgcolor: '#fff' } }}
                                            />
                                        </div>
                                        <IconButton 
                                            color="error" 
                                            onClick={() => {
                                                const newList = (formData[field.key] || []).filter((_: any, i: number) => i !== idx);
                                                onFieldChange(field.key, newList);
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
                                    size="small"
                                    sx={{ mt: 1, borderRadius: "8px", textTransform: "none", fontWeight: 700 }}
                                    onClick={() => {
                                        const current = formData[field.key] || [];
                                        const isObjectMode = current.length > 0 && typeof current[0] === 'object';
                                        const newItem = isObjectMode ? { en: "", ar: "" } : "";
                                        onFieldChange(field.key, [...current, newItem]);
                                    }}
                                >
                                    + Add {field.label}
                                </Button>
                            </div>
                        )}

                        {(field.type === "text" || field.type === "quill") && (
                            <TranslatableField
                                label={field.label}
                                type={field.type}
                                value={formData[field.key]}
                                onChange={(val) => onFieldChange(field.key, val)}
                            />
                        )}
                    </div>
                ))}
            </Box>
        </CMSDialog>
    );
}
