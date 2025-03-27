/**
 * This file contains the actions related to cake parts.
 */

"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import { ApiListResponse, fetchListData } from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { ICakePartType } from "../types/cake-part-type";

export const getCakeParts = async (
  searchParams: SearchParams
): Promise<ApiListResponse<ICakePartType>> => {
  noStore();
  revalidatePath("/dashboard/ingredients");

  const result = await fetchListData<ICakePartType>("/part_options", searchParams);

  if (!result.success) {
    console.error("Failed to fetch list ICakePartType:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};
