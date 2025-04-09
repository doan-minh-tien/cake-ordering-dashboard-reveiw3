import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/next-auth/auth";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  // Check if user has the required role (bakery or admin)
  const userRole = session?.user?.role;
  if (userRole !== "BAKERY" && userRole !== "ADMIN") {
    redirect("/");
  }

  return <div>{children}</div>;
};

export default DashboardLayout;
