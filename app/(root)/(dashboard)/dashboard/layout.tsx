import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/next-auth/auth";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();
    if (!session) {
        redirect("/");
    }
  return <div>{children}</div>;
};

export default DashboardLayout; 