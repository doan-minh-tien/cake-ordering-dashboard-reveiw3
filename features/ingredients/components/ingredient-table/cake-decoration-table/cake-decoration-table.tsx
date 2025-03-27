"use client";

import * as React from "react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";

import { useDataTable } from "@/hooks/use-data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateColumnLabels } from "@/components/data-table/column-label-mapping";
import { ICakeDecorationType } from "../../../types/cake-decoration-type";
import { ApiListResponse } from "@/lib/api/api-handler/generic";
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
  BoxIcon,
  TagIcon,
  Edit2Icon,
  Cake,
  PaletteIcon,
  BrushIcon,
  StarIcon,
  LayersIcon,
  RotateCwIcon,
  TrashIcon,
  IceCreamIcon,
  GemIcon,
  LeafIcon,
  FlagIcon,
  WindIcon,
  CloudIcon,
} from "lucide-react";
import { ExpandDataTable } from "@/components/data-table/expand-data-table";
import { Badge } from "@/components/ui/badge";


// Utility function to format VND
const formatVND = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

// Expanded icon mapping with more variety
const getItemIcon = (type: string) => {
  const iconMap = {
    Topping: Cake,
    Color: PaletteIcon,
    Decoration: BrushIcon,
    Shape: LayersIcon,
    Style: StarIcon,
    Theme: RotateCwIcon,
    Flavor: IceCreamIcon,
    Special: GemIcon,
    Seasonal: LeafIcon,
    Occasion: FlagIcon,
    Texture: WindIcon,
    Background: CloudIcon,
    default: Package,
  };

  return iconMap[type as keyof typeof iconMap] || iconMap["default"];
};

interface CakeDecorationTableProps {
  data: ApiListResponse<ICakeDecorationType>;
  onViewItem?: (item: any) => void;
  onEditItem?: (item: any) => void;
}

export function CakeDecorationTable({
  data,
  onViewItem,
  onEditItem,
}: CakeDecorationTableProps) {
  const [expandedRows, setExpandedRows] = React.useState<
    Record<string, boolean>
  >({});

  const { data: cakeData, pageCount } = data;

  const toggleRowExpansion = (type: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const columns = React.useMemo<ColumnDef<ICakeDecorationType, unknown>[]>(
    () => [
      {
        accessorKey: "type",
        header: "Loại Trang Trí",
        cell: ({ row }) => (
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-indigo-50 transition-all duration-300 ease-in-out transform hover:scale-110"
              onClick={() => toggleRowExpansion(row.original.type)}
            >
              <AnimatePresence mode="wait">
                {expandedRows[row.original.type] ? (
                  <motion.div
                    key="chevron-down"
                    initial={{ rotate: -90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: 90 }}
                  >
                    <ChevronDown className="text-indigo-600" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="chevron-right"
                    initial={{ rotate: 90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: -90 }}
                  >
                    <ChevronRight className="text-indigo-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
            <Badge
              variant="secondary"
              className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 shadow-sm hover:bg-indigo-100 transition-colors duration-200"
            >
              {row.original.type}
            </Badge>
          </motion.div>
        ),
      },
      {
        accessorKey: "items",
        header: "Số Lượng Danh Mục",
        cell: ({ row }) => (
          <motion.div 
            className="flex items-center space-x-2 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <BoxIcon className="h-4 w-4 text-indigo-500 animate-pulse" />
            <span className="font-medium">{row.original.items.length} danh mục</span>
          </motion.div>
        ),
      },
    ],
    [expandedRows]
  );

  const labels = generateColumnLabels(columns);

  const { dataTable } = useDataTable({
    data: cakeData,
    columns,
    pageCount,
    searchableColumns: [],
    filterableColumns: [],
  });

  const renderExpandedContent = (type: string, items: any[]) => {
    if (!expandedRows[type]) return null;

    return (
      <TableRow>
        <TableCell colSpan={columns.length} className="p-0">
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <Card className="m-2 border-indigo-100 dark:border-indigo-800/50 rounded-lg overflow-hidden shadow-md">
              <CardHeader className="bg-indigo-50 dark:bg-indigo-900/20 py-3 border-b border-indigo-100 dark:border-indigo-800/30">
                <CardTitle className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 flex items-center">
                  <TagIcon className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400 animate-wiggle" />
                  Chi Tiết {type}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-indigo-100/50 dark:bg-indigo-900/30">
                    <TableRow>
                      <TableHead className="text-indigo-700 dark:text-indigo-300">
                        Tên
                      </TableHead>
                      <TableHead className="text-indigo-700 dark:text-indigo-300">
                        Giá
                      </TableHead>
                      <TableHead className="text-indigo-700 dark:text-indigo-300">
                        Màu Sắc
                      </TableHead>
                      <TableHead className="text-indigo-700 dark:text-indigo-300">
                        Mô Tả
                      </TableHead>
                      <TableHead className="text-indigo-700 dark:text-indigo-300">
                        Mặc Định
                      </TableHead>
              
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {items.map((item, index) => {
                        const ItemIcon = getItemIcon(type);
                        return (
                          <motion.tr
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                              delay: index * 0.1,
                              duration: 0.3 
                            }}
                            className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-200"
                          >
                            <TableCell className="flex items-center space-x-3">
                              <ItemIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400 transform hover:scale-110 transition-transform" />
                              <span className="font-medium text-gray-800 dark:text-gray-200">
                                {item.name}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200 hover:bg-indigo-200 transition-colors"
                              >
                                {formatVND(item.price)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <motion.div
                                className="w-4 h-4 rounded-full inline-block mr-2 shadow-sm"
                                style={{ backgroundColor: item.color }}
                                whileHover={{ scale: 1.2 }}
                              />
                              <span className="text-gray-700 dark:text-gray-300">
                                {item.color}
                              </span>
                            </TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400">
                              {item.description}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={item.is_default ? "default" : "outline"}
                                className={
                                  item.is_default
                                    ? "bg-indigo-500 text-white dark:bg-indigo-600 animate-pulse"
                                    : "text-gray-500 border-gray-300 dark:text-gray-400 dark:border-gray-700"
                                }
                              >
                                {item.is_default ? "Có" : "Không"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="hover:bg-indigo-50 group"
                                >
                                  <Edit2Icon className="h-4 w-4 text-indigo-600 group-hover:rotate-12 transition-transform" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="hover:bg-indigo-50 group"
                                >
                                  <TrashIcon className="h-4 w-4 text-indigo-600 group-hover:scale-90 transition-transform" />
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <Card className="w-full shadow-md">
        <CardContent>
          <ExpandDataTable
            dataTable={dataTable}
            columns={columns}
            searchableColumns={[]}
            filterableColumns={[]}
            columnLabels={labels}
            renderAdditionalRows={(row) =>
              renderExpandedContent(row.original.type, row.original.items)
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default CakeDecorationTable;