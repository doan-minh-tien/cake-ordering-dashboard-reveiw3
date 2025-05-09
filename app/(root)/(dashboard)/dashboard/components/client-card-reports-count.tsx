"use client";

import React from "react";
import StatCard from "./stat-card";
import { FileTextIcon } from "lucide-react";

interface ClientCardReportsCountProps {
  count: number;
  iconColor: string;
}

const ClientCardReportsCount = ({
  count,
  iconColor,
}: ClientCardReportsCountProps) => {
  return (
    <StatCard
      title="Báo Cáo"
      value={count.toString()}
      change={0}
      period="tháng trước"
      icon={<FileTextIcon className={`h-5 w-5 ${iconColor}`} />}
    />
  );
};

export default ClientCardReportsCount;
