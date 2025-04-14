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
import { Loader2, Upload, Image as ImageIcon, FileImage } from "lucide-react";
import Image from "next/image";

// Define file type schema
const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const bakeryFormSchema = z.object({
  bakery_name: z.string().min(2, "Bakery name must be at least 2 characters"),
  password: z.string().optional(),
  phone: z.string().min(10, "Phone number must be valid"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  bank_account: z.string().optional(),
  owner_name: z.string().min(2, "Owner name must be at least 2 characters"),
  tax_code: z.string().optional(),
  identity_card_number: z.string().optional(),
  shop_image_file_ids: z.array(z.string()).optional(),
  avatar_file_id: z.string().optional(),
  front_card_file_id: z.string().optional(),
  back_card_file_id: z.string().optional(),
  // File upload fields - not part of API but used for handling uploads
  avatar_file: z.any().optional(),
  front_card_file: z.any().optional(),
  back_card_file: z.any().optional(),
  shop_image_files: z.any().optional(),
});

type BakeryFormValues = z.infer<typeof bakeryFormSchema>;

interface BakeryUpdateFormProps {
  bakery: IBarkery;
}

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

  // Initialize the form with current bakery data
  const form = useForm<BakeryFormValues>({
    resolver: zodResolver(bakeryFormSchema),
    defaultValues: {
      bakery_name: bakery.bakery_name,
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
    },
  });

  async function onSubmit(values: BakeryFormValues) {
    setIsSubmitting(true);

    try {
      // Handle file uploads first
      let avatarFileId = values.avatar_file_id;
      let frontCardFileId = values.front_card_file_id;
      let backCardFileId = values.back_card_file_id;
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
      };

      console.log("Form submission data:", JSON.stringify(submitData));

      const result = await updateBakeryProfile(bakery.id, submitData);

      if (result.success) {
        toast.success("Bakery information updated successfully");
      } else {
        toast.error(`Failed to update: ${result.error}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Update Bakery Profile</CardTitle>
        <CardDescription>
          Update your bakery's information below. Fields marked with * are
          required.
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
                    <FormLabel>Bakery Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter bakery name" {...field} />
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
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
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
                  <FormLabel>Address *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input placeholder="Latitude coordinate" {...field} />
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
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input placeholder="Longitude coordinate" {...field} />
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
                    <FormLabel>Owner Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter owner name" {...field} />
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
                    <FormLabel>Bank Account</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter bank account" {...field} />
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
                  <FormLabel>Tax Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tax code" {...field} />
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
                  <FormLabel>Identity Card Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter identity card number"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your national identity card number for verification purposes
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
                  <FormLabel>Avatar Image</FormLabel>
                  <div className="flex flex-col gap-4">
                    {avatarPreview && (
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-200">
                        <Image
                          src={avatarPreview}
                          alt="Avatar preview"
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
                        Upload Avatar
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
                            placeholder="Or enter avatar file ID manually"
                            {...field}
                            className="flex-1"
                          />
                        )}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload a new profile picture or enter an existing image ID
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
                    <FormLabel>ID Card Front Image</FormLabel>
                    <div className="flex flex-col gap-4">
                      {frontCardPreview && (
                        <div className="relative w-full h-40 rounded-md overflow-hidden border border-gray-200">
                          <Image
                            src={frontCardPreview}
                            alt="Front ID card preview"
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
                          Upload Front
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
                            placeholder="Or enter front card file ID manually"
                            {...field}
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
                    <FormLabel>ID Card Back Image</FormLabel>
                    <div className="flex flex-col gap-4">
                      {backCardPreview && (
                        <div className="relative w-full h-40 rounded-md overflow-hidden border border-gray-200">
                          <Image
                            src={backCardPreview}
                            alt="Back ID card preview"
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
                            document.getElementById("back-card-upload")?.click()
                          }
                          className="flex items-center gap-2"
                        >
                          <FileImage className="h-4 w-4" />
                          Upload Back
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
                            placeholder="Or enter back card file ID manually"
                            {...field}
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
                  <FormLabel>Shop Images</FormLabel>
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
                              alt={`Shop image ${index + 1}`}
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
                          document.getElementById("shop-images-upload")?.click()
                        }
                        className="flex items-center gap-2"
                      >
                        <ImageIcon className="h-4 w-4" />
                        Upload Shop Images
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
                    Upload multiple shop images to showcase your bakery
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
                    <FormLabel>Existing Shop Image File IDs</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter comma-separated shop image file IDs"
                        value={stringValue}
                        onChange={(e) => {
                          // Convert comma-separated string back to array
                          const arrayValue = e.target.value
                            .split(",")
                            .map((id) => id.trim())
                            .filter((id) => id.length > 0);
                          field.onChange(arrayValue);
                        }}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter file IDs for existing shop images, separated by
                      commas (e.g., id1, id2, id3)
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
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
