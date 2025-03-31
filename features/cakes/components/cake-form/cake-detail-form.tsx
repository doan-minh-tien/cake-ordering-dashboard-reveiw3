"use client";
import { z } from "zod";
import { ICake } from "../../types/cake";
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
} from "@/components/ui/card";
import { useState, useTransition } from "react";
import { updateCake, createCake } from "../../actions/cake-action";
import { toast } from "sonner";
import { uploadCakeImage } from "../../actions/cake-image-action";
import Image from "next/image";
import { Loader, ImagePlus, Cake } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CakeDetailFormProps {
  initialData: ICake | null;
}

const cakeSchema = z.object({
  available_cake_name: z.string().min(1, "Cake name is required"),
  available_cake_description: z.string().min(1, "Description is required"),
  available_cake_price: z.number().min(1, "Price must be at least 1"),
  available_cake_quantity: z.number().min(1, "Quantity must be at least 1"),
  available_cake_type: z.string().min(1, "Cake type is required"),
  available_cake_image_file_ids: z.array(z.string()).optional(),
  available_main_image_id: z.string().optional(),
});

type cakeFormValue = z.infer<typeof cakeSchema>;

const CakeDetailForm = ({ initialData }: CakeDetailFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const title = initialData ? "Edit Cake Details" : "Add New Cake";
  const description = initialData
    ? "Edit the details of the cake."
    : "Add a new cake to your collection.";
  const action = initialData ? "Save Changes" : "Create";
  const toastMessage = initialData
    ? "Cake updated successfully."
    : "Cake created successfully.";

  const defaultValues = initialData
    ? {
        available_cake_name: initialData.available_cake_name,
        available_cake_description: initialData.available_cake_description,
        available_cake_price: initialData.available_cake_price,
        available_cake_quantity: initialData.available_cake_quantity,
        available_cake_type: initialData.available_cake_type,
        available_cake_image_file_ids:
          initialData.available_cake_image_files?.map((img) => img.id) || [],
        available_main_image_id: initialData.available_main_image_id,
      }
    : {
        available_cake_name: "",
        available_cake_description: "",
        available_cake_price: 0,
        available_cake_quantity: 0,
        available_cake_type: "",
        available_cake_image_file_ids: [],
        available_main_image_id: "",
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
        toast.error(result.error || "Failed to upload image");
        return;
      }

      setUploadedFileUrl(result.data.file_url);

      form.setValue("available_main_image_id", result.data.id);

      form.setValue("available_cake_image_file_ids", [result.data.id]);

      toast.success("Image uploaded successfully");
      console.log("Uploaded image:", result.data);
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
      toast.error("An error occurred.", error);
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
    { label: "Bánh Theo Mùa", value: "BANH_THEO_MUA" }
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
                        Cake Image
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
                                alt="Cake preview"
                                fill
                                className="object-contain p-2"
                              />
                            ) : imagePreview ? (
                              <Image
                                src={imagePreview}
                                alt="Cake preview"
                                fill
                                className="object-contain p-2"
                              />
                            ) : getMainImageUrl() ? (
                              <Image
                                src={getMainImageUrl()!}
                                alt="Cake preview"
                                fill
                                className="object-contain p-2"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-gray-400 text-center px-2">
                                <ImagePlus className="h-8 w-8 mb-1" />
                                <p className="text-xs">Upload cake image</p>
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
                                {imageLoading ? "Uploading..." : "Change Image"}
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
                  Cake Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <FormField
                  control={form.control}
                  name="available_cake_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Cake Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter cake name"
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
                        Cake Type
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-9 text-sm focus:ring-1 focus:ring-primary/20">
                            <SelectValue placeholder="Select cake type" />
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
                          Price
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                            className="h-9 text-sm focus:ring-1 focus:ring-primary/20"
                          />
                        </FormControl>
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
                          Quantity Available
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
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter cake description"
                          className="min-h-24 text-sm resize-none focus:ring-1 focus:ring-primary/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => form.reset()}
              disabled={isLoading || isPending}
              className="h-9 px-4 text-sm hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isPending}
              className="h-9 px-4 text-sm"
            >
              {isPending ? (
                <div className="flex items-center gap-1.5">
                  <Loader className="h-3 w-3 animate-spin" />
                  <span>Saving...</span>
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
