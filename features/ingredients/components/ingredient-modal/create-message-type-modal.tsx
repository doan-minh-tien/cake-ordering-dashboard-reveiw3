"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  MessageSquare,
  Check,
  Palette,
  ChevronsUpDown,
  Loader,
} from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { useColorSelection } from "@/hooks/use-color";
import { cn } from "@/lib/utils";
import { createCakeMessage } from "../../actions/cake-message-option-action";
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

// Enum definitions
enum CakeMessageTypeEnum {
  NONE = "NONE",
  TEXT = "TEXT",
  IMAGE = "IMAGE",
}

enum CakeMessageOptionTypeEnum {
  PIPING_COLOUR = "PIPING_COLOUR",
  PLAQUE_COLOUR = "PLAQUE_COLOUR",
}

// Tên hiển thị tiếng Việt cho các loại tin nhắn
const getTypeDisplayName = (type: string): string => {
  const typeNameMap: Record<string, string> = {
    PLAQUE_COLOUR: "Màu Thông Điệp",
    PIPING_COLOUR: "Màu Viền",
    TEXT: "Nội Dung",
    NONE: "Không",
    IMAGE: "Hình Ảnh",
  };

  return typeNameMap[type] || type;
};

// Form schema for creating a new message type
const formSchema = z.object({
  type: z.nativeEnum(CakeMessageTypeEnum),
  name: z.nativeEnum(CakeMessageOptionTypeEnum),
  color: z
    .object({
      displayName: z.string(),
      name: z.string(),
      hex: z.string(),
    })
    .optional(),
  is_default: z.boolean().default(false),
});

const CreateMessageTypeModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isOpenModal = isOpen && type === "createMessageTypeModal";
  const [isPending, startTransition] = useTransition();
  const existingTypes = data?.existingTypes || [];
  const { COLOR_OPTIONS, getColorValue } = useColorSelection();
  const [currentColorPopover, setCurrentColorPopover] =
    useState<boolean>(false);
  const [typePopoverOpen, setTypePopoverOpen] = useState<boolean>(false);
  const [namePopoverOpen, setNamePopoverOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: CakeMessageTypeEnum.NONE,
      name: CakeMessageOptionTypeEnum.PIPING_COLOUR,
      is_default: false,
      color: getColorValue("Black"),
    },
  });

  // Reset form when modal closes or changes
  const resetForm = () => {
    form.reset({
      type: CakeMessageTypeEnum.NONE,
      name: CakeMessageOptionTypeEnum.PIPING_COLOUR,
      is_default: false,
      color: getColorValue("Black"),
    });
  };

  // Effect to reset states when the modal closes
  useEffect(() => {
    if (!isOpenModal) {
      resetForm();
    }
  }, [isOpenModal]);

  // Form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      startTransition(async () => {
        // Create the data object based on form values
        const submitData: any = {
          type: values.type,
          name: values.name,
          color: values.color?.name,
        };

        // Wrap the data in an array to match the collection modal implementation
        const formattedItems = [submitData];

        // Call the API
        const result = await createCakeMessage(formattedItems);

        if (result.success) {
          toast.success("Đã tạo loại tin nhắn mới thành công");
          handleClose();
        } else {
          toast.error(result.error || "Có lỗi xảy ra");
        }
      });
    } catch (error) {
      console.error("Error creating message type:", error);
      toast.error("Có lỗi xảy ra khi tạo loại tin nhắn");
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Dialog open={isOpenModal} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-xl overflow-y-auto max-h-[85vh]">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            Thêm Loại Tin Nhắn
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Type Field - Dropdown selection */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    Loại tin nhắn <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Popover
                      open={typePopoverOpen}
                      onOpenChange={setTypePopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between rounded-md h-9 text-sm"
                          aria-expanded={typePopoverOpen}
                        >
                          <span className="truncate">
                            {getTypeDisplayName(field.value)}
                          </span>
                          <ChevronsUpDown className="ml-1 h-4 w-4 flex-shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandList>
                            <CommandGroup>
                              {Object.values(CakeMessageTypeEnum).map(
                                (messageType) => (
                                  <CommandItem
                                    key={messageType}
                                    value={messageType}
                                    onSelect={() => {
                                      form.setValue(
                                        "type",
                                        messageType as CakeMessageTypeEnum
                                      );
                                      setTypePopoverOpen(false);
                                    }}
                                  >
                                    {getTypeDisplayName(messageType)}
                                    <Check
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        field.value === messageType
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                )
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Info Title */}
            <div className="pt-2 border-t">
              <h3 className="text-sm font-medium">
                Thông tin danh mục đầu tiên
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Tạo một danh mục mẫu cho loại tin nhắn này
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Name Field - Dropdown */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-xs">
                      <MessageSquare className="w-3.5 h-3.5 text-primary" />
                      Tên tin nhắn <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Popover
                        open={namePopoverOpen}
                        onOpenChange={setNamePopoverOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between rounded-md h-8 text-xs"
                            aria-expanded={namePopoverOpen}
                          >
                            <span className="truncate">
                              {getTypeDisplayName(field.value)}
                            </span>
                            <ChevronsUpDown className="ml-1 h-3 w-3 flex-shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandList>
                              <CommandGroup>
                                {Object.values(CakeMessageOptionTypeEnum).map(
                                  (optionType) => (
                                    <CommandItem
                                      key={optionType}
                                      value={optionType}
                                      onSelect={() => {
                                        form.setValue(
                                          "name",
                                          optionType as CakeMessageOptionTypeEnum
                                        );
                                        setNamePopoverOpen(false);
                                      }}
                                    >
                                      {getTypeDisplayName(optionType)}
                                      <Check
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          field.value === optionType
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  )
                                )}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Color Field */}
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-xs text-gray-700">
                      <Palette className="w-3.5 h-3.5 text-purple-500" />
                      Màu sắc <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Popover
                        open={currentColorPopover}
                        onOpenChange={setCurrentColorPopover}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between rounded-md h-8 hover:bg-transparent text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{
                                  backgroundColor:
                                    field.value?.hex || "#000000",
                                }}
                              />
                              <span className="truncate text-xs">
                                {field.value?.name || "Black"}
                              </span>
                            </div>
                            <ChevronsUpDown className="ml-1 h-3 w-3 flex-shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="p-0 w-[180px] shadow-md"
                          align="center"
                          side="bottom"
                          sideOffset={4}
                        >
                          <Command className="max-h-[150px]">
                            <CommandInput
                              placeholder="Tìm màu..."
                              className="h-7 text-xs"
                            />
                            <CommandList className="max-h-[100px]">
                              <CommandEmpty>Không tìm thấy màu.</CommandEmpty>
                              <CommandGroup className="overflow-y-auto">
                                {COLOR_OPTIONS.map((color) => (
                                  <CommandItem
                                    key={color.name}
                                    value={color.name}
                                    onSelect={() => {
                                      form.setValue("color", color);
                                      setCurrentColorPopover(false);
                                    }}
                                    className="flex items-center gap-2 cursor-pointer py-1 px-2 text-xs"
                                  >
                                    <div
                                      className="w-3 h-3 rounded-full border border-gray-200 flex-shrink-0"
                                      style={{ backgroundColor: color.hex }}
                                    />
                                    <span className="truncate">
                                      {color.displayName}
                                    </span>
                                    <Check
                                      className={cn(
                                        "ml-auto h-3 w-3 flex-shrink-0",
                                        color.hex === field.value?.hex
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
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Is Default Checkbox */}
            <FormField
              control={form.control}
              name="is_default"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0 mt-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="h-3.5 w-3.5"
                    />
                  </FormControl>
                  <div className="space-y-0.5 leading-none">
                    <FormLabel className="text-xs">Đặt làm mặc định</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                className="rounded-full px-3 bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700 hover:text-amber-800 transition-all flex items-center gap-1 justify-center w-full"
                disabled={isPending}
              >
                {isPending ? "Đang xử lý..." : "Tạo loại tin nhắn mới"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMessageTypeModal;
