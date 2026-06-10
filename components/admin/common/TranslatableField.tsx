"use client";

import { Box, TextField, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { RgbaColorPicker } from "react-colorful";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false }) as any;

type RGBA = { r: number; g: number; b: number; a: number };

function rgbaToString(c: RGBA) {
  return `rgba(${c.r},${c.g},${c.b},${c.a})`;
}

function parseColor(color: string): RGBA {
  if (!color) return { r: 0, g: 0, b: 0, a: 1 };
  const rgba = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgba) return { r: +rgba[1], g: +rgba[2], b: +rgba[3], a: rgba[4] !== undefined ? +rgba[4] : 1 };
  if (color.startsWith("#")) {
    let h = color.slice(1);
    if (h.length === 3) h = h.split("").map(c => c + c).join("");
    const n = parseInt(h, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
}

function toHex(c: RGBA) {
  const toH = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  return `#${toH(c.r)}${toH(c.g)}${toH(c.b)}`;
}

interface PickerPopoverProps {
  color: RGBA;
  position: { top: number; left: number };
  onChange: (c: RGBA) => void;
  onClose: () => void;
}

function PickerPopover({ color, position, onChange, onClose }: PickerPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"hex" | "rgb">("hex");
  const [hexInput, setHexInput] = useState(toHex(color));

  useEffect(() => {
    setHexInput(toHex(color));
  }, [color]);

  useEffect(() => {
    const handleDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handleDown), 50);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handleDown);
    };
  }, [onClose]);

  const [pos, setPos] = useState(position);
  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    let { top, left } = position;
    if (left + rect.width > window.innerWidth - 8) {
      left = window.innerWidth - rect.width - 8;
    }
    if (top + rect.height > window.innerHeight - 8) {
      top = position.top - rect.height - 8;
    }
    setPos({ top, left });
  }, [position]);

  const handleHexChange = (raw: string) => {
    setHexInput(raw);
    const full = raw.trim().startsWith("#") ? raw.trim() : `#${raw.trim()}`;
    if (/^#[0-9a-fA-F]{6}$/.test(full)) {
      const n = parseInt(full.slice(1), 16);
      onChange({ r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: color.a });
    }
  };

  const swatch: React.CSSProperties = {
    width: 26,
    height: 26,
    borderRadius: 6,
    flexShrink: 0,
    background: rgbaToString(color),
    border: "1px solid rgba(0,0,0,0.15)",
  };

  const tabBtn = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "6px 0",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    cursor: "pointer",
    border: "none",
    borderRadius: 6,
    background: active ? "#1e293b" : "transparent",
    color: active ? "#fff" : "#64748b",
    transition: "all 0.15s",
  });

  const numInput: React.CSSProperties = {
    flex: 1,
    border: "1px solid #cbd5e1",
    borderRadius: 6,
    padding: "6px",
    fontSize: "11px",
    textAlign: "center",
    outline: "none",
    background: "#fff",
    color: "#1e293b",
    minWidth: 0,
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        zIndex: 99999,
        background: "#ffffff",
        borderRadius: 14,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.05)",
        padding: 16,
        minWidth: 220,
      }}
    >
      <RgbaColorPicker color={color} onChange={onChange} />

      <div style={{ marginTop: 12, display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 8, padding: 3 }}>
        <button type="button" style={tabBtn(mode === "hex")} onClick={() => setMode("hex")}>Hex</button>
        <button type="button" style={tabBtn(mode === "rgb")} onClick={() => setMode("rgb")}>RGB</button>
      </div>

      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={swatch} />
        {mode === "hex" ? (
          <input
            value={hexInput}
            onChange={(e) => handleHexChange(e.target.value)}
            placeholder="#000000"
            spellCheck={false}
            style={{
              flex: 1,
              border: "1px solid #cbd5e1",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 12,
              fontFamily: "monospace",
              outline: "none",
              background: "#fff",
              color: "#1e293b",
            }}
          />
        ) : (
          <div style={{ flex: 1, display: "flex", gap: 4 }}>
            {(["r", "g", "b"] as const).map((ch) => (
              <div key={ch} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={Math.round(color[ch])}
                  onChange={(e) => onChange({ ...color, [ch]: Math.min(255, Math.max(0, +e.target.value)) })}
                  style={numInput}
                />
                <span style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>{ch}</span>
              </div>
            ))}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <input
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={color.a}
                onChange={(e) => onChange({ ...color, a: Math.min(1, Math.max(0, +e.target.value)) })}
                style={numInput}
              />
              <span style={{ fontSize: 9, color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>a</span>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

function QuillEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quillRef = useRef<any>(null);
  const [picker, setPicker] = useState<{
    visible: boolean;
    type: "color" | "background";
    position: { top: number; left: number };
    color: RGBA;
  }>({ visible: false, type: "color", position: { top: 0, left: 0 }, color: { r: 0, g: 0, b: 0, a: 1 } });

  useEffect(() => {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const editor = quillRef.current?.getEditor?.();
      const toolbar = editor?.getModule?.("toolbar");
      if (!toolbar?.container) {
        if (attempts > 30) clearInterval(interval);
        return;
      }
      clearInterval(interval);
      
      const colorLabel = toolbar.container.querySelector(".ql-color .ql-picker-label") as HTMLElement | null;
      const bgLabel = toolbar.container.querySelector(".ql-background .ql-picker-label") as HTMLElement | null;

      if (colorLabel && !(colorLabel as any).__nativePicker) {
        (colorLabel as any).__nativePicker = true;
        colorLabel.addEventListener("mousedown", (e: Event) => {
          e.stopPropagation();
          e.preventDefault();
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const currentColor = parseColor(editor.getFormat().color || "#000000");
          setPicker({ visible: true, type: "color", position: { top: rect.bottom + 6, left: rect.left }, color: currentColor });
        }, true);
      }

      if (bgLabel && !(bgLabel as any).__nativePicker) {
        (bgLabel as any).__nativePicker = true;
        bgLabel.addEventListener("mousedown", (e: Event) => {
          e.stopPropagation();
          e.preventDefault();
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const currentBg = parseColor(editor.getFormat().background || "#ffffff");
          setPicker({ visible: true, type: "background", position: { top: rect.bottom + 6, left: rect.left }, color: currentBg });
        }, true);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleColorChange = useCallback((color: RGBA) => {
    setPicker(prev => ({ ...prev, color }));
    const editor = quillRef.current?.getEditor?.();
    if (editor) {
      editor.format(picker.type, rgbaToString(color));
    }
  }, [picker.type]);

  const closePicker = useCallback(() => setPicker(prev => ({ ...prev, visible: false })), []);

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  const quillFormats = ["header", "bold", "italic", "underline", "strike", "color", "background", "list"];

  return (
    <>
      <ReactQuill 
        ref={quillRef} 
        theme="snow" 
        value={value} 
        modules={quillModules} 
        formats={quillFormats} 
        onChange={onChange} 
      />
      {picker.visible && (
        <PickerPopover 
          color={picker.color} 
          position={picker.position} 
          onChange={handleColorChange} 
          onClose={closePicker} 
        />
      )}
    </>
  );
}

interface TranslatableFieldProps {
  label: string;
  value: { en: string; ar: string };
  onChange: (val: { en: string; ar: string }) => void;
  type?: "text" | "quill";
  placeholder?: string;
}

export default function TranslatableField({ label, value, onChange, type = "text", placeholder }: TranslatableFieldProps) {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const valEN = value?.en || "";
  const valAR = value?.ar || "";

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="caption" sx={{ fontWeight: 800, color: 'gray.400', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </Typography>
        <Box sx={{ display: 'flex', gap: '2px', bgcolor: '#f1f5f9', p: '2px', borderRadius: '8px', border: '1px solid #e2e8f0', mr: 4 }}>
          {(["en", "ar"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              style={{
                padding: "3px 12px",
                borderRadius: "6px",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.05em",
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s",
                background: lang === l ? "#00C4B4" : "transparent",
                color: lang === l ? "#fff" : "#64748b",
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </Box>
      </Box>
      
      <div>
        {lang === "en" ? (
          <div>
            {type === "quill" ? (
              <QuillEditor value={valEN} onChange={(v) => { if (v !== valEN) onChange({ ...value, en: v }); }} />
            ) : (
              <TextField 
                fullWidth 
                size="small" 
                placeholder={placeholder || `Enter ${label} in English`}
                value={valEN} 
                onChange={(e) => onChange({ ...value, en: e.target.value })}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: '#fff' } }}
              />
            )}
          </div>
        ) : (
          <div dir="rtl">
            {type === "quill" ? (
              <QuillEditor value={valAR} onChange={(v) => { if (v !== valAR) onChange({ ...value, ar: v }); }} />
            ) : (
              <TextField 
                fullWidth 
                dir="rtl" 
                size="small" 
                placeholder={placeholder || `أدخل ${label} باللغة العربية`}
                value={valAR} 
                onChange={(e) => onChange({ ...value, ar: e.target.value })}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: '#fff' } }}
              />
            )}
          </div>
        )}
      </div>
    </Box>
  );
}
