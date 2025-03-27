"use client";

import { ApiListResponse } from "@/lib/api/api-handler/generic";
import { Cake, PlusCircle, StarIcon, BoxIcon } from "lucide-react";
import React, { Suspense, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { ICakeDecorationType } from "../../types/cake-decoration-type";
import { motion } from "framer-motion";
import { ICakeMessageOptionType } from "../../types/cake-message-option-type";
import { ICakeExtraOptionType } from "../../types/cake-extra-option-type";
import { ICakePartType } from "../../types/cake-part-type";
import { CakeDecorationTable } from "./cake-decoration-table";
import CakeExtraOptionTable from "./cake-extra-option-table";
import CakeMessageOptionTable from "./cake-message-option-table";
import CakePartTable from "./cake-part-table";
import { cn } from "@/lib/utils";

interface IngredientsClientWrapperProps {
  cakeDecorations: ApiListResponse<ICakeDecorationType>;
  cakeMessageOptions: ApiListResponse<ICakeMessageOptionType>;
  cakeExtraOptions: ApiListResponse<ICakeExtraOptionType>;
  cakeParts: ApiListResponse<ICakePartType>;
}

const TABS = [
  {
    value: "decoration",
    label: "Trang Trí",
    icon: Cake,
    color: "text-amber-500",
    activeBg: "bg-amber-50",
    activeBorder: "border-amber-500",
  },
  {
    value: "message",
    label: "Thông Điệp",
    icon: PlusCircle,
    color: "text-pink-500",
    activeBg: "bg-pink-50",
    activeBorder: "border-pink-500",
  },
  {
    value: "extras",
    label: "Tùy Chọn",
    icon: StarIcon,
    color: "text-emerald-500",
    activeBg: "bg-emerald-50",
    activeBorder: "border-emerald-500",
  },
  {
    value: "parts",
    label: "Phần Bánh",
    icon: BoxIcon,
    color: "text-blue-500",
    activeBg: "bg-blue-50",
    activeBorder: "border-blue-500",
  },
] as const;

export function IngredientsClientWrapper({
  cakeDecorations,
  cakeMessageOptions,
  cakeExtraOptions,
  cakeParts,
}: IngredientsClientWrapperProps) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["value"]>(
    TABS[0].value
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as (typeof TABS)[number]["value"])
          }
          className="space-y-6"
        >
          <TabsList className="flex flex-row gap-2 p-1 bg-transparent border-b border-gray-200">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-t-md transition-all",
                  "text-gray-600 hover:text-gray-800 hover:bg-gray-50",
                  "data-[state=active]:text-black data-[state=active]:border-b-2",
                  "data-[state=active]:font-semibold",
                  tab.activeBorder
                )}
              >
                {tab.icon && (
                  <tab.icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      tab.color,
                      "data-[state=active]:text-black"
                    )}
                  />
                )}
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <Card className="border rounded-lg shadow-sm">
            <CardContent className="p-6 ">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="decoration" className={TABS[0].activeBg}>
                  <Suspense fallback={<TableSkeleton />}>
                    <CakeDecorationTable data={cakeDecorations} />
                  </Suspense>
                </TabsContent>
                <TabsContent value="message" className={TABS[1].activeBg}>
                  <Suspense fallback={<TableSkeleton />}>
                    <CakeMessageOptionTable data={cakeMessageOptions} />
                  </Suspense>
                </TabsContent>
                <TabsContent value="extras" className={TABS[2].activeBg}>
                  <Suspense fallback={<TableSkeleton />}>
                    <CakeExtraOptionTable data={cakeExtraOptions} />
                  </Suspense>
                </TabsContent>
                <TabsContent value="parts" className={TABS[3].activeBg}>
                  <Suspense fallback={<TableSkeleton />}>
                    <CakePartTable data={cakeParts} />
                  </Suspense>
                </TabsContent>
              </motion.div>
            </CardContent>
          </Card>
        </Tabs>
      </motion.div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <DataTableSkeleton
      columnCount={5}
      searchableColumnCount={1}
      filterableColumnCount={2}
      cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
      shrinkZero
    />
  );
}

export default IngredientsClientWrapper;
