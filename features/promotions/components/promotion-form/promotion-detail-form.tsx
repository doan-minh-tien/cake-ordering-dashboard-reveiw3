"use client";

import { z } from "zod";
import { IPromotion } from "../../types/promotion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  CardDescription,
} from "@/components/ui/card";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  createPromotion,
  updatePromotion,
} from "../../action/promotion-action";
import {
  CalendarIcon,
  Percent,
  Package,
  Clock,
  Tag,
  Coins,
  ShoppingBag,
  FileText,
  Info,
} from "lucide-react";

interface PromotionDetailFormProps {
  initialData: IPromotion | null;
}

const promotionSchema = z.object({
  discount_percentage: z.coerce.number().min(0),
  min_order_amount: z.coerce.number().min(0),
  max_discount_amount: z.coerce.number().min(0),
  expiration_date: z.string(),
  quantity: z.coerce.number().min(0),
  usage_count: z.coerce.number().min(0),
  description: z.string().min(1, "Promotion description is required"),
  voucher_type: z.string().min(1, "Promotion description is required"),
});

type promotionFormValue = z.infer<typeof promotionSchema>;

const voucherType = ["PRIVATE", "GLOBAL"];

const PromotionDetailForm = ({ initialData }: PromotionDetailFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Promotion Details" : "Add New Promotion";
  const description = initialData
    ? "Edit the details of the promotion."
    : "Add a new promotion.";
  const action = initialData ? "Lưu thay đổi" : "Tạo";
  const toastMessage = initialData
    ? "cập nhật thành công."
    : "tạo thành công .";

  const defaultValues = initialData
    ? initialData
    : {
        discount_percentage: 0,
        min_order_amount: 0,
        max_discount_amount: 0,
        expiration_date: "",
        quantity: 0,
        usage_count: 0,
        description: "",
        voucher_type: "",
      };

  const form = useForm<promotionFormValue>({
    resolver: zodResolver(promotionSchema),
    defaultValues,
  });

  const onSubmit = async (data: promotionFormValue) => {
    startTransition(async () => {
      setLoading(true);
      if (initialData) {
        await updatePromotion(data, initialData.id);
      } else {
        await createPromotion(data);
      }
      setLoading(false);
      toast.success(toastMessage);
    });
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        <p className="text-slate-600">{description}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Discount Information */}
            <Card className="shadow-sm">
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Percent className="h-5 w-5 text-primary" />
                  Discount Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="discount_percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Percentage (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter discount percentage"
                          {...field}
                          className="focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="min_order_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Order Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter min order amount"
                          {...field}
                          className="focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_discount_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Discount Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter max discount amount"
                          {...field}
                          className="focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Card 2: Usage Details */}
            <Card className="shadow-sm">
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Usage Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="expiration_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiration Date</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          className="focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter quantity"
                          {...field}
                          className="focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="usage_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usage Count</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter usage count"
                          {...field}
                          className="focus:ring-2 focus:ring-primary"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Card 3: Voucher Details - Full Width */}
          <Card className="shadow-sm">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Voucher Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="voucher_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voucher Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="focus:ring-2 focus:ring-primary">
                            <SelectValue placeholder="Select voucher type" />
                          </SelectTrigger>
                          <SelectContent>
                            {voucherType.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter description"
                        {...field}
                        className="min-h-28 focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Button Card */}
          <Card className="shadow-sm border-t-4 border-t-primary">
            <CardContent className="p-4 flex justify-end items-center">
              <div className="flex-1">
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  {initialData
                    ? "Update promotion details"
                    : "Create a new promotion"}
                </p>
              </div>
              <Button
                type="submit"
                disabled={isPending || loading}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2"
              >
                {loading ? "Đang xử lý..." : action}
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default PromotionDetailForm;
