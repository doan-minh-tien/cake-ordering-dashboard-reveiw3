"use client";

import { type ColumnDef } from "@tanstack/react-table";

  import { IOrder } from "../../types/order-type";
import selectColumn from "./column/select-column";
import actionColumn from "./column/action-column";
import idColumn from "./column/id-column";


export function fetchOrderTableColumnDefs(): ColumnDef<IOrder, unknown>[] {
  return [
    selectColumn,
    idColumn,
    actionColumn,

    // bookingTimeColumn,
  ];
}
