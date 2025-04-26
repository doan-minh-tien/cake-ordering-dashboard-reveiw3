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
import { ITopBakeriesType } from "../types/admid-dashboard-type";

export async function getTopBakery(): Promise<
  ApiListResponse<ITopBakeriesType>
> {
  noStore();

  const result = await fetchListData<ITopBakeriesType>(
    `/admins/top-bakery-sales?pageIndex=0&pageSize=5`
  );

  if (!result.success) {
    console.error("Failed to fetch list ITopBakeriesType:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
}
