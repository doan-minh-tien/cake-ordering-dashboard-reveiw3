"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";

import { useDataTable } from "@/hooks/use-data-table";
import { Card, CardContent } from "@/components/ui/card";
import { generateColumnLabels } from "@/components/data-table/column-label-mapping";
import { ICakeExtraOptionType } from "../../types/cake-extra-option-type";
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
  TagIcon,
  Edit2Icon,
  PaletteIcon,
  TrashIcon,
} from "lucide-react";
import { ExpandDataTable } from "@/components/data-table/expand-data-table";
import { Badge } from "@/components/ui/badge";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";

// Utility function to format VND
const formatVND = (price: number) => 
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

// Simplified icon mapping
const getItemIcon = (type: string) => {
  const iconMap = {
    Topping: Package,
    Color: PaletteIcon,
    default: Package,
  };

  return iconMap[type as keyof typeof iconMap] || iconMap["default"];
};

interface CakeExtraOptionTableProps {
  data: ApiListResponse<ICakeExtraOptionType>;
}

export function CakeExtraOptionTable({ data }: CakeExtraOptionTableProps) {
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({});
  const { onOpen } = useModal();

  const { data: cakeData, pageCount } = data;

  const toggleRowExpansion = (type: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const columns = React.useMemo<ColumnDef<ICakeExtraOptionType, unknown>[]>(
    () => [
      {
        accessorKey: "type",
        header: "Loại Phụ Kiện",
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
              className="rounded-full hover:bg-indigo-50 transition-all"
              onClick={() => toggleRowExpansion(row.original.type)}
            >
              <AnimatePresence mode="wait">
                {expandedRows[row.original.type] ? (
                  <ChevronDown className="text-indigo-600" />
                ) : (
                  <ChevronRight className="text-indigo-600" />
                )}
              </AnimatePresence>
            </Button>
            <Badge
              variant="secondary"
              className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700"
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
          <div className="flex items-center space-x-2 text-gray-600">
            <TagIcon className="h-4 w-4 text-indigo-500" />
            <span className="font-medium">{row.original.items.length} danh mục</span>
          </div>
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
            <Card className="m-2 rounded-lg overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-indigo-50 dark:bg-indigo-900/20">
                  <TableRow>
                    {["Tên", "Giá", "Màu Sắc", "Mô Tả", "Mặc Định", "Thao Tác"].map((header) => (
                      <TableHead key={header} className="text-indigo-700 dark:text-indigo-300">
                        {header}
                      </TableHead>
                    ))}
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
                          className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                        >
                          <TableCell className="flex items-center space-x-3">
                            <ItemIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {item.name}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200"
                            >
                              {formatVND(item.price)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div
                              className="w-4 h-4 rounded-full inline-block mr-2 shadow-sm"
                              style={{ backgroundColor: item.color }}
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
                              className={cn(
                                "text-center",
                                item.is_default
                                  ? "bg-indigo-500 text-white dark:bg-indigo-600"
                                  : "text-gray-500 border-gray-300 dark:text-gray-400 dark:border-gray-700"
                              )}
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
                                onClick={() => onOpen("cakeExtraModal", {cakeExtra: item})}
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
            </Card>
          </motion.div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
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

export default CakeExtraOptionTable;