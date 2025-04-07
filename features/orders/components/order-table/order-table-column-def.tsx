"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { IOrder } from "../../types/order-type";
import selectColumn from "./column/select-column";
import actionColumn from "./column/action-column";
import cusNameColumn from "./column/cus-name-column";
import orderStatusColumn from "./column/order-status-column";
import orderDateColumn from "./column/order-date-column";
import orderTotalColumn from "./column/order-total-column";
import paymentTypeColumn from "./column/payment-type-column";
import shippingAddressColumn from "./column/shipping-address-column";
import orderCodeColumn from "./column/order-code-column";

export function fetchOrderTableColumnDefs(): ColumnDef<IOrder, unknown>[] {
  return [
    selectColumn,
    orderCodeColumn,
    orderStatusColumn,
    orderDateColumn,
    cusNameColumn,
    orderTotalColumn,
    paymentTypeColumn,
    shippingAddressColumn,
    actionColumn,

    // bookingTimeColumn,
  ];
}
