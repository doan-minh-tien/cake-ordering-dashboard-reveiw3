"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";

import { useDataTable } from "@/hooks/use-data-table";
import { Card, CardContent } from "@/components/ui/card";
import { generateColumnLabels } from "@/components/data-table/column-label-mapping";
import { ICakeMessageOptionType } from "../../types/cake-message-option-type";
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
  MessageSquare,
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
import { deleteCakeMessage } from "@/features/ingredients/actions/cake-message-option-action";
import { toast } from "sonner";

// Enum definitions
enum CakeMessageTypeEnum {
  NONE = "NONE",
  TEXT = "TEXT",
  IMAGE = "IMAGE",
}

enum CakeMessageOptionTypeEnum {
  PIPING_COLOUR = "PIPING_COLOUR",
  PLAQUE_COLOUR = "PLAQUE_COLOUR",
}

// Simplified icon mapping
const getItemIcon = (type: string) => {
  const iconMap = {
    Message: MessageSquare,
    Topping: Package,
    Color: PaletteIcon,
    default: MessageSquare,
  };

  return iconMap[type as keyof typeof iconMap] || iconMap["default"];
};

// Tên hiển thị tiếng Việt cho các loại tin nhắn
const getTypeDisplayName = (type: string): string => {
  const typeNameMap: Record<string, string> = {
    PLAQUE_COLOUR: "Màu Thông Điệp",
    PIPING_COLOUR: "Màu Viền",
    TEXT: "Nội Dung",
    NONE: "Không",
    IMAGE: "Hình Ảnh",
  };

  return typeNameMap[type] || type;
};

interface CakeMessageOptionTableProps {
  data: ApiListResponse<ICakeMessageOptionType>;
}

export function CakeMessageOptionTable({ data }: CakeMessageOptionTableProps) {
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

  // Get existing types from data
  const existingTypes = React.useMemo(() => {
    return cakeData.map((item) => item.type);
  }, [cakeData]);

  const toggleRowExpansion = (type: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleDelete = async (id?: string) => {
    startTransition(async () => {
      const result = await deleteCakeMessage(id!);
      if (result.success) {
        setOpenDeleteModal(false);
        toast.success("Đã xóa thành công");
      } else {
        toast.error("Đã xảy ra lỗi");
      }
    });
  };

  const columns = React.useMemo<ColumnDef<ICakeMessageOptionType, unknown>[]>(
    () => [
      {
        accessorKey: "type",
        header: "Tùy Chọn Tin Nhắn",
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
                    onOpen("collectionCakeMessageModal", {
                      ingredientType: row.original.type,
                    })
                  }
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Thêm tin nhắn
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Thêm tin nhắn mới</p>
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
                  Danh sách {getTypeDisplayName(type).toLowerCase()}
                </h3>
              </div>
              <Table>
                <TableHeader className="bg-indigo-50/50 dark:bg-indigo-900/10">
                  <TableRow>
                    {["Nội dung", "Màu Sắc", "Mặc Định", "Thao Tác"].map(
                      (header) => (
                        <TableHead
                          key={header}
                          className="text-indigo-700 dark:text-indigo-300"
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
                          className="hover:bg-indigo-50/60 dark:hover:bg-indigo-900/20 transition-colors"
                        >
                          <TableCell className="flex items-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                              <ItemIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                              {getTypeDisplayName(item.name)}
                            </span>
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
                                      onOpen("cakeMessageModal", {
                                        cakeMessage: item,
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
                  <MessageSquare className="h-12 w-12 text-indigo-200 mb-4" />
                  <h3 className="text-indigo-700 font-medium mb-1">
                    Chưa có tin nhắn nào
                  </h3>
                  <p className="text-indigo-600 mb-4">
                    Hãy thêm tin nhắn đầu tiên cho loại này
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-black shadow-sm"
                    onClick={() =>
                      onOpen("collectionCakeMessageModal", {
                        ingredientType: type,
                      })
                    }
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Thêm tin nhắn
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
              Quản lý tin nhắn bánh
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-3 bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700 hover:text-amber-800 transition-all flex items-center gap-1"
              onClick={() =>
                onOpen("createMessageTypeModal", { existingTypes })
              }
            >
              <PlusCircle className="h-4 w-4" />
              <span>Thêm loại tin nhắn mới</span>
            </Button>
          </div>
          <CardContent>
            {cakeData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <MessageSquare className="h-12 w-12 text-indigo-200 mb-4" />
                <h3 className="text-indigo-700 font-medium mb-1">
                  Chưa có loại tin nhắn nào
                </h3>
                <p className="text-indigo-600 mb-4">
                  Bạn cần tạo loại tin nhắn trước khi thêm các tin nhắn riêng lẻ
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-3 bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700 hover:text-amber-800 transition-all flex items-center gap-1"
                  onClick={() =>
                    onOpen("createMessageTypeModal", { existingTypes })
                  }
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Tạo loại tin nhắn</span>
                </Button>
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default CakeMessageOptionTable;
