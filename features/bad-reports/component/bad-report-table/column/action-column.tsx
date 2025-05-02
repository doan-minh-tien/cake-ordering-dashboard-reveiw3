"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Clock, Eye, MoreHorizontal, X } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { IBadReport } from "@/features/bad-reports/types/bad-report-type";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import AlertModal from "@/features/bad-reports/component/alert-modal/alert-modal";
import { updateBadReportStatus } from "@/features/bad-reports/actions/bad-report-action";

interface ActionMenuProps {
  row: Row<IBadReport>;
}

function ActionMenu({ row }: ActionMenuProps) {
  const router = useRouter();
  const { toast } = useToast();
  const report = row.original;
  const [showStatusAlert, setShowStatusAlert] = useState(false);
  const [isApprove, setIsApprove] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showResolveAlert, setShowResolveAlert] = useState(false);

  const handleView = () => {
    router.push(`/dashboard/bad-report/${report.id}`);
  };

  const handleStatusUpdate = async () => {
    try {
      setIsPending(true);
      const result = await updateBadReportStatus(report.id, isApprove);

      if (result.success) {
        toast({
          title: isApprove ? "Đã bắt đầu xử lý báo cáo" : "Đã từ chối báo cáo",
          description: `Báo cáo #${report.id.substring(0, 8)} đã được cập nhật`,
        });
        router.refresh();
      } else {
        toast({
          title: "Lỗi",
          description: result.error || "Đã có lỗi xảy ra",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã có lỗi xảy ra khi cập nhật trạng thái",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
      setShowStatusAlert(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={handleView}
            className="cursor-pointer hover:bg-accent/50 focus:bg-accent/50"
          >
            <Eye className="mr-2 h-4 w-4 text-blue-500" />
            <span>Xem chi tiết</span>
          </DropdownMenuItem>
          
          {report.status === "PENDING" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setIsApprove(true);
                  setShowStatusAlert(true);
                }}
                className="cursor-pointer hover:bg-accent/50 focus:bg-accent/50"
                disabled={isPending}
              >
                <Clock className="mr-2 h-4 w-4 text-blue-500" />
                <span>Bắt đầu xử lý</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setIsApprove(false);
                  setShowStatusAlert(true);
                }}
                className="cursor-pointer hover:bg-accent/50 focus:bg-accent/50 text-red-500"
                disabled={isPending}
              >
                <X className="mr-2 h-4 w-4 text-red-500" />
                <span>Từ chối báo cáo</span>
              </DropdownMenuItem>
            </>
          )}
          
          {report.status === "PROCESSING" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowResolveAlert(true)}
                className="cursor-pointer hover:bg-accent/50 focus:bg-accent/50 text-green-600"
              >
                <Check className="mr-2 h-4 w-4 text-green-600" />
                <span>Đánh dấu đã giải quyết</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <AlertModal
        isOpen={showStatusAlert}
        onClose={() => !isPending && setShowStatusAlert(false)}
        onConfirm={handleStatusUpdate}
        title={isApprove ? "Xác nhận xử lý" : "Xác nhận từ chối"}
        description={
          isApprove
            ? "Bạn có chắc chắn muốn bắt đầu xử lý báo cáo này?"
            : "Bạn có chắc chắn muốn từ chối báo cáo này?"
        }
        actionLabel={
          isPending 
            ? (isApprove ? "Đang xử lý..." : "Đang từ chối...") 
            : (isApprove ? "Bắt đầu xử lý" : "Từ chối")
        }
        variant={isApprove ? "default" : "destructive"}
      />
      
      <AlertModal
        isOpen={showResolveAlert}
        onClose={() => setShowResolveAlert(false)}
        onConfirm={() => {
          toast({
            title: "Chức năng đang phát triển",
            description: "Tính năng này sẽ sớm được cập nhật",
          });
          setShowResolveAlert(false);
        }}
        title="Xác nhận giải quyết"
        description="Bạn có chắc chắn muốn đánh dấu báo cáo này là đã giải quyết?"
        actionLabel="Đánh dấu đã giải quyết"
      />
    </>
  );
}

const actionColumn = {
  id: "actions",
  cell: ({ row }: { row: Row<IBadReport> }) => <ActionMenu row={row} />,
  enableSorting: false,
  enableHiding: false,
};

export default actionColumn;
