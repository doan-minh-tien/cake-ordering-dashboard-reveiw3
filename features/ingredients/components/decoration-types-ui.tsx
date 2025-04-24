"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Cake,
  Package,
  PlusCircle,
  Edit2,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CAKE_DECORATION_TYPES,
  getDecorationTypeDisplayName,
} from "../constants/decoration-types";

// Dữ liệu mẫu cho UI
const EMPTY_EXAMPLE_DATA = {
  OuterIcing: [
    { name: "Kem bơ truyền thống", color: "#F5F0D6", price: 50000 },
    { name: "Kem phô mai", color: "#FFF8E1", price: 60000 },
    { name: "Kem tươi", color: "#FFFFFF", price: 70000 },
  ],
  TallSkirt: [{ name: "Váy xòe cao", color: "#FFCCFF", price: 45000 }],
  ShortSkirt: [{ name: "Váy ngắn đơn giản", color: "#BAFC7C", price: 30000 }],
  Drip: [{ name: "Sốt socola đen", color: "#3A2213", price: 30000 }],
  Bling: [{ name: "Kim tuyến thực phẩm", color: "#FFD700", price: 30000 }],
  Decoration: [{ name: "Hoa kem tươi", color: "#FF90BB", price: 40000 }],
  Sprinkles: [{ name: "Hạt màu sắc", color: "#FF90C9", price: 20000 }],
};

export default function DecorationTypesUI() {
  // Danh sách các loại trang trí cần hiển thị
  const decorationTypes = [
    "OuterIcing",
    "TallSkirt",
    "ShortSkirt",
    "Drip",
    "Bling",
    "Decoration",
    "Sprinkles",
  ];

  return (
    <div className="space-y-6">
      {decorationTypes.map((type) => (
        <DecorationTypeCard key={type} type={type} />
      ))}
    </div>
  );
}

interface DecorationTypeCardProps {
  type: string;
}

function DecorationTypeCard({ type }: DecorationTypeCardProps) {
  // Dữ liệu mẫu cho loại trang trí
  const items =
    EMPTY_EXAMPLE_DATA[type as keyof typeof EMPTY_EXAMPLE_DATA] || [];

  return (
    <Card className="shadow-md border-amber-200 overflow-hidden">
      <CardHeader className="p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 border-b border-amber-200">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-amber-800 flex items-center">
            <Cake className="h-5 w-5 mr-2 text-amber-600" />
            {getDecorationTypeDisplayName(type)}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full px-3 bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700 hover:text-amber-800 transition-all flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Thêm danh mục</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Table>
          <TableHeader className="bg-amber-50/60">
            <TableRow>
              <TableHead className="text-amber-700 font-medium w-1/3">
                Tên
              </TableHead>
              <TableHead className="text-amber-700 font-medium w-1/3">
                Màu sắc
              </TableHead>
              <TableHead className="text-amber-700 font-medium w-1/4">
                Giá
              </TableHead>
              <TableHead className="text-amber-700 font-medium w-1/6">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow
                key={index}
                className="hover:bg-amber-50/40 border-b border-amber-100"
              >
                <TableCell className="py-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                </TableCell>
                <TableCell className="py-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.color}</span>
                  </div>
                </TableCell>
                <TableCell className="py-2">
                  <div className="px-2 py-1 rounded-md inline-block bg-green-50 text-green-700 border border-green-200 text-sm">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.price)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 hover:bg-amber-50 group border-amber-200"
                        >
                          <Edit2 className="h-4 w-4 text-amber-600 group-hover:rotate-12 transition-transform" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Chỉnh sửa</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-50 group border-red-200"
                        >
                          <Trash2 className="h-4 w-4 text-red-500 group-hover:scale-90 transition-transform" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Xóa</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {items.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-6 text-amber-600"
                >
                  <div className="flex flex-col items-center">
                    <Package className="h-10 w-10 text-amber-300 mb-2" />
                    <p>Không có mẫu nào cho loại trang trí này</p>
                    <Button
                      variant="default"
                      size="sm"
                      className="mt-4 bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Thêm danh mục
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
