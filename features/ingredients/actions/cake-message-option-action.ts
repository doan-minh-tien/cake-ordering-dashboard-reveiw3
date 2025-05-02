/**
 * @file cake-message-option-action.ts
 * @description This file contains the actions related to cake message options.
 */

"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import {
  ApiListResponse,
  fetchListData,
  Result,
  apiRequest,
  ApiSingleResponse,
  fetchSingleData,
} from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { ICakeMessageOptionType } from "../types/cake-message-option-type";
import { axiosAuth } from "@/lib/api/api-interceptor/api";
import { auth } from "@/lib/next-auth/auth";

const defaultMessageTypes = [
  "Message",
  "Congratulations",
  "Birthday",
  "Anniversary",
  "Special Occasion",
];

export const initializeDefaultMessages = async (
  bakeryId: string
): Promise<void> => {
  try {
    const session = await auth();

    for (const type of defaultMessageTypes) {
      await axiosAuth.post("/message_options", {
        name: type,
        bakeryId: bakeryId,
        items: [],
      });
    }

    console.log(`Default message types initialized for bakery ${bakeryId}`);
  } catch (error) {
    console.error("Failed to initialize default message types:", error);
  }
};

export const getCakeMessageOptions = async (
  searchParams: SearchParams
): Promise<ApiListResponse<ICakeMessageOptionType>> => {
  noStore();
  const session = await auth();
  const result = await fetchListData<ICakeMessageOptionType>(
    `/message_options?bakeryId=${session?.user.entity.id}`,
    searchParams
  );

  if (!result.success) {
    console.error("Failed to fetch list ICakeMessageOptionType:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};

export const updateCakeMessage = async (
  data: any,
  id: string
): Promise<Result<void>> => {
  noStore();
  const result = await apiRequest(() =>
    axiosAuth.put(`/message_options/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard/ingredients");

  return { success: true, data: result.data };
};

export const createCakeMessage = async (data: any): Promise<Result<void>> => {
  noStore();
  console.log("data", data);
  const result = await apiRequest(() =>
    axiosAuth.post("/message_options", data)
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard/ingredients");
  return { success: true, data: result.data };
};

export const deleteCakeMessage = async (id: string): Promise<Result<void>> => {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.delete(`/message_options/${id}`)
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard/ingredients");
  return { success: true, data: result.data };
};

export const getMessageOptionById = async (id: string): Promise<ApiSingleResponse<any>> => {
  noStore();
  
  try {
    const result = await fetchSingleData<any>(`/message_options/${id}`);
    
    if (!result.success) {
      console.error(`Failed to fetch message option with ID ${id}:`, result.error);
      return { data: null, error: result.error };
    }
    
    return result.data;
  } catch (error) {
    console.error(`Error fetching message option with ID ${id}:`, error);
    return { data: null, error: String(error) };
  }
};
