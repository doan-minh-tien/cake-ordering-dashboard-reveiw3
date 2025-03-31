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
    // Make the API request to get the image
    const response = await axiosAuth.get(`/files/${imageId}`);
    
    // Return the image data
    return { 
      success: true, 
      data: {
        id: response.data.id,
        file_name: response.data.file_name,
        file_url: response.data.file_url,
      } 
    };
  } catch (error: any) {
    console.error("Failed to fetch cake image:", error);
    return { 
      success: false, 
      error: error.message || "Failed to fetch cake image" 
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
    // Convert base64 to blob
    const base64Response = await fetch(base64);
    const blob = await base64Response.blob();
    
    // Create form data
    const formData = new FormData();
    formData.append("formFile", blob, fileName);
    
    // Make the API request to upload the image
    const response = await axiosAuth.post("/files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Extract data from payload structure
    const payload = response.data.payload || response.data;
    
    // Return the image data
    return { 
      success: true, 
      data: {
        id: payload.id,
        file_name: payload.file_name || fileName,
        file_url: payload.file_url,
      } 
    };
  } catch (error: any) {
    console.error("Failed to upload cake image:", error);
    return { 
      success: false, 
      error: error.message || "Failed to upload cake image" 
    };
  }
} 