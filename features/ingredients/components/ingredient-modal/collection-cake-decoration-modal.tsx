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
import {
  getCakeImageById,
  uploadCakeImage,
} from "../../../cakes/actions/cake-image-action";
import { Checkbox } from "@/components/ui/checkbox";

// Tên hiển thị tiếng Việt cho các loại trang trí
const getTypeDisplayName = (type: string): string => {
  const typeNameMap: Record<string, string> = {
    Sprinkles: "Hạt Rắc",
    Decoration: "Trang Trí",
    Bling: "Đồ Trang Trí Lấp Lánh",
    TallSkirt: "Váy Bánh Cao",
    Drip: "Dòng Chảy",
    ShortSkirt: "Váy Bánh Ngắn",
  };

  return typeNameMap[type] || type;
};

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
  is_default: z.boolean().default(false),
  image_id: z.string().optional(),
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
      is_default: false,
      image_id: "",
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

  // Reset image states when changing items
  useEffect(() => {
    const currentItem = decorationItems[currentItemIndex];
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
  }, [currentItemIndex, decorationItems]);

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
    const currentItem = decorationItems[currentItemIndex];

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
    if (decorationItems.length === 0) {
      setAllItemsValid(false);
      return false;
    }

    const allValid = decorationItems.every((item) => {
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
  }, [decorationItems, currentItemIndex]);

  // Add a new item to the list and navigate to it
  const addNewItem = () => {
    const newItem = createEmptyItem();
    const newItems = [...decorationItems, newItem];
    setDecorationItems(newItems);
    form.setValue("decorations", newItems);
    setCurrentItemIndex(newItems.length - 1);
    resetTouchedFields();
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
    if (currentItemIndex < decorationItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      resetTouchedFields();
    }
  };

  const goToSummary = () => {
    if (decorationItems.length > 0) {
      // Validate all items before proceeding to summary
      if (validateAllItems()) {
        setCurrentStep("summary");
      } else {
        toast.error("Vui lòng điền đầy đủ thông tin cho tất cả trang trí");
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
    setUploadedFileUrl(null);
    setImagePreview(null);
  };

  // Get selected color object based on name
  const getSelectedColor = (colorName: string) => {
    return COLOR_OPTIONS.find((color) => color.name === colorName) || null;
  };

  const renderItemForm = () => {
    const currentItem = decorationItems[currentItemIndex];

    if (!currentItem) {
      return (
        <div className="flex justify-center items-center p-4">
          <Button
            type="button"
            onClick={addNewItem}
            variant="outline"
            className="gap-2 rounded-md h-8 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Thêm trang trí mới
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
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-2 py-0.5 text-xs">
              {currentItemIndex + 1} / {decorationItems.length}
            </Badge>
            <h3 className="text-xs font-medium">
              Trang trí #{currentItemIndex + 1}
            </h3>
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={goToPrevItem}
              disabled={currentItemIndex === 0}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={goToNextItem}
              disabled={currentItemIndex === decorationItems.length - 1}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-7 w-7 ml-1"
              onClick={removeCurrentItem}
              disabled={decorationItems.length <= 1}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Image Upload Field */}
        <div>
          <FormLabel className="flex items-center gap-2 text-xs mb-1">
            <ImagePlus className="w-3.5 h-3.5 text-primary" />
            Hình Ảnh Trang Trí
          </FormLabel>
          <div className="flex flex-col gap-2">
            <div className="relative w-full h-32 border rounded-md border-dashed flex items-center justify-center bg-gray-50/50 group">
              {imageLoading || fetchingImage ? (
                <div className="flex items-center justify-center">
                  <Loader className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : uploadedFileUrl ? (
                <Image
                  src={uploadedFileUrl}
                  alt="Decoration preview"
                  fill
                  className="object-contain p-2"
                />
              ) : imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Decoration preview"
                  fill
                  className="object-contain p-2"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 text-center px-2">
                  <ImagePlus className="h-6 w-6 mb-1" />
                  <p className="text-xs">Upload decoration image</p>
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
                        `decoration-image-upload-${currentItemIndex}`
                      )
                      ?.click()
                  }
                  disabled={imageLoading || fetchingImage}
                  className="text-xs h-7"
                >
                  {imageLoading ? "Uploading..." : "Change Image"}
                </Button>
              </div>
            </div>

            <Input
              type="file"
              accept="image/*"
              id={`decoration-image-upload-${currentItemIndex}`}
              className="hidden"
              onChange={handleImageUpload}
              disabled={imageLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Name Field */}
          <div className="space-y-1">
            <FormLabel className="flex items-center gap-2 text-xs">
              <CakeSlice className="w-3.5 h-3.5 text-primary" />
              Tên trang trí <span className="text-red-500">*</span>
            </FormLabel>
            <Input
              placeholder="Nhập tên"
              value={currentItem.name || ""}
              onChange={(e) => updateCurrentItem("name", e.target.value)}
              onBlur={() =>
                setTouchedFields((prev) => ({ ...prev, name: true }))
              }
              className={cn(
                "rounded-md h-8 text-xs",
                isFieldTouched("name") &&
                  !validation.nameValid &&
                  "border-red-500"
              )}
            />
            {isFieldTouched("name") && !validation.nameValid && (
              <p className="text-xs text-red-500">Tối thiểu 2 ký tự</p>
            )}
          </div>

          {/* Type Field */}
          <div className="space-y-1">
            <FormLabel className="flex items-center gap-2 text-xs">
              <CakeSlice className="w-3.5 h-3.5 text-primary" />
              Loại trang trí <span className="text-red-500">*</span>
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
                  "rounded-md h-8 text-xs",
                  isFieldTouched("type") &&
                    !validation.typeValid &&
                    "border-red-500"
                )}
              >
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={itemType} className="text-xs">
                  {getTypeDisplayName(itemType)}
                </SelectItem>
              </SelectContent>
            </Select>
            {isFieldTouched("type") && !validation.typeValid && (
              <p className="text-xs text-red-500">
                Vui lòng chọn loại trang trí
              </p>
            )}
          </div>

          {/* Price Field */}
          <div className="space-y-1">
            <FormLabel className="flex items-center gap-2 text-xs">
              <DollarSign className="w-3.5 h-3.5 text-primary" />
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
                "rounded-md h-8 text-xs",
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
          <div className="space-y-1">
            <FormLabel className="flex items-center gap-2 text-xs text-gray-700">
              <Palette className="w-3.5 h-3.5 text-purple-500" />
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
                    "w-full justify-between rounded-md h-8 hover:bg-transparent text-xs",
                    isFieldTouched("color") &&
                      !validation.colorValid &&
                      "border-red-500"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: currentItem.color?.hex || "#FFFFFF",
                      }}
                    />
                    <span className="truncate text-xs">
                      {currentItem.color?.name || "White"}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-1 h-3 w-3 flex-shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="p-0 w-[180px] shadow-md"
                align="center"
                side="bottom"
                sideOffset={4}
              >
                <Command className="max-h-[150px]">
                  <CommandInput
                    placeholder="Tìm màu..."
                    className="h-7 text-xs"
                  />
                  <CommandList className="max-h-[100px]">
                    <CommandEmpty>Không tìm thấy màu.</CommandEmpty>
                    <CommandGroup className="overflow-y-auto">
                      {COLOR_OPTIONS.map((color) => (
                        <CommandItem
                          key={color.name}
                          value={color.name}
                          onSelect={() => {
                            updateCurrentItem("color", color);
                            setCurrentColorPopover(false);
                          }}
                          className="flex items-center gap-2 cursor-pointer py-1 px-2 text-xs"
                        >
                          <div
                            className="w-3 h-3 rounded-full border border-gray-200 flex-shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="truncate">{color.displayName}</span>
                          <Check
                            className={cn(
                              "ml-auto h-3 w-3 flex-shrink-0",
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

        {/* Is Default Checkbox */}
        <div>
          <div className="flex flex-row items-start space-x-2 space-y-0 py-1">
            <Checkbox
              checked={currentItem.is_default || false}
              onCheckedChange={(checked) =>
                updateCurrentItem("is_default", !!checked)
              }
              className="h-3.5 w-3.5"
            />
            <div className="space-y-0.5 leading-none">
              <FormLabel className="text-xs">Đặt làm mặc định</FormLabel>
            </div>
          </div>
        </div>

        {/* Description Field */}
        <div className="space-y-1">
          <FormLabel className="flex items-center gap-2 text-xs">
            <FileText className="w-3.5 h-3.5 text-primary" />
            Mô tả
          </FormLabel>
          <textarea
            placeholder="Nhập mô tả"
            value={currentItem.description || ""}
            onChange={(e) => updateCurrentItem("description", e.target.value)}
            className="w-full rounded-md border p-2 text-xs min-h-[60px]"
          />
        </div>
      </div>
    );
  };

  // Render the summary view
  const renderSummary = () => {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">
            Danh sách trang trí ({decorationItems.length})
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => backToForm()}
            className="h-7 text-xs"
          >
            Chỉnh sửa
          </Button>
        </div>

        <ScrollArea className="h-[250px] pr-4">
          <div className="space-y-2">
            {decorationItems.map((item, index) => {
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
                    "flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 cursor-pointer",
                    !isItemValid && "border-red-500 bg-red-50"
                  )}
                  onClick={() => backToForm(index)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: item.color?.hex || "#FFFFFF" }}
                    />
                    <div>
                      <div className="text-sm font-medium">
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
                    <Badge
                      variant="destructive"
                      className="mr-2 text-[10px] px-1 py-0"
                    >
                      Thiếu thông tin
                    </Badge>
                  )}
                  <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
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
      <DialogContent className="max-w-xl max-h-[85vh] rounded-xl overflow-y-auto">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <CakeSlice className="w-5 h-5" />
            {currentStep === "form"
              ? "Thêm Trang Trí"
              : "Xác nhận Thêm Trang Trí"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {currentStep === "form" ? renderItemForm() : renderSummary()}

            <div className="flex flex-col gap-1.5 pt-2">
              {currentStep === "form" && (
                <>
                  <div className="flex gap-2 w-full">
                    <Button
                      type="button"
                      onClick={addNewItem}
                      variant="outline"
                      className="gap-2 rounded-md flex-1 h-8 text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Thêm trang trí mới
                    </Button>
                    <Button
                      type="button"
                      onClick={goToSummary}
                      disabled={!currentItemValidated}
                      className="gap-2 rounded-md flex-1 h-8 text-xs"
                    >
                      <ListFilter className="w-3.5 h-3.5" />
                      Xem danh sách ({decorationItems.length})
                    </Button>
                  </div>
                </>
              )}

              {currentStep === "summary" && (
                <Button
                  type="submit"
                  className="w-full rounded-md h-8 text-xs"
                  disabled={
                    isPending || decorationItems.length === 0 || !allItemsValid
                  }
                >
                  {isPending
                    ? "Đang xử lý..."
                    : !allItemsValid
                    ? "Một số trang trí chưa hoàn thành"
                    : `Xác nhận thêm ${decorationItems.length} trang trí`}
                </Button>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="rounded-md h-8 text-xs w-full"
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
