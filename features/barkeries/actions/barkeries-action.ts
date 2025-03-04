"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import { ApiListResponse, fetchListData } from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { IBarkery } from "../types/barkeries-type";

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
