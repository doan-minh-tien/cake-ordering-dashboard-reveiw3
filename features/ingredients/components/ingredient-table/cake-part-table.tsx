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
  BoxIcon,
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

// Tên hiển thị tiếng Việt cho các loại phần bánh
const getTypeDisplayName = (type: string): string => {
  const typeNameMap: Record<string, string> = {
    Goo: "Kem Nhân",
    Icing: "Lớp Phủ",
    Filling: "Nhân Bánh",
    Sponge: "Tầng Bánh",
    Size: "Kích Thước",
  };

  return typeNameMap[type] || type;
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
  const [openDeleteId, setOpenDeleteId] = React.useState<string | undefined>(
    undefined
  );

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
              className="rounded-full hover:bg-blue-50 dark:hover:bg-gray-800 transition-all border-blue-200 dark:border-gray-700"
              onClick={() => toggleRowExpansion(row.original.type)}
            >
              <AnimatePresence mode="wait">
                {expandedRows[row.original.type] ? (
                  <ChevronDown className="text-blue-600 dark:text-gray-300" />
                ) : (
                  <ChevronRight className="text-blue-600 dark:text-gray-300" />
                )}
              </AnimatePresence>
            </Button>
            <Badge
              variant="secondary"
              className="px-3 py-1 rounded-full bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-gray-200 border border-blue-200 dark:border-gray-700"
            >
              {getTypeDisplayName(row.original.type)}
            </Badge>
          </motion.div>
        ),
      },
      {
        accessorKey: "items",
        header: "Số Lượng Danh Mục",
        cell: ({ row }) => (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <TagIcon className="h-4 w-4 text-blue-500 dark:text-gray-400" />
              <span className="font-medium">
                {row.original.items.length} danh mục
              </span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-3 bg-blue-50 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 border-blue-200 dark:border-gray-700 text-blue-700 dark:text-gray-200 hover:text-blue-800 dark:hover:text-white transition-all"
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
            <Card className="m-2 rounded-lg overflow-hidden shadow-md border-blue-200 dark:border-gray-700">
              <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-b border-blue-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-blue-800 dark:text-gray-200 font-medium flex items-center">
                  {React.createElement(getItemIcon(type), {
                    className: "h-5 w-5 mr-2 text-blue-600 dark:text-gray-400",
                  })}
                  Danh sách {getTypeDisplayName(type).toLowerCase()}
                </h3>
              </div>
              <Table>
                <TableHeader className="bg-blue-50/70 dark:bg-gray-800">
                  <TableRow>
                    {["Tên", "Giá", "Mô Tả", "Mặc Định", "Thao Tác"].map(
                      (header) => (
                        <TableHead
                          key={header}
                          className="text-blue-700 dark:text-gray-200 font-medium"
                        >
                          {header}
                        </TableHead>
                      )
                    )}
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
                          className="hover:bg-blue-50/60 dark:hover:bg-gray-800 transition-colors border-b border-blue-100 dark:border-gray-700"
                        >
                          <TableCell className="flex items-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-gray-700 shadow-sm">
                              <ItemIcon className="h-4 w-4 text-blue-600 dark:text-gray-300" />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {item.name}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-green-50 dark:bg-gray-700 text-green-700 dark:text-gray-200 border-green-200 dark:border-gray-600 shadow-sm"
                            >
                              {formatVND(item.price)}
                            </Badge>
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
                                  ? "bg-blue-500 dark:bg-gray-600 text-white"
                                  : "text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-700"
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
                                    className="hover:bg-blue-50 dark:hover:bg-gray-700 group border-blue-200 dark:border-gray-700"
                                    onClick={() =>
                                      onOpen("cakePartModal", {
                                        cakePart: item,
                                      })
                                    }
                                  >
                                    <Edit2Icon className="h-4 w-4 text-blue-600 dark:text-gray-300 group-hover:rotate-12 transition-transform" />
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
                                    className="hover:bg-red-50 dark:hover:bg-gray-700 group border-red-200 dark:border-gray-700"
                                    onClick={() => {
                                      setOpenDeleteId(item.id);
                                      setOpenDeleteModal(true);
                                    }}
                                  >
                                    <TrashIcon className="h-4 w-4 text-red-500 dark:text-red-400 group-hover:scale-90 transition-transform" />
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
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-blue-50/30 dark:bg-gray-800/50">
                  <Package className="h-12 w-12 text-blue-200 dark:text-gray-600 mb-4" />
                  <h3 className="text-blue-700 dark:text-gray-300 font-medium mb-1">
                    Chưa có danh mục nào
                  </h3>
                  <p className="text-blue-600 dark:text-gray-400 mb-4">
                    Hãy thêm danh mục đầu tiên cho loại phần bánh này
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-blue-600 dark:bg-gray-700 hover:bg-blue-700 dark:hover:bg-gray-600 text-white shadow-sm"
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
        onConfirm={() => handleDelete(openDeleteId!)}
        title="Xóa"
        description="Bạn có chắc chắn với hành động này không?"
      />
      <div className="space-y-4">
        <Card className="shadow-md border-blue-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-gray-800 dark:to-gray-900 border-b border-blue-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-blue-800 dark:text-gray-200 flex items-center">
              <BoxIcon className="h-5 w-5 mr-2 text-blue-600 dark:text-gray-400" />
              Quản lý phần bánh
            </h2>
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
