"use client";

import React from "react";
import StatCard from "./stat-card";
import { StoreIcon } from "lucide-react";

interface ClientCardBakeriesCountProps {
  count: number;
  iconColor: string;
}

const ClientCardBakeriesCount = ({
  count,
  iconColor,
}: ClientCardBakeriesCountProps) => {
  return (
    <StatCard
      title="Cửa Hàng"
      value={count.toString()}
      change={0}
      period="tháng trước"
      icon={<StoreIcon className={`h-5 w-5 ${iconColor}`} />}
    />
  );
};

export default ClientCardBakeriesCount;
