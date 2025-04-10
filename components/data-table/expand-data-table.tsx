import * as React from "react";
import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
} from "@/types/table";
import {
  flexRender,
  type ColumnDef,
  type Table as TanstackTable,
  type Row,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  dataTable: TanstackTable<TData>;
  columns: ColumnDef<TData, TValue>[];
  searchableColumns?: DataTableSearchableColumn<TData>[];
  filterableColumns?: DataTableFilterableColumn<TData>[];
  advancedFilter?: boolean;
  columnLabels?: Record<string, string>;
  newRowLink?: string;
  deleteRowsAction?: React.MouseEventHandler<HTMLButtonElement>;
  renderAdditionalRows?: (row: Row<TData>) => React.ReactNode;
}

export function ExpandDataTable<TData, TValue>({
  dataTable,
  columns,
  searchableColumns = [],
  filterableColumns = [],
  columnLabels,
  newRowLink,
  deleteRowsAction,
  renderAdditionalRows,
}: DataTableProps<TData, TValue>) {
  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={dataTable}
        filterableColumns={filterableColumns}
        searchableColumns={searchableColumns}
        deleteRowsAction={deleteRowsAction}
        columnLabels={columnLabels}
        newRowLink={newRowLink}
      />
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
        <div className="overflow-auto">
          <Table className="w-full">
            <TableHeader className="bg-slate-50 dark:bg-slate-900/70 sticky top-0 z-4">
              {dataTable.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-slate-200 dark:border-slate-800"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-slate-800 dark:text-slate-200 font-bold"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {dataTable.getRowModel().rows?.length ? (
                dataTable.getRowModel().rows.flatMap((row, index) => [
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-slate-100 dark:hover:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800/60"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="text-slate-700 dark:text-slate-300"
                        style={{
                          minWidth: cell.column.id === "name" ? "50px" : "20px",
                          maxWidth:
                            cell.column.id === "name" ? "250px" : "150px",
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>,
                  renderAdditionalRows && renderAdditionalRows(row),
                ])
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-slate-500 dark:text-slate-400 italic"
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={dataTable} />
      </div>
    </div>
  );
}
