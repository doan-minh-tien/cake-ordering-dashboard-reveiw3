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
