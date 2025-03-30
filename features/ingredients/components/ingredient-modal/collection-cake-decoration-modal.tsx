"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Palette,
  CakeSlice,
  DollarSign,
  FileText,
  ChevronsUpDown,
  Check,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ListFilter,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useColorSelection } from "@/hooks/use-color";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { createCakeDecoration } from "../../actions/cake-decoration-action";

const cakeDecorationItemSchema = z.object({
  name: z.string().min(2, { message: "Tối thiểu 2 ký tự" }),
  price: z.coerce.number().min(0, { message: "Giá không hợp lệ" }),
  color: z.object({
    displayName: z.string(),
    name: z.string(),
    hex: z.string(),
  }),
  description: z.string().optional(),
  type: z.string().min(1, { message: "Chọn loại trang trí" }),
});

const collectionSchema = z.object({
  decorations: z
    .array(cakeDecorationItemSchema)
    .min(1, { message: "Thêm ít nhất 1 trang trí" }),
});

const CollectionCakeDecorationModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isOpenModal = isOpen && type === "collectionCakeDecorationModal";
  const [isPending, startTransition] = useTransition();
  const { COLOR_OPTIONS, getColorValue } = useColorSelection();
  const [decorationItems, setDecorationItems] = useState<
    z.infer<typeof cakeDecorationItemSchema>[]
  >([]);
  const [currentColorPopover, setCurrentColorPopover] =
    useState<boolean>(false);

  // New state for pagination
  const [currentStep, setCurrentStep] = useState("form"); // "form", "summary"
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [currentItemValidated, setCurrentItemValidated] = useState(false);

  const form = useForm<z.infer<typeof collectionSchema>>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      decorations: [],
    },
  });

  // Create a new empty decoration item
  const createEmptyItem = () => {
    // Kiểm tra data.ingredientType có tồn tại không
    const itemType = data?.ingredientType || "Default";

    return {
      name: "",
      price: 0,
      color: getColorValue("White"),
      description: "",
      type: itemType,
    };
  };

  // Initialize with one empty item when the modal opens
  useEffect(() => {
    if (isOpenModal && decorationItems.length === 0) {
      const newItem = createEmptyItem();
      setDecorationItems([newItem]);
      form.setValue("decorations", [newItem]);
    }
  }, [isOpenModal]);

  // Validate the current item
  const validateCurrentItem = () => {
    const currentItem = decorationItems[currentItemIndex];

    // Check if currentItem exists
    if (!currentItem) {
      setCurrentItemValidated(false);
      return false;
    }

    // Check if all required properties exist and are valid
    const isValid =
      currentItem.name &&
      currentItem.name.length >= 2 &&
      typeof currentItem.price === "number" &&
      currentItem.price >= 0 &&
      currentItem.type &&
      currentItem.type.length >= 1;

    setCurrentItemValidated(!!isValid);
    return isValid;
  };

  useEffect(() => {
    validateCurrentItem();
  }, [decorationItems, currentItemIndex]);

  // Add a new item to the list and navigate to it
  const addNewItem = () => {
    const newItem = createEmptyItem();
    const newItems = [...decorationItems, newItem];
    setDecorationItems(newItems);
    form.setValue("decorations", newItems);
    setCurrentItemIndex(newItems.length - 1);
  };

  // Remove the current item
  const removeCurrentItem = () => {
    if (decorationItems.length <= 1) return;

    const updatedItems = decorationItems.filter(
      (_, i) => i !== currentItemIndex
    );
    setDecorationItems(updatedItems);
    form.setValue("decorations", updatedItems);

    if (currentItemIndex >= updatedItems.length) {
      setCurrentItemIndex(updatedItems.length - 1);
    }
  };

  const updateCurrentItem = (field: string, value: any) => {
    const updatedItems = [...decorationItems];
    if (updatedItems[currentItemIndex]) {
      updatedItems[currentItemIndex] = {
        ...updatedItems[currentItemIndex],
        [field]: value,
      };
      setDecorationItems(updatedItems);
      form.setValue("decorations", updatedItems);
    }
  };

  const goToPrevItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
    }
  };

  const goToNextItem = () => {
    if (currentItemIndex < decorationItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    }
  };

  const goToSummary = () => {
    if (decorationItems.length > 0) {
      setCurrentStep("summary");
    }
  };

  const backToForm = (index: number = currentItemIndex) => {
    setCurrentStep("form");
    setCurrentItemIndex(index);
  };

  const onSubmit = async (values: z.infer<typeof collectionSchema>) => {
    try {
      // Format the data for API submission
      const formattedItems = values.decorations.map((item) => ({
        ...item,
        color: item.color.name,
      }));

      console.log("Submitted items:", formattedItems);

      startTransition(async () => {
        const result = await createCakeDecoration(formattedItems);
        if (!result.success) {
          toast.error(result.error);
          return;
        } else {
          toast.success(
            `Đã thêm ${formattedItems.length} trang trí thành công!`
          );
        }

        handleClose();
      });
    } catch (error) {
      console.error("Error processing cake decorations:", error);
      toast.error("Có lỗi xảy ra khi xử lý trang trí");
    }
  };

  const handleClose = () => {
    onClose();
    setDecorationItems([]);
    setCurrentItemIndex(0);
    setCurrentStep("form");
    setCurrentItemValidated(false);
  };

  const renderItemForm = () => {
    const currentItem = decorationItems[currentItemIndex];

    if (!currentItem) {
      return (
        <div className="flex justify-center items-center p-8">
          <Button
            type="button"
            onClick={addNewItem}
            variant="outline"
            className="gap-2 rounded-md"
          >
            <Plus className="w-4 h-4" />
            Thêm trang trí mới
          </Button>
        </div>
      );
    }

    const itemType = data?.ingredientType || "Default";

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              {currentItemIndex + 1} / {decorationItems.length}
            </Badge>
            <h3 className="text-sm font-medium">
              Trang trí #{currentItemIndex + 1}
            </h3>
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={goToPrevItem}
              disabled={currentItemIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={goToNextItem}
              disabled={currentItemIndex === decorationItems.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8 ml-1"
              onClick={removeCurrentItem}
              disabled={decorationItems.length <= 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Name Field */}
          <div className="space-y-1.5">
            <FormLabel className="flex items-center gap-2 text-sm">
              <CakeSlice className="w-4 h-4 text-primary" />
              Tên trang trí
            </FormLabel>
            <Input
              placeholder="Nhập tên"
              value={currentItem.name || ""}
              onChange={(e) => updateCurrentItem("name", e.target.value)}
              className="rounded-md h-9"
            />
            {!currentItem.name || currentItem.name.length < 2 ? (
              <p className="text-xs text-red-500">Tối thiểu 2 ký tự</p>
            ) : null}
          </div>

          {/* Price Field */}
          <div className="space-y-1.5">
            <FormLabel className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-primary" />
              Giá
            </FormLabel>
            <Input
              type="number"
              placeholder="Nhập giá"
              value={currentItem.price}
              onChange={(e) =>
                updateCurrentItem("price", parseFloat(e.target.value) || 0)
              }
              className="rounded-md h-9"
            />
            {currentItem.price < 0 ? (
              <p className="text-xs text-red-500">Giá không hợp lệ</p>
            ) : null}
          </div>

          {/* Color Field */}
          <div className="space-y-1.5">
            <FormLabel className="flex items-center gap-2 text-sm text-gray-700">
              <Palette className="w-4 h-4 text-purple-500" />
              Màu sắc
            </FormLabel>
            <Popover
              open={currentColorPopover}
              onOpenChange={setCurrentColorPopover}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between rounded-xl h-10 border-gray-300 hover:bg-transparent"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: currentItem.color?.hex || "#FFFFFF",
                      }}
                    />
                    {currentItem.color?.name || "White"} (
                    {currentItem.color?.hex || "#FFFFFF"})
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[300px]">
                <Command>
                  <CommandInput placeholder="Tìm màu..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy màu.</CommandEmpty>
                    <CommandGroup>
                      {COLOR_OPTIONS.map((color) => (
                        <CommandItem
                          key={color.hex}
                          value={color.name}
                          onSelect={() => {
                            updateCurrentItem("color", color);
                            setCurrentColorPopover(false);
                          }}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div
                              className="w-5 h-5 rounded-full border border-gray-200"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span className="text-sm">
                              {color.name} ({color.hex})
                            </span>
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              color.hex === currentItem.color?.hex
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Type Field */}
          <div className="space-y-1.5">
            <FormLabel className="flex items-center gap-2 text-sm">
              <CakeSlice className="w-4 h-4 text-primary" />
              Loại trang trí
            </FormLabel>
            <Select
              value={itemType}
              onValueChange={(value) => updateCurrentItem("type", value)}
            >
              <SelectTrigger className="rounded-md h-9">
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={itemType}>{itemType}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description Field */}
        <div className="mt-4 space-y-1.5">
          <FormLabel className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-primary" />
            Mô tả
          </FormLabel>
          <textarea
            placeholder="Nhập mô tả"
            value={currentItem.description || ""}
            onChange={(e) => updateCurrentItem("description", e.target.value)}
            className="w-full rounded-md border p-2 text-sm min-h-[80px]"
          />
        </div>
      </div>
    );
  };

  // Render the summary view
  const renderSummary = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">
            Danh sách trang trí ({decorationItems.length})
          </h3>
          <Button variant="outline" size="sm" onClick={() => backToForm()}>
            Chỉnh sửa
          </Button>
        </div>

        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {decorationItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => backToForm(index)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: item.color?.hex || "#FFFFFF" }}
                  />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">
                      {item.type} -{" "}
                      {new Intl.NumberFormat("vi-VN").format(item.price)}đ
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  };

  return (
    <Dialog open={isOpenModal} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl rounded-xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <CakeSlice className="w-6 h-6" />
            {currentStep === "form"
              ? "Thêm Trang Trí"
              : "Xác nhận Thêm Trang Trí"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {currentStep === "form" ? renderItemForm() : renderSummary()}

            <div className="flex flex-col gap-2 pt-4">
              {currentStep === "form" && (
                <>
                  <div className="flex gap-2 w-full">
                    <Button
                      type="button"
                      onClick={addNewItem}
                      variant="outline"
                      className="gap-2 rounded-md flex-1"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm trang trí mới
                    </Button>
                    <Button
                      type="button"
                      onClick={goToSummary}
                      disabled={!currentItemValidated}
                      className="gap-2 rounded-md flex-1"
                    >
                      <ListFilter className="w-4 h-4" />
                      Xem danh sách ({decorationItems.length})
                    </Button>
                  </div>
                </>
              )}

              {currentStep === "summary" && (
                <Button
                  type="submit"
                  className="w-full rounded-md h-10"
                  disabled={isPending || decorationItems.length === 0}
                >
                  {isPending
                    ? "Đang xử lý..."
                    : `Xác nhận thêm ${decorationItems.length} trang trí`}
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="rounded-md h-9 w-full"
              >
                Hủy bỏ
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionCakeDecorationModal;
