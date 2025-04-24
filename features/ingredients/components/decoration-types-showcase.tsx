"use client";

import React, { useState } from "react";
import {
  CAKE_DECORATION_TYPES,
  DECORATION_TYPE_SAMPLES,
  getDecorationTypeDisplayName,
} from "../constants/decoration-types";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  Package,
  Cake,
  PaletteIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Utility function to format VND
const formatVND = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

interface DecorationTypesShowcaseProps {
  className?: string;
}

export default function DecorationTypesShowcase({
  className,
}: DecorationTypesShowcaseProps) {
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>(
    {}
  );

  const decorationTypes = Object.keys(CAKE_DECORATION_TYPES);

  const toggleExpand = (type: string) => {
    setExpandedTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Card className="shadow-md border-amber-200 overflow-hidden">
        <CardHeader className="p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 border-b border-amber-200">
          <CardTitle className="text-xl font-semibold text-amber-800 flex items-center">
            <Cake className="h-5 w-5 mr-2 text-amber-600" />
            Các loại trang trí bánh
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {decorationTypes.map((type) => (
              <div
                key={type}
                className="border border-amber-100 rounded-lg overflow-hidden"
              >
                <div
                  className="flex items-center justify-between p-3 bg-amber-50 cursor-pointer"
                  onClick={() => toggleExpand(type)}
                >
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-amber-100 transition-colors"
                    >
                      {expandedTypes[type] ? (
                        <ChevronDown className="h-5 w-5 text-amber-600" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-amber-600" />
                      )}
                    </Button>
                    <Badge
                      variant="secondary"
                      className="px-3 py-1 bg-amber-100 text-amber-700 border border-amber-200"
                    >
                      {getDecorationTypeDisplayName(type)}
                    </Badge>
                  </div>

                  <div className="flex items-center text-amber-700 text-sm">
                    <Package className="h-4 w-4 mr-1.5" />
                    <span>
                      {DECORATION_TYPE_SAMPLES[
                        type as keyof typeof DECORATION_TYPE_SAMPLES
                      ]?.length || 0}{" "}
                      mẫu
                    </span>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedTypes[type] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
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
                          {DECORATION_TYPE_SAMPLES[
                            type as keyof typeof DECORATION_TYPE_SAMPLES
                          ]?.map((item, index) => (
                            <TableRow
                              key={index}
                              className="hover:bg-amber-50/40"
                            >
                              <TableCell className="py-2">
                                <div className="flex items-center gap-2">
                                  <Package className="h-4 w-4 text-amber-500" />
                                  <span className="font-medium">
                                    {item.name}
                                  </span>
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
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200"
                                >
                                  {formatVND(item.price)}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}

                          {(!DECORATION_TYPE_SAMPLES[
                            type as keyof typeof DECORATION_TYPE_SAMPLES
                          ] ||
                            DECORATION_TYPE_SAMPLES[
                              type as keyof typeof DECORATION_TYPE_SAMPLES
                            ].length === 0) && (
                            <TableRow>
                              <TableCell
                                colSpan={3}
                                className="text-center py-6 text-amber-600"
                              >
                                <div className="flex flex-col items-center">
                                  <Package className="h-10 w-10 text-amber-300 mb-2" />
                                  <p>Không có mẫu nào cho loại trang trí này</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
