"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  PlusCircle, 
  CakeSlice, 
  Check, 
  Tags,  
  Palette,
  DollarSign,
  FileText,
  ChevronsUpDown,
  ImagePlus,
  Loader 
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useColorSelection } from "@/hooks/use-color";
import { cn } from "@/lib/utils";
import { createCakeDecoration } from "../../actions/cake-decoration-action";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { uploadCakeImage } from "../../../cakes/actions/cake-image-action";

// Predefined type mapping - used just for display/selection
const PREDEFINED_TYPES: Record<string, string> = {
  Sprinkles: "Hạt Rắc",
  Decoration: "Trang Trí",
  Bling: "Đồ Trang Trí Lấp Lánh",
  TallSkirt: "Phần Kem Phía Trên",
  Drip: "Sốt Kem",
  ShortSkirt: "Phần Kem Phía Dưới",
};

// Form schema for creating a new ingredient type
const formSchema = z.object({
  type: z.string().min(2, { message: "Tối thiểu 2 ký tự" }),
  name: z.string().min(2, { message: "Tối thiểu 2 ký tự" }).optional(),
  price: z.coerce.number().min(0, { message: "Giá không hợp lệ" }).optional(),
  color: z.object({
    displayName: z.string(),
    name: z.string(),
    hex: z.string(),
  }).optional(),
  description: z.string().optional(),
  is_default: z.boolean().default(false),
  image_id: z.string().optional(),
});

const CreateIngredientTypeModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isOpenModal = isOpen && type === "createIngredientTypeModal";
  const [isPending, startTransition] = useTransition();
  const [selectedPredefinedType, setSelectedPredefinedType] = useState<string | null>(null);
  const existingTypes = data?.existingTypes || [];
  const { COLOR_OPTIONS, getColorValue } = useColorSelection();
  const [currentColorPopover, setCurrentColorPopover] = useState<boolean>(false);

  // Image handling states
  const [imageLoading, setImageLoading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      name: "",
      price: 0,
      description: "",
      is_default: false,
      color: getColorValue("White")
    },
  });

  // Reset form and image states when modal closes or changes
  const resetForm = () => {
    form.reset({
      type: "",
      name: "",
      price: 0,
      description: "",
      is_default: false,
      color: getColorValue("White")
    });
    setSelectedPredefinedType(null);
    setUploadedFileUrl(null);
    setImagePreview(null);
  };

  // Effect to reset states when the modal closes
  useEffect(() => {
    if (!isOpenModal) {
      resetForm();
    }
  }, [isOpenModal]);

  // Get missing predefined types
  const missingPredefinedTypes = Object.keys(PREDEFINED_TYPES).filter(
    typeKey => !existingTypes.includes(typeKey)
  );

  // Select a predefined type
  const handleSelectPredefinedType = (typeKey: string) => {
    setSelectedPredefinedType(typeKey);
    form.setValue("type", typeKey);
  };

  // Image upload handling
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageLoading(true);

      // Create temporary preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      const base64 = await convertFileToBase64(file);

      // Call API to upload image
      const result = await uploadCakeImage(base64, file.name, file.type);
      
      if (!result.success) {
        toast.error(result.error || "Failed to upload image");
        return;
      }

      // Save URL from API result
      setUploadedFileUrl(result.data.file_url);
      
      // Update image_id in form
      form.setValue("image_id", result.data.id);

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

  // Form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      startTransition(async () => {
        // Create the data object based on form values
        const submitData: any = {
          type: values.type,
          name: values.name,
          price: values.price,
          color: values.color?.name,
          description: values.description,
          is_default: values.is_default,
          image_id: values.image_id,
        };

        // Wrap the data in an array to match the collection modal implementation
        const formattedItems = [submitData];

        // Call the API
        const result = await createCakeDecoration(formattedItems);

        if (result.success) {
          toast.success("Đã tạo loại trang trí mới thành công");
          handleClose();
        } else {
          toast.error(result.error || "Có lỗi xảy ra");
        }
      });
    } catch (error) {
      console.error("Error creating ingredient type:", error);
      toast.error("Có lỗi xảy ra khi tạo loại trang trí");
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Dialog open={isOpenModal} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-xl overflow-y-auto max-h-[85vh]">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <CakeSlice className="w-5 h-5 text-amber-600" />
            Thêm Loại Trang Trí
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Predefined Types Selection */}
            {missingPredefinedTypes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tags className="h-4 w-4 text-amber-600" />
                  <h3 className="text-sm font-medium">Chọn loại trang trí</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {missingPredefinedTypes.map((typeKey) => (
                    <div 
                      key={typeKey}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors border",
                        selectedPredefinedType === typeKey 
                          ? "bg-amber-100 border-amber-300" 
                          : "hover:bg-amber-50 border-gray-200",
                      )}
                      onClick={() => handleSelectPredefinedType(typeKey)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{PREDEFINED_TYPES[typeKey]}</span>
                      </div>
                      {selectedPredefinedType === typeKey && (
                        <Check className="h-3.5 w-3.5 text-amber-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Type Field - either custom or selected from predefined */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs flex items-center gap-1">
                    <CakeSlice className="w-3.5 h-3.5 text-primary" />
                    Loại trang trí <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Tên loại trang trí (VD: Sprinkles)"
                      className="h-9 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Info Title */}
            <div className="pt-2 border-t">
              <h3 className="text-sm font-medium">Thông tin danh mục đầu tiên</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Tạo một danh mục mẫu cho loại trang trí này
              </p>
            </div>

            {/* Image Upload Field */}
            <div>
              <FormLabel className="flex items-center gap-2 text-xs mb-1">
                <ImagePlus className="w-3.5 h-3.5 text-primary" />
                Hình Ảnh
              </FormLabel>
              <div className="flex flex-col gap-2">
                <div className="relative w-full h-32 border rounded-md border-dashed flex items-center justify-center bg-gray-50/50 group">
                  {imageLoading ? (
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
                      <p className="text-xs">Tải ảnh lên</p>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        document
                          .getElementById("decoration-type-image-upload")
                          ?.click()
                      }
                      disabled={imageLoading}
                      className="text-xs h-7"
                    >
                      {imageLoading ? "Đang tải..." : "Chọn ảnh"}
                    </Button>
                  </div>
                </div>

                <Input
                  type="file"
                  accept="image/*"
                  id="decoration-type-image-upload"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={imageLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-xs">
                      <CakeSlice className="w-3.5 h-3.5 text-primary" />
                      Tên trang trí <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nhập tên"
                        className="rounded-md h-8 text-xs"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Price Field */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-xs">
                      <DollarSign className="w-3.5 h-3.5 text-primary" />
                      Giá <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Nhập giá"
                        className="rounded-md h-8 text-xs"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Color Field */}
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-xs text-gray-700">
                      <Palette className="w-3.5 h-3.5 text-purple-500" />
                      Màu sắc <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Popover
                        open={currentColorPopover}
                        onOpenChange={setCurrentColorPopover}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between rounded-md h-8 hover:bg-transparent text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{
                                  backgroundColor: field.value?.hex || "#FFFFFF",
                                }}
                              />
                              <span className="truncate text-xs">
                                {field.value?.name || "White"}
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
                                      form.setValue("color", color);
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
                                        color.hex === field.value?.hex
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
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Is Default Checkbox */}
              <FormField
                control={form.control}
                name="is_default"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0 mt-5">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-3.5 w-3.5"
                      />
                    </FormControl>
                    <div className="space-y-0.5 leading-none">
                      <FormLabel className="text-xs">Đặt làm mặc định</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-xs">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    Mô tả
                  </FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Nhập mô tả"
                      className="w-full rounded-md border p-2 text-xs min-h-[60px]"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                className="w-full rounded-md bg-amber-600 hover:bg-amber-700 text-white"
                disabled={isPending}
              >
                {isPending ? "Đang xử lý..." : "Tạo loại trang trí mới"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIngredientTypeModal; 