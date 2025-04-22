"use client";
import { z } from "zod";
import { ICake } from "../../types/cake";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useTransition } from "react";
import { updateCake, createCake } from "../../actions/cake-action";
import { toast } from "sonner";
import { uploadCakeImage } from "../../actions/cake-image-action";
import Image from "next/image";
import {
  Loader,
  ImagePlus,
  Cake,
  ShoppingCart,
  Award,
  Ruler,
  Users,
  Star,
  Check,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface CakeDetailFormProps {
  initialData: ICake | null;
}

const cakeSchema = z.object({
  available_cake_name: z.string().min(1, "Tên bánh không được bỏ trống"),
  available_cake_description: z.string().min(1, "Mô tả không được bỏ trống"),
  available_cake_price: z
    .number()
    .min(1000, "Giá phải từ 1.000đ trở lên")
    .max(100000000, "Giá không được vượt quá 100.000.000đ")
    .refine((val) => val % 100 === 0, {
      message: "Giá phải là bội số của 100đ",
    }),
  available_cake_quantity: z
    .number()
    .min(1, "Số lượng phải lớn hơn hoặc bằng 1"),
  quantity_default: z.number().default(0),
  available_cake_type: z.string().min(1, "Loại bánh không được bỏ trống"),
  available_cake_image_file_ids: z.array(z.string()).optional(),
  available_main_image_id: z.string().optional(),
  available_cake_size: z.string().optional().nullable(),
  available_cake_serving_size: z.string().optional().nullable(),
  has_low_shipping_fee: z.boolean().default(false),
  is_quality_guaranteed: z.boolean().default(false),
});

type cakeFormValue = z.infer<typeof cakeSchema>;

// Thêm hàm format số tiền
const formatCurrency = (value: number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const parseCurrency = (value: string): number => {
  return parseInt(value.replace(/\./g, "")) || 0;
};

const CakeDetailForm = ({ initialData }: CakeDetailFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Thêm state để quản lý giá trị hiển thị
  const [displayPrice, setDisplayPrice] = useState<string>(
    initialData ? formatCurrency(initialData.available_cake_price) : ""
  );

  const getMainImageUrl = (): string | null => {
    if (initialData?.available_cake_main_image) {
      return initialData.available_cake_main_image;
    }

    if (
      initialData?.available_main_image_id &&
      initialData?.available_cake_image_files?.length > 0
    ) {
      const mainImage = initialData.available_cake_image_files.find(
        (img) => img.id === initialData.available_main_image_id
      );
      return mainImage?.file_url || null;
    }

    return null;
  };

  const title = initialData ? "Chỉnh sửa thông tin bánh" : "Thêm bánh mới";
  const description = initialData
    ? "Chỉnh sửa thông tin chi tiết của bánh."
    : "Thêm một loại bánh mới vào danh mục của bạn.";
  const action = initialData ? "Lưu thay đổi" : "Tạo mới";
  const toastMessage = initialData
    ? "Cập nhật bánh thành công."
    : "Tạo bánh mới thành công.";

  const defaultValues = initialData
    ? {
        available_cake_name: initialData.available_cake_name,
        available_cake_description: initialData.available_cake_description,
        available_cake_price: initialData.available_cake_price,
        available_cake_quantity: initialData.available_cake_quantity,
        quantity_default: initialData.quantity_default || 0,
        available_cake_type: initialData.available_cake_type,
        available_cake_image_file_ids:
          initialData.available_cake_image_files?.map((img) => img.id) || [],
        available_main_image_id: initialData.available_main_image_id,
        available_cake_size: initialData.available_cake_size,
        available_cake_serving_size: initialData.available_cake_serving_size,
        has_low_shipping_fee: initialData.has_low_shipping_fee || false,
        is_quality_guaranteed: initialData.is_quality_guaranteed || false,
      }
    : {
        available_cake_name: "",
        available_cake_description: "",
        available_cake_price: 0,
        available_cake_quantity: 0,
        quantity_default: 0,
        available_cake_type: "",
        available_cake_image_file_ids: [],
        available_main_image_id: "",
        available_cake_size: "",
        available_cake_serving_size: "",
        has_low_shipping_fee: false,
        is_quality_guaranteed: false,
      };

  const form = useForm<cakeFormValue>({
    resolver: zodResolver(cakeSchema),
    defaultValues,
  });

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
        toast.error(result.error || "Không thể tải ảnh lên");
        return;
      }

      setUploadedFileUrl(result.data.file_url);

      form.setValue("available_main_image_id", result.data.id);

      form.setValue("available_cake_image_file_ids", [result.data.id]);

      toast.success("Tải ảnh lên thành công");
      console.log("Ảnh đã tải lên:", result.data);
    } catch (error: any) {
      toast.error("Không thể tải ảnh lên");
      console.error("Lỗi khi tải ảnh:", error);
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

  const onSubmit = async (data: cakeFormValue) => {
    try {
      setLoading(true);
      if (initialData) {
        startTransition(async () => {
          const result = await updateCake(
            data,
            initialData?.id.toString() || ""
          );

          if (!result.success) {
            toast.error(result.error);
          } else {
            toast.success(toastMessage);
          }
        });
      } else {
        startTransition(async () => {
          const result = await createCake(data);

          if (!result.success) {
            toast.error(result.error);
          } else {
            toast.success(toastMessage);
            form.reset();
          }
        });
      }
    } catch (error: any) {
      toast.error("Đã xảy ra lỗi.", error);
    } finally {
      setLoading(false);
    }
  };
  const bakeryCategories = [
    { label: "Bánh Kem", value: "BANH_KEM" },
    { label: "Bánh Mì", value: "BANH_MI" },
    { label: "Bánh Ngọt", value: "BANH_NGON" },
    { label: "Bánh Mặn", value: "BANH_MAN" },
    { label: "Bánh Trung Thu", value: "BANH_TRUNG_THU" },
    { label: "Bánh Chay", value: "BANH_CHAY" },
    { label: "Cupcake", value: "CUPCAKE" },
    { label: "Bánh Theo Mùa", value: "BANH_THEO_MUA" },
  ];
  const cakeTypes = [
    "BANH_KEM",
    "BANH_MI",
    "BANH_NGON",
    "BANH_MAN",
    "BANH_TRUNG_THU",
    "BANH_CHAY",
    "CUPCAKE",
    "BANH_THEO_MUA",
  ];

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            {title}
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="hidden md:block">
          <Cake className="h-7 w-7 text-primary opacity-80" />
        </div>
      </div>
      <Separator className="my-2" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Column - Image Upload */}
            <Card className="col-span-1 md:col-span-4 overflow-hidden border shadow-sm">
              <CardContent className="p-4">
                <FormField
                  control={form.control}
                  name="available_main_image_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Hình ảnh bánh
                      </FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-3">
                          <div className="relative w-72 h-40 border rounded-md border-dashed flex items-center justify-center  bg-gray-50/50 group">
                            {imageLoading ? (
                              <div className="flex items-center justify-center">
                                <Loader className="h-6 w-6 animate-spin text-primary" />
                              </div>
                            ) : uploadedFileUrl ? (
                              <Image
                                src={uploadedFileUrl}
                                alt="Xem trước hình bánh"
                                fill
                                className="object-contain p-2"
                              />
                            ) : imagePreview ? (
                              <Image
                                src={imagePreview}
                                alt="Xem trước hình bánh"
                                fill
                                className="object-contain p-2"
                              />
                            ) : getMainImageUrl() ? (
                              <Image
                                src={getMainImageUrl()!}
                                alt="Xem trước hình bánh"
                                fill
                                className="object-contain p-2"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-gray-400 text-center px-2">
                                <ImagePlus className="h-8 w-8 mb-1" />
                                <p className="text-xs">Tải ảnh bánh lên</p>
                              </div>
                            )}

                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() =>
                                  document
                                    .getElementById("image-upload")
                                    ?.click()
                                }
                                disabled={imageLoading}
                                className="text-xs"
                              >
                                {imageLoading ? "Đang tải..." : "Thay đổi ảnh"}
                              </Button>
                            </div>
                          </div>

                          <Input
                            type="file"
                            accept="image/*"
                            id="image-upload"
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
              </CardContent>
            </Card>

            {/* Right Column - Cake Details */}
            <Card className="col-span-1 md:col-span-8 border shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg font-medium">
                  Thông tin bánh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <FormField
                  control={form.control}
                  name="available_cake_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Tên bánh
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập tên bánh"
                          {...field}
                          className="h-9 text-sm focus:ring-1 focus:ring-primary/20"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="available_cake_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Loại bánh
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-9 text-sm focus:ring-1 focus:ring-primary/20">
                            <SelectValue placeholder="Chọn loại bánh" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="text-sm">
                          {bakeryCategories.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                              className="text-sm"
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="available_cake_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Giá (VNĐ)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Ví dụ: 150.000"
                            value={displayPrice}
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(
                                /\./g,
                                ""
                              );
                              const numericValue = rawValue.replace(
                                /[^\d]/g,
                                ""
                              );

                              if (numericValue) {
                                const numberValue = parseInt(numericValue);
                                const formattedValue =
                                  formatCurrency(numberValue);
                                setDisplayPrice(formattedValue);
                                field.onChange(numberValue);
                              } else {
                                setDisplayPrice("");
                                field.onChange(0);
                              }
                            }}
                            onBlur={(e) => {
                              const value = parseCurrency(displayPrice);
                              if (value < 1000) {
                                setDisplayPrice("1.000");
                                field.onChange(1000);
                              }
                              field.onBlur();
                            }}
                            className="h-9 text-sm focus:ring-1 focus:ring-primary/20"
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground mt-1">
                          Nhập giá từ 1.000đ đến 100.000.000đ (bội số của 100đ)
                        </p>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="available_cake_quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Số lượng hiện có
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            step="1"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                            className="h-9 text-sm focus:ring-1 focus:ring-primary/20"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="available_cake_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Mô tả
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập mô tả chi tiết về bánh"
                          className="min-h-24 text-sm resize-none focus:ring-1 focus:ring-primary/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Size Information */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Ruler className="h-5 w-5 text-primary mr-2" />
                    <h3 className="text-lg font-semibold">
                      Kích thước và Phục vụ
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="available_cake_size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kích thước bánh</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ví dụ: 20cm"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="available_cake_serving_size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phù hợp cho</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ví dụ: 6-8 người"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Cake Features */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-primary mr-2" />
                    <h3 className="text-lg font-semibold">Đặc điểm</h3>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="has_low_shipping_fee"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Phí giao hàng thấp</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Bánh này có phí giao hàng thấp hơn thông thường
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="is_quality_guaranteed"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Đảm bảo chất lượng</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Cam kết chất lượng khi nhận hàng
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Add Metrics Information if available */}
                {initialData && initialData.metric && (
                  <div className="mt-6">
                    <Separator className="my-4" />

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <ShoppingCart className="h-5 w-5 text-primary mr-2" />
                        <h3 className="text-lg font-semibold">
                          Thống kê bán hàng
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-muted/30 p-4 rounded-md flex items-center space-x-3">
                          <ShoppingCart className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Đã bán
                            </p>
                            <p className="font-medium text-lg">
                              {initialData.metric.quantity_sold || 0}
                            </p>
                          </div>
                        </div>

                        <div className="bg-muted/30 p-4 rounded-md flex items-center space-x-3">
                          <Star className="h-5 w-5 text-amber-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Đánh giá trung bình
                            </p>
                            <p className="font-medium text-lg">
                              {initialData.metric.rating_average ||
                                "Chưa có đánh giá"}
                            </p>
                          </div>
                        </div>

                        <div className="bg-muted/30 p-4 rounded-md flex items-center space-x-3">
                          <Users className="h-5 w-5 text-indigo-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Số lượng đánh giá
                            </p>
                            <p className="font-medium text-lg">
                              {initialData.metric.reviews_count || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/dashboard/cakes")}
              disabled={isLoading || isPending}
              className="h-9 px-4 text-sm hover:bg-gray-50"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isPending}
              className="h-9 px-4 text-sm"
            >
              {isPending ? (
                <div className="flex items-center gap-1.5">
                  <Loader className="h-3 w-3 animate-spin" />
                  <span>Đang lưu...</span>
                </div>
              ) : (
                action
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CakeDetailForm;
