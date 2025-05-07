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
import { IOrder, IOrderDetail } from "../types/order-type";
import { auth } from "@/lib/next-auth/auth";
import { axiosAuth } from "@/lib/api/api-interceptor/api";
import { ICakeImageFile } from "@/features/cakes/types/cake";

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

/**
 * Special function for moving order status from PROCESSING to PICKUP for pickup orders
 * This is specifically for orders with shipping_type = PICKUP
 */
export async function moveToPickup(
  orderId: string,
  fileBase64?: string,
  fileName?: string,
  fileType?: string
): Promise<Result<void>> {
  noStore();

  console.log("Moving order to PICKUP status:", orderId);

  try {
    // Get the order details first to verify shipping_type
    const orderResult = await fetchSingleData<IOrder>(`/orders/${orderId}`);
    if (!orderResult.success) {
      return {
        success: false,
        error: "Failed to fetch order details",
      };
    }

    if (!orderResult.data.data) {
      return {
        success: false,
        error: "Order not found",
      };
    }

    const order = orderResult.data.data;

    // Verify this is a PICKUP order
    if (order.shipping_type?.toUpperCase() !== "PICKUP") {
      return {
        success: false,
        error: "This function is only for PICKUP orders",
      };
    }

    // Process file if provided
    if (fileBase64 && fileName && fileType) {
      try {
        // Create a FormData object
        const formData = new FormData();

        // Convert base64 to blob
        const base64Response = await fetch(
          `data:${fileType};base64,${fileBase64}`
        );
        const blob = await base64Response.blob();

        // Create a File from the Blob
        const file = new File([blob], fileName, { type: fileType });

        // Append the file to the FormData
        formData.append("files", file);

        console.log("Sending PICKUP order request with file...");

        // Send request
        const response = await axiosAuth.put(
          `/orders/${orderId}/move-to-next`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("PICKUP order status update successful:", response.status);
      } catch (fileError: any) {
        console.error("Error processing file for PICKUP order:", fileError);
        return {
          success: false,
          error:
            fileError?.response?.data?.message ||
            fileError?.message ||
            "Failed to process file",
        };
      }
    } else {
      // No file, just make standard request
      const result = await apiRequest(() =>
        axiosAuth.put(`/orders/${orderId}/move-to-next`)
      );

      if (!result.success) {
        return { success: false, error: result.error };
      }
    }

    // Revalidate path to update UI
    revalidatePath(`/dashboard/orders/${orderId}`);
    return { success: true, data: undefined };
  } catch (error: any) {
    console.error("Error moving to pickup status:", error);
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to move order to pickup status",
    };
  }
}

/**
 * Fetches an image file directly by its ID
 * @param fileId - The ID of the file to fetch
 * @returns Promise with the result containing file information
 */
export async function getImageById(
  fileId: string
): Promise<Result<ICakeImageFile>> {
  noStore();

  try {
    if (!fileId) {
      throw new Error("Image ID is required");
    }

    const response = await axiosAuth.get(`/files/${fileId}`);
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
    console.error("Failed to fetch image:", error);
    return {
      success: false,
      error:
        error.response?.data?.message || error.message || "Không thể tải ảnh",
    };
  }
}

/**
 * Fetches cake image by available cake ID from order detail
 * @param availableCakeId - The ID of the available cake
 * @returns Promise with the result containing image file data
 */
export async function getCakeImageByAvailableCakeId(
  availableCakeId: string
): Promise<Result<ICakeImageFile>> {
  noStore();

  try {
    if (!availableCakeId) {
      throw new Error("Available cake ID is required");
    }

    // Fetch the available cake details to get the image ID
    const cakeResponse = await axiosAuth.get(
      `/available-cakes/${availableCakeId}`
    );
    const cakePayload = cakeResponse.data.payload;

    if (!cakePayload) {
      throw new Error("Available cake not found");
    }

    // Get the main image ID from the cake data
    const imageId = cakePayload.available_cake_main_image_id;

    if (!imageId) {
      throw new Error("Available cake does not have a main image");
    }

    // Directly fetch the image file using the /files/{id} API
    const response = await axiosAuth.get(`/files/${imageId}`);
    const payload = response.data.payload;

    if (!payload) {
      throw new Error("Invalid response format from files API");
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
 * Fetches cake image directly from order detail ID
 * @param orderDetailId - The ID of the order detail
 * @returns Promise with the result containing image file data
 */
export async function getCakeImageByOrderDetail(
  orderDetailId: string
): Promise<Result<ICakeImageFile>> {
  noStore();

  try {
    if (!orderDetailId) {
      throw new Error("Order detail ID is required");
    }

    // Fetch the order detail to get the available_cake_id
    const orderDetailResponse = await axiosAuth.get(
      `/order-details/${orderDetailId}`
    );
    const orderDetailPayload = orderDetailResponse.data.payload;

    if (!orderDetailPayload) {
      throw new Error("Order detail not found");
    }

    // Check if the order detail has an available cake ID
    const availableCakeId = orderDetailPayload.available_cake_id;
    if (!availableCakeId) {
      throw new Error("Order detail does not have an available cake ID");
    }

    // Use the availableCakeId to get the cake image
    return getCakeImageByAvailableCakeId(availableCakeId);
  } catch (error: any) {
    console.error("Failed to fetch cake image from order detail:", error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Không thể tải ảnh bánh từ chi tiết đơn hàng",
    };
  }
}

/**
 * Fetches a cake image from an available cake
 * @param cakeId - The ID of the available cake
 * @returns Promise with the result containing image URL if successful
 */
export async function getCakeImage(
  cakeId: string
): Promise<Result<{ imageUrl: string }>> {
  noStore();

  try {
    if (!cakeId) {
      throw new Error("Cake ID is required");
    }

    // For available cakes only
    const result = await getCakeImageByAvailableCakeId(cakeId);
    if (result.success) {
      return {
        success: true,
        data: {
          imageUrl: result.data.file_url,
        },
      };
    }

    return {
      success: false,
      error: result.error,
    };
  } catch (error: any) {
    console.error("Error fetching cake image:", error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Không thể tải ảnh bánh",
    };
  }
}
