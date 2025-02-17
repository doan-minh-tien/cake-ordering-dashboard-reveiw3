"use client";
import { ReactNode } from "react";
import { AppSidebar } from "@/components/shared/dashboard/sidebar/app-sidebar";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { breadcrumbTranslations } from "@/constants/bread-crumb-tranlate";
import Breadcrumb from "@/components/shared/dashboard/bread-crumb";
import { FeatureFlagsProvider } from "@/hooks/use-feature-flag";
import { ModeToggleAnimate } from "@/components/shared/custom-ui/mode-toggle-animate";
import UserProfileDropdown from "@/components/shared/dashboard/sidebar/user-header-profile";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const pathName = usePathname();
  const breadcrumbItems = pathName
    .split("/")
    .filter(Boolean)
    .map((segment, index, arr) => {
      const isLast = index === arr.length - 1;
      return {
        label: breadcrumbTranslations[segment] || segment,
        href: "/" + arr.slice(0, index + 1).join("/"),
        isLast,
      };
    });

  return (
    <main>
      <FeatureFlagsProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex shadow dark:shadow-muted justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb items={breadcrumbItems} />
              </div>

              <div>
                <ModeToggleAnimate />
                <UserProfileDropdown/>
              </div>
            </header>

            {/* // content  */}
            <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
              {children}
              {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </FeatureFlagsProvider>
    </main>
  );
};

export default DashboardLayout;
