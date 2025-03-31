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
import { updateCakeDecoration } from "../../actions/cake-decoration-action";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  getCakeImageById,
  uploadCakeImage,
} from "../../../cakes/actions/cake-image-action";

const TYPE_OPTIONS = [
  "Sprinkles",
  "Decoration",
  "Bling",
  "TallSkirt",
  "Drip",
  "ShortSkirt",
];

const cakeDecorationSchema = z.object({
  name: z.string().min(2, { message: "Tối thiểu 2 ký tự" }),
  price: z.coerce.number().min(0, { message: "Giá không hợp lệ" }),
  color: z.string().min(1, { message: "Chọn màu sắc" }),
  is_default: z.boolean().default(false),
  description: z.string().optional(),
  image_id: z.string().optional(),
  type: z.string().min(1, { message: "Chọn loại trang trí" }),
});

const CakeDecorationModal = () => {
  const { data, isOpen, onClose, type } = useModal();
  const isOpenModal = isOpen && type === "cakeDecorationModal";
  const [isPending, startTransition] = useTransition();
  const [colorPopoverOpen, setColorPopoverOpen] = React.useState(false);
  const { COLOR_OPTIONS, getColorValue } = useColorSelection(
    data?.cakeDecoration?.color
  );

  // Image handling states
  const [imageLoading, setImageLoading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fetchingImage, setFetchingImage] = useState(false);

  const form = useForm<z.infer<typeof cakeDecorationSchema>>({
    resolver: zodResolver(cakeDecorationSchema),
    defaultValues: {
      name: data?.cakeDecoration?.name || "",
      price: data?.cakeDecoration?.price || 0,
      color: data?.cakeDecoration?.color || "",
      is_default: data?.cakeDecoration?.is_default || false,
      description: data?.cakeDecoration?.description || "",
      image_id: data?.cakeDecoration?.image_id || "",
      type: data?.cakeDecoration?.type || "",
    },
  });

  // Set image URL from image object if available
  useEffect(() => {
    if (data?.cakeDecoration?.image && data.cakeDecoration.image.file_url) {
      setUploadedFileUrl(data.cakeDecoration.image.file_url);
    } else if (data?.cakeDecoration?.image_id && !data?.cakeDecoration?.image) {
      // Only fetch if we have image_id but no image object
      fetchImage();
    } else {
      // Reset images if neither is available
      setUploadedFileUrl(null);
      setImagePreview(null);
    }
  }, [isOpenModal, data?.cakeDecoration]);

  // Fetch image function (now separate from useEffect)
  const fetchImage = async () => {
    if (!data?.cakeDecoration?.image_id) return;

    try {
      setFetchingImage(true);
      const result = await getCakeImageById(data.cakeDecoration.image_id);
      if (result.success && result.data) {
        setUploadedFileUrl(result.data.file_url);
      }
    } catch (error) {
      console.error("Failed to fetch image:", error);
    } finally {
      setFetchingImage(false);
    }
  };

  useEffect(() => {
    if (data?.cakeDecoration) {
      form.reset({
        name: data.cakeDecoration.name || "",
        price: data.cakeDecoration.price || 0,
        color: data.cakeDecoration.color || "",
        is_default: data.cakeDecoration.is_default || false,
        description: data.cakeDecoration.description || "",
        image_id: data.cakeDecoration.image_id || "",
        type: data.cakeDecoration.type || "",
      });
    }
  }, [data, form]);

  // Image upload handling
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageLoading(true);

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      const base64 = await convertFileToBase64(file);

      const result = await uploadCakeImage(base64, file.name, file.type);

      if (!result.success) {
        toast.error(result.error || "Failed to upload image");
        return;
      }

      setUploadedFileUrl(result.data.file_url);
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

  const onSubmit = async (values: z.infer<typeof cakeDecorationSchema>) => {
    try {
      startTransition(async () => {
        const result = await updateCakeDecoration(
          values,
          data?.cakeDecoration?.id!
        );
        if (!result.success) {
          toast.error(result.error);
        } else {
          toast.success("Cập nhật decoration thành công !");
          onClose();
        }
      });
    } catch (error) {
      console.error("Error updating cake decoration:", error);
    }
  };

  // Get selected color object based on name
  const getSelectedColor = (colorName: string) => {
    return COLOR_OPTIONS.find((color) => color.name === colorName) || null;
  };

  const selectedColor = getSelectedColor(form.watch("color"));

  return (
    <Dialog open={isOpenModal} onOpenChange={onClose}>
      <DialogContent className="max-w-xl rounded-xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <CakeSlice className="w-6 h-6" />
            Cập Nhật Trang Trí
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Image Upload Field */}
              <FormField
                control={form.control}
                name="image_id"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="flex items-center gap-2 text-sm">
                      Hình Ảnh Trang Trí
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-3">
                        <div className="relative w-full h-40 border rounded-md border-dashed flex items-center justify-center bg-gray-50/50 group">
                          {imageLoading || fetchingImage ? (
                            <div className="flex items-center justify-center">
                              <Loader className="h-6 w-6 animate-spin text-primary" />
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
                              <ImagePlus className="h-8 w-8 mb-1" />
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
                                  .getElementById("decoration-image-upload")
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
                          id="decoration-image-upload"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={imageLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm">
                      <CakeSlice className="w-4 h-4 text-primary" />
                      Tên trang trí
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên"
                        {...field}
                        className="rounded-md h-9"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="flex justify-between gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="flex items-center  gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-primary" />
                        Giá
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Nhập giá"
                          {...field}
                          className="rounded-md h-9"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="flex items-center gap-2 text-sm text-gray-700">
                        <Palette className="w-4 h-4 text-purple-500" />
                        Màu sắc
                      </FormLabel>
                      <Popover
                        open={colorPopoverOpen}
                        onOpenChange={setColorPopoverOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between rounded-xl h-10 hover:bg-transparent",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                {selectedColor && (
                                  <div
                                    className="w-4 h-4 rounded-full"
                                    style={{
                                      backgroundColor: selectedColor.hex,
                                    }}
                                  />
                                )}
                                {selectedColor
                                  ? selectedColor.displayName
                                  : "Chọn màu sắc"}
                              </div>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-[300px]">
                          <Command>
                            <CommandInput
                              placeholder="Tìm màu..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>Không tìm thấy màu.</CommandEmpty>
                              <CommandGroup>
                                {COLOR_OPTIONS.map((color) => (
                                  <CommandItem
                                    key={color.hex}
                                    value={color.name}
                                    onSelect={() => {
                                      form.setValue("color", color.name);
                                      setColorPopoverOpen(false);
                                    }}
                                  >
                                    <div className="flex items-center gap-3 w-full">
                                      <div
                                        className="w-5 h-5 rounded-full border border-gray-200"
                                        style={{ backgroundColor: color.hex }}
                                      />
                                      <span className="text-sm">
                                        {color.displayName}
                                      </span>
                                    </div>
                                    <Check
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        color.name === field.value
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
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm">
                      <CakeSlice className="w-4 h-4 text-primary" />
                      Loại trang trí
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-md h-9" disabled={true}>
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem key={data?.cakeDecoration?.type} value={data?.cakeDecoration?.type!}>
                          {data?.cakeDecoration?.type}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_default"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm">
                        Đặt làm mặc định
                      </FormLabel>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-primary" />
                    Mô tả
                  </FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Nhập mô tả"
                      {...field}
                      className="w-full rounded-md border p-2 text-sm min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-md h-9"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                className="rounded-md h-9"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center gap-1.5">
                    <Loader className="h-3 w-3 animate-spin" />
                    <span>Đang lưu...</span>
                  </div>
                ) : (
                  "Cập Nhật"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CakeDecorationModal;
