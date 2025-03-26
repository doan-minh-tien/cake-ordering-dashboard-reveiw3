"use client";

import { ApiListResponse } from "@/lib/api/api-handler/generic";
import { Cake, PlusCircle, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { Suspense, useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { ICake } from "../../types/cake";
import { CakeTable } from "./availabe/cake-table";
import { ICustomCake } from "../../types/custome-cake";
import { CustomCakeTable } from "./custom/custom-cake-table";
import { motion, AnimatePresence } from "framer-motion";

interface CakeClientWrapperProps {
  cakeData: ApiListResponse<ICake>;
  customCakeData: ApiListResponse<ICustomCake>;
}

export enum TABS_VALUE {
  AVAILABLE = "AVAILABLE",
  CUSTOM = "CUSTOM",
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
    value: TABS_VALUE.AVAILABLE,
    label: "Bánh Có Sẵn",
    icon: Cake,
    gradient: {
      light: "from-amber-100 via-amber-50 to-white",
      dark: "from-amber-900/30 via-amber-900/20 to-background/90",
    },
    description: "Danh sách bánh đã được chuẩn bị sẵn",
  },
  {
    value: TABS_VALUE.CUSTOM,
    label: "Bánh Đặt Riêng",
    icon: PlusCircle,
    gradient: {
      light: "from-pink-100 via-pink-50 to-white",
      dark: "from-pink-900/30 via-pink-900/20 to-background/90",
    },
    description: "Bánh được thiết kế theo yêu cầu riêng",
  },
] as const;

export function CakeClientWrapper({ cakeData, customCakeData }: CakeClientWrapperProps) {
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
                  value={TABS_VALUE.AVAILABLE}
                  className="m-0 min-h-[500px]"
                  asChild
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-amber-700 dark:text-amber-300 flex items-center gap-2">
                          <Cake className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                          Danh Sách Bánh Có Sẵn
                          <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
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
                  </motion.div>
                </TabsContent>

                <TabsContent
                  key={`${activeTab}-custom`}
                  value={TABS_VALUE.CUSTOM}
                  className="m-0 min-h-[500px]"
                  asChild
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-pink-700 dark:text-pink-300 flex items-center gap-2">
                          <PlusCircle className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                          Danh Sách Đã Từng Được Custom
                          <Sparkles className="w-5 h-5 text-pink-500 animate-pulse" />
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
                        <CustomCakeTable data={customCakeData} />
                      </Suspense>
                    </div>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}