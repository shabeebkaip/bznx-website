"use client";

import { 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Tooltip,
  Typography,
  CircularProgress
} from "@mui/material";
import { Edit2, Trash2 } from "lucide-react";
import React from "react";

export interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface CommonTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export default function CommonTable({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  loading = false, 
  emptyMessage = "No items found." 
}: CommonTableProps) {
  
  if (loading) return (
    <div className="flex items-center justify-center min-h-[300px]">
      <CircularProgress size={30} sx={{ color: '#00C4B4' }} />
    </div>
  );

  return (
    <TableContainer component={Paper} sx={{ borderRadius: '24px', boxShadow: 'none', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <Table>
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            {columns.map((col) => (
              <TableCell 
                key={col.key} 
                align={col.align || 'left'}
                sx={{ fontWeight: 900, fontSize: '0.75rem', color: '#64748b', py: 3, textTransform: 'uppercase' }}
              >
                {col.label}
              </TableCell>
            ))}
            {(onEdit || onDelete) && (
              <TableCell align="right" sx={{ fontWeight: 900, fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={row._id || idx} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              {columns.map((col) => (
                <TableCell key={col.key} align={col.align || 'left'}>
                  {col.render ? col.render(row) : row[col.key]}
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    {onEdit && (
                      <Tooltip title="Edit">
                        <IconButton 
                          onClick={() => onEdit(row)}
                          sx={{ color: '#0f172a', bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#e2e8f0' } }}
                        >
                          <Edit2 size={16} />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onDelete && (
                      <Tooltip title="Delete">
                        <IconButton 
                          onClick={() => onDelete(row)}
                          sx={{ color: '#ef4444', bgcolor: '#fee2e2', '&:hover': { bgcolor: '#fecaca' } }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              )}
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length + ((onEdit || onDelete) ? 1 : 0)} align="center" sx={{ py: 10 }}>
                <Typography sx={{ color: 'slate.400', fontWeight: 700, fontStyle: 'italic' }}>
                  {emptyMessage}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
