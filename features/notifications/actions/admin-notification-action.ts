"use server";
import { unstable_noStore as noStore } from "next/cache";
import { ApiListResponse, fetchListData } from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { AdminNotificationType } from "../types/admin-notification-type";
import { auth } from "@/lib/next-auth/auth";

export const getAdminNotifications = async (
  searchParams?: SearchParams
): Promise<ApiListResponse<AdminNotificationType>> => {
  try {
    noStore();
    const session = await auth();

    if (!session?.user?.entity?.id) {
      console.error("No admin session found");
      return { data: [], pageCount: 0, error: "Unauthorized" };
    }

    console.log("Fetching notifications for admin:", session.user.entity.id);

    const result = await fetchListData<AdminNotificationType>(
      `/admins/${session.user.entity.id}/notifications`,
      searchParams
    );

    console.log("Notifications result:", result);

    if (!result.success) {
      console.error("Failed to fetch admin notifications:", result.error);
      return { data: [], pageCount: 0, error: result.error };
    }

    return result.data;
  } catch (error) {
    console.error("Error in getAdminNotifications:", error);
    return { data: [], pageCount: 0, error: "Failed to fetch notifications" };
  }
};
