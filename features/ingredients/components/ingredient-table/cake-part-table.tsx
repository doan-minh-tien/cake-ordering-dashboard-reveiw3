"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";

import { useDataTable } from "@/hooks/use-data-table";
import { Card, CardContent } from "@/components/ui/card";
import { generateColumnLabels } from "@/components/data-table/column-label-mapping";
import { ICakePartType } from "../../types/cake-part-type";
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
  PlusCircle,
  Settings,
} from "lucide-react";
import { ExpandDataTable } from "@/components/data-table/expand-data-table";
import { Badge } from "@/components/ui/badge";
import { useModal } from "@/hooks/use-modal";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AlertModal from "@/components/modals/alert-modal";
import { deleteCakePart } from "@/features/ingredients/actions/cake-part-action";
import { toast } from "sonner";

// Utility function to format VND
const formatVND = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

// Simplified icon mapping
const getItemIcon = (type: string) => {
  const iconMap = {
    "Lớp Bánh": Package,
    "Lớp Kem": PaletteIcon,
    default: Package,
  };

  return iconMap[type as keyof typeof iconMap] || iconMap["default"];
};

interface CakePartTableProps {
  data: ApiListResponse<ICakePartType>;
}

export function CakePartTable({ data }: CakePartTableProps) {
  const [expandedRows, setExpandedRows] = React.useState<
    Record<string, boolean>
  >({});
  const { onOpen } = useModal();
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const [openDeleteId, setOpenDeleteId] = React.useState<string | undefined>(undefined);

  const { data: cakeData, pageCount } = data;

  const toggleRowExpansion = (type: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleDelete = async (id?: string) => {
    startTransition(async () => {
      const result = await deleteCakePart(id!);
      if (result.success) {
        setOpenDeleteModal(false);
        toast.success("Đã xóa thành công");
      } else {
        toast.error("Đã xảy ra lỗi");
      }
    });
  };

  const columns = React.useMemo<ColumnDef<ICakePartType, unknown>[]>(
    () => [
      {
        accessorKey: "type",
        header: "Phần Bánh",
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-600">
              <TagIcon className="h-4 w-4 text-indigo-500" />
              <span className="font-medium">
                {row.original.items.length} danh mục
              </span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-3 bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700 hover:text-indigo-800 transition-all"
                  onClick={() =>
                    onOpen("collectionCakePartModal", {
                      ingredientType: row.original.type,
                    })
                  }
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Thêm danh mục
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Thêm danh mục mới</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ),
      },
    ],
    [expandedRows, onOpen]
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
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <Card className="m-2 rounded-lg overflow-hidden shadow-sm">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 flex justify-between items-center">
                <h3 className="text-indigo-700 dark:text-indigo-300 font-medium flex items-center">
                  {React.createElement(getItemIcon(type), {
                    className: "h-5 w-5 mr-2",
                  })}
                  Danh sách {type.toLowerCase()}
                </h3>
              </div>
              <Table>
                <TableHeader className="bg-indigo-50/50 dark:bg-indigo-900/10">
                  <TableRow>
                    {[
                      "Tên",
                      "Giá",
                      "Màu Sắc",
                      "Mô Tả",
                      "Mặc Định",
                      "Thao Tác",
                    ].map((header) => (
                      <TableHead
                        key={header}
                        className="text-indigo-700 dark:text-indigo-300"
                      >
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
                            delay: index * 0.05,
                            duration: 0.3,
                          }}
                          className="hover:bg-indigo-50/60 dark:hover:bg-indigo-900/20 transition-colors"
                        >
                          <TableCell className="flex items-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                              <ItemIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {item.name}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50"
                            >
                              {formatVND(item.price)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div
                                className="w-5 h-5 rounded-full inline-block mr-2 shadow-sm border border-gray-200"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-gray-700 dark:text-gray-300">
                                {item.color}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400 max-w-xs truncate">
                            {item.description || "Không có mô tả"}
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
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="hover:bg-indigo-50 group"
                                    onClick={() =>
                                      onOpen("cakePartModal", {
                                        cakePart: item,
                                      })
                                    }
                                  >
                                    <Edit2Icon className="h-4 w-4 text-indigo-600 group-hover:rotate-12 transition-transform" />
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
                                    className="hover:bg-red-50 group"
                                    onClick={() => {
                                      setOpenDeleteId(item.id);
                                      setOpenDeleteModal(true);
                                    }}
                                  >
                                    <TrashIcon className="h-4 w-4 text-red-500 group-hover:scale-90 transition-transform" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Xóa</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
              {items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <Package className="h-12 w-12 text-indigo-200 mb-4" />
                  <h3 className="text-gray-700 font-medium mb-1">
                    Chưa có danh mục nào
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Hãy thêm danh mục đầu tiên cho phần bánh này
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() =>
                      onOpen("collectionCakePartModal", {
                        ingredientType: type,
                      })
                    }
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Thêm danh mục
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <>
      <AlertModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={() => handleDelete(openDeleteId)}
        title="Xóa"
        description="Bạn có chắc chắn với hành động này không?"
      />
      <div className="space-y-4">
        <Card className="shadow-sm border-indigo-100">
          <div className="p-4 border-b border-indigo-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-indigo-800">
              Quản lý phần bánh
            </h2>
            <Button
              variant="default"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => onOpen("collectionCakePartModal", {})}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Thêm loại phần bánh mới
            </Button>
          </div>
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
    </>
  );
}

export default CakePartTable;