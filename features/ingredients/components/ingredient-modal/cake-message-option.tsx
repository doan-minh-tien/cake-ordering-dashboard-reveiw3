'use client'

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";

const CakeMessageOptionModal = () => {
  const { data, isOpen, onClose, type } = useModal();
  const isOpenModal = isOpen && type === "cakeMessageModal";

  return (
    <Dialog open={isOpenModal} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Thêm tùy chọn tin nhắn
          </DialogTitle>
          <DialogDescription>
            Chọn tùy chọn tin nhắn bạn muốn thêm vào bánh.
          </DialogDescription>
        </DialogHeader>

        {/* <Form {...form}></Form> */}

      </DialogContent>
    </Dialog>
  );
};

export default CakeMessageOptionModal;
