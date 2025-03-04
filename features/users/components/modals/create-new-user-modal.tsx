"use client";
import { useModal } from "@/hooks/use-modal";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
  } from "@/components/ui/sheet";
import { useGetUsers } from "../../react-query/user-query";
const CreateNewUserModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const isOpenModal = isOpen && type === "createNewUserModal";



// get 1 list product boi userId

// ko dc call  => CSR => react-query

// call client side

  const {data: users, isLoading} = useGetUsers();
console.log(users)
// const usersPromise = getUsers(searchParams);


  // logic

 
  // ui modal
  return (
    <Sheet open={isOpenModal} onOpenChange={onClose} >
    <SheetContent side="right" >
      <SheetHeader>
        <SheetTitle>Cập nhật dịch vụ</SheetTitle>
        <SheetDescription>Chỉnh sửa dịch vụ .</SheetDescription>
      </SheetHeader>
      <div>CONTENT</div>
    </SheetContent>
  </Sheet>
  );
};

export default CreateNewUserModal;
