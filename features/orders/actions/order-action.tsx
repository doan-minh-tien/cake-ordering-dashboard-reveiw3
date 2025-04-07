"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import {
  ApiListResponse,
  fetchListData,
  ApiSingleResponse,
  fetchSingleData,
  apiRequest,
  Result,
} from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { IOrder } from "../types/order-type";
import { auth } from "@/lib/next-auth/auth";
import { axiosAuth } from "@/lib/api/api-interceptor/api";

export const getOrders = async (
  searchParams: SearchParams
): Promise<ApiListResponse<IOrder>> => {
  noStore();

  const session = await auth();

  const result = await fetchListData<IOrder>(
    `/bakeries/${session?.user.entity.id}/orders`,
    searchParams
  );

  if (!result.success) {
    console.error("Failed to fetch list IOrder:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};

export async function getOrder(
  params: string
): Promise<ApiSingleResponse<IOrder>> {
  noStore();

  const result = await fetchSingleData<IOrder>(`/orders/${params}`);
  if (!result.success) {
    console.error("Failed to fetch order by ID:", result.error);
    return { data: null };
  }
  return result.data;
}

export async function watingToConfirm(params: string): Promise<Result<void>> {
  noStore();

  console.log("Đang chuyển sang trạng thái chờ xác nhận", params);
  const result = await apiRequest(() =>
    axiosAuth.put(`/orders/${params}/save`)
  );
  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath(`/dashboard/orders/${params}`);

  return { success: true, data: undefined };
}

export async function beingToNext(params: string): Promise<Result<void>> {
  noStore();

  console.log(params);
  const result = await apiRequest(() =>
    axiosAuth.put(`/orders/${params}/move-to-next`)
  );
  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath(`/dashboard/orders/${params}`);

  return { success: true, data: undefined };
}

export async function beingToNextWithFiles(
  params: string,
  files: File[]
): Promise<Result<void>> {
  noStore();

  console.log("Order ID:", params);
  console.log("Files to upload count:", files.length);

  if (!files || files.length === 0) {
    console.error("No files provided for upload");
    return { success: false, error: "No files provided for upload" };
  }

  try {
    // Create a new FormData instance
    const formData = new FormData();

    // Iterate through files and append them to FormData
    for (const file of files) {
      if (!file || !file.name) {
        console.error("Invalid file encountered");
        continue;
      }

      console.log(`Processing file:`, file.name, file.type, file.size);

      // Add the file to the FormData with the correct field name
      formData.append("files", file);
    }

    // Make the API request
    try {
      // Set up axios with the right configuration for multipart/form-data
      const requestConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "*/*",
        },
      };

      console.log("Sending request to API...");

      // Use a direct axios call with proper configuration
      const response = await axiosAuth.put(
        `/orders/${params}/move-to-next`,
        formData,
        requestConfig
      );

      console.log("API response status:", response.status);

      // If we get here, it was successful
      revalidatePath(`/dashboard/orders/${params}`);
      return { success: true, data: undefined };
    } catch (apiError: any) {
      // Log detailed error information
      console.error("API error status:", apiError?.response?.status);
      console.error("API error data:", apiError?.response?.data);

      // Return descriptive error
      return {
        success: false,
        error:
          apiError?.response?.data?.message || "Error communicating with API",
      };
    }
  } catch (error: any) {
    // Log and return any unexpected errors
    console.error("Unexpected error during file upload:", error);
    return {
      success: false,
      error: error?.message || "Failed to process files for upload",
    };
  }
}

export async function cancelOrder(
  params: string,
  reason: string
): Promise<Result<void>> {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.delete(`/orders/${params}/cancel`)
  );
  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath(`/dashboard/orders/${params}`);

  return { success: true, data: undefined };
}

export async function beingToNextWithFileBase64(
  params: string,
  fileBase64: string,
  fileName: string,
  fileType: string
): Promise<Result<void>> {
  noStore();

  console.log("Order ID:", params);
  console.log("Processing file with type:", fileType);

  try {
    // Create a FormData object to handle the file upload
    const formData = new FormData();

    // Convert base64 to blob
    const base64Response = await fetch(`data:${fileType};base64,${fileBase64}`);
    const blob = await base64Response.blob();

    // Create a File from the Blob
    const file = new File([blob], fileName, { type: fileType });

    // Append the file to the FormData
    formData.append("files", file);

    console.log("Sending request to API with converted file...");

    // Send the request
    const response = await axiosAuth.put(
      `/orders/${params}/move-to-next`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("API response status:", response.status);

    // Revalidate the path to update the UI
    revalidatePath(`/dashboard/orders/${params}`);
    return { success: true, data: undefined };
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to process file upload",
    };
  }
}
