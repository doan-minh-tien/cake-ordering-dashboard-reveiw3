import { getAdminBadReportById } from "@/features/bad-reports/actions/bad-report-action";
import AdminBadReportDetail from "@/features/bad-reports/component/admin/AdminBadReportDetail";
import { notFound } from "next/navigation";

interface AdminBadReportDetailPageProps {
  params: {
    bakeryId: string;
    reportId: string;
  };
}

export default async function AdminBadReportDetailPage({
  params,
}: AdminBadReportDetailPageProps) {
  // Lấy dữ liệu chi tiết báo cáo
  const { bakeryId, reportId } = params;
  const reportResult = await getAdminBadReportById(bakeryId, reportId);

  if (!reportResult.data) {
    notFound();
  }

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Chi tiết báo cáo</h2>
      </div>

      <AdminBadReportDetail report={reportResult.data} bakeryId={bakeryId} />
    </div>
  );
}
