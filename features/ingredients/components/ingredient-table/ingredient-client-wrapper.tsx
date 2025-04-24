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
    darkColor: "dark:text-amber-400",
    activeBg: "bg-amber-50",
    activeBorder: "border-amber-500",
    lightBg: "bg-amber-50/50",
    darkBg: "dark:bg-amber-900/20",
  },
  {
    value: "message",
    label: "Thông Điệp",
    icon: PlusCircle,
    color: "text-pink-500",
    darkColor: "dark:text-pink-400",
    activeBg: "bg-pink-50",
    activeBorder: "border-pink-500",
    lightBg: "bg-pink-50/50",
    darkBg: "dark:bg-pink-900/20",
  },
  {
    value: "extras",
    label: "Tùy Chọn",
    icon: StarIcon,
    color: "text-emerald-500",
    darkColor: "dark:text-emerald-400",
    activeBg: "bg-emerald-50",
    activeBorder: "border-emerald-500",
    lightBg: "bg-emerald-50/50",
    darkBg: "dark:bg-emerald-900/20",
  },
  {
    value: "parts",
    label: "Phần Bánh",
    icon: BoxIcon,
    color: "text-blue-500",
    darkColor: "dark:text-blue-400",
    activeBg: "bg-blue-50",
    activeBorder: "border-blue-500",
    lightBg: "bg-blue-50/50",
    darkBg: "dark:bg-blue-900/20",
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
          <TabsList className="flex flex-row gap-2 p-1 bg-transparent dark:bg-transparent border-b border-gray-200 dark:border-gray-800">
            <div className="flex-1 flex justify-center gap-2">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-t-md transition-all",
                    "border-b-2 border-transparent",
                    "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50",
                    `data-[state=active]:${tab.color} data-[state=active]:${tab.darkColor}`,
                    "data-[state=active]:border-b-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900",
                    "data-[state=active]:font-semibold data-[state=active]:shadow-sm",
                    tab.activeBorder
                  )}
                >
                  {tab.icon && (
                    <tab.icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        tab.color,
                        tab.darkColor,
                        `data-[state=active]:${tab.color} data-[state=active]:${tab.darkColor}`
                      )}
                    />
                  )}
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </div>
            <button
              onClick={() => {
                /* TODO: Add new ingredient handler */
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-t-md transition-all",
                "border-b-2 border-transparent",
                "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300",
                "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                "font-medium text-sm"
              )}
            >
            </button>
          </TabsList>

          <Card className="border rounded-lg shadow-md overflow-hidden dark:border-gray-800">
            <div
              className={cn(
                "h-2",
                activeTab === "decoration" ? "bg-amber-500" : "",
                activeTab === "message" ? "bg-pink-500" : "",
                activeTab === "extras" ? "bg-emerald-500" : "",
                activeTab === "parts" ? "bg-blue-500" : ""
              )}
            ></div>
            <CardContent className="p-6">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg overflow-hidden"
              >
                <TabsContent
                  value="decoration"
                  className={cn(
                    "rounded-lg p-2",
                    TABS[0].lightBg,
                    TABS[0].darkBg
                  )}
                >
                  <Suspense fallback={<TableSkeleton />}>
                    <CakeDecorationTable data={cakeDecorations} />
                  </Suspense>
                </TabsContent>
                <TabsContent
                  value="message"
                  className={cn(
                    "rounded-lg p-2",
                    TABS[1].lightBg,
                    TABS[1].darkBg
                  )}
                >
                  <Suspense fallback={<TableSkeleton />}>
                    <CakeMessageOptionTable data={cakeMessageOptions} />
                  </Suspense>
                </TabsContent>
                <TabsContent
                  value="extras"
                  className={cn(
                    "rounded-lg p-2",
                    TABS[2].lightBg,
                    TABS[2].darkBg
                  )}
                >
                  <Suspense fallback={<TableSkeleton />}>
                    <CakeExtraOptionTable data={cakeExtraOptions} />
                  </Suspense>
                </TabsContent>
                <TabsContent
                  value="parts"
                  className={cn(
                    "rounded-lg p-2",
                    TABS[3].lightBg,
                    TABS[3].darkBg
                  )}
                >
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
