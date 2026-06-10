"use client";

import { useState } from "react";
import { IconButton, Menu, MenuItem, Button } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import { unescapeHTML } from "@/lib/utils";
import AddEditCardSection from "./AddEditCardSection";
import DeleteConfirmModal from "../common/DeleteConfirmModal";

// Import icons for the field renderers
import {
  Calendar,
  Utensils,
  Truck,
  UserCheck,
  Gift,
  BarChart3,
  Building,
  Heart,
  Stethoscope,
  Dumbbell
} from 'lucide-react';

interface CardSectionProps {
  data: any;          // Full section document { section, content }
  route: string;
  section: string;
  displayFields: (string | any)[];
  onUpdate: () => void;
  name: string;
  listKey?: string;
}

const CardSection = ({
  data,
  route,
  section,
  displayFields,
  onUpdate,
  name,
  listKey = "items",
}: CardSectionProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const content = data?.content || {};

  // Support both top-level arrays and nested arrays under listKey
  const items: any[] = Array.isArray(content)
    ? content
    : Array.isArray(content[listKey])
      ? content[listKey]
      : [];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
    setIsAddEditOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    if (!selectedItem?._id) return;
    setIsDeleting(true);

    try {
      const res = await fetch(
        `${route}?section=${section}&id=${selectedItem._id}&listKey=${listKey}`,
        { method: "DELETE" }
      );
      const result = await res.json();
      if (result.status) {
        enqueueSnackbar("Deleted successfully", { variant: "success" });
        onUpdate();
      } else {
        enqueueSnackbar(result.message || "Delete failed", { variant: "error" });
      }
    } catch {
      enqueueSnackbar("Error deleting", { variant: "error" });
    } finally {
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
    }
  };

  const iconMap: Record<string, React.ReactNode> = {
    calendar: <Calendar className="w-10 h-10 text-white" />,
    utensils: <Utensils className="w-10 h-10 text-white" />,
    truck: <Truck className="w-10 h-10 text-white" />,
    userCheck: <UserCheck className="w-10 h-10 text-white" />,
    gift: <Gift className="w-10 h-10 text-white" />,
    chart: <BarChart3 className="w-10 h-10 text-white" />,
    building: <Building className="w-10 h-10 text-white" />,
    heart: <Heart className="w-10 h-10 text-white" />,
    stethoscope: <Stethoscope className="w-10 h-10 text-white" />,
    dumbbell: <Dumbbell className="w-10 h-10 text-white" />,
  };


  const renderField = (item: any, field: string) => {
    const value = item[field];
    if (value === undefined || value === null) return null;

    // Handle i18n objects or Cloudinary image objects
    const displayValue = (typeof value === 'object' && value !== null && !Array.isArray(value)) 
      ? (value.en !== undefined ? value.en : (value.url || JSON.stringify(value))) 
      : value;

    if (field === "image" || field === "logo" || field === "iconImage") {
      return (
        <div className="flex justify-center w-full mb-4">
          <img src={displayValue} alt="" className="h-16 w-16 object-contain rounded-lg" />
        </div>
      );
    }

    if (field === "icon") {
      return (
        <div className="flex items-center justify-center w-full mb-4">
          {iconMap[displayValue] || (
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xs">
              {displayValue}
            </div>
          )}
        </div>
      );
    }

    if (field === "title" || field === "label") {
      return <p className="text-white text-xl font-black text-center mb-2 leading-tight" dangerouslySetInnerHTML={{ __html: unescapeHTML(displayValue) }} />;
    }

    if (field === "description" || field === "text" || field === "content") {
      return (
        <div
          className="text-white/70 text-sm text-center line-clamp-3 prose prose-invert prose-sm"
          dangerouslySetInnerHTML={{ __html: unescapeHTML(displayValue) }}
        />
      );
    }

    if (field === "value" || field === "number" || field === "end") {
      const suffix = item.suffix || "";
      return <p className="text-white text-3xl font-black text-center">{displayValue}{suffix}</p>;
    }

    if (Array.isArray(value)) {
      return (
        <div className="mt-4 space-y-1">
          {value.map((v, i) => {
            const dv = (typeof v === 'object' && v !== null) ? (v.en || v.ar || JSON.stringify(v)) : v;
            return <p key={i} className="text-white/50 text-[10px] text-center italic truncate">• {dv}</p>;
          })}
        </div>
      );
    }

    return (
      <p className="text-white/50 text-xs font-bold uppercase tracking-widest text-center mt-2" dangerouslySetInnerHTML={{ __html: unescapeHTML(displayValue) }} />
    );
  };

  return (
    <div className="bg-white border-b border-slate-50 p-10 mb-8 rounded-xl">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-2xl font-black text-[#091d37] uppercase tracking-tighter">
          {name}
        </h3>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedItem(null);
            setIsAddEditOpen(true);
          }}
          sx={{
            bgcolor: "#091d37",
            color: "white",
            borderRadius: "12px",
            px: 4,
            py: 1.2,
            fontWeight: 800,
            fontSize: "12px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            "&:hover": { bgcolor: "#00C4B4" },
          }}
        >
          Add
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        {items.map((item: any, idx: number) => (
          <div key={item._id || idx}>
            <div className="group bg-[#2B3674] p-8 rounded-2xl relative pt-12 shadow-xl hover:scale-[1.02] transition-all duration-300 min-h-[250px] flex flex-col justify-center">
              {item.category?.en && (
                <div className="absolute top-4 left-4">
                  <span className="px-2 py-1 bg-white/10 backdrop-blur-md rounded text-[10px] uppercase font-black text-white/80 tracking-widest">
                    {item.category.en}
                  </span>
                </div>
              )}

              <div className="absolute top-2 right-2">
                <IconButton
                  onClick={(e) => handleMenuOpen(e, item)}
                  sx={{ color: "white", opacity: 0.5, "&:hover": { opacity: 1, bgcolor: "white/10" } }}
                >
                  <MoreVertIcon />
                </IconButton>
              </div>

              <div className="space-y-1">
                {displayFields.map((field, fIdx) => {
                  const key = typeof field === 'string' ? field : field.key;
                  return (
                    <div key={fIdx}>
                      {renderField(item, key)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-full">
            <div className="w-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
              <p className="text-gray-400 font-black tracking-widest uppercase text-xs mb-4">
                No {name} items added yet
              </p>
              <Button
                startIcon={<AddIcon />}
                onClick={() => setIsAddEditOpen(true)}
                sx={{ color: "gray", fontWeight: 700 }}
              >
                Click to add first item
              </Button>
            </div>
          </div>
        )}
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              mt: 1,
              minWidth: 150
            }
          }
        }}
      >
        <MenuItem onClick={handleEdit} sx={{ gap: 1.5, py: 1.5, px: 3, fontWeight: 700, color: "#2B3674" }}>
          <EditIcon fontSize="small" /> Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ gap: 1.5, py: 1.5, px: 3, fontWeight: 700, color: "#ef4444" }}>
          <DeleteIcon fontSize="small" /> Delete
        </MenuItem>
      </Menu>

      <AddEditCardSection
        open={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        onUpdate={onUpdate}
        data={selectedItem}
        sectionData={data}
        section={section}
        route={route}
        listKey={listKey}
        displayFields={displayFields}
        name={name}
      />
      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        loading={isDeleting}
      />
    </div>
  );
};

export default CardSection;
