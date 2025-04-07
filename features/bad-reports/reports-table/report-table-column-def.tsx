"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { IBadReport } from "../types/bad-report";
import selectColumn from "./column/select-column";
import idColumn from "./column/id-column";
import actionColumn from "./column/action-column";
import codeColumn from "./column/code";
import discountPercentageColumn from "./column/discount-column";
import expirationDateColumn from "./column/expiration_date";
import quantityColumn from "./column/quantity-column";
import typeColumn from "./column/type-column";
  export function fetchReportTableColumnDefs(): ColumnDef<IBadReport, unknown>[] {
  return [
    selectColumn,
    idColumn,
    // codeColumn,
    // discountPercentageColumn,
    // expirationDateColumn,
    // quantityColumn,
    // typeColumn,
    // bakeyNameColumn,
    // ownerNameColumn,
    // phoneNumColumn,
    actionColumn,

    // bookingTimeColumn,
  ];
}
