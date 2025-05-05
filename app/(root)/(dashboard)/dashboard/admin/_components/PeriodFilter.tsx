"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon, FilterIcon } from "lucide-react";
import {
  format,
  subDays,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { vi } from "date-fns/locale";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { ReportPeriod } from "@/features/reports/types/admin-overview-type";
import { cn } from "@/lib/utils";

const periodOptions = [
  { value: "day", label: "Hôm nay" },
  { value: "week", label: "Tuần này" },
  { value: "month", label: "Tháng này" },
  { value: "year", label: "Năm nay" },
  { value: "all", label: "Tất cả" },
];

export function PeriodFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Lấy giá trị hiện tại từ URL
  const currentPeriod = (searchParams.get("period") as ReportPeriod) || "month";
  const currentStartDate = searchParams.get("startDate");
  const currentEndDate = searchParams.get("endDate");

  // State cho date range
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: currentStartDate ? new Date(currentStartDate) : undefined,
    to: currentEndDate ? new Date(currentEndDate) : undefined,
  });

  // Cập nhật URL params
  const updatePeriodParams = useCallback(
    (period: ReportPeriod, startDate?: string, endDate?: string) => {
      const params = new URLSearchParams(searchParams.toString());

      // Cập nhật params
      params.set("period", period);

      if (startDate) {
        params.set("startDate", startDate);
      } else {
        params.delete("startDate");
      }

      if (endDate) {
        params.set("endDate", endDate);
      } else {
        params.delete("endDate");
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // Xử lý khi thay đổi period từ tabs
  const handlePeriodChange = useCallback(
    (newPeriod: ReportPeriod) => {
      let startDate: string | undefined;
      let endDate: string | undefined;

      const today = new Date();

      switch (newPeriod) {
        case "day":
          startDate = startOfDay(today).toISOString();
          endDate = endOfDay(today).toISOString();
          break;
        case "week":
          startDate = startOfWeek(today, { locale: vi }).toISOString();
          endDate = endOfWeek(today, { locale: vi }).toISOString();
          break;
        case "month":
          startDate = startOfMonth(today).toISOString();
          endDate = endOfMonth(today).toISOString();
          break;
        case "year":
          startDate = startOfYear(today).toISOString();
          endDate = endOfYear(today).toISOString();
          break;
        case "all":
          // Không cần startDate và endDate cho "all"
          startDate = undefined;
          endDate = undefined;
          break;
      }

      // Cập nhật state và URL
      if (startDate && endDate) {
        setDateRange({ from: new Date(startDate), to: new Date(endDate) });
      } else {
        setDateRange({ from: undefined, to: undefined });
      }

      updatePeriodParams(newPeriod, startDate, endDate);
    },
    [updatePeriodParams]
  );

  // Xử lý khi thay đổi date range
  const handleDateRangeChange = useCallback(
    (range: DateRange | undefined) => {
      if (!range) {
        setDateRange({ from: undefined, to: undefined });
        return;
      }

      setDateRange({
        from: range.from,
        to: range.to,
      });

      if (range.from && range.to) {
        updatePeriodParams(
          "custom",
          startOfDay(range.from).toISOString(),
          endOfDay(range.to).toISOString()
        );
      }
    },
    [updatePeriodParams]
  );

  // Cập nhật state khi URL thay đổi từ bên ngoài
  useEffect(() => {
    const period = searchParams.get("period") as ReportPeriod;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (startDate && endDate) {
      setDateRange({
        from: new Date(startDate),
        to: new Date(endDate),
      });
    }
  }, [searchParams]);

  // Xây dựng nội dung hiển thị cho filter button
  const getFilterLabel = () => {
    if (currentPeriod === "custom" && dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "dd/MM/yyyy")} - ${format(
        dateRange.to,
        "dd/MM/yyyy"
      )}`;
    }

    const option = periodOptions.find((opt) => opt.value === currentPeriod);
    return option ? option.label : "Lọc theo thời gian";
  };

  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-3 gap-1 font-normal"
          >
            <FilterIcon className="h-3.5 w-3.5" />
            <span>{getFilterLabel()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="end">
          <div className="space-y-4">
            <Tabs
              defaultValue={currentPeriod}
              value={currentPeriod}
              onValueChange={(value) =>
                handlePeriodChange(value as ReportPeriod)
              }
              className="w-full"
            >
              <TabsList className="grid grid-cols-5 w-full">
                {periodOptions.map((option) => (
                  <TabsTrigger
                    key={option.value}
                    value={option.value}
                    className={cn(
                      "text-xs",
                      currentPeriod === option.value && "font-medium"
                    )}
                  >
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div>
              <p className="text-sm font-medium mb-2">
                Tùy chỉnh khoảng thời gian
              </p>
              <Card>
                <CardContent className="p-2">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={handleDateRangeChange}
                    numberOfMonths={2}
                    locale={vi}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
