"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { IBadReport } from "../../types/bad-report-type";
import idColumn from "./column/id-column";

import actionColumn from "./column/action-column";


export function fetchBadReportTableColumnDefs(): ColumnDef<
  IBadReport,
  unknown
>[] {
  return [
    idColumn,

    actionColumn,
  ];
}
