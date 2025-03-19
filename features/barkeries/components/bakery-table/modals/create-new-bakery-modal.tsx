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
import { useGetBakeries } from "@/features/barkeries/react-query/bakery-query";



const CreateNewBakeryModal = () => {
  const { isOpen, type, onClose, data } = useModal();
  const isOpenModal = isOpen && type === "createNewBakeryModal";

  const { data: bakeries, isLoading } = useGetBakeries();

  const handleClose = () => {
    onClose();
  };

  return (
    <Sheet open={isOpenModal} onOpenChange={onClose}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Thêm mới cửa hàng</SheetTitle>
          <SheetDescription>Thêm mới cửa hàng</SheetDescription>
        </SheetHeader>
        <div>CONTENT</div>
      </SheetContent>
    </Sheet>
  );
};

export default CreateNewBakeryModal;
