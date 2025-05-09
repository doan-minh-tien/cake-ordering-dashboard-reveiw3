"use client";

import React from "react";
import StatCard from "./stat-card";
import { DollarSignIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ClientCardRevenueProps {
  amount: number;
  iconColor: string;
}

const ClientCardRevenue = ({ amount, iconColor }: ClientCardRevenueProps) => {
  return (
    <StatCard
      title="Tổng Doanh Thu"
      value={formatCurrency(amount)}
      change={0}
      period="tháng trước"
      icon={<DollarSignIcon className={`h-5 w-5 ${iconColor}`} />}
    />
  );
};

export default ClientCardRevenue;
