"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Building,
  User,
  Mail,
  Phone,
  Lock,
  CreditCard,
  MapPin,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// Define Zod schema for form validation
const bakeryRegistrationSchema = z.object({
  bakery_name: z.string().min(1, "Tên cửa hàng là bắt buộc"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  address: z.string().min(1, "Địa chỉ là bắt buộc"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  owner_name: z.string().min(1, "Tên chủ sở hữu là bắt buộc"),
  tax_code: z.string().min(1, "Mã số thuế là bắt buộc"),
  identity_card_number: z.string().min(9, "Số CMND/CCCD không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  // These are placeholder strings for file IDs in the form
  avatar_file_id: z.string().optional(),
  front_card_file_id: z.string().optional(),
  back_card_file_id: z.string().optional(),
  shop_image_file_ids: z.string().optional(),
});

type BakeryRegistrationFormValues = z.infer<typeof bakeryRegistrationSchema>;

const SignUpPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const bakeryForm = useForm<BakeryRegistrationFormValues>({
    resolver: zodResolver(bakeryRegistrationSchema),
    defaultValues: {
      bakery_name: "",
      password: "",
      phone: "",
      address: "",
      latitude: "",
      longitude: "",
      owner_name: "",
      tax_code: "",
      identity_card_number: "",
      email: "",
      avatar_file_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6", // Default UUID for testing
      front_card_file_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6", // Default UUID for testing
      back_card_file_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6", // Default UUID for testing
      shop_image_file_ids: "3fa85f64-5717-4562-b3fc-2c963f66afa6", // We'll convert this to array in onSubmit
    },
    mode: "onChange",
  });

  const onSubmit = async (values: BakeryRegistrationFormValues) => {
    try {
      setLoading(true);

      // Convert single ID to array for shop_image_file_ids
      const payload = {
        ...values,
        shop_image_file_ids: [values.shop_image_file_ids],
      };

      console.log("Registration payload:", payload);

      toast.success("Form được submit thành công (demo)");
      router.push("/");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Đã xảy ra lỗi khi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
            Đăng ký tài khoản Bakery
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Điền thông tin để đăng ký cửa hàng của bạn
          </p>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-xl border border-gray-100 dark:border-gray-700">
          <Form {...bakeryForm}>
            <form
              onSubmit={bakeryForm.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bakery Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">
                    Thông tin cửa hàng
                  </h3>

                  <FormField
                    control={bakeryForm.control}
                    name="bakery_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên cửa hàng</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                              <Building className="h-4 w-4" />
                            </div>
                            <Input
                              placeholder="Nhập tên cửa hàng"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bakeryForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                              <Mail className="h-4 w-4" />
                            </div>
                            <Input
                              type="email"
                              placeholder="example@email.com"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bakeryForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                              <Lock className="h-4 w-4" />
                            </div>
                            <Input
                              type="password"
                              placeholder="Nhập mật khẩu"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bakeryForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                              <Phone className="h-4 w-4" />
                            </div>
                            <Input
                              placeholder="0912345678"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bakeryForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none text-gray-500 dark:text-gray-400">
                              <MapPin className="h-4 w-4" />
                            </div>
                            <Textarea
                              placeholder="Nhập địa chỉ cửa hàng"
                              className="pl-9 min-h-[80px]"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={bakeryForm.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vĩ độ</FormLabel>
                          <FormControl>
                            <Input placeholder="21.028511" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bakeryForm.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kinh độ</FormLabel>
                          <FormControl>
                            <Input placeholder="105.804817" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Owner Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">
                    Thông tin chủ sở hữu
                  </h3>

                  <FormField
                    control={bakeryForm.control}
                    name="owner_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên chủ sở hữu</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                              <User className="h-4 w-4" />
                            </div>
                            <Input
                              placeholder="Nguyễn Văn A"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bakeryForm.control}
                    name="tax_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mã số thuế</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                              <CreditCard className="h-4 w-4" />
                            </div>
                            <Input
                              placeholder="0123456789"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bakeryForm.control}
                    name="identity_card_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số CMND/CCCD</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-gray-400">
                              <CreditCard className="h-4 w-4" />
                            </div>
                            <Input
                              placeholder="012345678901"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={bakeryForm.control}
                    name="avatar_file_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID ảnh đại diện</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="UUID của ảnh đại diện"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={bakeryForm.control}
                      name="front_card_file_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID mặt trước CMND</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="UUID của ảnh mặt trước"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bakeryForm.control}
                      name="back_card_file_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID mặt sau CMND</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="UUID của ảnh mặt sau"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Shop Image ID */}
              <FormField
                control={bakeryForm.control}
                name="shop_image_file_ids"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID ảnh cửa hàng</FormLabel>
                    <FormControl>
                      <Input placeholder="UUID của ảnh cửa hàng" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => router.push("/")}
                    className="w-full bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 border border-teal-600 dark:border-teal-500 transition-colors h-11 rounded-lg font-medium text-teal-600 dark:text-teal-400"
                  >
                    Quay lại
                  </Button>
                  <Button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 transition-colors h-11 rounded-lg font-medium text-white"
                    disabled={loading || !bakeryForm.formState.isValid}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang đăng ký...
                      </span>
                    ) : (
                      "Đăng ký"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
