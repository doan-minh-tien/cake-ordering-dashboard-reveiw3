import {
  getNotifications,
  markAllNotificationsAsRead,
} from "../actions/notification-action";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { SearchParams } from "@/types/table";

export const useInfiniteNotifications = (pageSize = 10) => {
  return useInfiniteQuery({
    queryKey: ["notifications", "infinite", pageSize],
    queryFn: async ({ pageParam = 0 }) => {
      console.log(`Fetching notifications page ${pageParam}`);
      const searchParams: SearchParams = {
        pageIndex: String(pageParam),
        pageSize: String(pageSize),
      };
      const result = await getNotifications(searchParams);
      console.log(
        `Fetched ${result.data.length} notifications for page ${pageParam}`
      );
      return result;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // If there are no more pages, return undefined
      if (lastPage.data.length < pageSize) {
        console.log("No more pages available");
        return undefined;
      }
      // Otherwise, return the next page index
      const nextPage = allPages.length;
      console.log(`Next page will be ${nextPage}`);
      return nextPage;
    },
    getPreviousPageParam: (firstPage, allPages) => {
      // Return the previous page index, or undefined if we're at the first page
      return allPages.length > 1 ? allPages.length - 2 : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      // Invalidate the notifications query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
