import { getBadReportById } from "@/features/bad-reports/actions/bad-report-action";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface ReportDetailPageProps {
  params: {
    reportId: string;
  };
}

export async function generateMetadata({
  params,
}: ReportDetailPageProps): Promise<Metadata> {
  const { data: report } = await getBadReportById(params.reportId);

  return {
    title: report
      ? `Báo cáo #${report.id.slice(0, 8)} | Dashboard`
      : "Chi tiết báo cáo",
    description: "Chi tiết báo cáo và lịch sử phản hồi",
  };
}

export default async function ReportDetailPage({
  params,
}: ReportDetailPageProps) {
  // Fetch report details
  const { data: report, error } = await getBadReportById(params.reportId);

  // Fetch report responses

  // Handle not found
  if (!report || error) {
    notFound();
  }
}
