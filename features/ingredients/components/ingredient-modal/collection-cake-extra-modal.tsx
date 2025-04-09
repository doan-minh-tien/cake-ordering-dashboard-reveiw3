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
  Loader,
  ImagePlus,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Form, FormLabel } from "@/components/ui/form";

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
import { createCakeExtraOption } from "../../actions/cake-extra-option-action";
import {
  getCakeImageById,
  uploadCakeImage,
} from "../../../cakes/actions/cake-image-action";
import { Checkbox } from "@/components/ui/checkbox";

// Tên hiển thị tiếng Việt cho các loại tùy chọn thêm
const getTypeDisplayName = (type: string): string => {
  const typeNameMap: Record<string, string> = {
    Candles: "Nến",
    CakeBoard: "Đế Bánh",
  };

  return typeNameMap[type] || type;
};

const cakeExtraItemSchema = z.object({
  name: z.string().min(2, { message: "Tối thiểu 2 ký tự" }),
  price: z.coerce.number().min(0, { message: "Giá không hợp lệ" }),
  color: z.object({
    displayName: z.string(),
    name: z.string(),
    hex: z.string(),
  }),
  description: z.string().optional(),
  type: z.string().min(1, { message: "Chọn loại tùy chọn thêm" }),
  is_default: z.boolean().default(false),
  image_id: z.string().optional(),
});

const collectionSchema = z.object({
  extras: z
    .array(cakeExtraItemSchema)
    .min(1, { message: "Thêm ít nhất 1 tùy chọn thêm" }),
});

const CollectionCakeExtraModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isOpenModal = isOpen && type === "collectionCakeExtraOptionModal";
  const [isPending, startTransition] = useTransition();
  const { COLOR_OPTIONS, getColorValue } = useColorSelection();
  const [extraItems, setExtraItems] = useState<
    z.infer<typeof cakeExtraItemSchema>[]
  >([]);
  const [currentColorPopover, setCurrentColorPopover] =
    useState<boolean>(false);

  // State for pagination
  const [currentStep, setCurrentStep] = useState("form"); // "form", "summary"
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [currentItemValidated, setCurrentItemValidated] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [allItemsValid, setAllItemsValid] = useState(false);

  // Image handling states
  const [imageLoading, setImageLoading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fetchingImage, setFetchingImage] = useState(false);

  const form = useForm<z.infer<typeof collectionSchema>>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      extras: [],
    },
  });

  // Create a new empty extra item
  const createEmptyItem = () => {
    // Kiểm tra data.ingredientType có tồn tại không
    const itemType = data?.ingredientType || "Default";

    return {
      name: "",
      price: 0,
      color: getColorValue("White"),
      description: "",
      type: itemType,
      is_default: false,
      image_id: "",
    };
  };

  // Initialize with one empty item when the modal opens
  useEffect(() => {
    if (isOpenModal && extraItems.length === 0) {
      const newItem = createEmptyItem();
      setExtraItems([newItem]);
      form.setValue("extras", [newItem]);
    }
  }, [isOpenModal]);

  // Reset image states when changing items
  useEffect(() => {
    const currentItem = extraItems[currentItemIndex];
    if (currentItem) {
      // Reset các state hình ảnh
      setUploadedFileUrl(null);
      setImagePreview(null);

      // Nếu item có image_id, fetch hình ảnh
      if (currentItem.image_id) {
        console.log("Fetching image for id:", currentItem.image_id);
        fetchImage(currentItem.image_id);
      }
    }
  }, [currentItemIndex, extraItems]);

  // Fetch image function
  const fetchImage = async (imageId: string) => {
    if (!imageId) return;

    try {
      setFetchingImage(true);
      const result = await getCakeImageById(imageId);
      console.log("Fetch image result:", result);

      if (result.success && result.data) {
        // Trực tiếp lấy file_url từ kết quả API
        setUploadedFileUrl(result.data.file_url);
        console.log("Fetched image URL:", result.data.file_url);
      }
    } catch (error) {
      console.error("Failed to fetch image:", error);
    } finally {
      setFetchingImage(false);
    }
  };

  // Image upload handling
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageLoading(true);

      // Tạo preview tạm thời
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      const base64 = await convertFileToBase64(file);

      // Gọi API upload hình ảnh
      const result = await uploadCakeImage(base64, file.name, file.type);
      console.log("Upload result:", result);

      if (!result.success) {
        toast.error(result.error || "Failed to upload image");
        return;
      }

      // Lưu URL từ kết quả API
      setUploadedFileUrl(result.data.file_url);
      console.log("Uploaded image URL:", result.data.file_url);

      // Cập nhật image_id cho item hiện tại
      updateCurrentItem("image_id", result.data.id);

      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error("Failed to upload image");
      console.error("Image upload error:", error);
    } finally {
      setImageLoading(false);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Validate the current item
  const validateCurrentItem = () => {
    const currentItem = extraItems[currentItemIndex];

    // Check if currentItem exists
    if (!currentItem) {
      setCurrentItemValidated(false);
      return false;
    }

    // Validate all required fields with detailed checks
    const nameValid = currentItem.name && currentItem.name.length >= 2;
    const priceValid =
      typeof currentItem.price === "number" && currentItem.price >= 0;
    const colorValid = !!currentItem.color && !!currentItem.color.name;
    const typeValid = !!currentItem.type && currentItem.type.length >= 1;

    // Get validation results
    const validationResults = {
      nameValid,
      priceValid,
      colorValid,
      typeValid,
      allValid: nameValid && priceValid && colorValid && typeValid,
    };

    setCurrentItemValidated(!!validationResults.allValid);
    return !!validationResults.allValid;
  };

  // Validate all items
  const validateAllItems = () => {
    if (extraItems.length === 0) {
      setAllItemsValid(false);
      return false;
    }

    const allValid = extraItems.every((item) => {
      const nameValid = item.name && item.name.length >= 2;
      const priceValid = typeof item.price === "number" && item.price >= 0;
      const colorValid = !!item.color && !!item.color.name;
      const typeValid = !!item.type && item.type.length >= 1;

      return nameValid && priceValid && colorValid && typeValid;
    });

    setAllItemsValid(allValid);
    return allValid;
  };

  useEffect(() => {
    validateCurrentItem();
    validateAllItems();
  }, [extraItems, currentItemIndex]);

  // Add a new item to the list and navigate to it
  const addNewItem = () => {
    const newItem = createEmptyItem();
    const newItems = [...extraItems, newItem];
    setExtraItems(newItems);
    form.setValue("extras", newItems);
    setCurrentItemIndex(newItems.length - 1);
    resetTouchedFields();
  };

  // Remove the current item
  const removeCurrentItem = () => {
    if (extraItems.length <= 1) return;

    const updatedItems = extraItems.filter((_, i) => i !== currentItemIndex);
    setExtraItems(updatedItems);
    form.setValue("extras", updatedItems);

    if (currentItemIndex >= updatedItems.length) {
      setCurrentItemIndex(updatedItems.length - 1);
    }
  };

  const updateCurrentItem = (field: string, value: any) => {
    const updatedItems = [...extraItems];
    if (updatedItems[currentItemIndex]) {
      updatedItems[currentItemIndex] = {
        ...updatedItems[currentItemIndex],
        [field]: value,
      };
      setExtraItems(updatedItems);
      form.setValue("extras", updatedItems);

      // Đánh dấu trường đã được tương tác
      setTouchedFields((prev) => ({
        ...prev,
        [field]: true,
      }));
    }
  };

  // Hàm kiểm tra xem field đã được tương tác chưa
  const isFieldTouched = (field: string) => {
    return touchedFields[field] === true;
  };

  // Reset touched fields khi thêm item mới hoặc chuyển item
  const resetTouchedFields = () => {
    setTouchedFields({});
  };

  const goToPrevItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
      resetTouchedFields();
    }
  };

  const goToNextItem = () => {
    if (currentItemIndex < extraItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      resetTouchedFields();
    }
  };

  const goToSummary = () => {
    if (extraItems.length > 0) {
      // Validate all items before proceeding to summary
      if (validateAllItems()) {
        setCurrentStep("summary");
      } else {
        toast.error("Vui lòng điền đầy đủ thông tin cho tất cả tùy chọn thêm");
      }
    }
  };

  const backToForm = (index: number = currentItemIndex) => {
    setCurrentStep("form");
    setCurrentItemIndex(index);
  };

  const onSubmit = async (values: z.infer<typeof collectionSchema>) => {
    try {
      // Format the data for API submission
      const formattedItems = values.extras.map((item) => ({
        ...item,
        color: item.color.name,
      }));

      console.log("Submitted items:", formattedItems);

      startTransition(async () => {
        const result = await createCakeExtraOption(formattedItems);
        if (!result.success) {
          toast.error(result.error);
          return;
        } else {
          toast.success(
            `Đã thêm ${formattedItems.length} tùy chọn thêm thành công!`
          );
        }

        handleClose();
      });
    } catch (error) {
      console.error("Error processing cake extras:", error);
      toast.error("Có lỗi xảy ra khi xử lý tùy chọn thêm");
    }
  };

  const handleClose = () => {
    onClose();
    setExtraItems([]);
    setCurrentItemIndex(0);
    setCurrentStep("form");
    setCurrentItemValidated(false);
    setUploadedFileUrl(null);
    setImagePreview(null);
  };

  // Get selected color object based on name
  const getSelectedColor = (colorName: string) => {
    return COLOR_OPTIONS.find((color) => color.name === colorName) || null;
  };

  const renderItemForm = () => {
    const currentItem = extraItems[currentItemIndex];

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
            Thêm tùy chọn mới
          </Button>
        </div>
      );
    }

    const itemType = data?.ingredientType || "Default";

    // Run validation for field-specific error messages
    const validation = {
      nameValid: currentItem.name && currentItem.name.length >= 2,
      priceValid:
        typeof currentItem.price === "number" && currentItem.price >= 0,
      colorValid: !!currentItem.color && !!currentItem.color.name,
      typeValid: !!currentItem.type && currentItem.type.length >= 1,
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              {currentItemIndex + 1} / {extraItems.length}
            </Badge>
            <h3 className="text-sm font-medium">
              Tùy chọn thêm #{currentItemIndex + 1}
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
              disabled={currentItemIndex === extraItems.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8 ml-1"
              onClick={removeCurrentItem}
              disabled={extraItems.length <= 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex space-x-2">
          {/* Image Upload Field */}
          <div className="col-span-2">
            <FormLabel className="flex items-center gap-2 text-sm">
              Hình Ảnh Tùy Chọn
            </FormLabel>
            <div className="flex flex-col gap-3">
              <div className="relative w-full h-40 border rounded-md border-dashed flex items-center justify-center bg-gray-50/50 group">
                {imageLoading || fetchingImage ? (
                  <div className="flex items-center justify-center">
                    <Loader className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : uploadedFileUrl ? (
                  <Image
                    src={uploadedFileUrl}
                    alt="Extra option preview"
                    fill
                    className="object-contain p-2"
                  />
                ) : imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Extra option preview"
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 text-center px-2">
                    <ImagePlus className="h-8 w-8 mb-1" />
                    <p className="text-xs">Upload extra option image</p>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      document
                        .getElementById(
                          `extra-image-upload-${currentItemIndex}`
                        )
                        ?.click()
                    }
                    disabled={imageLoading || fetchingImage}
                    className="text-xs"
                  >
                    {imageLoading ? "Uploading..." : "Change Image"}
                  </Button>
                </div>
              </div>

              <Input
                type="file"
                accept="image/*"
                id={`extra-image-upload-${currentItemIndex}`}
                className="hidden"
                onChange={handleImageUpload}
                disabled={imageLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Name Field */}
            <div className="space-y-1.5">
              <FormLabel className="flex items-center gap-2 text-sm">
                <CakeSlice className="w-4 h-4 text-primary" />
                Tên tùy chọn <span className="text-red-500">*</span>
              </FormLabel>
              <Input
                placeholder="Nhập tên"
                value={currentItem.name || ""}
                onChange={(e) => updateCurrentItem("name", e.target.value)}
                onBlur={() =>
                  setTouchedFields((prev) => ({ ...prev, name: true }))
                }
                className={cn(
                  "rounded-md h-9",
                  isFieldTouched("name") &&
                    !validation.nameValid &&
                    "border-red-500"
                )}
              />
              {isFieldTouched("name") && !validation.nameValid && (
                <p className="text-xs text-red-500">Tối thiểu 2 ký tự</p>
              )}
            </div>

            <div className="flex justify-between space-x-2">
              {/* Price Field */}
              <div className="space-y-1.5">
                <FormLabel className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-primary" />
                  Giá <span className="text-red-500">*</span>
                </FormLabel>
                <Input
                  type="number"
                  placeholder="Nhập giá"
                  value={currentItem.price}
                  onChange={(e) =>
                    updateCurrentItem("price", parseFloat(e.target.value) || 0)
                  }
                  onBlur={() =>
                    setTouchedFields((prev) => ({ ...prev, price: true }))
                  }
                  className={cn(
                    "rounded-md h-9",
                    isFieldTouched("price") &&
                      !validation.priceValid &&
                      "border-red-500"
                  )}
                />
                {isFieldTouched("price") && !validation.priceValid && (
                  <p className="text-xs text-red-500">Giá không hợp lệ</p>
                )}
              </div>

              {/* Color Field */}
              <div className="space-y-1.5">
                <FormLabel className="flex items-center gap-2 text-sm text-gray-700">
                  <Palette className="w-4 h-4 text-purple-500" />
                  Màu sắc <span className="text-red-500">*</span>
                </FormLabel>
                <Popover
                  open={currentColorPopover}
                  onOpenChange={(open) => {
                    setCurrentColorPopover(open);
                    if (!open) {
                      setTouchedFields((prev) => ({ ...prev, color: true }));
                    }
                  }}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between rounded-xl h-10  hover:bg-transparent",
                        isFieldTouched("color") &&
                          !validation.colorValid &&
                          "border-red-500"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor:
                              currentItem.color?.hex || "#FFFFFF",
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
                {isFieldTouched("color") && !validation.colorValid && (
                  <p className="text-xs text-red-500">Vui lòng chọn màu sắc</p>
                )}
              </div>
            </div>

            {/* Type Field */}
            <div className="space-y-1.5">
              <FormLabel className="flex items-center gap-2 text-sm">
                <CakeSlice className="w-4 h-4 text-primary" />
                Loại tùy chọn <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                value={itemType}
                onValueChange={(value) => {
                  updateCurrentItem("type", value);
                  setTouchedFields((prev) => ({ ...prev, type: true }));
                }}
                onOpenChange={(open) => {
                  if (!open) {
                    setTouchedFields((prev) => ({ ...prev, type: true }));
                  }
                }}
              >
                <SelectTrigger
                  className={cn(
                    "rounded-md h-9",
                    isFieldTouched("type") &&
                      !validation.typeValid &&
                      "border-red-500"
                  )}
                >
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={itemType}>{itemType}</SelectItem>
                </SelectContent>
              </Select>
              {isFieldTouched("type") && !validation.typeValid && (
                <p className="text-xs text-red-500">
                  Vui lòng chọn loại tùy chọn
                </p>
              )}
            </div>

            {/* Is Default Checkbox */}
            <div className="col-span-2">
              <div className="flex flex-row items-start space-x-3 space-y-0 p-2">
                <Checkbox
                  checked={currentItem.is_default || false}
                  onCheckedChange={(checked) =>
                    updateCurrentItem("is_default", !!checked)
                  }
                />
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm">Đặt làm mặc định</FormLabel>
                </div>
              </div>
            </div>
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
            Danh sách tùy chọn thêm ({extraItems.length})
          </h3>
          <Button variant="outline" size="sm" onClick={() => backToForm()}>
            Chỉnh sửa
          </Button>
        </div>

        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {extraItems.map((item, index) => {
              const isItemValid =
                item.name &&
                item.name.length >= 2 &&
                typeof item.price === "number" &&
                item.price >= 0 &&
                !!item.color &&
                !!item.color.name &&
                !!item.type &&
                item.type.length >= 1;

              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer",
                    !isItemValid && "border-red-500 bg-red-50"
                  )}
                  onClick={() => backToForm(index)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: item.color?.hex || "#FFFFFF" }}
                    />
                    <div>
                      <div className="font-medium">
                        {item.name || "Chưa có tên"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getTypeDisplayName(item.type)} -{" "}
                        {new Intl.NumberFormat("vi-VN").format(item.price)}đ
                        {item.is_default && " - Mặc định"}
                      </div>
                    </div>
                  </div>
                  {!isItemValid && (
                    <Badge variant="destructive" className="mr-2">
                      Thiếu thông tin
                    </Badge>
                  )}
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              );
            })}
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
              ? "Thêm Tùy Chọn Thêm"
              : "Xác nhận Thêm Tùy Chọn Thêm"}
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
                      Thêm tùy chọn thêm mới
                    </Button>
                    <Button
                      type="button"
                      onClick={goToSummary}
                      disabled={!currentItemValidated}
                      className="gap-2 rounded-md flex-1"
                    >
                      <ListFilter className="w-4 h-4" />
                      Xem danh sách ({extraItems.length})
                    </Button>
                  </div>
                </>
              )}

              {currentStep === "summary" && (
                <Button
                  type="submit"
                  className="w-full rounded-md h-10"
                  disabled={
                    isPending || extraItems.length === 0 || !allItemsValid
                  }
                >
                  {isPending
                    ? "Đang xử lý..."
                    : !allItemsValid
                    ? "Một số tùy chọn thêm chưa hoàn thành"
                    : `Xác nhận thêm ${extraItems.length} tùy chọn thêm`}
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

export default CollectionCakeExtraModal;
