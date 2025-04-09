import { getAdminBadReports } from "@/features/bad-reports/actions/bad-report-action";
import AdminBadReportTable from "@/features/bad-reports/component/admin/AdminBadReportTable";

export default async function AdminBadReportsPage() {
  // Lấy dữ liệu báo cáo từ tất cả bakeries
  const badReportsData = await getAdminBadReports({
    page: 1,
    pageSize: 10,
  });

  return (
    <div className="space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">
        Quản lý Hỗ trợ Khách hàng
      </h2>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Danh sách báo cáo và yêu cầu hỗ trợ từ khách hàng cho tất cả cửa hàng.
        </p>
      </div>

      <AdminBadReportTable initialData={badReportsData} />
    </div>
  );
}
