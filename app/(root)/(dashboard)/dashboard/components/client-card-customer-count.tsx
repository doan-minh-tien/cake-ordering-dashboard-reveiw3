"use client";

import React from "react";
import StatCard from "./stat-card";
import { UsersIcon } from "lucide-react";
import { ITotalCustomers } from "@/features/reports/types/admin-report-type";

interface ClientCardCustomerCountProps {
  data: ITotalCustomers;
  iconColor: string;
}

const ClientCardCustomerCount = ({
  data,
  iconColor,
}: ClientCardCustomerCountProps) => {
  return (
    <StatCard
      title="Khách Hàng"
      value={data.amount.toString()}
      change={data.change}
      period={data.comparisonPeriod}
      icon={<UsersIcon className={`h-5 w-5 ${iconColor}`} />}
    />
  );
};

export default ClientCardCustomerCount;
