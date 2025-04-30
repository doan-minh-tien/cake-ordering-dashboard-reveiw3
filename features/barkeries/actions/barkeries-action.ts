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
import { IBarkery, IFile } from "../types/barkeries-type";
import { axiosAuth } from "@/lib/api/api-interceptor/api";

export const getBakeries = async (
  searchParams: SearchParams
): Promise<ApiListResponse<IBarkery>> => {
  noStore();

  const result = await fetchListData<IBarkery>("/bakeries", searchParams);

  if (!result.success) {
    console.error("Failed to fetch list IBarkery:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};

export async function getBakery(
  params: string
): Promise<ApiSingleResponse<IBarkery>> {
  noStore();

  const result = await fetchSingleData<IBarkery>(`/bakeries/${params}`);
  if (!result.success) {
    console.error("Failed to fetch bakery by ID:", result.error);
    return { data: null };
  }
  return result.data;
}

export async function approveBakery(params: string): Promise<Result<void>> {
  noStore();

  console.log(params);
  const result = await apiRequest(() =>
    axiosAuth.put(`/bakeries/${params}/approve`, {
      is_approve: true
    })
  );
  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath(`/dashboard/bakeries/${params}`);

  return { success: true, data: undefined };
}

export async function banBakery(params: string): Promise<Result<void>> {
  noStore();

  console.log(params);
  const result = await apiRequest(() =>
    axiosAuth.put(`/bakeries/${params}/ban_action`)
  );
  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath(`/dashboard/bakeries/${params}`);

  return { success: true, data: undefined };
}

// Function to be used by bakery owners to update their own information
export async function updateBakeryProfile(
  bakeryId: string,
  updateData: {
    bakery_name: string;
    password?: string;
    phone: string;
    address: string;
    latitude: string;
    longitude: string;
    owner_name: string;
    tax_code: string;
    identity_card_number: string;
    shop_image_file_ids: string[] | string;
    avatar_file_id: string;
    front_card_file_id: string;
    back_card_file_id: string;
    bank_account?: string;
  }
): Promise<Result<IBarkery>> {
  noStore();

  console.log("Original update data received:", JSON.stringify(updateData));

  // Ensure shop_image_file_ids is an array
  let shop_image_file_ids: string[] = [];

  if (Array.isArray(updateData.shop_image_file_ids)) {
    shop_image_file_ids = updateData.shop_image_file_ids;
  } else if (typeof updateData.shop_image_file_ids === "string") {
    if (updateData.shop_image_file_ids.startsWith("[")) {
      try {
        shop_image_file_ids = JSON.parse(updateData.shop_image_file_ids);
      } catch (error) {
        console.error("Failed to parse shop_image_file_ids:", error);
        shop_image_file_ids = [];
      }
    } else if (updateData.shop_image_file_ids) {
      shop_image_file_ids = [updateData.shop_image_file_ids];
    }
  }

  // Create a new payload object with the exact structure the API expects
  const apiPayload = {
    bakery_name: updateData.bakery_name,
    password: updateData.password || "password_placeholder", // Default password if not provided
    phone: updateData.phone,
    address: updateData.address,
    latitude: updateData.latitude,
    longitude: updateData.longitude,
    owner_name: updateData.owner_name,
    tax_code: updateData.tax_code,
    identity_card_number: updateData.identity_card_number,
    shop_image_file_ids: shop_image_file_ids,
    avatar_file_id: updateData.avatar_file_id,
    front_card_file_id: updateData.front_card_file_id,
    back_card_file_id: updateData.back_card_file_id,
    bank_account: updateData.bank_account || undefined,
  };

  console.log("Final API payload:", JSON.stringify(apiPayload));

  // The API itself should verify that the authenticated user is the owner of the bakery
  const result = await apiRequest(() =>
    axiosAuth.put(`/bakeries/${bakeryId}`, apiPayload)
  );

  if (!result.success) {
    console.error("Failed to update bakery:", result.error);
    return { success: false, error: result.error };
  }

  revalidatePath(`/dashboard/bakeries/${bakeryId}`);

  return { success: true, data: result.data };
}

export async function getBakeryFiles(
  params: string
): Promise<ApiSingleResponse<IFile>> {
  noStore();

  const result = await fetchSingleData<IFile>(`/files/${params}`);
  if (!result.success) {
    console.error("Failed to fetch bakery files:", result.error);
    return { data: null };
  }
  return result.data;
}
