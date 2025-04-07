"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import {
  ApiListResponse,
  ApiSingleResponse,
  fetchListData,
  fetchSingleData,
} from "@/lib/api/api-handler/generic";
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

export const getCustomCakeById = async (
  id: string
): Promise<ApiSingleResponse<ICustomCake> | null> => {
  noStore();

  const result = await fetchSingleData<ICustomCake>(`/custom_cakes/${id}`);

  if (!result.success) {
    console.error(`Failed to fetch custom cake with ID ${id}:`, result.error);
    return null;
  }

  return result.data;
};
