/**
 * This file contains the actions related to cake parts.
 */

"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import {
  ApiListResponse,
  apiRequest,
  fetchListData,
  Result,
} from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { ICakePartType } from "../types/cake-part-type";
import { axiosAuth } from "@/lib/api/api-interceptor/api";
import { auth } from "@/lib/next-auth/auth";

// Default cake part categories that all bakeries should have
const defaultCakePartTypes = ["Goo", "Icing", "Filling", "Sponge", "Size"];

export const getCakeParts = async (
  searchParams: SearchParams
): Promise<ApiListResponse<ICakePartType>> => {
  noStore();
  const session = await auth();

  const result = await fetchListData<ICakePartType>(
    `/part_options?bakeryId=${session?.user.entity.id}`,
    searchParams
  );

  if (!result.success) {
    console.error("Failed to fetch list ICakePartType:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }
  revalidatePath("/dashboard/ingredients");

  return result.data;
};

export const updateCakePart = async (
  data: any,
  id: string
): Promise<Result<void>> => {
  noStore();
  const result = await apiRequest(() =>
    axiosAuth.put(`/part_options/${id}`, data)
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard/ingredients");

  return { success: true, data: result.data };
};

export const createCakePart = async (data: any): Promise<Result<void>> => {
  noStore();

  const result = await apiRequest(() => axiosAuth.post("/part_options", data));

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard/ingredients");
  return { success: true, data: result.data };
};

export const deleteCakePart = async (id: string): Promise<Result<void>> => {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.delete(`/part_options/${id}`)
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard/ingredients");
  return { success: true, data: result.data };
};

// Initialize default cake part types for a new bakery
export const initializeDefaultCakeParts = async (
  bakeryId: string
): Promise<Result<void>> => {
  noStore();

  try {
    // Create default cake part types for the bakery
    for (const cakePartType of defaultCakePartTypes) {
      await apiRequest(() =>
        axiosAuth.post("/part_options", {
          type: cakePartType,
          bakeryId: bakeryId,
          items: [], // Initially empty items, bakery will add their own items
        })
      );
    }

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to initialize default cake parts:", error);
    return { success: false, error: "Failed to initialize default cake parts" };
  }
};
