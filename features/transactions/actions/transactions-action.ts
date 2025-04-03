"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import {
  ApiListResponse,
  fetchListData,
  ApiSingleResponse,
  fetchSingleData,
  apiRequest,
} from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { TransactionType } from "../types/transaction-type";
import { auth } from "@/lib/next-auth/auth";

export const getTransactions = async (
  searchParams: SearchParams
): Promise<ApiListResponse<TransactionType>> => {
  noStore();

  const session = await auth();

  const result = await fetchListData<TransactionType>(
    `/wallets/${session?.user.wallet_id}/transactions`,
    searchParams
  );

  if (!result.success) {
    console.error("Failed to fetch list TransactionType:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};
