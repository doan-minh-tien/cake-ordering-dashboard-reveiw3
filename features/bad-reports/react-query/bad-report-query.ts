"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBadReportStatus } from "../actions/bad-report-action";
import { toast } from "sonner";

interface UpdateStatusParams {
  reportId: string;
  isApprove: boolean;
}

export const useUpdateBadReportStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, isApprove }: UpdateStatusParams) => {
      const result = await updateBadReportStatus(reportId, isApprove);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["bad-reports"] });

      toast.success(
        variables.isApprove ? "Đã bắt đầu xử lý báo cáo" : "Đã từ chối báo cáo"
      );
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Đã có lỗi xảy ra khi cập nhật trạng thái báo cáo"
      );
    },
  });
};
