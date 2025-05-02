"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import {
  apiRequest,
  ApiListResponse,
  fetchListData,
  Result,
  ApiSingleResponse,
  fetchSingleData,
} from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { ICakeExtraOptionType } from "../types/cake-extra-option-type";
import { axiosAuth } from "@/lib/api/api-interceptor/api";
import { auth } from "@/lib/next-auth/auth";

// Default extra option categories that all bakeries should have
const defaultExtraTypes = ["Candles", "CakeBoard"];

export const initializeDefaultExtraOptions = async (
  bakeryId: string
): Promise<Result<void>> => {
  noStore();

  try {
    // Create default extra option types for the bakery
    for (const extraType of defaultExtraTypes) {
      await apiRequest(() =>
        axiosAuth.post("/extra_options", {
          type: extraType,
          bakeryId: bakeryId,
          items: [], // Initially empty items, bakery will add their own items
        })
      );
    }

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to initialize default extra options:", error);
    return {
      success: false,
      error: "Failed to initialize default extra options",
    };
  }
};

export const getCakeExtraOptions = async (
  searchParams: SearchParams
): Promise<ApiListResponse<ICakeExtraOptionType>> => {
  noStore();
  const session = await auth();

  const result = await fetchListData<ICakeExtraOptionType>(
    `/extra_options?bakeryId=${session?.user.entity.id}`,
    searchParams
  );

  if (!result.success) {
    console.error("Failed to fetch list ICakeExtraOptionType:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};

export const updateCakeExtraOption = async (
  data: any,
  id: string
): Promise<Result<void>> => {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.put(`/extra_options/${id}`, data)
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath(`/dashboard/ingredients/${id}`);

  return { success: true, data: result.data };
};

export const createCakeExtraOption = async (
  data: any
): Promise<Result<void>> => {
  noStore();

  const result = await apiRequest(() => axiosAuth.post("/extra_options", data));

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard/ingredients");
  return { success: true, data: result.data };
};

export const deleteCakeExtraOption = async (
  id: string
): Promise<Result<void>> => {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.delete(`/extra_options/${id}`)
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard/ingredients");
  return { success: true, data: result.data };
};

export const getExtraOptionById = async (id: string): Promise<ApiSingleResponse<any>> => {
  noStore();
  
  try {
    const result = await fetchSingleData<any>(`/extra_options/${id}`);
    
    if (!result.success) {
      console.error(`Failed to fetch extra option with ID ${id}:`, result.error);
      return { data: null, error: result.error };
    }
    
    return result.data;
  } catch (error) {
    console.error(`Error fetching extra option with ID ${id}:`, error);
    return { data: null, error: String(error) };
  }
};
