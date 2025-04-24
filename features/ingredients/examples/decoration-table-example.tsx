"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DecorationTableRow } from "../components/decoration-table-row";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cake } from "lucide-react";

export default function DecorationTableExample() {
  // Các mẫu trang trí bánh của bạn
  const decorationItems = [
    {
      name: "Kem bơ truyền thống",
      color: "#F5F0D6",
      price: 50000,
    },
    {
      name: "Kem phô mai",
      color: "#FFF8E1",
      price: 60000,
    },
    // Thêm hàng mới tại đây
    {
      name: "Kem hoa hồng",
      color: "#FFCCCB",
      price: 75000,
    },
    {
      name: "Kem chocolate",
      color: "#7B3F00",
      price: 55000,
    },
  ];

  return (
    <Card className="shadow-md border-amber-200 overflow-hidden">
      <CardHeader className="p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 border-b border-amber-200">
        <CardTitle className="text-xl font-semibold text-amber-800 flex items-center">
          <Cake className="h-5 w-5 mr-2 text-amber-600" />
          Phủ Kem Ngoài
        </CardTitle>
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
              <TableHead className="text-amber-700 font-medium w-1/3">
                Giá
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Sử dụng map để tạo nhiều hàng từ mảng dữ liệu */}
            {decorationItems.map((item, index) => (
              <DecorationTableRow
                key={index}
                name={item.name}
                color={item.color}
                price={item.price}
              />
            ))}

            {/* Hoặc thêm trực tiếp một hàng mới */}
            <DecorationTableRow
              name="Kem matcha"
              color="#78C850"
              price={65000}
            />
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
