"use server";

import { AxiosResponse } from "axios";
import { axiosAuth } from "@/lib/api/api-interceptor/api";
import { translateError } from "./hanlder-api-error";

export type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

export interface ApiListResponse<T> {
  data: T[];
  pageCount?: number;
  totalItemsCount?: number;
  error?: string;
}
export interface ApiSingleResponse<T> {
  data: T | null;
  error?: string;
}

export async function apiRequest<T>(
  request: () => Promise<AxiosResponse<T>>
): Promise<Result<T>> {
  try {
    const response = await request();
    return { success: true, data: response.data };
  } catch (error) {
    // if (axios.isAxiosError(error)) {
    //   const errorMessage = await handleAPIError(error);
    //   return { success: false, error: errorMessage };
    // }

    return { success: false, error: translateError(error) };
  }
}

export async function fetchListData<T>(
  url: string,
  searchParams?: Record<string, any>
): Promise<Result<ApiListResponse<T>>> {
  const result = await apiRequest<{
    payload: T[];
    meta_data: {
      total_pages_count: number;
      limit: number;
      total_items_count: number;
    };
  }>(() => axiosAuth.get(url, { params: searchParams }));

  if (result.success) {
    const { payload, meta_data } = result.data;
    return {
      success: true,
      data: {
        data: payload || [],
        pageCount: meta_data?.total_pages_count || 0,
        totalItemsCount: meta_data?.total_items_count || 0,
      },
    };
  }

  return result;
}
export async function fetchSingleData<T>(
  url: string
): Promise<Result<ApiSingleResponse<T>>> {
  const result = await apiRequest<{ payload: T }>(() => axiosAuth.get(url));

  if (result.success) {
    return {
      success: true,
      data: { data: result.data.payload },
    };
  }

  return result;
}
