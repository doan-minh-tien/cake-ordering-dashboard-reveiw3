"use client";

import { ApiListResponse } from "@/lib/api/api-handler/generic";
import { Cake, PlusCircle, Sparkles, StarIcon, BoxIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { ICakeDecorationType } from "../../types/cake-decoration-type";
import { motion, AnimatePresence } from "framer-motion";
import { ICakeMessageOptionType } from "../../types/cake-message-option-type";
import { ICakeExtraOptionType } from "../../types/cake-extra-option-type";
import { ICakePartType } from "../../types/cake-part-type";
import { CakeDecorationTable } from "./cake-decoration-table/cake-decoration-table";

interface IngredientsClientWrapperProps {
  cakeDecorations: ApiListResponse<ICakeDecorationType>;
  cakeMessageOptions: ApiListResponse<ICakeMessageOptionType>;
  cakeExtraOptions: ApiListResponse<ICakeExtraOptionType>;
  cakeParts: ApiListResponse<ICakePartType>;
}

export enum TABS_VALUE {
  DECORATION = "DECORATION",
  MESSAGE = "MESSAGE",
  EXTRAS = "EXTRAS",
  PARTS = "PARTS",
}

const TABS: readonly {
  value: TABS_VALUE;
  label: string;
  icon: typeof Cake;
  gradient: {
    light: string;
    dark: string;
  };
  description: string;
}[] = [
  {
    value: TABS_VALUE.DECORATION,
    label: "Trang Trí Bánh",
    icon: Cake,
    gradient: {
      light: "from-amber-100 via-amber-50 to-white",
      dark: "from-amber-900/30 via-amber-900/20 to-background/90",
    },
    description: "Danh sách trang trí bánh đã được chuẩn bị sẵn",
  },
  {
    value: TABS_VALUE.MESSAGE,
    label: "Thông Điệp",
    icon: PlusCircle,
    gradient: {
      light: "from-pink-100 via-pink-50 to-white",
      dark: "from-pink-900/30 via-pink-900/20 to-background/90",
    },
    description: "Danh sách thông điệp đã được chuẩn bị sẵn",
  },
  {
    value: TABS_VALUE.EXTRAS,
    label: "Tùy Chọn Thêm",
    icon: StarIcon,
    gradient: {
      light: "from-green-100 via-green-50 to-white",
      dark: "from-green-900/30 via-green-900/20 to-background/90",
    },
    description: "Các tùy chọn phụ thêm cho bánh",
  },
  {
    value: TABS_VALUE.PARTS,
    label: "Các Phần Bánh",
    icon: BoxIcon,
    gradient: {
      light: "from-blue-100 via-blue-50 to-white",
      dark: "from-blue-900/30 via-blue-900/20 to-background/90",
    },
    description: "Các phần cấu thành của bánh",
  },
] as const;

export function IngredientsClientWrapper({
  cakeDecorations,
  cakeMessageOptions,
  cakeExtraOptions,
  cakeParts,
}: IngredientsClientWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollPositionRef = useRef<number>(0);
  const isTabChangeRef = useRef(false);

  const initialTab =
    (searchParams.get("tab") as TABS_VALUE) || TABS_VALUE.DECORATION;

  const [activeTab, setActiveTab] = useState<TABS_VALUE>(initialTab);

  useEffect(() => {
    const handleScroll = () => {
      if (!isTabChangeRef.current) {
        scrollPositionRef.current = window.scrollY;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabChange = (value: string) => {
    const newTab = value as TABS_VALUE;
    isTabChangeRef.current = true;
    scrollPositionRef.current = window.scrollY;
    setActiveTab(newTab);

    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPositionRef.current);
      isTabChangeRef.current = false;
    });
  };

  const renderTabContent = (
    title: string,
    icon: React.ElementType,
    color: string,
    table: React.ReactNode
  ) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-2xl font-bold ${color} flex items-center gap-2`}>
            {icon &&
              React.createElement(icon, {
                className: `w-6 h-6 ${color.replace("text", "")}`,
              })}
            {title}
            <Sparkles className="w-5 h-5 text-gray-500 animate-pulse" />
          </h2>
        </div>
        <Suspense
          fallback={
            <DataTableSkeleton
              columnCount={5}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
              shrinkZero
            />
          }
        >
          {table}
        </Suspense>
      </div>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="border-0 rounded-3xl overflow-hidden shadow-2xl dark:bg-background/90">
        <CardContent className="p-0">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="border-b px-4 sticky top-0 bg-white/80 dark:bg-background/80 backdrop-blur-md z-10 rounded-md">
              <TabsList className="bg-transparent">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.value;

                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className={`
                        flex-1 
                        rounded-xl 
                        transition-all 
                        duration-300 
                        py-3 
                        relative 
                        overflow-hidden
                        ${
                          isActive
                            ? `bg-gradient-to-br ${tab.gradient.light} dark:${tab.gradient.dark}`
                            : "bg-transparent hover:bg-secondary/10"
                        }
                        data-[state=active]:scale-[1.03]
                        group
                      `}
                    >
                      <div className="absolute inset-0 opacity-20 group-hover:opacity-10 transition-opacity"></div>
                      <div className="flex items-center space-x-2 relative z-10">
                        <motion.div
                          initial={{ scale: 1, rotate: 0 }}
                          animate={{
                            scale: isActive ? 1.1 : 1,
                            rotate: isActive ? 6 : 0,
                          }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Icon
                            className={`
                              h-5 
                              w-5 
                              transition-colors
                              ${isActive ? "text-primary" : "text-secondary"}
                            `}
                          />
                        </motion.div>
                        <span className="font-semibold">{tab.label}</span>
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <TabsContent
                  key={activeTab}
                  value={TABS_VALUE.DECORATION}
                  className="m-0 min-h-[500px]"
                  asChild
                >
                  {renderTabContent(
                    "Danh Mục Trang Trí Bánh",
                    Cake,
                    "text-amber-700 dark:text-amber-300",
                    <CakeDecorationTable data={cakeDecorations} />
                  )}
                </TabsContent>

                <TabsContent
                  key={`${activeTab}-message`}
                  value={TABS_VALUE.MESSAGE}
                  className="m-0 min-h-[500px]"
                  asChild
                >
                  {renderTabContent(
                    "Danh Sách Đã Từng Được Custom",
                    PlusCircle,
                    "text-pink-700 dark:text-pink-300",
                    <CakeMessageOptionTable data={cakeMessageOptions} />
                  )}
                </TabsContent>

                <TabsContent
                  key={`${activeTab}-extras`}
                  value={TABS_VALUE.EXTRAS}
                  className="m-0 min-h-[500px]"
                  asChild
                >
                  {renderTabContent(
                    "Các Tùy Chọn Thêm",
                    StarIcon,
                    "text-green-700 dark:text-green-300",
                    <CakeExtraOptionsTable data={cakeExtraOptions} />
                  )}
                </TabsContent>

                <TabsContent
                  key={`${activeTab}-parts`}
                  value={TABS_VALUE.PARTS}
                  className="m-0 min-h-[500px]"
                  asChild
                >
                  {renderTabContent(
                    "Các Phần Của Bánh",
                    BoxIcon,
                    "text-blue-700 dark:text-blue-300",
                    <CakePartsTable data={cakeParts} />
                  )}
                </TabsContent>
              </AnimatePresence>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function CakeMessageOptionTable({
  data,
}: {
  data: ApiListResponse<ICakeMessageOptionType>;
}) {
  return <div>Bảng Tùy Chọn Thông Điệp</div>;
}

function CakeExtraOptionsTable({
  data,
}: {
  data: ApiListResponse<ICakeExtraOptionType>;
}) {
  return <div>Bảng Tùy Chọn Phụ</div>;
}

function CakePartsTable({ data }: { data: ApiListResponse<ICakePartType> }) {
  return <div>Bảng Các Phần Bánh</div>;
}

export default IngredientsClientWrapper;
