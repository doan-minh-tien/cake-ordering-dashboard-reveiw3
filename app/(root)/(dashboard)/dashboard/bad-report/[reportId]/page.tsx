import React from "react";
import { getBadReportById } from "@/features/bad-reports/actions/bad-report-action";
import BadReportDetail from "@/features/bad-reports/component/bad-report-detail/bad-report-detail";
import { Shell } from "@/components/shared/custom-ui/shell";
import { notFound } from "next/navigation";

interface BadReportDetailPageProps {
  params: {
    reportId: string;
  };
}

const BadReportDetailPage = async ({ params }: BadReportDetailPageProps) => {
  try {
    const { reportId } = params;
    console.log("Fetching report with ID:", reportId);
    const reportResult = await getBadReportById(reportId);

    console.log("Report data:", JSON.stringify(reportResult));

    if (!reportResult.data) {
      console.error("Report not found:", reportResult.error);
      notFound();
    }

    return (
      <Shell className="p-0">
        <BadReportDetail report={reportResult.data} />
      </Shell>
    );
  } catch (error) {
    console.error("Error in BadReportDetailPage:", error);
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center p-10">
          <h1 className="text-2xl font-bold mb-4">Đã xảy ra lỗi</h1>
          <p className="text-muted-foreground mb-6">
            Không thể tải dữ liệu báo cáo
          </p>
          <pre className="bg-muted p-4 rounded-md overflow-auto text-sm max-w-full">
            {error instanceof Error ? error.message : JSON.stringify(error)}
          </pre>
        </div>
      </Shell>
    );
  }
};

export default BadReportDetailPage;
