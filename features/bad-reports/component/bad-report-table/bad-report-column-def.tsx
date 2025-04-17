"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { IBadReport } from "../../types/bad-report-type";
import idColumn from "./column/id-column";

import actionColumn from "./column/action-column";
import typeColumn from "./column/type-column";
import customerColumn from "./column/customer-column";
import statusColumn from "./column/status-column";
import contentColumn from "./column/content-column";
export function fetchBadReportTableColumnDefs(): ColumnDef<
  IBadReport,
  unknown
>[] {
  return [
    idColumn,
    typeColumn,
    customerColumn,
    statusColumn,
    contentColumn,
    actionColumn,
  ];
}
