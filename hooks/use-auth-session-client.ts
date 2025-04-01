"use client";
import { UserRole } from "@/lib/enums/user-role-enum";
import { useSession } from "next-auth/react";

export const useRole = () => {
  const { data: session } = useSession();

  const userRole = session?.user.role.toUpperCase() as UserRole;

  const hasRole = (role: UserRole) => userRole === role;

  const hasAnyRole = (roles: UserRole[]) => roles.includes(userRole);

  return { userRole, hasRole, hasAnyRole };
};
