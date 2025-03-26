"use client";

import * as React from "react";
import { 
  type ColumnDef, 
  createColumnHelper,
} from "@tanstack/react-table";

import { useDataTable } from "@/hooks/use-data-table";

import {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from "@/types/table";

import { generateColumnLabels } from "@/components/data-table/column-label-mapping";
import { ICakeDecorationType } from "../../../types/cake-decoration-type";
import { ApiListResponse } from "@/lib/api/api-handler/generic";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  ChevronRight, 
  Package 
} from "lucide-react";
import { ExpandDataTable } from "@/components/data-table/expand-data-table";

interface CakeDecorationTableProps {
  data: ApiListResponse<ICakeDecorationType>;
}

export function CakeDecorationTable({ data }: CakeDecorationTableProps) {
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({});

  const { data: cakeData, pageCount } = data;

  const toggleRowExpansion = (type: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const columns = React.useMemo<ColumnDef<ICakeDecorationType, unknown>[]>(
    () => [
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => toggleRowExpansion(row.original.type)}
            >
              {expandedRows[row.original.type] ? <ChevronDown /> : <ChevronRight />}
            </Button>
            <span>{row.original.type}</span>
          </div>
        )
      },
      {
        accessorKey: "items",
        header: "Number of Items",
        cell: ({ row }) => row.original.items.length
      }
    ],
    [expandedRows]
  );

  const labels = generateColumnLabels(columns);

  const { dataTable } = useDataTable({
    data: cakeData,
    columns,
    pageCount,
    searchableColumns: [],
    filterableColumns: [],
  });

  const renderExpandedContent = (type: string, items: any[]) => {
    if (!expandedRows[type]) return null;

    return (
      <TableRow>
        <TableCell colSpan={columns.length}>
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Default</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-green-100 dark:hover:bg-green-800/50">
                    <TableCell className="flex items-center space-x-2">
                      <Package className="h-5 w-5 text-green-600" />
                      <span>{item.name}</span>
                    </TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>{item.color}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.is_default ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <ExpandDataTable
        dataTable={dataTable}
        columns={columns}
        searchableColumns={[]}
        filterableColumns={[]}
        columnLabels={labels}
        renderAdditionalRows={(row) => 
          renderExpandedContent(row.original.type, row.original.items)
        }
      />
    </div>
  );
}