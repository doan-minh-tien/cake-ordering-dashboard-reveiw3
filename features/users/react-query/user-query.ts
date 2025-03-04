"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../actions/users-action";
import { ApiListResponse } from "@/lib/api/api-handler/generic";
import { IUser } from "../types/user-type";

// tối ưu hơn rất nhiều
export const useGetUsers = () => {
  return useQuery<ApiListResponse<IUser>>({
    queryKey: ["KEY_OFF_USER"],
    queryFn: () => getUsers(),
  });
};


