"use client";

import { useState } from "react";
import { IconButton, Menu, MenuItem, Button } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import AddEditCardSection from "./AddEditCardSection";
import DeleteConfirmModal from "../common/DeleteConfirmModal";

interface ImageCardSectionProps {
  data: any;
  route: string;
  section: string;
  displayFields: string[];
  onUpdate: () => void;
  name: string;
  listKey?: string;
}

const ImageCardSection = ({
  data,
  route,
  section,
  displayFields,
  onUpdate,
  name,
  listKey = "logos",
}: ImageCardSectionProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const items = data?.content?.[listKey] || [];

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((item: any, idx: number) => (
          <div key={item._id || idx}>
            <div className="group bg-white p-6 rounded-xl border border-gray-100 relative aspect-[4/3] flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300">
              <div className="absolute top-1 right-1">
                <IconButton
                  onClick={(e) => handleMenuOpen(e, item)}
                  size="small"
                  sx={{ opacity: 0.3, "&:hover": { opacity: 1 } }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </div>

              {(() => {
                const imgSrc = typeof item.image === 'string' ? item.image : (item.image?.url || item.image?.en || item.src || "");
                return imgSrc ? (
                  <img src={imgSrc} alt="" className="max-w-full max-h-[70%] object-contain mb-2" />
                ) : (
                  <div className="text-gray-200 uppercase font-black tracking-widest text-[10px]">No Image</div>
                );
              })()}

              {/* Show Alt text or Title */}
              {(() => {
                const getStr = (val: any) => typeof val === 'string' ? val : val?.en || "";
                const text = getStr(item.imageAlt) || getStr(item.title) || getStr(item.name);
                return text ? (
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">{text}</p>
                ) : null;
              })()}
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="col-span-full">
            <div className="w-full py-10 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
              <p className="text-gray-400 font-black tracking-widest uppercase text-xs">
                No {name} items added yet
              </p>
            </div>
          </div>
        )}
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        slotProps={{ paper: { sx: { borderRadius: "12px", minWidth: 120 } } }}
      >
        <MenuItem onClick={handleEdit} sx={{ gap: 1.5, py: 1.5, px: 3, fontWeight: 700 }}>
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

export default ImageCardSection;
