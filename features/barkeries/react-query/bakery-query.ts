"use client";

import { useQuery } from "@tanstack/react-query";
import { getBakeries } from "../actions/barkeries-action";
import { ApiListResponse } from "@/lib/api/api-handler/generic";
import { IBarkery } from "../types/barkeries-type";

export const useGetBakeries = () => {
  return useQuery<ApiListResponse<IBarkery>>({
    queryKey: ["KEY_OFF_BAKERIES"],
    queryFn: () => getBakeries({}),
  });
};
