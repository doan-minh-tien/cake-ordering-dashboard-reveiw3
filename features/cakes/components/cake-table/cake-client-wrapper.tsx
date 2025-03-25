"use client";

import { ApiListResponse } from "@/lib/api/api-handler/generic";
import { Cake, PlusCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { Suspense, useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { ICake } from "../../types/cake";
import { CakeTable } from "./availabe/cake-table";

interface CakeClientWrapperProps {
  cakeData: ApiListResponse<ICake>;
}

export enum TABS_VALUE {
  AVAILABLE = "AVAILABLE",
  CUSTOM = "CUSTOM",
}

const TABS: readonly {
  value: TABS_VALUE;
  label: string;
  icon: typeof Cake;
  lightBg: string;
  darkBg: string;
  description: string;
}[] = [
  {
    value: TABS_VALUE.AVAILABLE,
    label: "Bánh Có Sẵn",
    icon: Cake,
    lightBg: "bg-amber-50 text-amber-600",
    darkBg: "bg-amber-900/20 text-amber-300",
    description: "Danh sách bánh đã được chuẩn bị sẵn",
  },
  {
    value: TABS_VALUE.CUSTOM,
    label: "Bánh Đặt Riêng",
    icon: PlusCircle,
    lightBg: "bg-pink-50 text-pink-600",
    darkBg: "bg-pink-900/20 text-pink-300",
    description: "Bánh được thiết kế theo yêu cầu riêng",
  },
] as const;

export function CakeClientWrapper({ cakeData }: CakeClientWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollPositionRef = useRef<number>(0);
  const isTabChangeRef = useRef(false);

  const initialTab =
    (searchParams.get("tab") as TABS_VALUE) || TABS_VALUE.AVAILABLE;

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

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="border-0 rounded-3xl overflow-hidden shadow-2xl dark:bg-background/90">
        <CardContent className="p-0">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="border-b px-4 sticky top-0 bg-background z-10 rounded-md">
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
                        ${
                          isActive
                            ? `${tab.lightBg} dark:${tab.darkBg}`
                            : "bg-transparent hover:bg-secondary/10"
                        }
                        data-[state=active]:scale-[1.03]
                        group
                        relative
                        overflow-hidden
                      `}
                    >
                      <div className="flex items-center space-x-2 relative z-10">
                        <Icon
                          className={`
                            h-5 
                            w-5 
                            transition-transform 
                            group-data-[state=active]:scale-110
                            group-data-[state=active]:rotate-6
                            ${isActive ? "text-primary" : "text-secondary"}
                          `}
                        />
                        <span className="font-semibold">{tab.label}</span>
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <div className="relative">
              <TabsContent
                value={TABS_VALUE.AVAILABLE}
                className="m-0 min-h-[500px]"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-amber-700 dark:text-amber-300 flex items-center gap-2">
                      <Cake className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                      Danh Sách Bánh Có Sẵn
                    </h2>
                  </div>
                  <Suspense
                    fallback={
                      <DataTableSkeleton
                        columnCount={5}
                        searchableColumnCount={1}
                        filterableColumnCount={2}
                        cellWidths={[
                          "10rem",
                          "40rem",
                          "12rem",
                          "12rem",
                          "8rem",
                        ]}
                        shrinkZero
                      />
                    }
                  >
                    <CakeTable data={cakeData} />
                  </Suspense>
                </div>
              </TabsContent>

              <TabsContent
                value={TABS_VALUE.CUSTOM}
                className="m-0 min-h-[500px]"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-pink-700 dark:text-pink-300 flex items-center gap-2">
                      <PlusCircle className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                      Danh Sách Bánh Đặt Riêng
                    </h2>
                  </div>
                  <Suspense
                    fallback={
                      <DataTableSkeleton
                        columnCount={5}
                        searchableColumnCount={1}
                        filterableColumnCount={2}
                        cellWidths={[
                          "10rem",
                          "40rem",
                          "12rem",
                          "12rem",
                          "8rem",
                        ]}
                        shrinkZero
                      />
                    }
                  >
                    <CakeTable data={cakeData} />
                  </Suspense>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
