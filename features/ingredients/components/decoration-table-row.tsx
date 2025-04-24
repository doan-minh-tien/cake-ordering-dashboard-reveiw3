"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

// Utility function to format VND
const formatVND = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

interface DecorationTableRowProps {
  name: string;
  color: string;
  price: number;
}

/**
 * Component hiển thị một hàng trong bảng trang trí bánh
 */
export function DecorationTableRow({
  name,
  color,
  price,
}: DecorationTableRowProps) {
  return (
    <TableRow className="hover:bg-amber-50/40">
      <TableCell className="py-2">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-amber-500" />
          <span className="font-medium">{name}</span>
        </div>
      </TableCell>
      <TableCell className="py-2">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border border-gray-200"
            style={{ backgroundColor: color }}
          />
          <span>{color}</span>
        </div>
      </TableCell>
      <TableCell className="py-2">
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          {formatVND(price)}
        </Badge>
      </TableCell>
    </TableRow>
  );
}

/**
 * Sử dụng ví dụ:
 *
 * <Table>
 *   <TableHeader>...</TableHeader>
 *   <TableBody>
 *     <DecorationTableRow
 *       name="Kem bơ truyền thống"
 *       color="#F5F0D6"
 *       price={50000}
 *     />
 *     // Các hàng khác
 *   </TableBody>
 * </Table>
 */
