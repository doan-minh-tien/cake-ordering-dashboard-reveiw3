"use client";

import React, { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Palette,
  CakeSlice,
  DollarSign,
  FileText,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useColorSelection } from "@/hooks/use-color";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { updateCakeMessage } from "../../actions/cake-message-option-action";

const TYPE_OPTIONS = [
  "PLAQUE_COLOUR",
  "PIPING_COLOUR",
  "TEXT"

];

const cakeMessageSchema = z.object({
  name: z.string().min(2, { message: "Tối thiểu 2 ký tự" }),
  color: z.object({
    displayName: z.string(),
    name: z.string(),
    hex: z.string(),
  }),
  type: z.string().min(1, { message: "Chọn loại trang trí" }),
});

const CakeMessageOptionModal = () => {
  const { data, isOpen, onClose, type } = useModal();
  const isOpenModal = isOpen && type === "cakeMessageModal";
  const [isPending, startTransition] = useTransition();
  const [colorPopoverOpen, setColorPopoverOpen] = React.useState(false);
  const { COLOR_OPTIONS, getColorValue, changeColor } = useColorSelection(
    data?.cakeMessage?.color
  );

  const form = useForm<z.infer<typeof cakeMessageSchema>>({
    resolver: zodResolver(cakeMessageSchema),
    defaultValues: {
      name: data?.cakeMessage?.name || "",
      color: getColorValue(data?.cakeMessage?.color),
      type: data?.cakeMessage?.type || "",
    },
  });

  useEffect(() => {
    if (data?.cakeMessage) {
      form.reset({
        name: data.cakeMessage.name || "",
        color: getColorValue(data.cakeMessage.color),
        type: data.cakeMessage.type || "",
      });
    }
  }, [data, form]);

  const onSubmit = async (values: z.infer<typeof cakeMessageSchema>) => {
    try {
      const formattedValues = {
        ...values,
        color: values.color.name,
      };

      startTransition(async () => {
        const result = await updateCakeMessage(
          formattedValues,
          data?.cakeMessage?.id!
        );
        if (!result.success) {
          toast.error(result.error);
        } else {
          toast.success("Cập nhật message thành công !");
        }
      });

      onClose();
    } catch (error) {
      console.error("Error updating cake message:", error);
    }
  };

  return (
    <Dialog open={isOpenModal} onOpenChange={onClose}>
      <DialogContent className="max-w-xl rounded-xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <CakeSlice className="w-6 h-6" />
            Cập Nhật Message
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm">
                      <CakeSlice className="w-4 h-4 text-primary" />
                      Tên message
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên"
                        {...field}
                        className="rounded-md h-9"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

 

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel className="flex items-center gap-2 text-sm text-gray-700">
                      <Palette className="w-4 h-4 text-purple-500" />
                      Màu sắc
                    </FormLabel>
                    <Popover
                      open={colorPopoverOpen}
                      onOpenChange={setColorPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between rounded-xl h-10 border-gray-300 hover:bg-transparent",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: field.value.hex }}
                              />
                              {field.value.name} ({field.value.hex})
                            </div>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-[300px]">
                        <Command>
                          <CommandInput
                            placeholder="Tìm màu..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>Không tìm thấy màu.</CommandEmpty>
                            <CommandGroup>
                              {COLOR_OPTIONS.map((color) => (
                                <CommandItem
                                  key={color.hex}
                                  value={color.name}
                                  onSelect={() => {
                                    form.setValue("color", color);
                                    setColorPopoverOpen(false);
                                  }}
                                >
                                  <div className="flex items-center gap-3 w-full">
                                    <div
                                      className="w-5 h-5 rounded-full border border-gray-200"
                                      style={{ backgroundColor: color.hex }}
                                    />
                                    <span className="text-sm">
                                      {color.name} ({color.hex})
                                    </span>
                                  </div>
                                  <Check
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      color.hex === field.value.hex
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm">
                      <CakeSlice className="w-4 h-4 text-primary" />
                      Loại message
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-md h-9">
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TYPE_OPTIONS.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            

            <DialogFooter className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-md h-9"
              >
                Hủy bỏ
              </Button>
              <Button type="submit" className="rounded-md h-9">
                Cập Nhật
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CakeMessageOptionModal;
