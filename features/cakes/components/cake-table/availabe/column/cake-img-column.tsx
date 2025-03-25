import { Column, Row } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ICake, ICakeImageFile } from "@/features/cakes/types/cake";
import Image from "next/image";
import { ImageOff, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const cakeImgColumn = {
  accessorKey: "available_cake_image_files",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Ảnh" />
  ),
  cell: ({ row }: { row: Row<ICake> }) => {
    const images = row.getValue(
      "available_cake_image_files"
    ) as ICakeImageFile[];

    if (!images || images.length === 0) {
      return (
        <div className="flex items-center justify-center w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <ImageOff className="w-12 h-12 text-gray-400 dark:text-gray-600" />
        </div>
      );
    }

    const primaryImage = images[0];

    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative group cursor-pointer">
            <Image
              src={primaryImage.file_url}
              alt={`Ảnh bánh ${row.getValue("name") || "không tên"}`}
              width={100}
              height={100}
              className={cn(
                "w-24 h-24 object-cover rounded-lg transition-all duration-300",
                "group-hover:opacity-70 group-hover:scale-105",
                "border border-gray-200 dark:border-gray-700"
              )}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ZoomIn className="w-8 h-8 text-white bg-black/50 rounded-full p-2" />
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-center">
              <Image
                src={primaryImage.file_url}
                alt={`Ảnh chi tiết bánh ${row.getValue("name") || "không tên"}`}
                width={500}
                height={500}
                className="max-h-[500px] object-contain rounded-lg"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {images.slice(1).map((img, index) => (
                  <Image
                    key={index}
                    src={img.file_url}
                    alt={`Ảnh phụ ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-32 object-cover rounded-lg hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  },
} as const;

export default cakeImgColumn;
