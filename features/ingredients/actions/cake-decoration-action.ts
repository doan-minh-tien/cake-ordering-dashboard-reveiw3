"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import { ApiListResponse, fetchListData } from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { ICakeDecorationType } from "../types/cake-decoration-type";

export const getCakeDecorations = async (
  searchParams: SearchParams
): Promise<ApiListResponse<ICakeDecorationType>> => {
  noStore();

  const result = await fetchListData<ICakeDecorationType>(
    "/decoration_options",
    searchParams
  );

  if (!result.success) {
    console.error("Failed to fetch list ICakeDecorationType:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};
