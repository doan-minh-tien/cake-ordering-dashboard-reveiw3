"use server";

import { unstable_noStore as noStore } from "next/cache";
import { axiosAuth } from "@/lib/api/api-interceptor/api";
import { ICakeImageFile } from "../types/cake";
import { Result } from "@/lib/api/api-handler/generic";

/**
 * Fetches a cake image by its ID
 */
export async function getCakeImageById(
  imageId: string
): Promise<Result<ICakeImageFile>> {
  noStore();

  try {
    if (!imageId) {
      throw new Error("Image ID is required");
    }

    const response = await axiosAuth.get(`/files/${imageId}`);
    const payload = response.data.payload;

    if (!payload) {
      throw new Error("Invalid response format");
    }

    return {
      success: true,
      data: {
        id: payload.id,
        file_name: payload.file_name,
        file_url: payload.file_url,
        created_at: payload.created_at || new Date().toISOString(),
        created_by: payload.created_by || "system",
        updated_at: payload.updated_at || new Date().toISOString(),
        updated_by: payload.updated_by || "system",
        is_deleted: payload.is_deleted || false,
      },
    };
  } catch (error: any) {
    console.error("Failed to fetch cake image:", error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Không thể tải ảnh bánh",
    };
  }
}

/**
 * Uploads a cake image using the FormData API
 */
export async function uploadCakeImage(
  base64: string,
  fileName: string,
  fileType: string
): Promise<Result<ICakeImageFile>> {
  noStore();

  try {
    if (!base64 || !fileName) {
      throw new Error("Base64 string and file name are required");
    }

    // Validate base64 string
    if (!base64.startsWith("data:image/")) {
      throw new Error("Invalid image format");
    }

    // Convert base64 to blob
    const base64Response = await fetch(base64);
    if (!base64Response.ok) {
      throw new Error("Failed to process image");
    }

    const blob = await base64Response.blob();
    if (blob.size === 0) {
      throw new Error("Empty image file");
    }

    // Validate file size (max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (blob.size > MAX_FILE_SIZE) {
      throw new Error("Kích thước ảnh không được vượt quá 5MB");
    }

    // Create form data
    const formData = new FormData();
    formData.append("formFile", blob, fileName);

    // Make the API request to upload the image
    const response = await axiosAuth.post("/files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const payload = response.data.payload;

    if (!payload || !payload.id || !payload.file_url) {
      throw new Error("Invalid response format");
    }

    // Return the image data
    return {
      success: true,
      data: {
        id: payload.id,
        file_name: payload.file_name || fileName,
        file_url: payload.file_url,
        created_at: payload.created_at || new Date().toISOString(),
        created_by: payload.created_by || "system",
        updated_at: payload.updated_at || new Date().toISOString(),
        updated_by: payload.updated_by || "system",
        is_deleted: payload.is_deleted || false,
      },
    };
  } catch (error: any) {
    console.error("Failed to upload cake image:", error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Không thể tải ảnh lên",
    };
  }
}
