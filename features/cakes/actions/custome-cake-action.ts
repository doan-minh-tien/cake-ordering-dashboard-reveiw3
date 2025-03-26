

"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import { ApiListResponse, fetchListData } from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { ICustomCake } from "../types/custome-cake";

export const getCustomCakes = async (
  searchParams: SearchParams
): Promise<ApiListResponse<ICustomCake>> => {
  noStore();

  const result = await fetchListData<ICustomCake>(
    "/custom_cakes",
    searchParams
  );

  if (!result.success) {
    console.error("Failed to fetch list ICustomCake:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;   
};
