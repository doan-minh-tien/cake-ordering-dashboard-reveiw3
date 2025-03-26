"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import { ApiListResponse, fetchListData } from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { ICakeExtraOptionType } from "../types/cake-extra-option-type";

export const getCakeExtraOptions = async (
  searchParams: SearchParams
): Promise<ApiListResponse<ICakeExtraOptionType>> => {
  noStore();

  const result = await fetchListData<ICakeExtraOptionType>(
    "/extra_options",
    searchParams
  );

  if (!result.success) {
    console.error("Failed to fetch list ICakeExtraOptionType:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};
