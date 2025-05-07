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
import { FeatureFlagsProvider } from "@/hooks/use-feature-flag";
import TopRightHeaderButtons from "@/components/shared/dashboard/TopRightHeaderButtons";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const pathName = usePathname();

  return (
    <main>
      <FeatureFlagsProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex shadow dark:shadow-muted justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
              </div>

              <div className="px-4">
                <TopRightHeaderButtons />
              </div>
            </header>

            {/* // content  */}
            <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </FeatureFlagsProvider>
    </main>
  );
};

export default DashboardLayout;
