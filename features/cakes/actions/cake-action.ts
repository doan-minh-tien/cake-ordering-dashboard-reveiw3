

"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import { ApiListResponse, fetchListData } from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { ICake } from "../types/cake";

export const getCakes = async (
  searchParams: SearchParams
): Promise<ApiListResponse<ICake>> => {
  noStore();

  const result = await fetchListData<ICake>("/available_cakes", searchParams);

  if (!result.success) {
    console.error("Failed to fetch list ICake:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};
