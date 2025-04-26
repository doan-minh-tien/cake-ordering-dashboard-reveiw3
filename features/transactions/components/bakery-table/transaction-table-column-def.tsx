"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { TransactionType } from "../../types/transaction-type";
import selectColumn from "./column/select-column";
import idColumn from "./column/id-column";
import actionColumn from "./column/action-column";
import amountColumn from "./column/amount-column";
import typeColumn from "./column/type-column";
import createdAtColumn from "./column/created-at-column";
import createByColumn from "./column/create-by-column";
import contentColumn from "./column/content-column";
import targetColumn from "./column/target-column";
export function fetchTransactionTableColumnDefs(): ColumnDef<
  TransactionType,
  unknown
>[] {
  return [
    selectColumn,
    idColumn,
    amountColumn,
    typeColumn,
    contentColumn,
    // createdAtColumn,
    createByColumn,
    targetColumn,
    actionColumn,
  ];
}
