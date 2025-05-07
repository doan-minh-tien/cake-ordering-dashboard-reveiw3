"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IBarkery } from "../../types/barkeries-type";
import { updateBakeryProfile } from "../../actions/barkeries-action";
import {
  Loader2,
  Upload,
  Image as ImageIcon,
  FileImage,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Define file type schema
const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const bakeryFormSchema = z.object({
  bakery_name: z.string().min(2, "Tên cửa hàng phải có ít nhất 2 ký tự"),
  bakery_description: z.string().nullable().optional(),
  cake_description: z.string().nullable().optional(),
  price_description: z.string().nullable().optional(),
  password: z.string().optional(),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  bank_account: z.string().optional(),
  owner_name: z.string().min(2, "Tên chủ sở hữu phải có ít nhất 2 ký tự"),
  tax_code: z.string().optional(),
  identity_card_number: z.string().optional(),
  shop_image_file_ids: z.array(z.string()).optional(),
  avatar_file_id: z.string().optional(),
  front_card_file_id: z.string().optional(),
  back_card_file_id: z.string().optional(),
  food_safety_certificate_file_id: z.string().optional(),
  business_license_file_id: z.string().optional(),
  open_time: z.string().min(1, "Giờ mở cửa là bắt buộc"),
  close_time: z.string().min(1, "Giờ đóng cửa là bắt buộc"),
  // File upload fields - not part of API but used for handling uploads
  avatar_file: z.any().optional(),
  front_card_file: z.any().optional(),
  back_card_file: z.any().optional(),
  shop_image_files: z.any().optional(),
  food_safety_certificate_file: z.any().optional(),
  business_license_file: z.any().optional(),
});

type BakeryFormValues = z.infer<typeof bakeryFormSchema>;

interface BakeryUpdateFormProps {
  bakery: IBarkery;
}

// Component để hiển thị nhãn với dấu * màu đỏ
const RequiredLabel = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center gap-1">
      {children}
      <span className="text-red-500">*</span>
    </div>
  );
};

export function BakeryUpdateForm({ bakery }: BakeryUpdateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    bakery.avatar_file?.file_url || null
  );
  const [frontCardPreview, setFrontCardPreview] = useState<string | null>(
    bakery.front_card_file?.file_url || null
  );
  const [backCardPreview, setBackCardPreview] = useState<string | null>(
    bakery.back_card_file?.file_url || null
  );
  const [shopImagePreviews, setShopImagePreviews] = useState<string[]>(
    bakery.shop_image_files?.map((file) => file.file_url) || []
  );
  const [foodSafetyCertificatePreview, setFoodSafetyCertificatePreview] =
    useState<string | null>(
      bakery.food_safety_certificate_file?.file_url || null
    );
  const [businessLicensePreview, setBusinessLicensePreview] = useState<
    string | null
  >(bakery.business_license_file?.file_url || null);

  // Function to handle file uploads to your API/server
  async function uploadFile(file: File): Promise<string> {
    // This is a placeholder - implement your actual file upload logic
    // You would typically:
    // 1. Create a FormData object
    // 2. Append the file
    // 3. Make an API request to your file upload endpoint
    // 4. Return the file ID from the response

    // For now, we'll simulate an upload with a timeout
    return new Promise((resolve) => {
      console.log("Uploading file:", file.name);
      setTimeout(() => {
        // Return a random UUID-like string as the file ID
        const randomId =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);
        resolve(randomId);
      }, 1000);
    });
  }

  // Function to format time string to "HH:MM:SS" format for API
  const formatTimeForApi = (timeString: string): string => {
    if (!timeString) return "";

    // If the time is already in HH:MM:SS format, return it
    if (/^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
      return timeString;
    }

    // If the time is in HH:MM format, append :00 for seconds
    if (/^\d{2}:\d{2}$/.test(timeString)) {
      return `${timeString}:00`;
    }

    return timeString;
  };

  // Initialize the form with current bakery data
  const form = useForm<BakeryFormValues>({
    resolver: zodResolver(bakeryFormSchema),
    defaultValues: {
      bakery_name: bakery.bakery_name,
      bakery_description: bakery.bakery_description || "",
      cake_description: bakery.cake_description || "",
      price_description: bakery.price_description || "",
      password: "",
      phone: bakery.phone,
      address: bakery.address,
      latitude: bakery.latitude,
      longitude: bakery.longitude,
      bank_account: bakery.bank_account || "",
      owner_name: bakery.owner_name,
      tax_code: bakery.tax_code,
      identity_card_number: bakery.identity_card_number || "",
      shop_image_file_ids: bakery.shop_image_files?.map((f) => f.id) || [],
      avatar_file_id: bakery.avatar_file_id || "",
      front_card_file_id: bakery.front_card_file_id || "",
      back_card_file_id: bakery.back_card_file_id || "",
      food_safety_certificate_file_id:
        bakery.food_safety_certificate_file_id || "",
      business_license_file_id: bakery.business_license_file_id || "",
      open_time: bakery.open_time || "",
      close_time: bakery.close_time || "",
    },
  });

  async function onSubmit(values: BakeryFormValues) {
    setIsSubmitting(true);

    try {
      // Handle file uploads first
      let avatarFileId = values.avatar_file_id;
      let frontCardFileId = values.front_card_file_id;
      let backCardFileId = values.back_card_file_id;
      let foodSafetyCertificateFileId = values.food_safety_certificate_file_id;
      let businessLicenseFileId = values.business_license_file_id;
      let shopImageFileIds = values.shop_image_file_ids || [];

      // Upload avatar if provided
      if (
        values.avatar_file &&
        values.avatar_file instanceof FileList &&
        values.avatar_file.length > 0
      ) {
        const file = values.avatar_file[0];
        avatarFileId = await uploadFile(file);
      }

      // Upload front card if provided
      if (
        values.front_card_file &&
        values.front_card_file instanceof FileList &&
        values.front_card_file.length > 0
      ) {
        const file = values.front_card_file[0];
        frontCardFileId = await uploadFile(file);
      }

      // Upload back card if provided
      if (
        values.back_card_file &&
        values.back_card_file instanceof FileList &&
        values.back_card_file.length > 0
      ) {
        const file = values.back_card_file[0];
        backCardFileId = await uploadFile(file);
      }

      // Upload food safety certificate if provided
      if (
        values.food_safety_certificate_file &&
        values.food_safety_certificate_file instanceof FileList &&
        values.food_safety_certificate_file.length > 0
      ) {
        const file = values.food_safety_certificate_file[0];
        foodSafetyCertificateFileId = await uploadFile(file);
      }

      // Upload business license if provided
      if (
        values.business_license_file &&
        values.business_license_file instanceof FileList &&
        values.business_license_file.length > 0
      ) {
        const file = values.business_license_file[0];
        businessLicenseFileId = await uploadFile(file);
      }

      // Upload shop images if provided
      if (
        values.shop_image_files &&
        values.shop_image_files instanceof FileList &&
        values.shop_image_files.length > 0
      ) {
        const newFileIds = [];
        for (let i = 0; i < values.shop_image_files.length; i++) {
          const fileId = await uploadFile(values.shop_image_files[i]);
          newFileIds.push(fileId);
        }

        // Combine with existing shop image IDs if needed
        if (newFileIds.length > 0) {
          shopImageFileIds = [...newFileIds, ...shopImageFileIds];
        }
      }

      // Create a complete payload with all required fields
      const submitData = {
        bakery_name: values.bakery_name,
        bakery_description: values.bakery_description || null,
        cake_description: values.cake_description || null,
        price_description: values.price_description || null,
        password: values.password || "",
        phone: values.phone,
        address: values.address,
        latitude: values.latitude || "",
        longitude: values.longitude || "",
        owner_name: values.owner_name,
        tax_code: values.tax_code || "",
        identity_card_number:
          values.identity_card_number || bakery.identity_card_number || "",
        shop_image_file_ids: shopImageFileIds,
        avatar_file_id: avatarFileId || bakery.avatar_file_id || "",
        front_card_file_id: frontCardFileId || bakery.front_card_file_id || "",
        back_card_file_id: backCardFileId || bakery.back_card_file_id || "",
        bank_account: values.bank_account || undefined,
        food_safety_certificate_file_id:
          foodSafetyCertificateFileId ||
          bakery.food_safety_certificate_file_id ||
          "",
        business_license_file_id:
          businessLicenseFileId || bakery.business_license_file_id || "",
        open_time: formatTimeForApi(values.open_time),
        close_time: formatTimeForApi(values.close_time),
      };

      console.log("Form submission data:", JSON.stringify(submitData));

      const result = await updateBakeryProfile(bakery.id, submitData);

      if (result.success) {
        toast.success("Cập nhật thông tin cửa hàng thành công");
      } else {
        toast.error(`Cập nhật thất bại: ${result.error}`);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi không mong muốn");
      console.error("Error updating bakery:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle file preview
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle multiple file preview
  const handleMultipleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newPreviews: string[] = [];

      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === files.length) {
            setShopImagePreviews((prev) => [...newPreviews, ...prev]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Add file preview handlers for new fields
  const handleFoodSafetyCertificateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleFileChange(e, setFoodSafetyCertificatePreview);
  };

  const handleBusinessLicenseChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleFileChange(e, setBusinessLicensePreview);
  };

  return (
    <>
      <div className="mb-6">
        <Link href={`/dashboard/bakeries/${bakery.id}`}>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay lại trang chi tiết
          </Button>
        </Link>
      </div>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Cập nhật thông tin cửa hàng</CardTitle>
          <CardDescription>
            Cập nhật thông tin cửa hàng bánh của bạn. Các trường có dấu * là bắt
            buộc.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bakery_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>Tên cửa hàng</RequiredLabel>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên cửa hàng" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>Số điện thoại</RequiredLabel>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số điện thoại" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredLabel>Địa chỉ</RequiredLabel>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập địa chỉ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bakery descriptions */}
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="bakery_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả cửa hàng</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Mô tả chi tiết về cửa hàng của bạn"
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
                  name="cake_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả sản phẩm bánh</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Mô tả về các loại bánh bạn cung cấp"
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
                  name="price_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả về giá</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Thông tin về khoảng giá sản phẩm"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Business hours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="open_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>Giờ mở cửa</RequiredLabel>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          required
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="close_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>Giờ đóng cửa</RequiredLabel>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          required
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vĩ độ</FormLabel>
                      <FormControl>
                        <Input placeholder="Tọa độ vĩ độ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kinh độ</FormLabel>
                      <FormControl>
                        <Input placeholder="Tọa độ kinh độ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="owner_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabel>Tên chủ sở hữu</RequiredLabel>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên chủ sở hữu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bank_account"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tài khoản ngân hàng</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập tài khoản ngân hàng"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tax_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã số thuế</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập mã số thuế" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="identity_card_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số CMND/CCCD</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số CMND/CCCD" {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      Số CMND/CCCD của bạn để xác minh danh tính
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Avatar Image Upload */}
              <FormField
                control={form.control}
                name="avatar_file"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Ảnh đại diện</FormLabel>
                    <div className="flex flex-col gap-4">
                      {avatarPreview && (
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200">
                          <Image
                            src={avatarPreview}
                            alt="Xem trước ảnh đại diện"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("avatar-upload")?.click()
                          }
                          className="flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Tải ảnh đại diện
                        </Button>
                        <Input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            onChange(e.target.files);
                            handleFileChange(e, setAvatarPreview);
                          }}
                          {...rest}
                        />
                        <FormField
                          control={form.control}
                          name="avatar_file_id"
                          render={({ field }) => (
                            <Input
                              placeholder="Hoặc nhập ID ảnh đại diện thủ công"
                              {...field}
                              className="flex-1"
                              readOnly
                            />
                          )}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tải lên ảnh đại diện mới hoặc nhập ID ảnh có sẵn
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ID Card Image Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Front Card Upload */}
                <FormField
                  control={form.control}
                  name="front_card_file"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Ảnh mặt trước CMND/CCCD</FormLabel>
                      <div className="flex flex-col gap-4">
                        {frontCardPreview && (
                          <div className="relative w-full h-40 rounded-md overflow-hidden border border-gray-200">
                            <Image
                              src={frontCardPreview}
                              alt="Xem trước mặt trước CMND/CCCD"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document
                                .getElementById("front-card-upload")
                                ?.click()
                            }
                            className="flex items-center gap-2"
                          >
                            <FileImage className="h-4 w-4" />
                            Tải mặt trước
                          </Button>
                          <Input
                            id="front-card-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              onChange(e.target.files);
                              handleFileChange(e, setFrontCardPreview);
                            }}
                            {...rest}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="front_card_file_id"
                          render={({ field }) => (
                            <Input
                              placeholder="Hoặc nhập ID ảnh mặt trước thủ công"
                              {...field}
                              readOnly
                            />
                          )}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Back Card Upload */}
                <FormField
                  control={form.control}
                  name="back_card_file"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Ảnh mặt sau CMND/CCCD</FormLabel>
                      <div className="flex flex-col gap-4">
                        {backCardPreview && (
                          <div className="relative w-full h-40 rounded-md overflow-hidden border border-gray-200">
                            <Image
                              src={backCardPreview}
                              alt="Xem trước mặt sau CMND/CCCD"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document
                                .getElementById("back-card-upload")
                                ?.click()
                            }
                            className="flex items-center gap-2"
                          >
                            <FileImage className="h-4 w-4" />
                            Tải mặt sau
                          </Button>
                          <Input
                            id="back-card-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              onChange(e.target.files);
                              handleFileChange(e, setBackCardPreview);
                            }}
                            {...rest}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="back_card_file_id"
                          render={({ field }) => (
                            <Input
                              placeholder="Hoặc nhập ID ảnh mặt sau thủ công"
                              {...field}
                              readOnly
                            />
                          )}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Shop Images Upload */}
              <FormField
                control={form.control}
                name="shop_image_files"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Ảnh cửa hàng</FormLabel>
                    <div className="flex flex-col gap-4">
                      {shopImagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {shopImagePreviews.map((preview, index) => (
                            <div
                              key={index}
                              className="relative w-full pt-[75%] rounded-md overflow-hidden border border-gray-200"
                            >
                              <Image
                                src={preview}
                                alt={`Ảnh cửa hàng ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document
                              .getElementById("shop-images-upload")
                              ?.click()
                          }
                          className="flex items-center gap-2"
                        >
                          <ImageIcon className="h-4 w-4" />
                          Tải ảnh cửa hàng
                        </Button>
                        <Input
                          id="shop-images-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            onChange(e.target.files);
                            handleMultipleFileChange(e);
                          }}
                          {...rest}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tải lên nhiều ảnh để giới thiệu cửa hàng bánh của bạn
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Food Safety Certificate Upload */}
              <FormField
                control={form.control}
                name="food_safety_certificate_file"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Giấy chứng nhận an toàn thực phẩm</FormLabel>
                    <div className="flex flex-col gap-4">
                      {foodSafetyCertificatePreview && (
                        <div className="relative w-full h-40 rounded-md overflow-hidden border border-gray-200">
                          <Image
                            src={foodSafetyCertificatePreview}
                            alt="Xem trước giấy chứng nhận ATTP"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document
                              .getElementById("food-safety-upload")
                              ?.click()
                          }
                          className="flex items-center gap-2"
                        >
                          <FileImage className="h-4 w-4" />
                          Tải giấy chứng nhận
                        </Button>
                        <Input
                          id="food-safety-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            onChange(e.target.files);
                            handleFoodSafetyCertificateChange(e);
                          }}
                          {...rest}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="food_safety_certificate_file_id"
                        render={({ field }) => (
                          <Input
                            placeholder="ID giấy chứng nhận an toàn thực phẩm"
                            {...field}
                            readOnly
                          />
                        )}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tải lên giấy chứng nhận an toàn thực phẩm
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Business License Upload */}
              <FormField
                control={form.control}
                name="business_license_file"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Giấy phép kinh doanh</FormLabel>
                    <div className="flex flex-col gap-4">
                      {businessLicensePreview && (
                        <div className="relative w-full h-40 rounded-md overflow-hidden border border-gray-200">
                          <Image
                            src={businessLicensePreview}
                            alt="Xem trước giấy phép kinh doanh"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document
                              .getElementById("business-license-upload")
                              ?.click()
                          }
                          className="flex items-center gap-2"
                        >
                          <FileImage className="h-4 w-4" />
                          Tải giấy phép
                        </Button>
                        <Input
                          id="business-license-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            onChange(e.target.files);
                            handleBusinessLicenseChange(e);
                          }}
                          {...rest}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="business_license_file_id"
                        render={({ field }) => (
                          <Input
                            placeholder="ID giấy phép kinh doanh"
                            {...field}
                            readOnly
                          />
                        )}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tải lên giấy phép kinh doanh của cửa hàng
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Existing shop image file IDs */}
              <FormField
                control={form.control}
                name="shop_image_file_ids"
                render={({ field }) => {
                  // Convert array to comma-separated string for display
                  const stringValue = Array.isArray(field.value)
                    ? field.value.join(", ")
                    : "";

                  return (
                    <FormItem>
                      <FormLabel>ID ảnh cửa hàng hiện tại</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập các ID ảnh cửa hàng, phân cách bằng dấu phẩy"
                          value={stringValue}
                          onChange={(e) => {
                            // Convert comma-separated string back to array
                            const arrayValue = e.target.value
                              .split(",")
                              .map((id) => id.trim())
                              .filter((id) => id.length > 0);
                            field.onChange(arrayValue);
                          }}
                          readOnly
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground mt-1">
                        Nhập ID của các ảnh cửa hàng hiện tại, phân cách bằng
                        dấu phẩy (ví dụ: id1, id2, id3)
                      </p>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Hidden fields to satisfy the API requirements */}
              <div className="hidden">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => <input type="hidden" {...field} />}
                />
              </div>

              <CardFooter className="flex justify-end px-0 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    "Cập nhật thông tin"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
