import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ICake, ICakeImageFile } from "@/features/cakes/types/cake";
import { Row, type Column } from "@tanstack/react-table";

const ImageCell: React.FC<{ images: ICakeImageFile[] }> = ({ images }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center ">
        <ImageIcon className="w-10 h-10 text-gray-400" />
      </div>
    );
  }

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsOpen(true);
  };

  const handlePrevious = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-2">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-1">
                {images.slice(0, 2).map((imageUrl, index) => (
                  <div
                    key={index}
                    className="relative w-10 h-10 rounded-md overflow-hidden border border-emerald-200 dark:border-emerald-800 cursor-pointer hover:opacity-75 transition-opacity"
                    onClick={() => handleImageClick(index)}
                  >
                    <Image
                      src={imageUrl.file_url}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ))}
                {images.length > 2 && (
                  <div
                    className="relative flex items-center justify-center w-10 h-10 rounded-md border border-emerald-200 dark:border-emerald-800 cursor-pointer bg-emerald-50 dark:bg-emerald-900 hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-colors"
                    onClick={() => handleImageClick(2)}
                  >
                    <span className="text-xs text-emerald-600 dark:text-emerald-300">
                      +{images.length - 2}
                    </span>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Xem {images.length} ảnh sản phẩm</p>
            </TooltipContent>
          </Tooltip>

          <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0 overflow-hidden bg-white dark:bg-gray-900 rounded-xl">
            <div className="p-4 border-b">
              <DialogTitle className="text-lg font-medium">
                Hình ảnh bánh
              </DialogTitle>
            </div>

            <div className="flex flex-col p-6">
              <div className="relative w-full aspect-square mb-4 group">
                <Image
                  src={images[selectedImageIndex].file_url}
                  alt={`Product image ${selectedImageIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 60vw"
                  priority
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevious}
                      className="absolute top-1/2 left-2 -translate-y-1/2 
                        bg-white dark:bg-gray-800 
                        rounded-full p-2 
                        shadow-xl hover:shadow-2xl 
                        border border-emerald-100 dark:border-emerald-800
                        opacity-0 group-hover:opacity-100 
                        transition-all duration-300 ease-in-out
                        hover:bg-emerald-50 dark:hover:bg-emerald-900
                        focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6 text-emerald-600 dark:text-emerald-400 hover:scale-110 transition-transform" />
                    </button>

                    <button
                      onClick={handleNext}
                      className="absolute top-1/2 right-2 -translate-y-1/2 
                        bg-white dark:bg-gray-800 
                        rounded-full p-2 
                        shadow-xl hover:shadow-2xl 
                        border border-emerald-100 dark:border-emerald-800
                        opacity-0 group-hover:opacity-100 
                        transition-all duration-300 ease-in-out
                        hover:bg-emerald-50 dark:hover:bg-emerald-900
                        focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6 text-emerald-600 dark:text-emerald-400 hover:scale-110 transition-transform" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center space-x-1">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ease-in-out ${
                        index === selectedImageIndex
                          ? "bg-emerald-500 w-4"
                          : "bg-gray-300 dark:bg-gray-600 hover:bg-emerald-400 dark:hover:bg-emerald-500"
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    />
                  ))}
                </div>
              </div>

              <div className="w-full overflow-x-auto pb-2 scrollbar-thumb-rounded scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                <div className="flex space-x-2 min-w-max">
                  {images.map((imageUrl, index) => (
                    <div
                      key={index}
                      className={`relative w-10 h-10 rounded-md cursor-pointer transition-all
                        ${
                          index === selectedImageIndex
                            ? "border-2 border-emerald-500 shadow-md scale-105"
                            : "border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700"
                        }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <Image
                        src={imageUrl.file_url}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover rounded-[3px]"
                        sizes="64px"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export const cakeImgColumn = {
  accessorKey: "available_cake_image_files",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Ảnh" />
  ),
  cell: ({ row }: { row: Row<ICake> }) => {
    const images = row.getValue(
      "available_cake_image_files"
    ) as ICakeImageFile[];
    return <ImageCell images={images} />;
  },
  enableSorting: false,
  enableHiding: false,
  filterFn: (row: Row<ICake>, columnId: string, filterValue: ICake[]) => {
    return filterValue.includes(row.getValue(columnId));
  },
} as const;

export default cakeImgColumn;
