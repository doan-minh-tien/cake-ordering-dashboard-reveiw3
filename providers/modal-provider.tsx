"use client";
import CreateNewUserModal from "@/features/users/components/modals/create-new-user-modal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return ( <>
  <CreateNewUserModal/>
  <CreateNewUserModal/>
  <CreateNewUserModal/>
  </>
  )
};
